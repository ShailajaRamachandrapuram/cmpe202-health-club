const User = require("../models/userModel.js");

// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
    admin: req.body.admin,
    membership: req.body.membership
  });

  // Save User in the database
  User.create(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the ."
      });
    else res.send(data);
  });
};

// Retrieve all Users from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  User.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};

// Find a single User by Id
exports.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// Find a single User by Id
exports.login = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a User
  const user = new User({
    name: req.body.name,
    password: req.body.password
  });

  User.login(user, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else if (err.kind === "invalid") {
        res.status(401).send({
          message: "Invalid login credentials"
        });
      } else {
        res.status(500).send({
          message: "Error logging in User"
        });
      }
    } else res.send(data);
  });
};


// Update a User identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  User.updateById(
    req.params.id,
    new User(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Update a User identified by the id in the request
exports.updateMembership = (req, res) => {
  // Validate Request
  if (!req.query.membership) {
    res.status(400).send({
      message: "membership can not be empty!"
    });
  }

  User.updateMembership(
    req.query.user,
    req.query.membership,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.query.user}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User with id " + req.query.user
          });
        }
      } else res.send(data);
    }
  );
};



// Create check-in entry
exports.checkin = (req, res) => {
  // Validate Request
  if (!req.query.intime) {
    res.status(400).send({
      message: "Check-in can not be empty!"
    });
  }

  User.checkin(
    req.params.id,
    req.query.intime,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User checkin with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};

// Update check-in entry with check-out time
exports.checkout = (req, res) => {
  // Validate Request
  if (!req.query.outtime) {
    res.status(400).send({
      message: "Check-in can not be empty!"
    });
  }

  User.checkout(
    req.params.id,
    req.query.outtime,
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found User Active Session with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating User checkout with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};



// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.id
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

// Delete all users from the database.
exports.deleteAll = (req, res) => {
  User.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all users."
      });
    else res.send({ message: `All users were deleted successfully!` });
  });
};
