const child_process = require('child_process');
const fs = require('fs');
const logging = require('./logging');


function setLock(vaultPath, deviceID) {
    let lockSet = true;
    fs.writeFileSync(`${vaultPath}\\.obsidian-filesync-lock`, deviceID, (err) => {
        if (err) {
            logging.sync_warn(err);
            lockSet = false;
        }
    });
    return lockSet;
}

function unsetLock(vaultPath) {
    let lockUnset = true;
    fs.writeFileSync(`${vaultPath}\\.obsidian-filesync-lock`, '', (err) => {
        if (err) {
            logging.sync_warn(err);
            lockUnset = false;
        }
    });
    return lockUnset;
}


function pullDown(vaultPath) {
    child_process.execSync(
        "git pull", { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }

            logging.sync_info("Pulling down from repository");
            logging.sync_log(stdout);
        }
    );

    let lock = '';
    fs.readFileSync(`${vaultPath}\\.obsidian-filesync-lock`, 'utf-8', (err, data) => {
        if (err) { logging.sync_warn(err); }
        lock = String(data).trim();
    });

    return lock;
}

function pushUp(vaultPath, deviceID, lockfile_only=false) {
    let addCmd = "git add -A";
    if (lockfile_only) addCmd = "git add .obsidian-filesync-lock";

    child_process.execSync(
        "git add -A", { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }

            logging.sync_info("Staging changes");
            logging.sync_log(stdout);
        }
    );

    try {
        child_process.execSync(
            `git commit -m "Sync changes from ${deviceID}"`, { cwd: vaultPath },
            (err, stdout, stderr) => {
                if (err) { logging.sync_warn(err); }
    
                logging.sync_info("Commiting changes");
                logging.sync_log(stdout);
            }
        );
    
        child_process.execSync(
            "git push", { cwd: vaultPath },
            (err, stdout, stderr) => {
                if (err) { logging.sync_warn(err); }
    
                logging.sync_info("Pushing commit to upstream repository");
                logging.sync_log(stdout);
            }
        );
    }
    catch {  }
}

module.exports = {
    setLock,
    unsetLock,
    pullDown,
    pushUp
}