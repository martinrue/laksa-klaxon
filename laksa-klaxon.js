#!/usr/bin/env node

'use strict';

const https = require('https');
const util = require('util');
const cheerio = require('cheerio');

const locations = {
  manchester: {
    'Cross Street': 'https://eat.co.uk/store-locations/cross-street',
    'St Anns Street': 'https://eat.co.uk/store-locations/st-anns-street',
    'Arndale (Unit 54B)': 'https://eat.co.uk/store-locations/arndale-2',
    'Arndale (Unit R1)': 'https://eat.co.uk/store-locations/arndale',
    'Trafford Centre': 'https://eat.co.uk/store-locations/trafford-centre'
  }
};

const text = {
  red: text => `\x1b[${util.inspect.colors.red[0]}m${text}\x1b[0m`,
  green: text => `\x1b[${util.inspect.colors.green[0]}m${text}\x1b[0m`,
  blue: text => `\x1b[${util.inspect.colors.blue[0]}m${text}\x1b[0m`
};

const get = (url, callback) => {
  const request = https.get(url, response => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => callback(null, data));
  });

  request.on('error', callback);
};

const hasLaksa = dom => dom('a[href*="chicken-laksa"]').length > 0;

const checkCity = city => {
  const key = city.toLowerCase();

  console.log(`Checking ${city} for laksa...`);

  Object.keys(locations[key]).forEach(place => {
    get(locations[key][place], (err, data) => {
      if (err) {
        return console.error(`error querying: ${text.blue(place)}`);
      }
      const dom = cheerio.load(data);

      const result = hasLaksa(dom) ? text.green('<KLAXON> There\'s laksa') : text.red('No laksa');
      console.log(`${result} at ${text.blue(place)}`);
    });
  });
};

checkCity('Manchester');
