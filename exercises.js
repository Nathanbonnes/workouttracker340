module.exports = function(){
    var express = require('express');
    var router = express.Router();


        function getSpecificExercise(res, mysql, context, id, complete){
          var sql = "SELECT exerciseID, name FROM Exercises WHERE exerciseID = ?";
          var inserts = [id];
          mysql.pool.query(sql, inserts, function(error, results, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.exercise = results[0];
              complete();
          });
      }

    function serveExercises(req, res){
        var query = 'SELECT exerciseID, name FROM Exercises';
        var mysql = req.app.get('mysql');
        var context = {};
        context.jsscripts = ["updateExercise.js"];

        function handleRenderingOfExercises(error, results, fields){

          //take the results of that query and store it inside context
          context.exercises = results;
          //pass it to handlebars to put inside a file
          res.render('exercises', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfExercises)

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

    router.get('/', serveExercises);

      //Used for loading our update form
      router.get('/:id', function(req, res){
        var context = {};
        context.jsscripts = ["updateExercise.js"];
        var mysql = req.app.get('mysql');
        getSpecificExercise(res, mysql, context, req.params.id, complete);
        function complete(){
            res.render('updateexercise.handlebars', context);
          
        }
    });

        //Updates an Exercise
        router.put('/:id', function(req, res){
          var mysql = req.app.get('mysql');
          var sql = "UPDATE Exercises SET name = ? WHERE exerciseID = ?";
          var inserts = [req.body.name, req.body.exerciseID];
          sql = mysql.pool.query(sql,inserts,function(error, results, fields){
              if(error){
                  console.log(error)
                  res.write(JSON.stringify(error));
                  res.end();
              } else{
                  res.status(200);
                  res.end();
              }
          });
      });
 
    return router;
}();
