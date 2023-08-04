const child_process = require('child_process');
const config = require('./config')
const dns = require('dns')
const logging = require('./logging');
const sync = require('./sync');


function checkInetConnection() {
    logging.app_info('Testing connection to github.com');
    
    dns.resolve('github.com', function(err) {
        if (err) {
            logging.app_error(err);
            throw err;
        }
        else {
            logging.app_log('Internet connection OK');
        }
    });
}


function launchApp() {
    logging.app_info('Launching Obsidian');

    let windowProc = child_process.exec(config.EXECUTABLE_PATH, (err, stdout, stderr) => {
        if (err) { logging.app_error(err); }
        logging.app_log(stdout);
    });
    
    windowProc.on('exit', () => { 
        logging.app_log('Exiting...')
        sync.pushUp(config.VAULT_PATH, config.DEVICE_ID);
    });
}


function main () {
    checkInetConnection();
    sync.pullDown(config.VAULT_PATH);
    launchApp();
}

main();