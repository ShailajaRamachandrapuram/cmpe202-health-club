const Activity = require("../models/activityModel.js");

// Create and Save an Activity
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create an Activity
  const activity = new Activity({
    name: req.body.name
  });

  // Save Activity in the database
  Activity.create(activity, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the activity."
      });
    else res.send(data);
  });
};


// Retrieve all activities from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  Activity.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving activities."
      });
    else res.send(data);
  });
};


// Find a single Activity by Id
exports.findOne = (req, res) => {
  Activity.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Activity with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Activity with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


// Update a Activity identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Activity.updateById(
    req.params.id,
    new Activity(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Activity with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Activity with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete an Activity with the specified id in the request
exports.delete = (req, res) => {
  Activity.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Activity with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Activity with id " + req.params.id
        });
      }
    } else res.send({ message: `Activity was deleted successfully!` });
  });
};


// Delete all Activities from the database.
exports.deleteAll = (req, res) => {
  Activity.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Activities."
      });
    else res.send({ message: `All Activity were deleted successfully!` });
  });
};
