const child_process = require('child_process');
const config = require('./config')
const fetch = require("node-fetch");
const logging = require('./logging');
const sync = require('./sync');


function isConnected() {
    const connected = fetch("https://github.com", {
        method: "GET",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        referrerPolicy: "no-referrer",
    }).then(() => true)
    .catch(() => false);
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
    });
}


function main () {
    if (! isConnected()) {
        logging.app_error("Unable to reach github.com. Check your Internet connection.");
        throw new Error("Unable to reach github.com. Check your Internet connection.");
    }

    else {
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
    }
}

main();