const sql = require("./db.js");

// constructor
const Membership = function(membership) {
  this.name = membership.name;
  this.duration = membership.duration;
  this.cost = membership.cost;
  this.location = membership.location;
};

Membership.create = (newMembership, result) => {
  sql.query("INSERT INTO memberships SET ?", newMembership, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created membership: ", { id: res.insertId, ...newMembership });
    result(null, { id: res.insertId, ...newMembership });
  });
};

Membership.findById = (id, result) => {
  sql.query(`SELECT * FROM memberships WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found membership: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found membership with the id
    result({ kind: "not_found" }, null);
  });
};


Membership.getAll = (title, result) => {
  let query = "SELECT * FROM memberships";

  if (title) {
    query += ` WHERE name LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("memberships: ", res);
    result(null, res);
  });
};


Membership.updateById = (id, membership, result) => {
  sql.query(
    "UPDATE memberships SET name = ?, duration = ?, cost = ?, location =? WHERE id = ?",
    [membership.name, membership.duration, membership.cost, membership.location, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found membership with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated membership: ", { id: id, ...membership });
      result(null, { id: id, ...membership });
    }
  );
};

Membership.remove = (id, result) => {
  sql.query("DELETE FROM memberships WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found membership with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted membership with id: ", id);
    result(null, res);
  });
};

Membership.removeAll = result => {
  sql.query("DELETE FROM memberships", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} memberships`);
    result(null, res);
  });
};

module.exports = Membership;
