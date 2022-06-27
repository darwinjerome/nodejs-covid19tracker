const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require('fs');

const locations = new Set();
const patient = new Set();
const age = new Set();
const gender = new Set();
const details = new Set();
var jsons = [];

const main = async (keys, redis) => {
  
  let response;
  try {
    response = await request.get("https://www.health.govt.nz/covid-19-novel-coronavirus/covid-19-data-and-statistics/covid-19-current-cases");
    if (response.status !== 200) {
      console.log("Error: ", response.status);
    }
  } catch (err) {
    return null;
  }

  // const result = [{country: "", patient: 0}];
  const result = [];
  const html = cheerio.load(response);
  const patientTable = html("table.table-style-two");
  const patientTableCells = patientTable.children("tbody").children("tr").children("td");
  const totalColumns = 5;
  const patientColIndex = 0;
  const locationColIndex = 1;
  const ageColIndex = 2;


  
  for (let i = 0; i <= patientTableCells.length - totalColumns; i += 1) {
    const cell = patientTableCells[i];

    // get patient
    if (i % totalColumns === patientColIndex) {
      let patient = cell.children[0].data || "";
          patient = patient.trim();

      if (patient.length === 0) {
        // parse with hyperlink
        if(cell.children[0].next !== null) {
          patient = cell.children[0].next.children[0].data || "";
        }
      }
      result.push({ patient: patient.trim() || "" });
    }

    // get location
    if (i % totalColumns === ageColIndex) {
      let age = cell.children.length != 0 ? cell.children[0].data : "";
      result[result.length - 1].age = age.trim();
    }

    // get age
    if (i % totalColumns === locationColIndex) {
      let location = cell.children.length != 0 ? cell.children[0].data : "";
      result[result.length - 1].location = location.trim();
    }

    let tablelength = patientTableCells.length-totalColumns;
    console.log("i: " + i);
    console.log("CELL: " + tablelength);

  }


  
  
  const string = JSON.stringify(result);
  //redis.set(keys.countries, string);
  console.log(result, "Patient total: " + result.length)
  return result;
 
}

const globalData = async () => {
  const result = await request.get("https://corona.lmao.ninja/countries/new%20zealand");
  const $ = cheerio.load(result);
}

const getCount = (arr, group) => {
  var count = 0;
  for (var i = 0; i < arr.length; i++) {
      if (arr[i].country == group) {
          count++;
      }
  }
  //console.log("Total: " + count + " in " + group);
  return count;
}

module.exports = {
  globalData: globalData,
  main: main,
  getCount: getCount,
}