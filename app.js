const express  = require("express"),
      mysql    = require("mysql"),
      format   = require("string-format"),
      response = require('./src/helpers/response'),
      package = require('./package.json');

const app  = express(),
      port = "3000",
      db = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'inventory'
      });

app.listen(port, () => {
    db.connect(function(err) {
        if (err) {
            console.error('error initializing db: ' + err.stack);
            process.exit();
        } else {
            console.log(`Server started: ${package.name}@${package.version}`);
            console.log(`Listening on port: ${port}`);
        }
    });
});

app.get("/", (req, res, next) => {
    response.success(res, next, {
        service: package.name + '@' + package.version
    }, 200, "running");
});

app.post("/:table/create", (req, res, next) => { //TODO: add support for array object
    const p = req.params;
    const q = req.query;
    let columns = "(";
    db.query("DESCRIBE " + p.table, function (error, results) {
        for(i=1; i<results.length; i++){
            if(i === results.length-1){
                columns += results[i].Field + ")";
            } else {
                columns += results[i].Field + ",";
            }
        }

        if(results){
            let dbQuery = "INSERT INTO " + p.table.toUpperCase() + columns + " VALUES (\"{0}\",\"{1}\",\"{2}\")";
            db.query(format(dbQuery, q.name, q.qty, q.amount), function (createErr, createRes) {
                if(createRes){
                    response.success(res, next, createRes, 200, 'OK');
                } else if (createErr){
                    response.failure(res, next, createErr, 500, 'Bad Request');
                }
            });
        } else if (error){
            response.failure(res, next, error, 500, 'Bad Request');
        }
    });
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});