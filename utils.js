const unixCPU = require('pidusage');

var exports = module.exports = {};

exports.getCPU_Load = (data, callback) => {
    unixCPU.stat(data.pid, function (err, result) {
        if (err) {
            console.error('Error in getCPU_Percent. Err: ', err);
            return callback(err, null);
        }
        callback(null, {"id": data.id, "cpu": result.cpu, "pid": data.pid});
    });
};