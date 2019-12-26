const express = require('express');
const cors = require('cors');
const NodeRSA = require('node-rsa');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const fs = require('fs');
path = require('path');

const key = new NodeRSA({b: 512});
const app = express();
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

app.use(cors());

app.use(function (req, res, next) {
    console.log('Time:', Date.now());
    next();
});

app.post('/rsa/encrypt' ,function(req, res) {
    const encrypted = key.encrypt(req.body.toEncode, 'base64');
    res.send({encrypted})
});

app.post('/saveToFile' ,function(req, res) {
    const mykey = crypto.createCipher('aes-128-cbc', 'mypassword');

    let mystr = mykey.update(req.body.textToSave, 'utf8', 'hex');
    mystr += mykey.final('hex');
    fs.writeFileSync('./assets/encrypted.txt', mystr);
    res.send({success: true})
});

app.get('/decryptFromFile' ,function(req, res) {
    const mykey = crypto.createDecipher('aes-128-cbc', 'mypassword');

    const contents = fs.readFileSync('assets/encrypted.txt', 'utf8');
    console.log(contents);

    var mystr = mykey.update(contents, 'hex', 'utf8');
    mystr += mykey.final('utf8');
    console.log(mystr);
    res.send({decrypted: mystr});
});

app.post('/rsa/decrypt' ,function(req, res) {
    const decrypted = key.decrypt(req.body.toDecrypt, 'utf8');
    res.send({decrypted});
});

app.post('/login' ,function(req, res) {
    if (req.body.username === 'irm-651' && req.body.password === '164') {
        res.status(200);
        res.send({success: true})
    } else {
        res.status(401);
        res.send({success: false})
    }
});

app.listen(process.env.PORT, function() {
    console.log('hello' + app.get('port'));
});


