'use strict';

// Setup basic express server
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var path = require('path');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8090;

server.listen(port, function(){
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('client'));
// parse application/json
app.use(bodyParser.json());

var user_count=0;

const mysql = require('mysql');

const options = {
  user: "root",
  password: "wf2xl1314",
  database: 'beacons'
};

if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
  options.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

const connection = mysql.createConnection(options);

connection.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname +'/client/home.html'));
});

app.get("/mapLowerLevel",function(req,res){
  res.sendFile(path.join(__dirname + '/client/lowerlevel.pdf'));
});

app.post("/MapVersion",function(req,res){
  let mapid = connection.escape(req.body.mapid);
  let sql = `SELECT version from maps where mapId=${mapid};`;
  var response_data = {};
  if(!mapid){
    response_data.er = "Mapid not specified";
    res.send(JSON.stringify(response_data));
  }else {
    connection.query(sql, function (err, result) {
      if (err) {
        response_data.er = err;
        res.send(JSON.stringify(response_data));
      }else{
        if (result.length !== 1) {
          response_data.er = "No matching record";
          res.send(JSON.stringify(response_data));
        } else {
          response_data.version = result[0].version;
          res.send(JSON.stringify(response_data));
        }
      }
    })
  }
});

app.post("/MapAndBeacons",function(req,res){
  let mapid = connection.escape(req.body.mapid);
  var response_data = {};
  if(!mapid){
    response_data.er = "Mapid not specified";
    res.send(JSON.stringify(response_data));
  }else{
    let sql = `SELECT url from maps where mapId=${mapid};`;
    connection.query(sql,function(err,result){
      if (err) {
        response_data.er = err;
        res.send(JSON.stringify(response_data));
      }else {
        if (result.length !== 1) {
          response_data.er = "No matching record";
          res.send(JSON.stringify(response_data));
        } else {
          let sql2 = `SELECT * from beacons where MapId=${mapid}`;
          connection.query(sql2, function (err, result2) {
            if (err) {
              response_data.er = err;
              res.send(JSON.stringify(response_data));
            }else {
              response_data.mapid = mapid;
              response_data.url = result[0];
              response_data.length = result2.length;
              for (var i = 0; i < result2.length; i++) {
                response_data[i] = result2[0];
              }
              res.send(JSON.stringify(response_data));
            }
          })
        }
      }
    })
  }
});

app.post("/api/CreateUser",function(req,res){
  let username = connection.escape(req.body.usr);
  let password = connection.escape(req.body.psw);
  var response_data = {};
  if(!username || !password){
    response_data.er = "not enough information provided";
    res.send(JSON.stringify(response_data));
  }else{
    var sql = `SELECT username from users where username=${username}`;
    //console.log("sql: " + sql);
    connection.query(sql,function(err,result){
      if (err) {
        response_data.er = err;
        res.send(JSON.stringify(response_data));
      }else{
        if(result.length !== 0) {
          // console.log(result);
          response_data.er = "User already exists";
          res.send(JSON.stringify(response_data));
        }else{
          sql = `INSERT INTO users (username, password, role) VALUES (${username}, ${password}, 'user')`;
          connection.query(sql, function (err, result) {
            if (err) {
              response_data.er = err;
              res.send(JSON.stringify(response_data));
            }else {
              response_data.msg = `User: '${username}' successfully created!`;
              response_data.role = "user";
              res.send(JSON.stringify(response_data));
            }
          });
        }
      }
    });
  }
});

app.post("/api/GetUserInfo",function(req,res){
  let username = connection.escape(req.body.usr);
  let role = req.body.role;
  var response_data = {};
  if(!username){
    response_data.er = "not enough information provided";
    res.send(JSON.stringify(response_data));
  }else{
    var sql;
    if(role === 'admin'){
      sql = `SELECT * FROM subscriptions INNER JOIN beacons ON subscriptions.subscriptions_id=beacons.subscription_id;`
    }else{
      sql = `SELECT * FROM subscriptions INNER JOIN beacons ON subscriptions.subscriptions_id=beacons.subscription_id where subscriptions.owned_by=${username};`
    }
    console.log(sql);
    // var sql = `SELECT * from subscriptions where owned_by='${username}'`;
    connection.query(sql,function(err,result){
      if (err) {
        response_data.er = err;
        res.send(JSON.stringify(response_data));
      }else {
        if (result.length === 0) {
          response_data.er = "No record found";
          res.send(JSON.stringify(response_data));
        } else {
          // console.log(result);
          for (var i = 0; i < result.length; i++) {
            response_data[i] = {
              "uuid": result[i].UUID,
              "major": result[i].Major,
              "minor": result[i].Minor,
              "mapid": result[i].MapId,
              "batterylevel": result[i].battery_level,
              "x": result[i].x,
              "y": result[i].y,
              "ownedby": result[i].owned_by,
              "subid": result[i].subscriptions_id,
              "exp_date": result[i].expire_date
            }
          }
          res.send(JSON.stringify(response_data));
        }
      }
    });
  }
});

app.post("/api/AuthorizeUser",function(req,res){
  let username = connection.escape(req.body.usr);
  let password = connection.escape(req.body.psw);
  // console.log(req.body);
  var response_data = {};
  if(!username || !password){
    response_data.er = "not enough information provided";
    res.send(JSON.stringify(response_data));
  }else{
    const sql = `SELECT * from users where username=${username} and password=${password}`;
    console.log("SQL: " + sql);
    connection.query(sql,function(err,result){
      if (err) {
        response_data.er = err;
        res.send(JSON.stringify(response_data));
      }else {
        if (result.length === 0) {
          response_data.er = "no matching username or password";
          res.send(JSON.stringify(response_data));
        } else {
          response_data.msg = `user: '${username}' logged in`;
          response_data.role = result[0].role;
          res.send(JSON.stringify(response_data));
        }
      }
    });
  }
});

app.post("/api/DeleteBeacon",function(req,res){
  let uuid = connection.escape(req.body.uuid);
  let major = connection.escape(req.body.major);
  let minor = connection.escape(req.body.minor);

  var response_data = {};
  if(!uuid || !major || !minor){
    response_data.er = "not enough information provided";
    res.send(JSON.stringify(response_data));
  }else{
    const sql = `DELETE from beacons where uuid=${uuid} and major=${major} and minor=${minor}`;
    connection.query(sql,function(err,result){
      if (err) {
        response_data.er = err;
        res.send(JSON.stringify(response_data));
      }else {
        console.log("delete result:" + JSON.stringify(result));
        if (result.length === 0) {
          response_data.er = "no matching beacon";
          res.send(JSON.stringify(response_data));
        } else {
          response_data.msg = `record deleted`;
          res.send(JSON.stringify(response_data));
        }
      }
    });
  }
});

app.post("/api/CreateBeacon",function(req,res){
  let uuid = connection.escape(req.body.uuid);
  let major = connection.escape(req.body.major);
  let minor = connection.escape(req.body.minor);
  let mapid = connection.escape(req.body.mapid);
  let x = connection.escape(req.body.x);
  let y = connection.escape(req.body.y);
  let subid = connection.escape(req.body.subid);
  let owner = connection.escape(req.body.owner);

  var response_data = {};
  if(!uuid||!major||!minor||!mapid||!x||!y||!subid||!owner){
    response_data.er = "not enough information provided";
    res.send(JSON.stringify(response_data));
  }else{
    var sql = `SELECT * from subscriptions where subscriptions_id=${subid};`;
    console.log(sql);
    connection.query(sql,function(err,result){
      if (err) {
        response_data.er = err;
        res.send(JSON.stringify(response_data));
      }else {
        if (result.length !== 0) {
          sql = `INSERT INTO beacons(uuid,major,minor,mapid,x,y,subscription_id,battery_level) values (${uuid},${major},${minor},${mapid},${x},${y},${subid},'3years');`;
          console.log(sql);
          connection.query(sql, function (err, result) {
            if (err) {
              response_data.er = err;
              res.send(JSON.stringify(response_data));
            }else {
              response_data.msg = 'record inserted';
              res.send(JSON.stringify(response_data));
            }
          });
        } else {
          sql = `INSERT INTO subscriptions (subscriptions_id,expire_date,owned_by) values (${subid},'2099-12-31',${owner});`;
          console.log(sql);
          connection.query(sql, function (err, result) {
            if (err) {
              response_data.er = err;
              res.send(JSON.stringify(response_data));
            }else {
              sql = `INSERT INTO beacons(uuid,major,minor,mapid,x,y,subscription_id,battery_level) values (${uuid},${major},${minor},${mapid},${x},${y},${subid},'3years');`;
              connection.query(sql, function (err, result) {
                if (err) {
                  response_data.er = err;
                  res.send(JSON.stringify(response_data));
                }else {
                  response_data.msg = 'record inserted';
                  res.send(JSON.stringify(response_data));
                }
              });
            }
          });
        }
      }
    });
  }
});
