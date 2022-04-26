// Get database
const Database = require('better-sqlite3')

// Create database
const db = new Database('log.db')

// Prepare db
const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' and name='accesslog';`)

// Get row
let row = stmt.get();

// initialize database
if (row === undefined) {
    console.log('Log database is empty. Creating log database...')
    const sqlInit = 
        `   CREATE TABLE accesslog (
            id INTEGER NOT NULL PRIMARY KEY, 
            remoteaddr TEXT, remoteuser TEXT, time INTEGER, 
            method TEXT, url TEXT, protocol TEXT, 
            httpversion TEXT, status INTEGER, 
            referer TEXT, useragent TEXT
        );`
    db.exec(sqlInit)
} else {
    console.log("Database exists")
}

module.exports = db