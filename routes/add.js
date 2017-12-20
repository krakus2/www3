var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //const filip = { name: "filip", age: 100, cool: true };
  //res.send("No hejka")
  //res.json(filip)
  res.render('add', { title: 'Express2' });
});
//router.get()

//router.use()

module.exports = router;
