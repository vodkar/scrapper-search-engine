const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT;

const searchGoogle = require('./scrapper/searchGoogle');
const searchInPage = require("./scrapper/searchInLinks");
app.options('*', cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/search', async (req, res) => {
    const dataValue = req.body.post
    console.log(dataValue)
    const dataSearchUrls = await searchGoogle(dataValue)
    console.log(dataSearchUrls)
    const searchData = []
    console.log(searchData)
    if (dataSearchUrls) {
        for(let link of dataSearchUrls){
            const value = await searchInPage(link.url)
            searchData.push(value)
        }
    }
    const value = await searchInPage(dataSearchUrls)
    searchData.push(value)
    console.log(value)
    res.send(searchData);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));