const sql = require("./db.js");

// constructor
const UserActivity = function(userActivity) {
  this.user_id = userActivity.user_id;
  this.activity_id = userActivity.activity_id;
  this.duration = userActivity.duration;
  this.activity_date = userActivity.activity_date;
};

UserActivity.create = (newUserActivity, result) => {
  sql.query("INSERT INTO user_activities SET ?", newUserActivity, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created userActivity: ", { id: res.insertId, ...newUserActivity });
    result(null, { id: res.insertId, ...newUserActivity });
  });
};

UserActivity.findById = (id, result) => {
  sql.query(`SELECT * FROM user_activities WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found userActivity: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found useractivity with the id
    result({ kind: "not_found" }, null);
  });
};


UserActivity.getAll = (user_id, result) => {
  sql.query("SELECT * FROM user_activities where user_id = ?", 
    [user_id],
    (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_activities: ", res);
    result(null, res);
  });
};

UserActivity.getAllByDate = (user_id, activity_date, result) => {
  sql.query("SELECT * FROM user_activities where user_id = ? AND activity_date= ?", 
    [user_id, activity_date],
    (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("user_activities: ", res);
    result(null, res);
  });
};


UserActivity.updateById = (id, userActivity, result) => {
  sql.query(
    "UPDATE user_activities SET duration = ?, activity_date=? WHERE id = ?",
    [userActivity.duration, userActivity.activity_date, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found userActivity with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated userActivity: ", { id: id, ...userActivity });
      result(null, { id: id, ...userActivity });
    }
  );
};

UserActivity.remove = (id, result) => {
  sql.query("DELETE FROM user_activities WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found userActivity with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted userActivity with id: ", id);
    result(null, res);
  });
};

UserActivity.removeAll = result => {
  sql.query("DELETE FROM user_activities", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} user_activities`);
    result(null, res);
  });
};

module.exports = UserActivity;
