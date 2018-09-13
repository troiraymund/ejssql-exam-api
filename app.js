const express  = require("express"),
      mysql    = require("mysql"),
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

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});