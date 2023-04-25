const sql = require("./db.js");

// constructor
const Schedule = function(schedule) {
  this.name = schedule.name;
  this.duration = schedule.duration;
  this.s_date = schedule.s_date;
  this.s_time = schedule.s_time;
};

Schedule.create = (newSchedule, result) => {
  sql.query("INSERT INTO schedules SET ?", newSchedule, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created schedule: ", { id: res.insertId, ...newSchedule });
    result(null, { id: res.insertId, ...newSchedule });
  });
};

Schedule.findById = (id, result) => {
  sql.query(`SELECT * FROM schedules WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found schedule: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Schedule with the id
    result({ kind: "not_found" }, null);
  });
};


Schedule.getAll = (title, result) => {
  let query = "SELECT * FROM schedules";

  if (title) {
    query += ` WHERE name LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("schedules: ", res);
    result(null, res);
  });
};


Schedule.updateById = (id, schedule, result) => {
  sql.query(
    "UPDATE schedules SET name = ?, s_date = ?, duration = ?, s_time =? WHERE id = ?",
    [schedule.name, schedule.s_date, schedule.duration, schedule.s_time, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found schedule with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated schedule: ", { id: id, ...schedule });
      result(null, { id: id, ...schedule });
    }
  );
};

Schedule.remove = (id, result) => {
  sql.query("DELETE FROM schedules WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found schedule with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted schedule with id: ", id);
    result(null, res);
  });
};

Schedule.removeAll = result => {
  sql.query("DELETE FROM schedules", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} schedules`);
    result(null, res);
  });
};

module.exports = Schedule;
