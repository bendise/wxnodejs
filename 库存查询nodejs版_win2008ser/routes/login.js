var crypto = require('crypto');
var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');

var connStr = {	
	user: '用户名',
	password: '密码',
	connectString: 'ip:端口/库名'
}

function md5str(str){
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
}

/* GET home page. */
router.post('/', function(req, res, next) {  
    var userid = req.body.username;
    var password_temp = req.body.password;
    var password_md5 = md5str(password_temp).toUpperCase();
	
	//console.log(password_md5);
	
	// 综合服务平台
    oracledb.getConnection(
	connStr,
	function (err, connection) {
		if (err) {
			console.error(err.message);
			return;
		}
		
		var loginresult = null; 
		connection.execute(
		"SELECT * from st_sysuser where userid=:id and passwd=:passwd",
		[userid,password_md5],  // bind value for userid,passwd
		function (err, result) {
			if (err) {
				console.error(err.message);
				return;				
			}
			//获取json字符串
			//loginresult = JSON.stringify(result.rows);
			loginresult = JSON.parse(JSON.stringify(result.rows));

			//console.log(loginresult[0]);
			// 检查帐号是否存在
			if(loginresult[0]==undefined){
				res.render('errmessage', {title: '登陆失败'});
			}
			else{
				// 获取角色
				oracledb.getConnection(
				connStr,
				function (err, connection) {
					if (err) {
						console.error(err.message);
						return;
					}
					//console.log(loginresult[0][0]);
					connection.execute(
					"select * from st_userrole where userid=:id",
					[loginresult[0][0]],  // bind value for userid
					function (err, result) {
						if (err) {
							console.error(err.message);
							return;
						}
						var userrole = JSON.parse(JSON.stringify(result.rows));
						//console.log(userrole);
						var userroles = [];
						userrole.forEach(function(item){
							userroles.push(item);
						});
						
						console.log(userroles);
						req.session.orgid = 1;
						req.session.userroles = userroles;
						res.render('success', {title: '登陆成功'});
					});
				});
			}				
		});		
	});
});

module.exports = router;