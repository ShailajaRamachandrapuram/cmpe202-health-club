const sql = require("./db.js");

// constructor
const UserSchedule = function(userSchedule) {
  this.user_id = userSchedule.user_id;
  this.schedule_id = userSchedule.schedule_id;
};

UserSchedule.create = (newUserSchedule, result) => {
  sql.query("INSERT INTO user_schedules SET ?", newUserSchedule, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created userSchedule: ", { id: res.insertId, ...newUserSchedule });
    result(null, { id: res.insertId, ...newUserSchedule });
  });
};

UserSchedule.findById = (id, result) => {
  sql.query(`SELECT * FROM user_schedules WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found userSchedule: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found UserSchedule with the id
    result({ kind: "not_found" }, null);
  });
};


UserSchedule.getAll = (user_id, result) => {
  sql.query("SELECT * FROM user_schedules where user_id = ?", 
    [user_id],
    (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_schedules: ", res);
    result(null, res);
  });
};

UserSchedule.getAllByDate = (user_id, schedule_date, result) => {
  sql.query("SELECT * FROM user_schedules where user_id = ? AND schedule_id IN (SELECT id from schedules WHERE s_date=?)", 
    [user_id, schedule_date],
    (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_schedules: ", res);
    result(null, res);
  });
};


UserSchedule.updateById = (id, userSchedule, result) => {
  sql.query(
    "UPDATE user_schedules SET schedule_id = ? WHERE id = ?",
    [userSchedule.schedule_id, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found userSchedule with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated userSchedule: ", { id: id, ...userSchedule });
      result(null, { id: id, ...userSchedule });
    }
  );
};

UserSchedule.remove = (id, result) => {
  sql.query("DELETE FROM user_schedules WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found userSchedule with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted userSchedule with id: ", id);
    result(null, res);
  });
};

UserSchedule.removeAll = result => {
  sql.query("DELETE FROM user_schedules", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} user_schedules`);
    result(null, res);
  });
};

module.exports = UserSchedule;
