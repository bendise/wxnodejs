var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
var eventEmitter = require('events');

var connStr = {	
	user: '用户名',
	password: '密码',
	connectString: 'ip:端口/库名'
}

var connStr_cms = {
    user: '用户名',
	password: '密码',
	connectString: 'ip:端口/库名'
}

var orgid=null;

// 获取总条数
function totalCount_DB(productCode,productName,productState,callback){
  var count = 0;
  var sqlstr = "select count(1) as num ";           
  sqlstr += "from pub_waredict t ";
  sqlstr += "where  ";
  sqlstr += "t.PROHIBIT = '00'  and ";
    if (productCode != "")
    {
        sqlstr += "t.goods = '" + productCode + "' and ";
    }
    //strb.Append("--t.goodid = ?  ");        
    if (productName != "")
    {
        sqlstr += "t.name like '%" + productName + "%' and ";
    }
    if (productState != "")
    {
        sqlstr += "t.isdiffprc = '" + productState + "' and ";
    }
    else
    {
        sqlstr += "t.isdiffprc = '00' and ";
    }
    //strb.Append("and   ");
    sqlstr += "( ";
    sqlstr += "case when ";
    sqlstr += "(select   sum(sls.allo_qty) allo_qty ";
    sqlstr += "          from scm_lot_stock_v sls, scm_lot_list_v sllv ";
    sqlstr += "         where sls.goodid = sllv.goodid ";
    sqlstr += "           and sls.lotid = sllv.lotid ";
    sqlstr += "           and sls.compid = sllv.compid ";
    sqlstr += "           and sls.ownerid = sllv.ownerid ";
    sqlstr += "           and sllv.enddate >= sysdate ";
    sqlstr += "           and sls.goodid = t.goodid ";
    sqlstr += "           and sls.compid = t.COMPID ";
    sqlstr += "           and sls.ownerid = '" + 1 + "' ";
    sqlstr += "           and sls.status = '00') > 0 then '有' ";
    sqlstr += "else '无' end ";
    sqlstr += ") = '有' ";

    // 查询数量
     oracledb.getConnection(
      connStr_cms,
      function (err, connection) {
          if (err) {
              console.error(err.message);
              callback(err,0);
          }
          connection.execute(
          sqlstr,                
          function (err, result) {
              if (err) {
                  console.error(err.message);
                  callback(err,0);
              }
              var pub_waredict_v = JSON.parse(JSON.stringify(result.rows));
              count = pub_waredict_v[0][0];
              callback(null,count);
          });
      });    
}

function queryList_DB(userroles,currentPage,productCode,productName,productState,orgid,res){
    userroles.forEach(function(item){
        // 获取角色权限
        oracledb.getConnection(
        connStr,
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            connection.execute(
            "select * from ST_ROLEPERMISSION where ROLEID=:roleid",
            [item[1]],  // bind value for userid
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }
                var userpermissions = JSON.parse(JSON.stringify(result.rows));
                var flag = false;
                userpermissions.forEach(function(item){                        
                if(item[3]==202){
                    flag = true;
                }
                //没权限
                if(flag==false){
                    res.render('errmessage', {title: '没有权限'});
                }

                
                var pageCount = 5;
                var totalCount = 0;
                totalCount_DB(productCode, productName, productState,function(err,count){
                    if(err){
                        console.err(err.message);
                        return;
                    }
                    totalCount = count;
                    var totalPageNum = Math.round((totalCount - 1) / pageCount + 1);
                    currentPage = currentPage < 1 ? 1 : currentPage;
                    currentPage = currentPage > totalPageNum ? totalPageNum : currentPage;
                    //(当前页-1)*每页条数
                    var beginIndex = (currentPage - 1) * pageCount + 1;
                    // 当前页*每页条数
                    var endIndex = 5 * currentPage;
                    var iskc = productState == "00" ? "有" : "无";
                    
                    var sqlstr = "";
                    sqlstr += "select * ";
                    sqlstr += "from ";
                    sqlstr += "(select rownum as rowno, ";
                    sqlstr += "t.goods, ";
                    sqlstr += "t.goodid, ";
                    sqlstr += "t.compid, ";
                    sqlstr += "t.name||t.spec as name_spec, ";
                    sqlstr += "t.producer, ";
                    sqlstr += "t.rtlprc, ";
                    sqlstr += "t.trdprc, ";
                    sqlstr += "t.packnum, ";
                    sqlstr += "t.mpacknum, ";
                    sqlstr += "t.msunitno, ";
                    sqlstr += "t.managerange, ";
                    sqlstr += "t.spdrug, ";
                    sqlstr += "t.Category, ";
                    sqlstr += "t.ratifier||t.register as ratifier_register, ";
                    sqlstr += "( ";
                    sqlstr += "case when ";
                    sqlstr += "(select   sum(sls.allo_qty) allo_qty ";
                    sqlstr += "          from scm_lot_stock_v sls, scm_lot_list_v sllv ";
                    sqlstr += "         where sls.goodid = sllv.goodid ";
                    sqlstr += "           and sls.lotid = sllv.lotid ";
                    sqlstr += "           and sls.compid = sllv.compid ";
                    sqlstr += "           and sls.ownerid = sllv.ownerid ";
                    sqlstr += "           and sllv.enddate >= sysdate ";
                    sqlstr += "           and sls.goodid = t.goodid ";
                    sqlstr += "           and sls.compid = t.COMPID ";
                    sqlstr += "           and sls.ownerid = '" + orgid + "' ";
                    sqlstr += "           and sls.status = '00') > 0 then '有' ";
                    sqlstr += "else '无' end ";
                    sqlstr += ") as inventory, ";
                    sqlstr += "( ";
                    sqlstr += "case when (select count(a.PLCYID) from scm_salcha_plcygrp a, scm_salcha_plcydet b where a.memtype like 'W0%' ";
                    sqlstr += "and a.PLCYID = b.PLCYID ";
                    sqlstr += "and b.GOODID = t.goodid ";
                    sqlstr += "and a.COMPID = t.COMPID ";
                    sqlstr += "and a.ownerid = '" + orgid + "') > 0 then '有' ";
                    sqlstr += " ";
                    sqlstr += "when (select count(a.PLCYID) from scm_salcha_plcygrp a, scm_salcha_plcydet b, scm_salcha_waregrp c, scm_salcha_waredet d where a.memtype like 'W1%' ";
                    sqlstr += "and a.PLCYID = b.PLCYID ";
                    sqlstr += "and b.GOODID = c.GRPID ";
                    sqlstr += "and c.GRPID = d.GRPID ";
                    sqlstr += "and d.GOODID = t.goodid ";
                    sqlstr += "and a.COMPID = t.COMPID ";
                    sqlstr += "and a.ownerid = '" + orgid + "') > 0 then '有' ";
                    sqlstr += "else '无' end ";
                    sqlstr += ") as channel ";
                    sqlstr += "from pub_waredict t ";
                    sqlstr += "where  ";
                    sqlstr += "t.PROHIBIT = '00'  and ";
                    if (productCode != "")
                    {
                        sqlstr+="t.goods = '"+productCode+"' and ";
                    }      
                    if (productName != "")
                    {
                        sqlstr+="t.name like '%" + productName + "%' and ";
                    }  
                    sqlstr+="( ";
                    sqlstr+="case when ";
                    sqlstr+="(select   sum(sls.allo_qty) allo_qty ";
                    sqlstr+="          from scm_lot_stock_v sls, scm_lot_list_v sllv ";
                    sqlstr+="         where sls.goodid = sllv.goodid ";
                    sqlstr+="           and sls.lotid = sllv.lotid ";
                    sqlstr+="           and sls.compid = sllv.compid ";
                    sqlstr+="           and sls.ownerid = sllv.ownerid ";
                    sqlstr+="           and sllv.enddate >= sysdate ";
                    sqlstr+="           and sls.goodid = t.goodid ";
                    sqlstr+="           and sls.compid = t.COMPID ";
                    sqlstr+="           and sls.ownerid = '" + orgid + "' ";
                    sqlstr+="           and sls.status = '00') > 0 then '有' ";
                    sqlstr+="else '无' end ";
                    sqlstr+=") = '" + iskc + "' ";
                    sqlstr+="and ";
                    sqlstr+=" rownum<="+endIndex+") table_alias ";
                    sqlstr+="where table_alias.rowno>="+beginIndex;
                    
                    oracledb.getConnection(
                    connStr_cms,
                    function (err, connection) {
                        if (err) {
                            console.error(err.message);
                            return;
                        }
                        connection.execute(
                        sqlstr,  
                        function (err, result) {
                            if (err) {
                                console.error(err.message);
                                return;
                            }
                            var pub_waredict_v = JSON.parse(JSON.stringify(result.rows));
                            res.render('querylist', { title: '库存列表',productName:productName,productCode:productCode,productState:productState,currentPage:currentPage,totalPageNum:totalPageNum,pub_waredict_v: pub_waredict_v });
                        });
                    });
                });                
            });                       						
        });
        });
    });
}

/* GET home page. */
router.get('/query', function(req, res, next) {
  res.render('query', { title: '库存查询' });
});

router.get('/querylist',function(req,res,next){
    var userroles = JSON.parse(JSON.stringify(req.session.userroles));
    var currentPage = req.query.currentPage==undefined ? 1 : req.query.currentPage;
    currentPage = currentPage < 1 ? 1 : currentPage;
    var productCode = req.query.productCode;
    var productName = req.query.productName;
    var productState = req.query.productState;
    var orgid = req.session.orgid;

    queryList_DB(userroles,currentPage,productCode,productName,productState,orgid,res);
});

router.post('/querylist', function(req, res, next) {
  console.log('querylist')
    var userroles = JSON.parse(JSON.stringify(req.session.userroles));
    var currentPage = req.body.currentPage==undefined ? 1 : req.body.currentPage;
    currentPage = currentPage < 1 ? 1 : currentPage;
    var productCode = req.body.productCode;
    var productName = req.body.productName;
    var productState = req.body.productState;
    var orgid = req.session.orgid;

    queryList_DB(userroles,currentPage,productCode,productName,productState,orgid,res);   
});

router.get('/queryinfo',function(req,res,next){ 
    var productCode = req.query.productCode;
    var productState = req.query.productState;
    var iskc = productState == "00" ? "有" : "无";

    var strSql = "";
    strSql+="select  ";
    strSql+="t.goods, ";
    strSql+="t.goodid, ";
    strSql+="t.compid, ";
    strSql+="t.name||t.spec as name_spec, ";
    strSql+="t.producer, ";
    strSql+="t.rtlprc, ";
    strSql+="t.trdprc, ";
    strSql+="t.packnum, ";
    strSql+="t.mpacknum, ";
    strSql+="t.msunitno, ";
    strSql+="t.managerange, ";
    strSql+="t.spdrug, ";
    strSql+="t.Category, ";
    strSql+="t.ratifier||t.register as ratifier_register, ";
    strSql+="( ";
    strSql+="case when ";
    strSql+="(select   sum(sls.allo_qty) allo_qty ";
    strSql+="          from scm_lot_stock_v sls, scm_lot_list_v sllv ";
    strSql+="         where sls.goodid = sllv.goodid ";
    strSql+="           and sls.lotid = sllv.lotid ";
    strSql+="           and sls.compid = sllv.compid ";
    strSql+="           and sls.ownerid = sllv.ownerid ";
    strSql+="           and sllv.enddate >= sysdate ";
    strSql+="           and sls.goodid = t.goodid ";
    strSql+="           and sls.compid = t.COMPID ";
    strSql+="           and sls.ownerid = '" + req.session.orgid + "' ";
    strSql+="           and sls.status = '00') > 0 then '有' ";
    strSql+="else '无' end ";
    strSql+=") as inventory, ";
    strSql+="( ";
    strSql+="case when (select count(a.PLCYID) from scm_salcha_plcygrp a, scm_salcha_plcydet b where a.memtype like 'W0%' ";
    strSql+="and a.PLCYID = b.PLCYID ";
    strSql+="and b.GOODID = t.goodid ";
    strSql+="and a.COMPID = t.COMPID ";
    strSql+="and a.ownerid = '" + req.session.orgid + "') > 0 then '有' ";
    strSql+=" ";
    strSql+="when (select count(a.PLCYID) from scm_salcha_plcygrp a, scm_salcha_plcydet b, scm_salcha_waregrp c, scm_salcha_waredet d where a.memtype like 'W1%' ";
    strSql+="and a.PLCYID = b.PLCYID ";
    strSql+="and b.GOODID = c.GRPID ";
    strSql+="and c.GRPID = d.GRPID ";
    strSql+="and d.GOODID = t.goodid ";
    strSql+="and a.COMPID = t.COMPID ";
    strSql+="and a.ownerid = '" + req.session.orgid + "') > 0 then '有' ";
    strSql+="else '无' end ";
    strSql+=") as channel ";
    strSql+="from pub_waredict t ";
    strSql+="where  ";
    strSql+="t.PROHIBIT = '00'  and ";
    if (productCode!="")
    {
        strSql+="t.goods = '" + productCode + "' and ";
    }    
    strSql+="( ";
    strSql+="case when ";
    strSql+="(select   sum(sls.allo_qty) allo_qty ";
    strSql+="          from scm_lot_stock_v sls, scm_lot_list_v sllv ";
    strSql+="         where sls.goodid = sllv.goodid ";
    strSql+="           and sls.lotid = sllv.lotid ";
    strSql+="           and sls.compid = sllv.compid ";
    strSql+="           and sls.ownerid = sllv.ownerid ";
    strSql+="           and sllv.enddate >= sysdate ";
    strSql+="           and sls.goodid = t.goodid ";
    strSql+="           and sls.compid = t.COMPID ";
    strSql+="           and sls.ownerid = '" + req.session.orgid + "' ";
    strSql+="           and sls.status = '00') > 0 then '有' ";
    strSql+="else '无' end ";
    strSql+=") = '" + iskc + "' ";

    oracledb.getConnection(
    connStr_cms,
    function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(
        strSql,
        function (err, result) {
            if (err) {
                console.error(err.message);
                return;
            }
            var pub_waredict_v = JSON.parse(JSON.stringify(result.rows));
            res.render('queryinfo', { title: '库存信息',productCode:productCode,pub_waredict_v: pub_waredict_v });
        });
    });
});

router.get('/QueryWarehouseNum',function(req,res,next){
    var productCode = req.query.productCode;
    var strSql = "";
    strSql+="select   sls.deptid,pd.deptname, sls.STATUS, sum(sls.allo_qty) allo_qty ";
    strSql+="from scm_lot_stock sls, scm_lot_list sllv, pub_dept pd ";
    strSql+="where sls.goodid = sllv.goodid ";
    strSql+="and sls.lotid = sllv.lotid ";
    strSql+="and sls.compid = sllv.compid ";
    strSql+="and sls.ownerid = sllv.ownerid ";
    strSql+="and sllv.enddate >= sysdate ";
    strSql+="and sls.goodid = '"+productCode+"' ";
    strSql+="and sls.ownerid = 1 ";
    strSql+="and sls.status = '00' ";
    strSql+="and sls.deptid=pd.deptid ";
    strSql+="group by sls.deptid, sls.STATUS,pd.deptname ";
    oracledb.getConnection(
    connStr_cms,
    function (err, connection) {
        if (err) {
            console.error(err.message);
            return;
        }
        connection.execute(
            strSql, 
            function (err, result) {
                if (err) {
                    console.error(err.message);
                    return;
                }
               var pub_dept_v = JSON.parse(JSON.stringify(result.rows));
               res.render('QueryWarehouseNum', { title: '库存量',pub_dept_v: pub_dept_v });
            });
    });
});

module.exports = router;