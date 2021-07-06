const puppeteer = require('puppeteer');

const searchInPage = async (link) => {
    let dataObj = {};
    try {
        const browser = await puppeteer.launch({headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']});
        let newPage = await browser.newPage();
        await newPage.goto(link);
        dataObj.text = await newPage.$eval('*', el => el.innerText);
        dataObj.url = link
        dataObj.header = await newPage.$eval('h1', text => text.textContent);
        console.log('выполнил')
        await newPage.close();
    }
    catch (e) {
        console.log(e)
    }

return dataObj
}

module.exports = searchInPage;




