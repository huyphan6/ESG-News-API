const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const sources = [
    {
        name: 'CNBC',
        url: 'https://www.cnbc.com/esg-green-business/',
        base: ''
    },
    {
        name: 'The Economic Times',
        url: 'https://economictimes.indiatimes.com/topic/esg',
        base: 'https://economictimes.indiatimes.com'
    },
    {
        name: 'ESG Today',
        url: 'https://www.esgtoday.com/',
        base: ''
    },
    {
        name: 'Barrons',
        url: 'https://www.barrons.com/topics/sustainable-investing',
        base: ''
    },
    {
        name: 'Financial Times',
        url: 'https://www.ft.com/esg-investing',
        base: ''
    },
    {
        name: "The Conversation",
        url: 'https://theconversation.com/us/topics/esg-88758',
        base: ''
    },
    {
        name: 'ESG News',
        url: 'https://esgnews.com/',
        base: ''
    }
]
const articles = [];

sources.forEach(source => {
    axios.get(source.url)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('a:contains("ESG")').each(function() {
            const title = $(this).text();
            const url = source.base + $(this).attr('href');

            articles.push({
                title,
                url,
                source: source.name
            });
        });
    })
    .catch(console.error);
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json("Welcome to the API");
});

router.get('/news', (req, res, next) => {
    res.json(articles);
})

router.get('/news/:source', (req, res, next) => {
    const sourceID = req.params.source;
    const sourceURL = sources.filter(source => source.name === sourceID)[0].url;

    axios.get(sourceURL)
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            const articles = [];
            $('a:contains("ESG")').each(function() {
                const title = $(this).text();
                const url = $(this).attr('href');
                articles.push({
                    title,
                    url,
                    source: sourceID
                });
            });
            res.json(articles);
        })
});

module.exports = router;
