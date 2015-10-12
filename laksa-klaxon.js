#!/usr/bin/env node

'use strict';

const http = require('http');
const util = require('util');

const locations = {
  manchester: {
    'Cross Street': 'http://eat.co.uk/store-locations/cross-street',
    'St Anns Street': 'http://eat.co.uk/store-locations/st-anns-street',
    'Arndale (Unit 54B)': 'http://eat.co.uk/store-locations/arndale-2',
    'Arndale (Unit R1)': 'http://eat.co.uk/store-locations/arndale',
    'Trafford Centre': 'http://eat.co.uk/store-locations/trafford-centre'
  }
};

const text = {
  red: text => `\x1b[${util.inspect.colors.red[0]}m${text}\x1b[0m`,
  green: text => `\x1b[${util.inspect.colors.green[0]}m${text}\x1b[0m`,
  blue: text => `\x1b[${util.inspect.colors.blue[0]}m${text}\x1b[0m`
};

const get = (url, callback) => {
  const request = http.get(url, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => callback(null, data));
  });

  request.on('error', callback);
};

const hasLaksa = data => data.toLowerCase().indexOf('chicken laksa') !== -1;

const checkCity = city => {
  const key = city.toLowerCase();

  console.log(`Checking ${city} for laksa...`);

  Object.keys(locations[key]).forEach(place => {
    get(locations[key][place], (err, data) => {
      if (err) {
        return console.error(`error querying: ${text.blue(place)}`);
      }

      const result = hasLaksa(data) ? text.green('<KLAXON> There\'s laksa') : text.red('No laksa');
      console.log(`${result} at ${text.blue(place)}`);
    });
  });
};

checkCity('Manchester');