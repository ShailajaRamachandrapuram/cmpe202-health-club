const sql = require("./db.js");

// constructor
const Activity = function(activity) {
  this.name = activity.name;
};

Activity.create = (newActivity, result) => {
  sql.query("INSERT INTO activities SET ?", newActivity, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created activity: ", { id: res.insertId, ...newActivity });
    result(null, { id: res.insertId, ...newActivity });
  });
};

Activity.findById = (id, result) => {
  sql.query(`SELECT * FROM activities WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found activity: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found activity with the id
    result({ kind: "not_found" }, null);
  });
};


Activity.getAll = (title, result) => {
  let query = "SELECT * FROM activities";

  if (title) {
    query += ` WHERE name LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("activities: ", res);
    result(null, res);
  });
};


Activity.updateById = (id, activity, result) => {
  sql.query(
    "UPDATE activities SET name = ? WHERE id = ?",
    [activity.name, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found activity with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated activity: ", { id: id, ...activity });
      result(null, { id: id, ...activity });
    }
  );
};

Activity.remove = (id, result) => {
  sql.query("DELETE FROM activities WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found activity with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted activity with id: ", id);
    result(null, res);
  });
};

Activity.removeAll = result => {
  sql.query("DELETE FROM activities", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} activities`);
    result(null, res);
  });
};

module.exports = Activity;
