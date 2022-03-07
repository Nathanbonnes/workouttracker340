
module.exports = function(){
    var express = require('express');
    var router = express.Router();

    /* get people to populate in dropdown */
    function getPersons(res, mysql, context, complete){
        mysql.pool.query("SELECT personID, firstName, lastName FROM Persons", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.persons = results;
            complete();
        });
    }

    function getGyms(res, mysql, context, complete){
        mysql.pool.query("SELECT gymID, name FROM Gyms", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.gyms = results;
            complete();
        });
    }

    /* get certificates to populate in dropdown */
    function getCertificates(res, mysql, context, complete){
        sql = "SELECT certification_id AS cid, title FROM bsg_cert";
        mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.certificates = results
            complete();
        });
    }

    /* get people with their certificates */
    /* TODO: get multiple certificates in a single column and group on
     * fname+lname or id column
     */
    function getMemberships(res, mysql, context, complete){
        var sql = 'SELECT Memberships.gymID, Gyms.name, Memberships.personID, Persons.firstName, Persons.lastName FROM ((Memberships INNER JOIN Persons ON Persons.personID = Memberships.personID)INNER JOIN Gyms ON Gyms.gymID = Memberships.gymID)';
         mysql.pool.query(sql, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end()
            }
            context.memberships = results
            complete();
        });
    }
  

    /* List people with certificates along with 
     * displaying a form to associate a person with multiple certificates
     */
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteMembership.js"];
        var mysql = req.app.get('mysql');
        var handlebars_file = 'memberships'

        getPersons(res, mysql, context, complete);
        getGyms(res, mysql, context, complete);
        getMemberships(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render(handlebars_file, context);
            }
        }
    });

    /* Associate certificate or certificates with a person and 
     * then redirect to the people_with_certs page after adding 
     */
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        // let's get out the certificates from the array that was submitted by the form 
        var gyms = req.body.gymID
        var person = req.body.personID
        for (let gym of gyms) {
          var sql = "INSERT INTO Memberships (gymID, personID) VALUES (?,?)";
          var inserts = [gym, person];
          sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                //TODO: send error messages to frontend as the following doesn't work
                /* 
                res.write(JSON.stringify(error));
                res.end();
                */
                console.log(error)
            }
          });
        } //for loop ends here 
        res.redirect('/memberships');
    });

    /* Delete a person's certification record */
    /* This route will accept a HTTP DELETE request in the form
     * /pid/{{pid}}/cert/{{cid}} -- which is sent by the AJAX form 
     */
    router.delete('/personID/:personID/gymID/:gymID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Memberships WHERE personID = ? AND gymID = ?";
        var inserts = [req.params.personID, req.params.gymID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400); 
                res.end(); 
            }else{
                res.status(202).end();
            }
        })
    })

    

    return router;
}();
