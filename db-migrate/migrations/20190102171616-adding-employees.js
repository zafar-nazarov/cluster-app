const mongoose = require('mongoose');
const config = require('../database.json');
const ObjectId = require('mongoose').Types.ObjectId;
const PositionSchema = require('../../models/PositionModel');
const async = require('async');

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function () {
};

exports.up = function (db, callback) {
    mongoose.connect(`mongodb://${config.local.host}:${config.local.port}/${config.local.database}`, { useNewUrlParser: true }, (err, dbConnection) => {
        if (err) { return callback(err); }
        PositionSchema.find({}, (err, positions) => {
            if (err) { return callback(err); }

            let names = ["Farrukh Kholikov", "Xusan Qodirov", "Oleg Zaitsev", "Botir Abdullayev", "Igor Krivenko", "John Doe", "Michael Lee", "Brandon Pitt", "Wilgelm Snider", "Danila Gazmanov", "Stiven King", "Sven Jordan", "Lilo Pintu", "Sarik Agasyan", "Dali Sallivan", "Zind Koleman", "Michael Lindsay", "Odell Grooms", "Dan Moen", "Hannah Charin", "James Bartos", "Henry Warren", "Troyal Garth", "Lisa Forkner", "Herman Smith", "Ali ibn Abi Talib", "Ali Tariq", "Alexie Sherman", "Abubakr Shaikhov", "Davron Petrov"];

            var createUser = (id, callback) => {
                let positionId = positions[Math.floor(Math.random() * 4)]._id;
                let name = names[Math.floor(Math.random() * 30)];
                let age = Math.floor(Math.random() * 40 + 20);
                db.insert('employees', [
                    {
                        name: name,
                        age: age,
                        position: ObjectId(positionId)
                    }
                ], (err) => {
                    callback(err, {});
                });
            };

            async.times(50, (n, next) => {
                createUser(n, (err, user) => {
                    next(err, user);
                })
            }, (err, users) => {
                mongoose.connection.close();
                if (err) { return callback(err); }
                return callback(null);
            })
        });
    });
};

exports.down = function (db, callback) {
    db.dropCollection('employees', (err) => {
        if (err) return callback(err);
        return callback(null);
    });
};

exports._meta = {
    "version": 1
};
