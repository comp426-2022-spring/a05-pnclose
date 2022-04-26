// Place your server entry point code here
const args = require('minimist')(process.argv.slice(2))
// Require Express.js
var express = require("express")

// Create App
const app = express()

// Require database
const db = require('./src/services/database.js')

// Require morgan
const morgan = require('morgan')

// Require fs
const fs = require('fs')

// Require cors
const cors = require('cors')

// Check minimist object
console.log(args)

// Help Text
const help = (`
server.js [options]
--port	Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.
--debug	If set to true, creates endlpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.
--log		If set to false, no log files are written. Defaults to true.
            Logs are always written to database.
--help	Return this message and exit.
`)


// echo help
if (args.help || args.h) {
    console.log(help)
    process.exit(0)
}


// cors Set up
app.use(cors())

// Use static html files
app.use(express.static('./public'));


// Allow JSON body messages on all endpoints
app.use(express.json())

