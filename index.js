const express = require('express');
const fileUpload = require('express-fileupload');
const _FORMDATA = require('express-formidable');
const cors = require('cors');
const HomeDataService = require('./api/HomeData');
const app = express();
app.use(cors({
    origin: "*",
    credentials: true
}))
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

app.get('/search', async (req, res) => {
    const result = await fetch("https://frontend-api.pump.fun/coins?offset=0&limit=50&sort=reply_count&order=DESC&includeNsfw=true&searchTerm=boom&captchaToken=03AFcWeA46zQykEjFIXmDet6UIGZnp9-R_Dcr7VPCKifFYOD8ufTzSQ9yjxO_w9xd0NdJPSMZkBjREAQX6zLIsA5lS5glVhdmZb8aphPxDxFk3IUk4m0iGCfNdBVN5Hmx6YKfxXDBO9QheiyxJPyqlF6595ZRNpC8Q8KFkvC6kLk9rQPHOoT-dkLbglhw1r7J_fAPWFPHGL-cTF5oGSLnmUqwIHPrRa3A3nrkq7gBHSvzpUpbqJVSW7EKEHdXGyBWvj8OtSt1ut71IXnrdA27iOquIbsRQ1SDSaqU8Fnhjc2hPAv3sDVQwRm58HWbZDWjoksNre8I4_3k8nAXVeBre2mrfowZPhsAvgE3Xk28pc70XgKTkanGlBLnlMBMhg6vQyHsDYVftshN2q_G9wCcnj0H8jH8EQsyroXBm-DFFtg1RuBpFg5yxXk4z1V690U6qg64NUZJdo_LtRZqMYzOf4A05Syj62k0dGV26qCEvtx35IVTYxT_9t69pSQ3sT2LElDBy3RKfgNrThiJA3MIyomMUPaY1CHmD29veA4Xu2d-OECId1Ho6ATFD9qO-Mw-iUUYnmT0kXEgZl3pz6MYI9HkbBXQwv85Tjrn7hHnqG6dtDbzhH6odnmt2BxsBR8iTkXXgOn25CEmdSYLhjU8zRMc20VowLAx3oIl963UsiXSYkbUIk78gUsBVKFuFos4V7aRbIVmF_vUOWtAf4omiZzTnYe32p7aFrRj4sqCKHK5HmodoJTZAKPCmT1A6obSc7fgVVFvUXlwEpPwxMuVGv-6XP1RYHIs0Nk9DHSWVzsL9OJRrXR2_s2VJpJp9PNNtYlAZtb5gya2u7vZuDbVPkkOZuMFYP3GrPbWhoa53giCOrRUeJpEp_F5vF0O5DU3qT6tk4N2GblZXXv1Rs5bEZLrpeEaNuVEPxggSO84A1dLvjEdQaXs4_aiV4wJ93_HG8E6-dkwJuN6blyZTvJlP5Ry4Y0xQsKQmwzLf1ZXPaFpIPxgLQpTqmGTK4E1AE4nw7y9ARjm6jsU0_PYGndBs0eM-qyVd1MokcbNpK5xNVdVVnfvxuD2qy2pX50etGLiTDGFnX9iGPLS4dnLEsw8JCg6b0M5JHrjud4tJbnGfx7usL89PN7K5XNv8Kd-PnCPA6X2B64JxVM0Uwiw65wL5csXqRIGx2T9QsJCjbKv36yfgRf_TPdT7ftjNCH7YaX3fnyIPJmqHz2C6__6rERew1pM5t4HWhr3uGylo5EGePImqJAjLq6Z6vizZf97PYNF4IXpXhzEYN3bgda6I170jDxErZbsXOSKJ7VzVS1tBXTrmwyap_YnT2yomsNTiwR8V1A80hLC1jhynYyHqKNIhmjsBWQCB-Hg2DEE-6wCBFt3xmPwnlcLnKoOo7NE1QMtxeLnQ6e30RW_VN3RBT7U42qUViHKGkA2S5D8NymfpPdPBk3nY7eYmpw2r-I6wALHCQO5GSduuzDBBRYlZ-KNJegRxjFPM4qV7q6jSrPALr44BS9NTAEgUOc7vErgHkuDK7OKXxbHsVezgBuYpNmvjrRnPsPT0jQqqQ9u5mZKbk_sCvR1f_6541JcQXq_DB6UUvkYV3Hntr3I3doM_Wl9Pxk9Ng4ro24Aqg0ET_lZh8dqa7DUZ-qom5XmkogsxteZ2eQBV-tT9K39cX3qawZAnw-ZRpDZEPEXdZ_BkQO5Dgvq74v3a_7E9w66oHEyxRIZ_0MG7eYuHlj89lGpmMHb2AE1gMbpTKBnWe8ftc3mdH6mgybN9OJzvR64MNmeht2o3bj59frgnJXIFPAOv3RCgHs5atORW1KsXHUR0JcsOHu5piCZqYQpHLbfTuAlEU8qpsbteQQBLSSUgCcOStEGQfj0KA1uRlZ3sEBYAfEEv77Bq9sNXZr41BVg", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,bn;q=0.8",
            "priority": "u=1, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Google Chrome\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site"
        },
        "referrer": "https://pump.fun/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "omit"
    }).then(res => res.json());

    console.log(result);


    res.send(result)
});

app.get('/home-informission', HomeDataService);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
