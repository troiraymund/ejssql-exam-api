const respond = (res, next, status, data, http_code, status_code) => {
    const response = {
        success: status,
        status: status_code,
        data: data
    }
    
    res.setHeader('content-type', 'application/json');
    res.writeHead(http_code);
    res.end(JSON.stringify(response));

    return next();
}

module.exports.success = (res, next, data, http_code, status_code) => {
    respond(res, next, true, data, http_code, status_code);
}

module.exports.failure = (res, next, data, http_code, status_code) => {
    respond(res, next, false, data, http_code, status_code);
}