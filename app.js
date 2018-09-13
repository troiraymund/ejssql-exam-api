const express  = require("express"),
      mysql    = require("mysql"),
      routes   = require("./src/routes/crud-routes"),
      package  = require("./package.json");

const app  = express(),
      port = "3000",
      db = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'inventory'
      });

app.get("/", (req, res, next) => {
    res.send("Reached API");
});
app.use("/api", routes);

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

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});