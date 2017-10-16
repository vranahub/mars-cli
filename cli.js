#!/usr/bin/env node

const colors = require('colors');
const yargs = require('yargs');
const shell = require('shelljs');
let cwd = process.cwd();
let params = yargs.argv;
let excludedParams = ['_', '$0']

let command = "";

function init() {
  parseParameters(); // Gets the mars enviroment variables
  parseCommand(); // Gets the selected command (e.g. 'server', 'build'...)
  runCommand(); // Actually runs the command
}

function parseParameters() {

  // Setting cross platform environment variables
  for (var key in params) {
    let value = params[key];
    if ((excludedParams.indexOf(key) == -1) && value) {
      command = command.indexOf("cross-env") == -1 ? command.concat("cross-env ") : command; // obtain cross platform environment vars
      command = command.concat(`${key}=${value} `);
    }
  }
}

function parseCommand() {
  command = command.concat("ionic");
  params._.forEach((subcommand) => {
    command = command.concat(` ${subcommand}`);
  });
};

function runCommand() {
  shell.exec(command);
  console.log(command);
}

init();

module.exports = {

};