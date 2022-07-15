var mysql = require('mysql');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs=require('fs');
require('dotenv').config();

var connection = mysql.createConnection({
  host     : process.env.host,
  user     : process.env.user,
  password : process.env.password,
  database : process.env.database
}); 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('Database connected as id ' + connection.threadId);
});
exports.register = async function(req,res){
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds)

  var user={
     "username":req.body.username,
     "password":encryptedPassword
   }
  
  connection.query('INSERT INTO users SET ?',user, function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    } else {
      res.send({
        "code":200,
        "success":"user registered sucessfully"
          });
      }
  });
}

exports.trainapi = async function(req,res){
  fs.readFile(`${__dirname}/TrainAPI/trains.json`,"utf-8",(err,data)=>{
    res.send(data);
  })
}


exports.addtrain = async function(req,res){
  const doc={
    arrival_station: req.body.as,
    arrival_time: req.body.at,
    destination_station: req.body.ds,
    destination_time: req.body.dt
  }
  
  const jsonString = JSON.stringify(doc);
  fs.writeFile('./TrainAPI/trains.json', jsonString, err => {
    if (err) {
        console.log('Error writing file', err)
        res.send(doc)
    } else {
        console.log('Successfully wrote file')
    }
})
}

exports.login = async function(req,res){
  var username= req.body.username;
  var password = req.body.password;
  connection.query('SELECT * FROM users WHERE username = ?',[username], async function (error, results, fields) {
    if (error) {
      res.send({
        "code":400,
        "failed":"error ocurred"
      })
    }else{
      if(results.length >0){
        const comparision = await bcrypt.compare(password, results[0].password)
        if(comparision){
            res.send({
              "code":200,
              "success":"login sucessfull"
            })
        }
        else{
          res.send({
               "code":204,
               "success":"username and password does not match"
          })
        }
      }
      else{
        res.send({
          "code":206,
          "success":"username does not exits"
            });
      }
    }
    });
}