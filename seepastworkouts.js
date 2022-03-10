module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function seeWorkouts(req, res){
        var query = 'SELECT date, Persons.firstName, Persons.lastName, Exercises.name, r1, w1, r2, w2, r3, w3, r4, w4, r5, w5 FROM ((WORKOUTS INNER JOIN Persons ON Persons.personID = Workouts.personID) INNER JOIN Exercises ON Exercises.exerciseID = Workouts.exerciseID)'; 
        var mysql = req.app.get('mysql');
        var context = {};

        function handleRenderingOfWorkouts(error, results, fields){

          //take the results of that query and store ti inside context
          context.workouts = results;
          //pass it to handlebars to put inside a file
          res.render('seepastworkouts', context)
        }
        //execute the sql query
        mysql.pool.query(query, handleRenderingOfWorkouts)

        //res.send('Here you go!');
    }

    router.get('/', seeWorkouts);
    return router;
}();
