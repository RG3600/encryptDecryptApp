
var express = require('express');
var app = express();
var message = '';
var key = '';
var encryptedMsg = '';
var decryptMsg = '';
var atob = require('atob');
var btoa = require('btoa');

// Set .html as the default template extension
app.set('view engine', 'html');

// Initialize the ejs template engine
app.engine('html', require('ejs').renderFile);


// Tell express where it can find the templates
app.set('views', __dirname + '/views');

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
   res.render( 'index', {message : message, key : key,  encryptedMsg : encryptedMsg,  decryptMsg : decryptMsg} );
});

app.get('/generate_key', function (req, res) {
   key = Math.floor((Math.random() * 100) + 1);
   res.render( 'index', {message: message, key : key, encryptedMsg : encryptedMsg,  decryptMsg : decryptMsg} );
});

app.get('/encrypt_msg', function (req, res) {
   // Prepare output in JSON format
   message = req.query.msg_txt;
   console.log(message);
   encryptedMsg = encryptMessage(message, key);
   res.render('index', {message: message, key : key, encryptedMsg : encryptedMsg,  decryptMsg : decryptMsg });
});

app.get('/decrypt_msg', function (req, res) {
   // Prepare output in JSON format
   decryptMessages = req.query.decryptmsg_txt;
   console.log(decryptMessages);
   decryptMsg = decryptMessage(decryptMessages, key);
   res.render('index', {message: message, key : key, encryptedMsg : encryptedMsg, decryptMsg : decryptMsg });
});

function encryptMessage(message, key){
    var encodeChars = '';
    var encryptMessage = '';
    //Loop through the characters in the string message
    for(var i = 0; i < message.length; ++i){
      //Algorithm for encoding each character in the string
      //Character ASCII code * Squareroot of Position of char in the string * key
	  encodeChars = message.charCodeAt(i) * Math.pow( i + 1, i + 1)  * key  + ';' ;
      encryptMessage += encodeChars ;
      
      console.log("encodeChar: " + encodeChars);
    }
    //encryptMessage = atob(encryptMessage);
    console.log("encryptMessage: " + encryptMessage);
    console.log("DECRYPTED: " + btoa(encryptMessage));
    return encryptMessage;
};

function decryptMessage(encryptedMessage, key){
    var decryptMessage = '';
    //Decode a string in base64
   // var decryptMessagefromBase64 = btoa(encryptedMessage);
   // console.log("decryptMessagefromBase64: " + decryptMessagefromBase64);
    var splitCharsArray = encryptedMessage.split(';');
    for (var i in splitCharsArray) {
        var decodeChar = '';
        console.log("i:: " + i);
        console.log("splitCharsArray: " + splitCharsArray[i]);
        decodeChar = (splitCharsArray[i]/key)/Math.pow(i + 1, i + 2);
        console.log("decodeChar: " + decodeChar);
        decryptMessage += String.fromCharCode(decodeChar);
    }
    return decryptMessage;
};

app.listen(3000);
