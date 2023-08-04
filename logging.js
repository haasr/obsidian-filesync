const clc = require('cli-color');
const config = require('./config');

let APP_NAME = "Obsidian launcher";
let SYNC_NAME = "Github sync";


if (config.LOG_DETAIL) {
    function app_log(text) {
        console.log(clc.bgBlue(`㏒`) + clc.bgCyan.black(`[${APP_NAME}]`) 
                    + `  ` + clc.bgBlue.whiteBright(text) );
    }
    
    function sync_log(text) {
        console.log(clc.bgBlue(`㏒`) + clc.bgMagenta(`<${SYNC_NAME}>`)
                    + ` ` + clc.bgBlue.whiteBright(text));
    }
}

else {
    function app_log(text) {}
    
    function sync_log(text) {}
}

if (config.LOG_INFO) {
    function app_info(text) {
        console.info(clc.bgWhite.black(`ⓘ `)
                    + clc.bgCyan.black(`[${APP_NAME}]`) + `  ` + text );   
    }

    function sync_info(text) {
        console.info(clc.bgWhite.black(`ⓘ `)
                    + clc.bgMagenta(`<${SYNC_NAME}>`) + ` ` + text);
    }
}

else {
    function app_info(text) {}

    function sync_info(text) {}
}

if (config.LOG_WARNING) {
    function app_warn(text) {
        console.warn(clc.bgYellow(`⚠ `) + clc.bgCyan.black(`[${APP_NAME}]`) 
                    + `  ` + clc.bgYellow.black(text) );
    }
    
    function sync_warn(text) {
        console.warn(clc.bgYellow(`⚠ `) + clc.bgMagenta(`<${SYNC_NAME}>`)
                    + ` ` + clc.bgYellow.black(text));
    }
}

else {
    function app_warn(text) {}
    
    function sync_warn(text) {}
}

if (config.LOG_ERROR) {
    function app_error(text) {
        console.error(clc.bgRed(`⧱ `) + clc.bgCyan.black(`[${APP_NAME}]`) 
                    + `  ` + clc.bgRed(text) );
    }
    
    function sync_error(text) {
        console.error(clc.bgRed(`⧱ `) + clc.bgMagenta(`<${SYNC_NAME}>`)
                    + ` ` + clc.bgRed(text));
    }
}

else {
    function app_error(text) {}
    
    function sync_error(text) {}
}

module.exports = {
    app_log,
    sync_log,
    app_info,
    sync_info,
    app_warn,
    sync_warn,
    app_error,
    sync_error,
}