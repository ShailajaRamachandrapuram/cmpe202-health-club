const Membership = require("../models/membershipModel.js");
const Location = require("../models/locationModel.js");

// Create and Save a Membership
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Membership
  const membership = new Membership({
    name: req.body.name,
    location: req.body.location,
    cost: req.body.cost,
    duration: req.body.duration
  });

  // Save Membership in the database
  Membership.create(membership, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the membership."
      });
    else res.send(data);
  });
};


// Retrieve all Memberships from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  Membership.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Memberships."
      });
    else res.send(data);
  });
};

// Retrieve all Locations from the database (with condition - city).
exports.getAllLocations = (req, res) => {
  const name = req.query.city;

  Location.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving locations."
      });
    else res.send(data);
  });
};


// Find a single Membership by Id
exports.findOne = (req, res) => {
  Membership.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Membership with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Membership with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


// Update a Membership identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Membership.updateById(
    req.params.id,
    new Membership(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Membership with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Membership with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete a Membership with the specified id in the request
exports.delete = (req, res) => {
  Membership.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Membership with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Membership with id " + req.params.id
        });
      }
    } else res.send({ message: `Membership was deleted successfully!` });
  });
};


// Delete all Membership from the database.
exports.deleteAll = (req, res) => {
  Membership.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Memberships."
      });
    else res.send({ message: `All Memberships were deleted successfully!` });
  });
};
