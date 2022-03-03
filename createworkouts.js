
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* Associate certificate or certificates with a person and 
     * then redirect to the people_with_certs page after adding 
     */

    router.get('/', function(req, res) {
        var context = {};
        res.render('createworkouts', context)
    })

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Workouts(personID, date, exerciseID, r1, w1, r2, w2, r3, w3, r4, w4, r5, w5) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
        var inserts = [req.body.personID, req.body.date, req.body.exerciseID, req.body.r1, req.body.w1, req.body.r2, req.body.w2, req.body.r3, req.body.w3, req.body.r4, req.body.w4, req.body.r5, req.body.w5];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/createworkouts');
            }
        });
    });

    /* Delete a person's certification record */
    /* This route will accept a HTTP DELETE request in the form
     * /pid/{{pid}}/cert/{{cid}} -- which is sent by the AJAX form 
     */

    return router;
}();
