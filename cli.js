#!/usr/bin/env node

const colors = require('colors');
const yargs = require('yargs');
let spawn = require('child_process').spawn;
let fork = require('child_process').fork;
let params = yargs.argv;
let excludedParams = ['_', '$0', 'help', 'version'];
let marsApiCommands = ['api'];

let command = "";

function init() {
  let command = getCommand();
  let subcommands = getSubcommands(); // Gets the selected command (e.g. 'server', 'build'...)
  runCommand(command, subcommands, params); // Actually runs the command
}

function getCommand() {
  let rootSubcommand = getSubcommands()._;
  if (marsApiCommands.indexOf(rootSubcommand) > -1) {

  } else {
    return "ionic";
  }
}

function getSubcommands() {
  return params._;
};

function runCommand(command, subcommands, params) {
  subcommands = subcommands || [];
  for (var key in params) { // Appends the options to the subcommands
    if (excludedParams.indexOf(key) == -1)
      subcommands.push(`--${key} ${params[key]}`);
  };

  spawn(command, subcommands, {
    stdio: "inherit",
    env: Object.assign(process.env, params) // Adds the supplied options to environment variables
  });
}

init();

module.exports = {

};