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

app.set('port', 8000);

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

app.listen(app.get('port') || process.env.PORT, function() {
    console.log('hello' + app.get('port'));
});


