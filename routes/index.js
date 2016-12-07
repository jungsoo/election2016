var express = require('express');
var router = express.Router();
var mysql = require('mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = mysql.createConnection({
    host: 'election2016.cfkfg0dg7ypb.us-east-1.rds.amazonaws.com',
    user: 'root',
    password: 'password',
    database: 'Election2016'
  });
  db.connect();

  db.query("SELECT Title FROM scandals", function(err, rows, fields) {
    if (err) throw err;

    res.render('index', { title: 'Election 2016 Polling Analysis', scandals: rows }); 
  });

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

  // HSGRAD
  if (req.body.hsLower) {
    stateListQuery += "AND HighSchoolGraduatePercent>=" + req.body.hsLower + " ";
  }
  else { stateListQuery += "AND HighSchoolGraduatePercent>=0 "; }
  if (req.body.hsUpper) {
    stateListQuery += "AND HighSchoolGraduatePercent<=" + req.body.hsUpper + " ";
  }
  else { stateListQuery += "AND HighSchoolGraduatePercent<=100 "; }

  // BACH GRAD
  if (req.body.bachLower) {
    stateListQuery += "AND BachelorPercent>=" + req.body.bachLower + " ";
  }
  else { stateListQuery += "AND BachelorPercent>=0 "; }
  if (req.body.bachUpper) {
    stateListQuery += "AND BachelorPercent<=" + req.body.bachUpper + " ";
  }
  else { stateListQuery += "AND BachelorPercent<=100 "; }

  // ADV DEGR GRAD
  if (req.body.advLower) {
    stateListQuery += "AND AdvancedDegrPercent>=" + req.body.advLower + " ";
  }
  else { stateListQuery += "AND AdvancedDegrPercent>=0 "; }
  if (req.body.advUpper) {
    stateListQuery += "AND AdvancedDegrPercent<=" + req.body.advUpper + " ";
  }
  else { stateListQuery += "AND AdvancedDegrPercent<=100 "; }

  // 18-25
  if (req.body.lower1825) {
    stateListQuery += "AND Age1825>=" + req.body.lower1825 + " ";
  }
  else { stateListQuery += "AND Age1825>=0 "; }
  if (req.body.upper1825) {
    stateListQuery += "AND Age1825<=" + req.body.upper1825 + " ";
  }
  else { stateListQuery += "AND Age1825<=100 "; }

  // 25-64 
  if (req.body.lower2564) {
    stateListQuery += "AND Age2564>=" + req.body.lower2564 + " ";
  }
  else { stateListQuery += "AND Age2564>=0 "; }
  if (req.body.upper2564) {
    stateListQuery += "AND Age2564<=" + req.body.upper2564 + " ";
  }
  else { stateListQuery += "AND Age2564<=100 "; }

  // 65
  if (req.body.lower65) {
    stateListQuery += "AND Age65>=" + req.body.lower65 + " ";
  }
  else { stateListQuery += "AND Age65>=0 "; }
  if (req.body.upper65) {
    stateListQuery += "AND Age65<=" + req.body.upper65 + " ";
  }
  else { stateListQuery += "AND Age65<=100 "; }

  // income
  if (req.body.incomeLower) {
    stateListQuery += "AND MedianHouseholdIncome>=" + req.body.incomeLower + " ";
  }
  else { stateListQuery += "AND MedianHouseholdIncome>=30000 "; }
  if (req.body.incomeUpper) {
    stateListQuery += "AND MedianHouseholdIncome<=" + req.body.incomeUpper + " ";
  }
  else { stateListQuery += "AND MedianHouseholdIncome<=70000 "; }

  /* END STATELISTQUERY BUILD */


  db.query(stateListQuery, function(err, rows, fields) {
    if (err) throw err;

    var states = rows;
    var results = [];
    var scandal;

    if (req.body.scandalTitle !== "No Scandal") {
      var queryScandal = "SELECT * FROM scandals WHERE Title='" + req.body.scandalTitle+"'";
      db.query(queryScandal, function(err, rows, fields) {
        if (err) throw err;

        scandal = rows[0];
        console.log(scandal);
      });
    } else { scandal = "None"; }

    for (var i = 0; i < states.length; i++) {
      var pollDateQuery = "SELECT DISTINCT Date, State, AVG(Clinton) AS Clinton, AVG(Trump) AS Trump FROM polls WHERE polls.State='";
      pollDateQuery += states[i].Name;
      pollDateQuery += "' GROUP BY Date ORDER BY polls.Date";

      // console.log(pollDateQuery);

      db.query(pollDateQuery, function(err, rows, fields) {
        if (err) throw err;

        var stateData = {
          name: rows[0].State,
          dates: [],
          clintonAvgs: [],
          trumpAvgs: [],
        }

        for (var j = 0; j < rows.length; j++) {
          stateData.dates.push("'"+rows[j].Date+"'");
          stateData.clintonAvgs.push(rows[j].Clinton);
          stateData.trumpAvgs.push(rows[j].Trump);
        }
        
        results.push(stateData);
      });

    }

    setTimeout(function() {
      res.render('graph', { title: 'Election 2016 Polling Analysis', results: results, scandal: scandal });
      db.end();
    }, 1500);
  });

});

module.exports = router;
