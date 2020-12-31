var express = require('express');
var jwt_decode = require('jwt-decode');

var router = express.Router();

const fetch = require("node-fetch");
const {google} = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  "398900735256-33ubuc1kgascoa87eaibhvmm1l45hmhu.apps.googleusercontent.com",
  "dkEZN6siI3qpYncZewm3FAOv",
  "http://localhost:3000/api/auth/google"
);

const scopes = [
  'openid',
  'email'
];

const { DynamoDBClient, UpdateItemCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({ region: "us-east-1" })

router.get('/signin/google', function(req, res, next) {
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes
  });

  res.redirect(url)
})

router.get('/signin/fitbit', function(req, res, next) {
  const url = "https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=22BY92&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Ffitbit&scope=activity%20profile&expires_in=604800"

  res.redirect(url)
})

router.get('/google', async function(req, res, next) {
  const code = req.query.code
  const {tokens} = await oauth2Client.getToken(code)
  oauth2Client.setCredentials(tokens);

  try {
    const decoded = jwt_decode(tokens.id_token);
    const params = {
      TableName: "users",
      Item: {
        "email": { S: decoded.email },
        "google_id": { S: JSON.stringify(decoded)} ,
      },
    }

    console.log('params: ', params);

    const data = await client.send(new PutItemCommand(params))
    console.log('dynamodb results: ', data)

    req.session.userid = decoded.email
    res.redirect('/')
  } catch(err) {
    console.error('dynamo db error: ', err)
  }
});

/* GET home page. */
router.get('/fitbit', async function(req, res, next) {
  const authCode = req.query.code
  console.log("authCode: ", authCode)
  if (!authCode) {
    res.json({"message": "fitbit-no-authcode"})
  }
  var details = {
    'clientId': '22BY92',
    'grant_type': 'authorization_code',
    'redirect_uri': 'http://localhost:3000/api/auth/fitbit',
    'code': authCode,
  };
  var formBody = [];
  for (var property in details) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(details[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const base64 = require('base-64')
  console.info('fitbit oauth api called')

  let d = {}
  console.info('fetching fitbit tokens...')
  fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + base64.encode('22BY92:59248fdc4ed1ba0916ba6bb51ff7694a'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formBody,
  })
  .then(response => response.json())
  .then(async data => {
    console.log('fitbit access data - 2: ', data)

    const params = {
      TableName: "users",
      Key: {
        email: { S: req.session.userid },
      },
      UpdateExpression: "set fitbit_refresh_token = :val1",
      ExpressionAttributeValues: {
        ":val1": { S: data.refresh_token },
      },
      ReturnValues: "ALL_NEW",
    }

    console.log('params: ', params);

    const resp = await client.send(new UpdateItemCommand(params))

    console.log('fitbit update item command: ', resp);

    res.cookie('fitbit_token', data.access_token)
    res.redirect('/')
  })
  .catch(error => {
    res.json({"error": error})
  })
});

module.exports = router;