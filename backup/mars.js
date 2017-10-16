#!/bin/env node
 //  OpenShift sample Node application
var express = require('express');
var app = express(); // create our app w/ express
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var https = require('https');
var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
var ip = require('ip');
var cors = require('cors');
var needle = require('needle');
var email = require("emailjs");
var randomstring = require('just.randomstring');
var prompt = require("prompt");
var colors = require("colors");
var path = require('path');
var pkg = require( path.join(__dirname, 'package.json') );
var program = require('commander');
var formidable = require('formidable'),
    form = new formidable.IncomingForm();

/**
 *  Define the sample application.
 */
var Mars = function() {
    var marsServer = this;

    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up mars IP address and port # using env variables/defaults.
     */
    marsServer.setupVariables = function() {
        //  Set the environment variables we need.
        marsServer.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        marsServer.port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof marsServer.ipaddress === "undefined") {
            // ============================================== Running the app locally
            // console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1:8080');
            marsServer.ipaddress = ip.address();
        } else {
            //  Running the app on Openshift
        }
    };

    /**
     *  Populate the cache.
     */
    marsServer.populateCache = function() {
        if (typeof marsServer.zcache === "undefined") {
            marsServer.zcache = {
                'index.html': ''
            };
        }
        //  Local cache for static content.
        marsServer.zcache['index.html'] = fs.readFileSync('./public/index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    marsServer.cache_get = function(key) {
        return marsServer.zcache[key];
    };

    /**
     *  terminator === the termination handler
     *  Terminate mars on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    marsServer.terminator = function(sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating sample app ...',
                Date(Date.now()), sig);
            process.exit(1);
        }
        // console.log('%s: Node mars stopped.', Date(Date.now()));
    };

    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    marsServer.setupTerminationHandlers = function() {
        //  Process on exit and signals.
        process.on('exit', function() {
            marsServer.terminator();
        });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
            'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() {
                marsServer.terminator(element);
            });
        });
    };

    /*  ================================================================  */
    /*  App mars functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    marsServer.createRoutes = function() {
        marsServer.routes = {};

        marsServer.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(marsServer.cache_get('index.html'));
        };
    };

    /**
     *  Initialize the mars (express) and create the routes and register
     *  the handlers.
     */
    marsServer.initializeServer = function() {
        marsServer.createRoutes();
        marsServer.app = express();
        marsServer.app.use(express.static(__dirname + '/public')); // set the static files location /client/img will be /img for users
        // mongoose.set('debug', true);
        marsServer.app.use(bodyParser.json()); // parse application/json
        marsServer.app.use(bodyParser.json({
            type: 'application/vnd.api+json'
        })); // parse application/vnd.api+json as json
        marsServer.app.use(methodOverride());
        marsServer.app.use(cors());
        var rootdir = process.argv[1].replace('/mars.js', '');
        // --------------------------------------- Config

        // Common headers
        marsServer.app.all('/', function(req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            next();
        });

        //  Add handlers for the app (from the routes).
        for (var r in marsServer.routes) {
            marsServer.app.get(r, marsServer.routes[r]);
        }
    }

    /**
     *  Initializes the sample application.
     */
    marsServer.initialize = function() {
        marsServer.setupVariables();
        marsServer.populateCache();
        marsServer.setupTerminationHandlers();
        // Create the express mars and routes.
        marsServer.initializeServer();
    };

    /**
     *  Start the mars (starts up the sample application).
     */
    marsServer.start = function() {
        //  Start the app on the specific interface (and port).
        // console.log('Mars initialized sucessfully!');
        prompt.delimiter = "Answer: ";
        prompt.message = "";
        prompt.start();
        prompt.get({
            properties: {
                name: {
                    description: colors.cyan("What is your project name?\n"),
                    required: true,
                    message: 'Whoops! It seems that this name was already taken. Please, try again ;)',
                },
                product: {
                    description: colors.cyan("What is your project main product or service (e.g. books, news, rides, photography)?\n"),
                    required: true,
                    message: 'Whoops! It seems that this name was already taken. Please, try again ;)',
                }
            }
        }, function(err, params) {
            console.log();
            console.log("Creating app with the following configurations:");
            console.log();
            for (var paramName in params) {
                console.log(colors.gray(paramName) + ' : ' + colors.cyan(params[paramName].toLowerCase()));
            }
            console.log();
        });
    };
};

/**
 *  main():  Main code.
 */
var mars = new Mars();
mars.initialize();
mars.start();
