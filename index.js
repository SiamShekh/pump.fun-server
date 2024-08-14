const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(cors({
    origin: "*",
    credentials: true
}));
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/', upload.single('file'), async (req, res) => {
    const form = new FormData();

    form.append('name', req?.body?.name);
    form.append('symbol', req?.body?.symbol);
    form.append('description', req?.body?.description);
    form.append('twitter', req?.body?.twitter | " ");
    form.append('telegram', req?.body?.telegram | " ");
    form.append('website', req?.body?.website | " ");
    form.append('showName', req?.body?.showName | "true");

    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    try {
        const response = await axios.post('https://pump.fun/api/ipfs', form, {
            headers: {
                ...form.getHeaders(),
                "accept": "*/*",
                "cookie": "your_cookie_here", // Replace with your actual cookie if needed
                "Referer": "https://pump.fun/create",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        });

        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete uploaded file:', err);
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while sending the file.');
    }
});

app.listen(1000, () => {
    console.log('server running at 1000');
});
