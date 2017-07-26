#!/usr/bin/env node

'use strict';
const util = require('util');
const core = require('laksa-klaxon-core');

const text = {
  red: text => `\x1b[${util.inspect.colors.red[0]}m${text}\x1b[0m`,
  green: text => `\x1b[${util.inspect.colors.green[0]}m${text}\x1b[0m`,
  blue: text => `\x1b[${util.inspect.colors.blue[0]}m${text}\x1b[0m`
};
const checkCity = city => {
    console.log(`Checking ${city} for laksa...`);
    return core.checkCity(city)
        .then((results) => {
            results.forEach((result) => {
                const hasLaksa = result.hasLaksa ? text.green('<KLAXON> There\'s laksa') : text.red('No laksa');
                console.log(`${hasLaksa} at ${text.blue(result.place)}`);
            });
        });
};

checkCity('Manchester');
