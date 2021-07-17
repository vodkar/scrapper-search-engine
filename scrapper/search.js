const searchGoogle = require("./searchGoogle");
const searchInPage = require("./searchInLinks");

const search = async (job, done) => {
  let searchQuery = job.data.dataValue;
  let progressCounter = 0;
  const searchData = [];

  if (!Boolean(searchQuery)) {
    done(null, searchData);
    return;
  }

  function updateJob() {
    job.update(searchData);
    job.progress(progressCounter);
  }
  updateJob();

  console.log(searchQuery);
  const dataSearchUrls = await searchGoogle(searchQuery);
  progressCounter = 10;
  updateJob();

  if (dataSearchUrls) {
    for (let link of dataSearchUrls) {
      const value = await searchInPage(link.url);
      if (Object.keys(value).length > 0) {
        searchData.push(value);
      }
      progressCounter += Math.floor(100 / (dataSearchUrls.length + 1));
      updateJob();
    }
  }
  const value = await searchInPage(dataSearchUrls);
  if (Object.keys(value).length > 0) {
    searchData.push(value);
  }
  done(null, searchData);
};

module.exports = search;
