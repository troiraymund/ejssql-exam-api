const express  = require("express"),
      response = require('./src/helpers/response'),
      package = require('./package.json');

const app  = express(),
      port = "3000";

app.get("/", (req, res, next) => {
    response.success(res, next, {
        service: package.name + '@' + package.version
    }, 200, "running");
});

app.listen(port, () => {
    console.log(`Server started: ${package.name}@${package.version}`);
    console.log(`Listening on port: ${port}`);
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});