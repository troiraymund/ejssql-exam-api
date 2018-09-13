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

app.get("/:table", (req, res, next) => {
    const p = req.params;
    const q = req.query;
    const table = p.table.toUpperCase();

    let qInit = Object.assign({},req.query);
    delete qInit.field;

    let dbQuery;
    if(q.field && Object.keys(qInit).length>0){
        let where = "";
        for (var property in qInit) {
            if (qInit.hasOwnProperty(property)) {
                where += property + " = \"" + qInit[property] + "\" AND ";
            }
        }
        var lastIndex = where.lastIndexOf(" ")-4;
        where = where.substring(0, lastIndex);

        dbQuery = format('SELECT {0} FROM {1} WHERE {2}', q.field, table, where);
    } else if (q.field) {
        dbQuery = format('SELECT {0} FROM {1}', q.field, table);
    } else {
        dbQuery = format('SELECT * FROM {0}', table);
    }

    db.query(dbQuery, function (err, result) {
        if(result){
            response.success(res, next, result, 200, 'OK');
        } else if (err){
            response.failure(res, next, err, 500, 'Bad Request');
        }
    });
});

app.delete("/:table", (req, res, next) => {
    const p = req.params;
    const q = req.query;
    const table = p.table.toUpperCase();

    let qInit = Object.assign({},req.query);
    delete qInit.field;

    let dbQuery;
    if(Object.keys(qInit).length>0){
        let where = "";
        for (var property in qInit) {
            if (qInit.hasOwnProperty(property)) {
                where += property + " = \"" + qInit[property] + "\" AND ";
            }
        }
        var lastIndex = where.lastIndexOf(" ")-4;
        where = where.substring(0, lastIndex);

        dbQuery = format('DELETE FROM {0} WHERE {1}', table, where);
    } else {
        dbQuery = format('DELETE FROM {0}', table);
    }

    db.query(dbQuery, function (err, result) {
        if(result){
            response.success(res, next, result, 200, 'OK');
        } else if (err){
            response.failure(res, next, err, 500, 'Bad Request');
        }
    });
});

app.delete("/:table/:id", (req, res, next) => {
    const p = req.params;
    const table = p.table.toUpperCase();

    let dbQuery = format('DELETE FROM {0} WHERE id = {1}', table, p.id);

    db.query(dbQuery, function (err, result) {
        if(result){
            response.success(res, next, result, 200, 'OK');
        } else if (err){
            response.failure(res, next, err, 500, 'Bad Request');
        }
    });
});

app.put("/:table/:id", (req, res, next) => {
    const p = req.params;
    const table = p.table.toUpperCase();

    let qInit = Object.assign({},req.query);
    delete qInit.field;

    let dbQuery;
    if(Object.keys(qInit).length>0){ //only proceed when update fields are given
        let set = "";
        for (var property in qInit) {
            if (qInit.hasOwnProperty(property)) {
                set += property + " = \"" + qInit[property] + "\", ";
            }
        }
        set = set.substring(0, set.length-2);

        dbQuery = format('UPDATE {0} SET {1} WHERE id = {2}', table, set, p.id);
    }

    db.query(dbQuery, function (err, result) {
        if(result){
            response.success(res, next, result, 200, 'OK');
        } else if (err){
            response.failure(res, next, err, 500, 'Bad Request');
        }
    });
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});