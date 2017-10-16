#!/usr/bin/env node

const colors = require('colors');
const yargs = require('yargs');
const shell = require('shelljs');
let cwd = process.cwd();
let params = yargs.argv;

let command = "";

function init() {
  parseParameters(); // Gets the mars enviroment variables
  parseCommand(); // Gets the selected command (e.g. 'server', 'build'...)
  runCommand(); // Actually runs the command
}

function parseParameters() {
  // Setting cross platform environment variables
  for (var key in params) {
    if (key.indexOf('mars') > -1) {

      if (command.indexOf('cross-env') == -1) // Appends the cross-env command in order to 
        command = command.concat("cross-env "); // obtain cross platform environment vars

      let value = params[key];
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