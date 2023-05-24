import * as fs from "fs";
import path from "path";
import * as url from "url";
import { load } from "csv-load-sync";
import ObjectsToCsv from "objects-to-csv";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const YEA = "1";
const NAY = "2";
const DEFAULT_SPONSOR = "Unknown";
const DATA_DIR = path.resolve(__dirname, "./data");
const RESULTS_DIR = path.resolve(__dirname, "./results");

export const compute_leg_sup_opp = (dataset) => {
  const result = dataset.legislators.map((legislator) => {
    const resultMap = dataset.vote_results
      .filter((result) => result.legislator_id === legislator.id)
      .reduce(
        (map, { vote_type }) => map.set(vote_type, map.get(vote_type) + 1),
        new Map([
          [YEA, 0],
          [NAY, 0],
        ])
      );
    return {
      id: legislator.id,
      name: legislator.name,
      num_supported_bills: resultMap.get(YEA),
      num_opposed_bills: resultMap.get(NAY),
    };
  });

  return result;
};

export const compute_bill_sup_opp = (dataset) => {
  const result = dataset.bills.map((bill) => {
    const sponsor = dataset.legislators.find(
      ({ id }) => id === bill.sponsor_id
    );
    const vote = dataset.votes.find((vote) => vote.bill_id === bill.id);
    const resultMap = dataset.vote_results
      .filter((result) => result.vote_id === vote?.id)
      .reduce(
        (map, { vote_type }) => map.set(vote_type, map.get(vote_type) + 1),
        new Map([
          [YEA, 0],
          [NAY, 0],
        ])
      );

    return {
      id: bill.id,
      title: bill.title,
      supporter_count: resultMap.get(YEA),
      opposer_count: resultMap.get(NAY),
      primary_sponsor: sponsor?.name ?? DEFAULT_SPONSOR,
    };
  });
  return result;
};

const createDataset = (files) => {
  const dataset = files.reduce((dataset, file) => {
    const bn = path.basename(file, ".csv");
    dataset[bn] = load(`${DATA_DIR}/${file}`);

    return dataset;
  }, {});

  return dataset;
};
const saveResultsToCSV = async (results, dir) => {
  for (const [fileName, result] of results.entries()) {
    const csv = new ObjectsToCsv(result);
    await csv.toDisk(`${dir}/${fileName}`);
  }
};

const files = fs.readdirSync(DATA_DIR);
const dataset = createDataset(files);
const results = new Map([
  ["legislators-support-oppose-count.csv", compute_leg_sup_opp(dataset)],
  ["bills.csv", compute_bill_sup_opp(dataset)],
]);

saveResultsToCSV(results, RESULTS_DIR).then(() => {
  console.log("Results written to files successfully 🙂");
});
