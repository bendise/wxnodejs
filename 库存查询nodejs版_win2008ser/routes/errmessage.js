var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('errmessage', { title: '操作成功' });
});

module.exports = router;