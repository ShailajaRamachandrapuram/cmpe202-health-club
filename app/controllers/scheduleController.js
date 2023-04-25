const Schedule = require("../models/scheduleModel.js");

// Create and Save a Schedule
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Schedule
  const schedule = new Schedule({
    name: req.body.name,
    s_date: req.body.s_date,
    s_time: req.body.s_time,
    duration: req.body.duration
  });

  // Save Schedule in the database
  Schedule.create(schedule, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Schedule."
      });
    else res.send(data);
  });
};


// Retrieve all Schedules from the database (with condition).
exports.findAll = (req, res) => {
  const name = req.query.name;

  Schedule.getAll(name, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Schedule."
      });
    else res.send(data);
  });
};


// Find a single Schedule by Id
exports.findOne = (req, res) => {
  Schedule.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Schedule with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Schedule with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


// Update a Schedule identified by the id in the request
exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  console.log(req.body);

  Schedule.updateById(
    req.params.id,
    new Schedule(req.body),
    (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Schedule with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Schedule with id " + req.params.id
          });
        }
      } else res.send(data);
    }
  );
};


// Delete a Schedule with the specified id in the request
exports.delete = (req, res) => {
  Schedule.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Schedule with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Schedule with id " + req.params.id
        });
      }
    } else res.send({ message: `Schedule was deleted successfully!` });
  });
};


// Delete all Schedule from the database.
exports.deleteAll = (req, res) => {
  Schedule.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Schedule."
      });
    else res.send({ message: `All Schedule were deleted successfully!` });
  });
};
