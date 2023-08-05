const child_process = require('child_process');
const logging = require('./logging');


function pullDown(vaultPath) {
    child_process.execSync(
        "git pull", { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }

            logging.sync_info("Pulling down from repository");
            logging.sync_log(stdout);
        }
    );
}

function pushUp(vaultPath, deviceID) {
    child_process.execSync(
        "git add -A", { cwd: vaultPath },
        (err, stdout, stderr) => {
            if (err) { logging.sync_warn(err); }

            logging.sync_info("Staging changes");
            logging.sync_log(stdout);
        }
    );

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

module.exports = {
    pullDown,
    pushUp
}