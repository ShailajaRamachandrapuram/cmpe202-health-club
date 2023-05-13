const UserActivity = require("../models/userActivityModel.js");

// Create and Save a UserActivity
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a UserActivity
  const userActivity = new UserActivity({
    user_id: req.body.user_id,
    activity_id: req.body.activity_id,
    duration: req.body.duration,
    activity_date: req.body.activity_date
  });

  // Save UserActivity in the database
  UserActivity.create(userActivity, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the userActivity."
      });
    else res.send(data);
  });
};


// Retrieve all user's all activities from the database (with condition).
exports.findAll = (req, res) => {
  const user_id = req.params.user_id;
  const activity_date = req.query.a_date;

  // Validate request
  if (!user_id) {
    res.status(400).send({
      message: "User ID is missing in request!"
    });
    return;
  }

  if(activity_date){
    UserActivity.getAllByDate(user_id, activity_date, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserActivity By Date."
      });
    else res.send(data);
    });
    return;
  }

  UserActivity.getAll(user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserActivity."
      });
    else res.send(data);
    return;
  });
};


// Find a single UserActivity by Id
exports.findOne = (req, res) => {
  UserActivity.findById(req.params.id, (err, data) => {
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


// Update a UserActivity identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  UserActivity.updateById(
    req.params.id,
    new UserActivity(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found UserActivity with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating UserActivity with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete a UserActivity with the specified id in the request
exports.delete = (req, res) => {
  UserActivity.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserActivity with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete UserActivity with id " + req.params.id
        });
      }
    } else res.send({ message: `UserActivity was deleted successfully!` });
  });
};


// Delete all UserActivity from the database.
exports.deleteAll = (req, res) => {
  UserActivity.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all UserActivity."
      });
    else res.send({ message: `All UserActivity were deleted successfully!` });
  });
};
