const express = require('express');
const minimist = require('minimist');
const db = require("./src/services/database.js");
const morgan = require('morgan');
const fs = require('fs');
const cors = require('cors')

const app = express()
const argv = (minimist)(process.argv.slice(2));

// Exposes public directory to the web
app.use(express.static('./public'));

// Make middleware use cors
app.use(cors());

// Make Express use its own built-in body parser to handle JSON
app.use(express.json());

// Set valid args
argv["port"];
argv["help"]
argv["debug"]


// Get port from arg, if no arg exists set to 5000
const HTTP_PORT = argv.port || 5000;

if (argv.help) {
  console.log("server.js [options]")
  console.log("--port	Set the port number for the server to listen on. Must be an integer between 1 and 65535.");
  console.log("--debug If set to `true`, creates endlpoints /app/log/access/ which returns a JSON access log from the database and /app/error which throws an error with the message \"Error test successful.\" Defaults to `false`.");
  console.log("--log If set to false, no log files are written. Defaults to true. Logs are always written to database.");
  console.log("--help Return this message and exit.");
  process.exit(0);
}

// Set log and debug constants based on args
debug = false;
log = true;

if (argv.debug) {
  debug = true;
}

if (!argv.log) {
  log = false;
}


// Start an app server
const server = app.listen(HTTP_PORT, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',HTTP_PORT))
});

// Creates sqllite database
app.use((req, res, next) => {
  let logdata = {
    remoteaddr: req.ip,
    remoteuser: req.user,
    time: Date.now(),
    method: req.method,
    url: req.url,
    protocol: req.protocol,
    httpversion: req.httpVersion,
    status: res.statusCode,
    referer: req.headers['referer'],
    useragent: req.headers['user-agent']
  }

  const stmt = db.prepare(`INSERT INTO accesslog (remoteaddr, remoteuser, time, method, url, protocol, httpversion, status, referer, useragent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insert = stmt.run(logdata.remoteaddr, logdata.remoteuser, logdata.time, logdata.method, logdata.url, logdata.protocol, logdata.httpversion, logdata.status, logdata.referer, logdata.useragent)
  next();
});


// Debug endpiont
if (debug == true) {
    app.get('/app/log/access', (req, res) => {
      const select_statement = db.prepare('SELECT * FROM accesslog').all();
      res.status(200).json(select_statement);
  });

  app.get('/app/error', (req, res) => {
    throw new Error('Error test successful.')
  });
}

// Write log file
if (log == true) {
  const WRITESTREAM = fs.createWriteStream('FILE', { flags: 'a' })
  app.use(morgan('combined', { stream: WRITESTREAM }))
} 


// Main app endpoint
app.get('/app/', (req, res) => {
    // Add response headerds
    //res.writeHead( res.statusCode, { 'Content-Type' : 'application/json' });
    res.status(200).json({"message" : "Your API works! (200)"});
});


// Endpoint that flips a single coin
app.get('/app/flip/', (req, res) => {
    let flip_result = coinFlip();
    res.status(200).json({"flip" : flip_result});
    console.log(res.getHeaders());
});


// Endpoint that flips multiple coins
// Takes in argument through ":number"
app.get('/app/flips/:number', (req, res) => {
    let num_flips = req.params.number
    let coin_flips = coinFlips(num_flips)
    let flips_counted = countFlips(coin_flips)
    res.status(200).json({"raw" : coin_flips, "summary" : flips_counted});
    console.log(res.getHeaders());
});

// Endpoint that sees if your guess is correct
// Takes in argument through "guess", must be "heads" or "tails"
app.get('/app/flip/call/:guess(heads|tails)/', (req, res, next) => {
    let game = flipACoin(req.params.guess)
    res.status(200).json(game)
});

// Endpoint that flips multiple coins
// Takes in argument through POST request
app.post('/app/flip/coins/', (req, res, next) => {
  let numFlips = req.body.number;
  let coin_flips = coinFlips(numFlips);
  let flips_counted = countFlips(coin_flips);
  res.status(200).json({"raw" : coin_flips, "summary" : flips_counted});
});


// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});



function coinFlip() {
    let rand = Math.floor(Math.random() * 2);
    if (rand == 1) {
      return "heads";
    } else {
      return "tails";
    }
  }
  

function coinFlips(flips) {
    let result = [];
    for (let i = 0; i < flips; i++) {
      result.push(coinFlip());
    }
    return result;
}
  
  
function countFlips(array) {
    let num_tails = 0;
    let num_heads = 0;
    for (let i = 0; i < array.length; i++) {
      if (array[i] == "heads") {
        num_heads += 1;
      } else {
        num_tails += 1;
      }
    }
    if (num_heads == 0) {
      return {
        tails: num_tails
      };
    }
    if (num_tails == 0) {
      return {
        heads: num_heads,
      };
    }
    return {
      heads: num_heads,
      tails: num_tails
    };
}
  
  
function flipACoin(call) {
    let coin  = coinFlip();
    if (coin == call) {
      return {
        call: call,
        flip: coin,
        result: "win"
      };
    } else {
      return {
        call: call,
        flip: coin,
        result: "lose"
      };
    }
}