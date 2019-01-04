'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function (db, callback) {
    db.insert('positions', [
        {
            name: "Director"
        },
        {
            name: "Project manager"
        },
        {
            name: "Software developer"
        },
        {
            name: "Tester"
        }
    ], (err) => {
        if (err) return callback(err);

        return callback(null);
    });
};

exports.down = function (db, callback) {
    db.dropCollection('positions', (err) => {
        if (err) return callback(err);
        return callback(null);
    });
};

exports._meta = {
    "version": 1
};
