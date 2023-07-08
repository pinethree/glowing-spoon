const cheerio = require("cheerio");
const fs = require("fs");
const Bottleneck = require("bottleneck");
const { createObjectCsvWriter } = require("csv-writer");

const ROOT = "https://www.formula1.com/en/results.html/";

const YEARS = (function () {
  const START_YEAR = 2000;
  const CURRENT_YEAR = 2023;

  const years = [];
  for (let year = START_YEAR; year <= CURRENT_YEAR; year++) {
    years.push(year);
  }
  return years;
})();

const limiter = new Bottleneck({
  maxConcurrent: 1, // Limit the crawler to 1 request at a time
  minTime: 2000, // 1s each request, so that we don't overload the server
});

function extractDataFromTable($, tableSelector, dataSelectors) {
  const rows = $(`${tableSelector} tbody tr`);
  const data = [];

  rows.each((_, element) => {
    const tr = $(element);
    const rowData = {};

    for (const key in dataSelectors) {
      const selector = dataSelectors[key];
      const value = tr.find(selector).text().trim();
      rowData[key] = value;
    }

    data.push(rowData);
  });

  return data;
}

async function fetchData({ url, csvPath, dataSelectors, csvHeaders, year }) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const data = extractDataFromTable(
      $,
      "table.resultsarchive-table",
      dataSelectors
    );
    if (data.length === 0) {
      return;
    }

    const fileExists = fs.existsSync(csvPath);
    const csvWriter = createObjectCsvWriter({
      path: csvPath,
      header: csvHeaders,
      append: !!fileExists,
    });

    await csvWriter.writeRecords(data.map((d) => ({ ...d, year })));
    console.log(`fetched { year: ${year}, file: ${csvPath.split("/").pop()} }`);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchRaces(year) {
  const url = `${ROOT}/${year}/races.html`;
  const csvPath = "./data/races.csv";
  const dataSelectors = {
    grandPrix: "td:nth-child(2) a",
    date: "td:nth-child(3)",
    firstName: "td:nth-child(4) span.hide-for-tablet",
    lastName: "td:nth-child(4) span.hide-for-mobile",
    team: "td:nth-child(5)",
    laps: "td:nth-child(6)",
    time: "td:nth-child(7)",
  };
  const csvHeaders = [
    { id: "grandPrix", title: "grand_prix" },
    { id: "date", title: "date" },
    { id: "firstName", title: "first_name" },
    { id: "lastName", title: "last_name" },
    { id: "team", title: "team" },
    { id: "laps", title: "laps" },
    { id: "time", title: "time" },
    { id: "year", title: "year" },
  ];

  await fetchData({ url, csvPath, dataSelectors, csvHeaders, year });
}

async function fetchDrivers(year) {
  const url = `${ROOT}/${year}/drivers.html`;
  const csvPath = "./data/drivers.csv";
  const dataSelectors = {
    position: "td:nth-child(2)",
    firstName: "td:nth-child(3) span.hide-for-tablet",
    lastName: "td:nth-child(3) span.hide-for-mobile",
    nationality: "td:nth-child(4)",
    team: "td:nth-child(5) a",
    points: "td:nth-child(6)",
  };
  const csvHeaders = [
    { id: "position", title: "position" },
    { id: "firstName", title: "first_name" },
    { id: "lastName", title: "last_name" },
    { id: "nationality", title: "nationality" },
    { id: "team", title: "team" },
    { id: "points", title: "points" },
    { id: "year", title: "year" },
  ];

  await fetchData({ url, csvPath, dataSelectors, csvHeaders, year });
}

async function fetchTeams(year) {
  const url = `${ROOT}/${year}/team.html`;
  const csvPath = "./data/teams.csv";
  const dataSelectors = {
    position: "td:nth-child(2)",
    team: "td:nth-child(3) a",
    points: "td:nth-child(4)",
  };
  const csvHeaders = [
    { id: "position", title: "position" },
    { id: "team", title: "team" },
    { id: "points", title: "points" },
    { id: "year", title: "year" },
  ];

  await fetchData({ url, csvPath, dataSelectors, csvHeaders, year });
}

async function fetchDataForMultipleYears() {
  for (const year of YEARS) {
    await limiter.schedule(async () => {
      await fetchRaces(year);
      await fetchDrivers(year);
      await fetchTeams(year);
    });
  }
}

fetchDataForMultipleYears();
