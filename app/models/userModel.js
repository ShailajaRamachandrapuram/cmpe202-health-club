const sql = require("./db.js");

// constructor
const User = function(user) {
  this.name = user.name;
  this.phone = user.phone;
  this.email = user.email;
  this.password = user.password;
  this.admin = user.admin;
  this.membership = user.membership;
};

User.create = (newUser, result) => {
  sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { id: res.insertId, ...newUser });
    result(null, { id: res.insertId, ...newUser });
  });
};

User.findById = (id, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.login = (user, result) => {
  sql.query(`SELECT * FROM users WHERE name = "${user.name}" AND password = "${user.password}"` , (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found user: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "invalid" }, null);
  });
};

User.getAll = (title, result) => {
  let query = "SELECT * FROM users";

  if (title) {
    query += ` WHERE name LIKE '%${title}%'`;
  }

  sql.query(query, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};


User.updateById = (id, user, result) => {
  sql.query(
    "UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?",
    [user.name, user.phone, user.email, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated user: ", { id: id, ...user });
      result(null, { id: id, ...user });
    }
  );
};

User.updateMembership = (id, membership, result) => {
  sql.query(
    "UPDATE users SET membership = ? WHERE id = ?",
    [membership, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated membership for user: " + id);
      result(null, { kind: "ok" });
    }
  );
};

User.checkin = (id, intime, result) => {
  sql.query(
    "INSERT INTO user_log (user_id, in_time, is_active) values (?,?,?)",
    [id, intime, true],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("created checkin for user: " + id);
      result(null, { kind: "ok" });
    }
  );
};

User.checkout = (id, outtime, result) => {
  sql.query(
    "UPDATE user_log SET out_time=?, is_active =? WHERE is_active=? AND user_id=?",
    [outtime, false, true, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found user with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated checkout for user: " + id);
      result(null, { kind: "ok" });
    }
  );
};



User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found user with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with id: ", id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} users`);
    result(null, res);
  });
};

module.exports = User;
