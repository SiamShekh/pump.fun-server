const express = require('express');
const cors = require('cors');
const formidable = require('express-formidable');
const { default: axios } = require('axios');
const FormData = require('form-data');
const app = express();
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());
app.use(formidable());

app.post('/', async (req, res) => {
    if (req?.fields?.file) {
        try {
            const fetchResponse = await fetch(req?.fields?.file);
            const arrayBuffer = await fetchResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const form = new FormData();
            form.append('name', req?.fields?.name);
            form.append('symbol', req?.fields?.symbol);
            form.append('description', req?.fields?.description);
            form.append('twitter', req?.fields?.twitter || " ");
            form.append('telegram', req?.fields?.telegram || " ");
            form.append('website', req?.fields?.website || " ");
            form.append('showName', req?.fields?.showName || "true");
            form.append('file', buffer, { filename: "image", contentType: fetchResponse.headers.get('content-type') });

            const response = await axios.post('https://pump.fun/api/ipfs', form, {
                headers: {
                    ...form.getHeaders(),
                    "accept": "*/*",
                    "cookie": "your_cookie_here", 
                    "Referer": "https://pump.fun/create",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                }
            });

            res.json(response.data);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while sending the file.');
        }
    } else {
        res.status(400).send('No file provided.');
    }
});
app.listen(1000, () => {
    console.log('server running at 1000');
});
