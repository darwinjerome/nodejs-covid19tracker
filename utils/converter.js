const fs = require('fs');
const main = require('../data');
(async () => {
  let results = await main()
  let jsonString = JSON.stringify(results);
  fs.writeFileSync('../output.json', jsonString, 'utf-8');
})()