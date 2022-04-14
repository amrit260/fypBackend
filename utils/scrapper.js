const fs = require('fs');
const catchAsync = require('./catchAsync');
const axios = require('axios');
const cheerio = require('cheerio');

const scrapData = catchAsync(async (req, res, next) => {
  const url = `https://www.nepaladventurepilgrimage.com/`;
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    const data = $('div.col > div.holder');

    const list = [];
    const price = $(
      ' div.col > div.holder > div.img-holder >span.price-holder > span >span.wpte-price'
    );
    const title = $('div.col > div.holder > div.text-holder >h3.title');

    data.map((index, element) => {
      let p = price.eq(index).text();

      let t = title.eq(index).text();
      if (p != '0' && p != '') {
        list.push({ title: t, price: p.replace(',', '') });
      }
    });

    console.log(list);

    fs.writeFileSync('./utils/scrapedData.json', JSON.stringify(list));

    res.status(200).json({ status: 'success', data: list });
  } catch (e) {
    console.error(e);
  }
});

module.exports = scrapData;
