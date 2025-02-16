const fs = require("fs");
const f = JSON.parse(fs.readFileSync("./heroes_full.json"));


const some = Object.entries(f).map(([key, value]) => {
  return {
    hero: value.name,
    localizedName: value["localized_name"],
  };
});

console.log(JSON.stringify(some))
