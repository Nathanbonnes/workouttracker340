module.exports = function(){
    var express = require('express');
    var router = express.Router();

    router.post('/', function(req, res){
      var mysql = req.app.get('mysql');
      var sql = "INSERT INTO Persons (firstName, lastName, weight, height) VALUES (?,?,?,?)";
      var inserts = [req.body.firstName, req.body.lastName, req.body.weight, req.body.height];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/persons');
          }
      });
  });

    router.get('/', function(req, res) {
      var query = 'SELECT personID, firstName, lastName, weight, height FROM Persons';
      var mysql = req.app.get('mysql');
      var context = {};
      context.jsscripts = ["searchPersons.js"];

      function handleRenderingOfPlanets(error, results, fields){

        context.persons = results;
        res.render('persons', context)
      }
      mysql.pool.query(query, handleRenderingOfPlanets)

    })

      router.get('/search/:s', function(req, res){
        var mysql = req.app.get('mysql');
        var query = "SELECT personID, firstName, lastName, weight, height FROM Persons where firstName like" + mysql.pool.escape(req.params.s + '%') ;
        var context = {};
        context.jsscripts = ["searchPersons.js"];
  
        function handleRenderingOfPlanets(error, results, fields){
  
          context.persons = results;
          res.render('persons', context)
        }
        mysql.pool.query(query, handleRenderingOfPlanets)
  
      })
 
    return router;
}();
