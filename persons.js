module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function servePlanets(req, res){
        var query = 'SELECT personID, firstName, lastName, weight, height FROM Persons';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfPlanets(error, results, fields){

          //take the results of that query and store ti inside context
          context.persons = results;
          //pass it to handlebars to put inside a file
          res.render('persons', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfPlanets)

        //res.send('Here you go!');
    }

    function serveOnePlanet(chicken, steak) {
      fancyId = chicken.params.fancyId

      var queryString = "SELECT planet_id, name, population, language, capital FROM bsg_planets WHERE planet_id = ?"

      var mysql = steak.app.get('mysql')
      var context = {};

      function handleRenderingOfOnePlanet(error, results, fields){
          context.planet = results[0]

          if(error){
            steak.write(error)
            steak.end();
          }else{
            steak.render('serverPlanet',context);
          }
      }
      //execute the query
      var queryString = mysql.pool.query(queryString, fancyId, handleRenderingOfOnePlanet);

      //steak.send("Here's a good tasty well done steak");
    }

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

    router.get('/', servePlanets);
    router.get('/:fancyId', serveOnePlanet);
    return router;
}();
