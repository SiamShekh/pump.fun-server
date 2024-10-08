const express = require('express');
const fileUpload = require('express-fileupload');
const _FORMDATA = require('express-formidable');
const cors = require('cors');
const HomeDataService = require('./api/HomeData');
const Charts = require('./api/Charts');
require('dotenv').config()
const { Schema, default: mongoose } = require('mongoose');
const { DetailsInformission } = require('./api/Database');
const CoinHolderByContractAddress = require('./api/coins-holder/CoinHolderByContractAddress');
const { Connection } = require('@solana/web3.js');
const FormData = require('form-data');
const { default: axios } = require('axios');
const { CreateWallets, RetriveWallets, WalletsModel, AllVirtualWallets } = require('./api/wallets/Wallet');
const { load } = require('cheerio');
const Profile = require('./api/Profile');
const { SwappedPost, SwappedGet, SwappedModal } = require('./api/swapped/Swapped');
const { MetaDataModel, MetaDataPost, MetaDataGet } = require('./api/meta-data/MetaData');
const { PostLogin } = require('./api/setting/PostLogin');
const SettingModel = require('./api/setting/Schema_Model_setting');

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://onlypumps.io",
    ],
    credentials: true
}));

app.use(fileUpload());
app.use(_FORMDATA());

mongoose.connect(process.env.URI)

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

app.get('/rpc', async (req, res) => {
    const rpc = await fetch('https://www.ankr.com/rpc/solana').then(res => res.json());

    res.send(rpc)
})

app.get('/home-informission', HomeDataService);
app.get('/charts', Charts);
app.get('/details', DetailsInformission);
app.get('/profile', Profile);
app.get('/virtual-wallets/all/wallets', async (req, res) => {
    const result = await WalletsModel.find({});
    res.send(result);
})

app.post('/ipfs', async (req, res) => {
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
            // res.json(req?.fields);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while sending the file.');
        }
    } else {
        res.status(400).send('No file provided.');
    }
});

app.get('/create-wallet', CreateWallets);
app.get('/find-wallet', RetriveWallets);

app.get('/meta-data', async (req, res) => {
    const contract = req?.query?.ca;
    const htmlFetch = await fetch(`https://pump.fun/${contract}`).then(res => res.text());
    const $ = load(htmlFetch);
    const bonding_curve = $("script").text().split("Taking too long")[1].split("children")[1].split("coin")[1].split("toggleNsf")[0];
    let cleanedString = bonding_curve.replace(/\\+/g, '').slice(2, -2);
    const MetaData = JSON.parse(cleanedString);
    res.send(JSON.parse(cleanedString))
});

app.post('/swapped', SwappedPost);
app.get('/swapped', SwappedGet);
app.get('/virtual-wallets', AllVirtualWallets);
app.post('/meta-data-post', MetaDataPost);
app.get('/metadata', MetaDataGet);

// update user creadiential
app.post('/login/admin/update', async (req, res) => {
    const result = await SettingModel.findByIdAndUpdate(new Object(process.env.SETTING_ID), { ...req?.fields });

    res.send(result)
});

// if ping true then user available and if ping false then user unavailable
app.post('/login/admin', async (req, res) => {
    const result = await SettingModel.findOne({
        email: req?.fields?.email,
        password: req?.fields?.password,
    });

    if (result) {
        return res.send({
            ping: true
        })
    } else {
        return res.send({
            ping: false
        })
    }
});

//get setting informission
app.get('/login/setting/info', async (req, res) => {
    const result = await SettingModel.findById(process.env.SETTING_ID).select({
        email: false,
        password: false,
        _id: false
    });
    res.send(result);
})

app.get('/login/info', async (req, res) => {
    const result = await SettingModel.findById(process.env.SETTING_ID);
    res.send(result);
});

app.get('/admin/dashboard', async (req, res) => {
    const virtual_wallets = await WalletsModel.estimatedDocumentCount();
    const swapped = await SwappedModal.estimatedDocumentCount();
    const token_created = await MetaDataModel.estimatedDocumentCount();
    res.send({
        virtual_wallets,
        swapped,
        token_created
    })
})

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});

