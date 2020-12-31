var express = require('express');
var router = express.Router();
var crypto = require('crypto');

var generate_key = function() {
    // 16 bytes is likely to be more than enough,
    // but you may tweak it to your needs
    return crypto.randomBytes(16).toString('base64');
};

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('session: ', req.session)
  if(!req.session.state){
    req.session.state = generate_key()
  } 
  res.json({"message": "ok"})
});

module.exports = router;