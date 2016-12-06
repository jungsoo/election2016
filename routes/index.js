var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Election 2016 Polling Analysis' }); 
});

router.post('/graph', function(req, res) {

  console.log(req.body);
  var db = mysql.createConnection({
    host: 'election2016.cfkfg0dg7ypb.us-east-1.rds.amazonaws.com',
    user: 'root',
    password: 'password',
    database: 'Election2016'
  });

  db.connect();

  var stateListQuery = "SELECT Name FROM state WHERE ";

  // BUILD QUERY FOR LIST OF STATES
  // White
  if (req.body.whiteLower) {
    stateListQuery += "White>=" + req.body.whiteLower + " ";
  }
  else { stateListQuery += "White>=0 "; }
  if (req.body.whiteUpper) {
    stateListQuery += "AND White<=" + req.body.whiteUpper + " ";
  }
  else { stateListQuery += "AND White<=100 "; }

  // Black
  if (req.body.blackLower) {
    stateListQuery += "AND Black>=" + req.body.blackLower + " ";
  }
  else { stateListQuery += "AND Black>=0 "; }
  if (req.body.blackUpper) {
    stateListQuery += "AND Black<=" + req.body.blackUpper + " ";
  }
  else { stateListQuery += "AND Black<=100 "; }

  // Hispanic
  if (req.body.hispanicLower) {
    stateListQuery += "AND Hispanic>=" + req.body.hispanicLower + " ";
  }
  else { stateListQuery += "AND Hispanic>=0 "; }
  if (req.body.hispanicUpper) {
    stateListQuery += "AND Hispanic<=" + req.body.hispanicUpper + " ";
  }
  else { stateListQuery += "AND Hispanic<=100 "; }

  // Asian
  if (req.body.asianLower) {
    stateListQuery += "AND Asian>=" + req.body.asianLower + " ";
  }
  else { stateListQuery += "AND Asian>=0 "; }
  if (req.body.asianUpper) {
    stateListQuery += "AND Asian<=" + req.body.asianUpper + " ";
  }
  else { stateListQuery += "AND Asian<=100 "; }

  // AmericanIndian
  if (req.body.natLower) {
    stateListQuery += "AND AmericanIndian>=" + req.body.natLower + " ";
  }
  else { stateListQuery += "AND AmericanIndian>=0 "; }
  if (req.body.natUpper) {
    stateListQuery += "AND AmericanIndian<=" + req.body.natUpper + " ";
  }
  else { stateListQuery += "AND AmericanIndian<=100 "; }

  
  console.log(stateListQuery);

  db.query(stateListQuery, function(err, rows, fields) {
    if (err) throw err;

    res.render('graph', { title: 'Election 2016 Polling Analysis', rows: rows });
  });

  db.end();
});

module.exports = router;
