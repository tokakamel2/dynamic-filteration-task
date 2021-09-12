const { Console } = require("console");
const csv = require("csv-parser");
const fs = require("fs");
const results = [];

const jsonString = {
  query: {
    qualification: {
      qualification_item: [
        { cloumnname: "CITY", operator: "LIKE", values: "NEW" },
        { cloumnname: "COUNTRY", operator: "EQUAL", values: "USA" },
      ],
    },
  },
};

const filterData =  (excelFile, jsonString) => {
  var finalResult = [];

  fs.createReadStream(excelFile)
    .pipe(csv())
    .on("data", (data) => {
      results.push(data);
    })
    .on("end", () => {
      const qualificationItemLength =
        jsonString.query.qualification.qualification_item.length;

      const allArrays = [];
      for (item in jsonString.query.qualification.qualification_item) {
        if (
          jsonString.query.qualification.qualification_item[item].operator ==
          "EQUAL"
        ) {
          const r1 = filterEqual(
            results,
            jsonString.query.qualification.qualification_item[item].cloumnname,
            jsonString.query.qualification.qualification_item[item].values
          );
          allArrays.push({ Results: r1 });
        } else {
          const r1 = filterLike(
            results,
            jsonString.query.qualification.qualification_item[item].cloumnname,
            jsonString.query.qualification.qualification_item[item].values
          );
          allArrays.push({ Results: r1 });
        }
      }

      var middleArray = allArrays[0];
      for (array in allArrays) {
        const intersection = allArrays[array].Results.filter((element) =>
          middleArray.Results.includes(element)
        );
        middleArray.Results = intersection;
      }
      console.log(middleArray);
      finalResult = middleArray;
    });
  return finalResult;
};
const filterEqual = (data, cloumnname, value) => {
  const result = [];
  for (i in data) {
    if (data[i][cloumnname] == value) {
      result.push(data[i]);
    }
  }

  return result;
};
const filterLike = (data, cloumnname, value) => {
  const result = [];
  for (i in data) {
    if (data[i][cloumnname].includes(value)) {
      result.push(data[i]);
    }
  }

  return result;
};
const result = filterData("data.csv", jsonString);

console.log(result)