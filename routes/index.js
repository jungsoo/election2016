var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' }); 
});

router.post('/', function(req, res) {

  var db = mysql.createConnection({
    host: 'election2016.cfkfg0dg7ypb.us-east-1.rds.amazonaws.com',
    user: 'root',
    password: 'password',
    database: 'Election2016'
  });

  db.connect();
  db.query('SELECT polls.State, Date FROM polls, state WHERE state.Age65 >= 0.17 AND polls.State = state.Name', function(err, rows, fields) {
    if (err) throw err;

    console.log(rows[0]);
    res.render('indexAfter', { title: 'Express', rows: rows });
  });

  db.end();
});

module.exports = router;
