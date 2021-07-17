const puppeteer = require("puppeteer");
const textStrip = require("./textStrip");
const summarizeText = require("./summarizerApi");

const searchInPage = async (link) => {
  let dataObj = {};
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    let newPage = await browser.newPage();
    await newPage.goto(link);
    var foundedText = await textStrip(
      await newPage.evaluate(() => {
        let paraghraphs = [...document.querySelectorAll("p")];
        return paraghraphs
          .map((p) => p.textContent.trim())
          .filter(Boolean)
          .join(". ");
      })
    );
    var { result_text, keywords } = await summarizeText(foundedText);
    dataObj.text = result_text.replaceAll("\n", " ");
    dataObj.keywords = keywords;
    dataObj.url = link;
    dataObj.header = await newPage.$eval("h1", (text) => text.textContent);
    await newPage.close();
  } catch (e) {
    console.log(e);
  } finally {
    browser.close();
  }

  return dataObj;
};

module.exports = searchInPage;
