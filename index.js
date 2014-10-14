#!/usr/bin/env node

// Run with `node index.js`
// or chmod the file and run via `./index.js`

/*jshint node:true*/
var https = require('https');
var util = require('util');
var fs = require('fs');

var configs = require('./secrets.js');

var options = {
    host: 'api.github.com',
    headers: {
        'User-Agent': 'pr-reviewer',
        'Authorization': 'token ' + configs.authToken
    }
};

var prs = [];

var completedRequests = 0;
var reqCount = configs.repos.length - 1;

var createFile = function (data) {
    var prData = 'var prs = ' + JSON.stringify(data, null, 4) + ';';

    var outputFilename = 'www/prs.json';
    fs.writeFile(outputFilename, prData, function(err) {
        if(err) {
          console.log(err);
        } else {
          console.log('JSON saved to ' + outputFilename);
        }
    });
};

var handleResponse = function (response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
        str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
        var repoJson = JSON.parse(str);
        prs.push(repoJson);

        completedRequests++;

        if (completedRequests == reqCount) {
            createFile(prs);
        }
    });
};

for (var i = 0; i < configs.repos.length; i++) {
    // build URL with repo details
    options.path = util.format('/repos/%s/%s/pulls', configs.owner, configs.repos[i]);

    // make request
    https.request(options, handleResponse).end();
}