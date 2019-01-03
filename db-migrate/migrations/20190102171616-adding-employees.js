const MongoClient = require('mongodb').MongoClient;
const config = require('../database.json');

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function() {
};

exports.up = function(db, callback) {
  // MongoClient.connect(`mongodb://${config.local.host}:${config.local.port}/${config.local.database}`, (err, dbConnection) => {
  //   if (err) return callback(err);
  //   const positions = dbConnection.collection('positions').find();
  //   console.log(positions);
  //   return null;
  // });

  // let positions = db.positions.find();
  //
  // let name = "";
  // let age = 0;
  // let names = ["Farrukh Kholikov", "Xusan Qodirov", "Oleg Zaitsev", "Botir Abdullayev", "Igor Krivenko", "John Doe", "Michael Lee", "Brandon Pitt", "Wilgelm Snider", "Danila Gazmanov", "Stiven King", "Sven Jordan", "Lilo Pintu", "Sarik Agasyan", "Dali Sallivan", "Zind Koleman", "Michael Lindsay", "Odell Grooms", "Dan Moen", "Hannah Charin", "James Bartos", "Henry Warren", "Troyal Garth", "Lisa Forkner", "Herman Smith", "Ali ibn Abi Talib", "Ali Tariq", "Alexie Sherman"];
  // for (let i=0; i<10; i++) {
  //   let rand = Math.floor(Math.random() * names.length);
  //   name = names[rand];
  //   age = Math.floor(Math.random() * 40 + 20);
  //   console.log(name);
  // }


  db.insert('employees', [
    {
      name: "Zafar Nazarov",
      age: 30,
      position: 'ObjectId("5c2cf1a0d055ab1884d5e67b")'
    },
    {
      name: "Rasulbek Mirzayev",
      age: 28,
      position: 'ObjectId("5c2cf1a0d055ab1884d5e67c")'
    },
    {
      name: "Alisher Abdukadirov",
      age: 39,
      position: 'ObjectId("5c2cf1a0d055ab1884d5e67a")'
    }
  ], (err) => {
    if (err) return callback(err);

    return callback(null);
  });
};

exports.down = function(db, callback) {
  db.dropCollection('employees', (err) => {
    if (err) return callback(err);
    return callback(null);
  });
};

exports._meta = {
  "version": 1
};
