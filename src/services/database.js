const Database = require('better-sqlite3');
const db = new Database('accesslog.db');

const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' and name = 'accesslog';`);

let row = stmt.get();

if (row == undefined) {
    const sqlInit = `
        CREATE TABLE accesslog (
            accesslogid INTEGER PRIMARY KEY, 
            remoteaddr TEXT, 
            remoteuser TEXT, 
            time TEXT, 
            method TEXT, 
            url TEXT, 
            protocol TEXT,
            httpversion TEXT, 
            status TEXT, 
            referer TEXT,
            useragent TEXT
        );`
    db.exec(sqlInit);
} else {
    console.log('DB exists.');
}

module.exports = db;