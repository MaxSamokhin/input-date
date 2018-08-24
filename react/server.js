'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const http = require('https');

const ALLOW_URL = 'http://127.0.0.1:7001';

app.use(cors({
	origin: ALLOW_URL,
}));

app.get('/date', (req, res) => {
    let geo = req.query.geo || 213;
    const url = `https://yandex.com/time/sync.json?geo=${geo}`;

    http.get(url, resp => {
      let data = '';
      resp.on('data', chunk =>  data += chunk);
      resp.on('end', chunk => {
          res.status(200).json({time: JSON.parse(data).time});
          res.end();
      });
    });

});

const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log(`Server listening port ${port}`);
});
