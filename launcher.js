const child_process = require('child_process');
const config = require('./config')
const dns = require('dns');
const logging = require('./logging');
const sync = require('./sync');


function isConnected() {
    return new Promise((resolve) => {
        dns.resolve('github.com', (err) => {
            if (err) {
                resolve(false);
            }
            else {
                resolve(true);
            }
        });
    });
}


function launchApp() {
    logging.app_info('Launching Obsidian');

    let windowProc = child_process.exec(config.EXECUTABLE_PATH, (err, stdout, stderr) => {
        if (err) { logging.app_error(err); }
        logging.app_log(stdout);
    });
    
    windowProc.on('exit', () => { 
        logging.app_log('Exiting...');
        sync.unsetLock(config.VAULT_PATH);
        sync.pushUp(config.VAULT_PATH, config.DEVICE_ID);
        process.exit(0);
    });
}


function main () {
    isConnected()
    .then(() => {
        let lock = sync.pullDown(config.VAULT_PATH);

        if (lock == '') {
            if (sync.setLock(config.VAULT_PATH, config.DEVICE_ID)) {
                sync.pushUp(config.VAULT_PATH, config.DEVICE_ID, lockfile_only=true);
                launchApp();
            }
        }
        else {
            logging.app_error(`Close Obsidian on ${lock} before launching again`);
        }
    })
    .catch(() => {
        logging.app_error("Unable to reach github.com. Check your Internet connection.");
        throw new Error("Unable to reach github.com. Check your Internet connection.");
    });
}

main();