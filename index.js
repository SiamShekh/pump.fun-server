const express = require('express');
const fileUpload = require('express-fileupload');
const _FORMDATA = require('express-formidable');
const app = express();
app.use(fileUpload());
app.use(_FORMDATA());

app.post('/', async (req, res) => {
    try {
        const request = await fetch("https://pump.fun/api/ipfs", {
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9,bn;q=0.8",
                "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryDlgGrC1TBVdU3mln",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "cookie": "_ga=GA1.1.397060112.1723372048; auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZGRyZXNzIjoiQXljWk1VN3VoSEpzR2FjVDlUcDRGSGRDQVpqY2l2d1BMZ3RnZ0tMU05xVVoiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTcyMzYxMTAzMywiZXhwIjoxNzI2MjAzMDMzfQ.G3vJdRcUKcix8pZsxEerDj447Q12WSF6hN3IsttoJE8; __cf_bm=v_9GnxylQRADTEtxgMmbJalq_js4CY52z3MwFU7IlDw-1723615572-1.0.1.1-65UDuNajtHaO89K4qcrUXzrLukTneONrCHljrt3.P9kYUUCYESujlv_XDbjlSXXXrXxkymSkNMj43f60AHUk8g; cf_clearance=vPuBAhWzxuEkN451.WlM3EgFGivPbetBG.OGxZ2NAvw-1723615629-1.0.1.1-d4pCUx8Z12eJ5ca0giTkfu6A_DNVH4OPUON161cRBefveUO9RR5s7d_c7wu4P9UNuRUj3JOaPMNgQhPbr8.PLw; fs_lua=1.1723615630978; fs_uid=#o-1YWTMD-na1#dbd0e220-f556-406b-a41a-37ed62775095:23afa096-9481-498c-b35c-4773fb90a488:1723615580283::2#e8a48f17#/1754908092; _ga_T65NVS2TQ6=GS1.1.1723615578.7.1.1723615652.60.0.0",
                "Referer": "https://pump.fun/create",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            },
            body: "------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"file\"; filename=\"BN.png\"\r\nContent-Type: image/png\r\n\r\n\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"name\"\r\n\r\nPorn Start\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"symbol\"\r\n\r\nLoad\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"description\"\r\n\r\nMI FI CI\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"twitter\"\r\n\r\n\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"telegram\"\r\n\r\n\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"website\"\r\n\r\n\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln\r\nContent-Disposition: form-data; name=\"showName\"\r\n\r\ntrue\r\n------WebKitFormBoundaryDlgGrC1TBVdU3mln--\r\n",
            method: "POST"
        });

        if (!request.ok) {
            throw new Error(`HTTP error! Status: ${request.status}`);
        }

        const data = await request.json();
        res.send(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.get('/list', async (req, res) => {
    const data = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=500&sort=last_trade_timestamp&order=DESC&includeNsfw=true")
        .then(res => res.json());

    res.send(data);
});

app.get('/popular', async (req, res) => {
    const data = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=50&sort=reply_count&order=DESC&includeNsfw=true")
        .then(res => res.json());

    res.send(data);
});

app.get('/top-gainer', async (req, res) => {
    const data = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=50&sort=market_cap&order=DESC&includeNsfw=true")
        .then(res => res.json());

    res.send(data);
});

app.get('/new', async (req, res) => {
    const data = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=50&sort=created_timestamp&order=DESC&includeNsfw=true")
        .then(res => res.json());

    res.send(data);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
