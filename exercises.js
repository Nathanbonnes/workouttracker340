module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function servePlanets(req, res){
        var query = 'SELECT exerciseID, name FROM Exercises';
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfPlanets(error, results, fields){

          //take the results of that query and store ti inside context
          context.exercises = results;
          //pass it to handlebars to put inside a file
          res.render('exercises', context)
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
      var sql = "INSERT INTO Exercises (name) VALUES (?)";
      var inserts = [req.body.name];
      sql = mysql.pool.query(sql,inserts,function(error, results, fields){
          if(error){
              console.log(JSON.stringify(error))
              res.write(JSON.stringify(error));
              res.end();
          }else{
              res.redirect('/exercises');
          }
      });
  });

    router.get('/', servePlanets);
    router.get('/:fancyId', serveOnePlanet);





    return router;
}();