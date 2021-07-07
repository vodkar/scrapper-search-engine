const searchGoogle = require("./searchGoogle");
const searchInPage = require("./searchInLinks");

const search = async (job, done) => {
  let searchQuery = job.data.dataValue;
  let progressCounter = 0;
  const searchData = [];

  function updateJob() {
    job.update(searchData);
    job.progress(progressCounter);
  }
  updateJob();

  const dataSearchUrls = await searchGoogle(searchQuery);
  progressCounter = 10;
  updateJob();

  if (dataSearchUrls) {
    for (let link of dataSearchUrls) {
      const value = await searchInPage(link.url);
      searchData.push(value);
      progressCounter += Math.floor(100 / (dataSearchUrls.length + 1));
      updateJob();
    }
  }
  const value = await searchInPage(dataSearchUrls);
  searchData.push(value);
  done(null, searchData);
};

module.exports = search;
