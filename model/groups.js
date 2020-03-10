const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('inventory1.db');

class Group {

 createTable() {
    const sql = "CREATE TABLE IF NOT EXISTS groups (id INTEGER PRIMARY KEY AUTOINCREMENT, groupname VARCHAR(60) NOT NULL, parent_id INTEGER)"
    return db.run(sql);
  }


  insert(groupname, parent_id) {
    return db.run(
      `INSERT INTO groups (groupname, parent_id)
        VALUES (?, ?)`,
        [groupname, parent_id])
  }

  getGroups() {
    const sql = `SELECT id, groupname, parent_id FROM groups`;

      return new Promise((resolve, reject) => {
        db.all(sql, (err, results) => {
          if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
          else resolve(results)
      });
    })
  }

  addGroup(group_name, group_main_id) {
    const stmt = db.prepare("INSERT INTO groups(groupname, parent_id) VALUES (?,?)");
      return new Promise((resolve, reject) => {  
      // group_main_id erteke 0 ha uj fo kategoriat hozunk letre
        if (group_name) {
          if (group_main_id == "0") {
            stmt.run(group_name, 0, (err) => {
              if (err) {
                console.error(err.toString()); 
                reject('Adatbazis hiba');
              }
              resolve('success')
            });
          } else {
            stmt.run(group_name, group_main_id, (err) => {
              if (err) {
                console.error(err.toString()); 
                reject('Adatbazis hiba');
              }
              resolve('success')
            });
          }
        } else {
            reject('Az egyik input field ures maradt');
        }
      });
  }


  editGroup(id, name, main_id) {
    const groupUpdate = db.prepare("UPDATE groups SET groupname = ?, parent_id = ? WHERE id = ?");
    const getGroupId = 'SELECT id, parent_id FROM groups WHERE id= ?'
    const groupMainUpdate = db.prepare('UPDATE groups SET parent_id = ? WHERE parent_id = ?')

    return new Promise(async (resolve, reject) => {
      if (name && id) {
        try {
          await groupUpdate.run(name, main_id, id, (err) => {
            if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
              resolve('success')
          })
          // await update(groupUpdate, name, main_id, id)
        } catch (err) {
          console.log(err)
        }

        let result;

        try {
          result = await getID(getGroupId, id)
        } catch (err) {
          console.log(err)
        }
        if (result.parent_id == null) {
            groupMainUpdate.run(result.id, main_id, (err) => {
              if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
              resolve('success')
          })
        }
      } else {
        reject('Nem sikerult szerkeszteni a raktar tulajdonsagait, mert nem minden mezo volt kitoltve.')
      }
    });
  }

  delGroup(id) {
    const getSubCategoriesIfAny = 'SELECT id, groupname, parent_id FROM groups WHERE parent_id = ?';
    const delGroup = db.prepare('DELETE FROM groups WHERE id = ?');
    const delFromConnectTable = db.prepare('DELETE FROM product_in_group WHERE group_id = ?');
    if (id) {
      
      return new Promise(async (resolve, reject) => {
        let result;

        try {
          result = await getAll(getSubCategoriesIfAny, id)
        } catch (err) {
          console.log(err)
        }
        //Csak akkor torlom, ha nincs alkategoriaja az adott kategorianak
        if(result.length === 0) {
          delGroup.run(id, (err) => {
            if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
            resolve('success')
          });
          delFromConnectTable.run(id, (err) => {
            if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
            resolve('success')
          });
        } else reject('A kategoria nem torolheto, mert van egy vagy tobb alkategoriaja');

      });

  }

}
}

function update(sqlstmt, params) {
  return new Promise((resolve, reject) => {
    sqlstmt.run([params], (err) => {
      if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
      resolve('success')
    });
  })
}

function getID(sqlstmt, params) {
  return new Promise((resolve, reject) => {
    db.get(sqlstmt, [params], (err, results) => {
      if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
      console.log('megvan az id')
      resolve(results)
    });
  })
}

function getAll(sqlstmt, params) {
  return new Promise((resolve, reject) => {
    db.all(sqlstmt, [params], (err, results) => {
      if (err) {console.error(err.toString()); reject('Adatbazis hiba')}
      resolve(results)
    });
  });
}


const group = new Group()

module.exports = group;