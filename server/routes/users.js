var express = require('express');
var router = express.Router();

const fetch = require("node-fetch");

/* Get user information from Fitbit */
router.get('/fitbit', function(req, res, next) {
  token = req.cookies['fitbit_token']
  const date = req.query.date
  // fetch('https://api.fitbit.com/1/user/-/activities/steps/date/2020-12-05/1d.json', {
  fetch(`https://api.fitbit.com/1/user/-/activities/steps/date/${date}/1d.json`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
  .then(response => response.json())
  .then((data) => {
    if (data.errors) {
      console.error('Error Response from Fitbit: ', data.errors[0].message)
      res.status(500)
      res.send(data.errors[0].message)
      return
    }
    res.status(200)
    res.send(data)
  })
  .catch((error) => {
    res.status(500)
    res.send(error)
  })
});

module.exports = router;
