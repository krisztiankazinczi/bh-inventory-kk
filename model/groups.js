const sqlite3 = require('sqlite3');
const Promise = require('bluebird');

class Group {
  contructor(db) {
    this.db = db;
  }

 createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, groupname VARCHAR(60) NOT NULL, parent_id INTEGER)"
    return this.db.run(sql);
  }


  insert(groupname, parent_id) {
    return this.db.run(
      `INSERT INTO groups (groupname, parent_id)
        VALUES (?, ?)`,
        [groupname, parent_id])
  }

}

module.exports = Group;