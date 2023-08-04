const child_process = require('child_process');
const logging = require('./logging');


function pullDown(vaultPath) {
    logging.sync_info("Pulling down from repository");

    child_process.exec(
        "git pull", { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }
            logging.sync_log(stdout);
        }
    );
}

function pushUp(vaultPath, deviceID) {
    logging.sync_info("Staging changes");

    child_process.exec(
        "git add -A", { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }
            logging.sync_log(stdout);
        }
    );

    logging.sync_info("Commiting changes");

    child_process.exec(
        `git commit -m "Sync changes from ${deviceID}"`, { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }
            logging.sync_log(stdout);
        }
    );

    logging.sync_info("Pushing commit to upstream repository");

    child_process.exec(
        "git push", { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }
            logging.sync_log(stdout);
        }
    );
}

module.exports = {
    pullDown,
    pushUp
}