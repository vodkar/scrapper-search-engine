const puppeteer = require('puppeteer');

const searchInPage = async (link) => {
    let dataObj = {};
    try {
        const browser = await puppeteer.launch({headless: true});
        let newPage = await browser.newPage();
        await newPage.goto(link);
        dataObj.headers = await newPage.$eval('*', el => el.innerText);
        // dataObj.headers = await newPage.$eval( 'h1', text => text.textContent);
        // dataObj.text = await newPage.$eval('p', text => text.textContent);
        console.log('выполнил')
        await newPage.close();
    }
    catch (e) {
        console.log(e)
    }

return dataObj
}

module.exports = searchInPage;




