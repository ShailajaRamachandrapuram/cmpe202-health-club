module.exports = app => {
  const users = require("../controllers/userController.js");
  const activities = require("../controllers/activityController.js");
  const memberships = require("../controllers/membershipController.js");
  const schedules = require("../controllers/scheduleController.js");
  const userSchedules = require("../controllers/userScheduleController.js");
  const userActivities = require("../controllers/userActivityController.js");

  var router = require("express").Router();

  // Create a new users
  router.post("/user/create", users.create);

  // Login user
  router.post("/user/login", users.login);

  //Update
  router.put("/user/update/membership", users.updateMembership);

  // Retrieve all users -  query params: name
  router.get("/users", users.findAll);

  // Retrieve a single user with id
  router.get("/user/:id", users.findOne);

  // Update a user with id
  router.put("/user/:id", users.update);

  // Delete a user with id
  router.delete("/user/:id", users.delete);




  // Create new activity
  router.post("/activity/add", activities.create);

  // Retrieve all activities - query params: name
  router.get("/activities", activities.findAll);

  // Retrieve a single activity with id
  router.get("/activity/:id", activities.findOne);

  // Update a activities with id
  router.put("/activity/:id", activities.update);

  // Delete a user with id
  router.delete("/activity/:id", activities.delete);





  // Create a new memberships
  router.post("/membership/add", memberships.create);

  // Retrieve all memberships -  query params: name
  router.get("/memberships", memberships.findAll);

  // Retrieve a single user with id
  router.get("/membership/:id", memberships.findOne);

  // Update a user with id
  router.put("/membership/:id", memberships.update);

  // Delete a user with id
  router.delete("/membership/:id", memberships.delete);




  // Create a new schedules
  router.post("/schedule/add", schedules.create);

  // Retrieve all schedules  -  query params: name
  router.get("/schedules", schedules.findAll);

  // Retrieve a single user with id
  router.get("/schedule/:id", schedules.findOne);

  // Update a user with id
  router.put("/schedule/:id", schedules.update);

  // Delete a user with id
  router.delete("/schedule/:id", schedules.delete);




  // Create a new user schedule
  router.post("/user/schedule/add", userSchedules.create);

  // Retrieve user's all schedules
  router.get("/user/schedules/:user_id", userSchedules.findAll);

  // Retrieve a single user schedule with id
  router.get("/user/schedule/:id", userSchedules.findOne);

  // Update a user with id
  router.put("/user/schedule/:id", userSchedules.update);

  // Delete a user with id
  router.delete("/user/schedule/:id", userSchedules.delete);



  // Create a new use activities
  router.post("/user/activity/add", userActivities.create);

  // Retrieve user's all activities
  router.get("/user/activities/:user_id", userActivities.findAll);

  // Retrieve a single activity with id
  router.get("/user/activity/:id", userActivities.findOne);

  // Update an activity with id
  router.put("/user/activity/:id", userActivities.update);

  // Delete an activity with id
  router.delete("/user/activity/:id", userActivities.delete);


  app.use('/api', router);
};
