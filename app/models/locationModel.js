const sql = require("./db.js");

// constructor
const Location = function(location) {
  this.city = location.city;
  this.state = location.state;
};

Location.create = (newLocation, result) => {
  sql.query("INSERT INTO club_loc SET ?", newLocation, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created new location: ", { id: res.insertId, ...newLocation });
    result(null, { id: res.insertId, ...newLocation });
  });
};

Location.findById = (id, result) => {
  sql.query("SELECT * FROM club_loc WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found Location: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found location with the id
    result({ kind: "not_found" }, null);
  });
};


Location.getAll = (title, result) => {
  let query = "SELECT * FROM club_loc";

  if (title) {
    query += " WHERE city LIKE '%" + title +"%'";
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("locations: ", res);
    result(null, res);
  });
};



Location.remove = (id, result) => {
  sql.query("DELETE FROM club_loc WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found location with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted Location with id: ", id);
    result(null, res);
  });
};

Location.removeAll = result => {
  sql.query("DELETE FROM club_loc", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} locations`);
    result(null, res);
  });
};

module.exports = Location;
