const UserSchedule = require("../models/userScheduleModel.js");

// Create and Save a UserSchedule
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a UserSchedule
  const userSchedule = new UserSchedule({
    user_id: req.body.user_id,
    schedule_id: req.body.schedule_id
  });

  // Save UserSchedule in the database
  UserSchedule.create(userSchedule, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the userSchedule."
      });
    else res.send(data);
  });
};


// Retrieve all user's all schedules from the database (with condition).
exports.findAll = (req, res) => {
  const user_id = req.params.user_id;
  const schedule_date = req.query.a_date;

  // Validate request
  if (!user_id) {
    res.status(400).send({
      message: "User ID is missing in request!"
    });
    return;
  }

  if(schedule_date){
    UserSchedule.getAllByDate(user_id, schedule_date, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserSchedule."
      });
    else res.send(data);
    });
    return;
  }

  UserSchedule.getAll(user_id, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving UserSchedule."
      });
    else res.send(data);
  });
};


// Find a single UserSchedule by Id
exports.findOne = (req, res) => {
  UserSchedule.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserSchedule with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving UserSchedule with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


// Update a UserSchedule identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  UserSchedule.updateById(
    req.params.id,
    new UserSchedule(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found UserSchedule with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating UserSchedule with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete a UserSchedule with the specified id in the request
exports.delete = (req, res) => {
  UserSchedule.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UserSchedule with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete UserSchedule with id " + req.params.id
        });
      }
    } else res.send({ message: `UserSchedule was deleted successfully!` });
  });
};


// Delete all UserSchedule from the database.
exports.deleteAll = (req, res) => {
  UserSchedule.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all UserSchedule."
      });
    else res.send({ message: `All UserSchedule were deleted successfully!` });
  });
};
