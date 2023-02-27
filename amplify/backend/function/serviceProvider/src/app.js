n/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


/**********************
 * Example get method *
 **********************/

app.get('/serviceProvider', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/serviceProvider/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/serviceProvider', function(req, res) {



res.json({success: 'post call succeed!'})

});

app.post('/serviceProvider/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/serviceProvider', function(req, res) {
  const forge = require("node-forge");
const fs = require("fs");
const p12Content = fs.readFileSync("MCD_Sandbox_Oxi-test_API_Keys/Oxi-test-sandbox.p12", 'binary');
const p12Asn1 = forge.asn1.fromDer(p12Content, false);
const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, "keystorepassword");
const keyObj = p12.getBags({
    friendlyName: "keyalias",
    bagType: forge.pki.oids.pkcs8ShroudedKeyBag
}).friendlyName[0];
const signingKey = forge.pki.privateKeyToPem(keyObj.key);
const consumerKey = "hvdsNY_Ed3yO3fXJjNoj5WPDL5yncgkBJuWF8124f90a858b!4ffa974eeff64dd695dfab33c6facae70000000000000000";
const oauth = require('mastercard-oauth1-signer');

var CarbonCalculatorApi = require('carbon_calculator_api');

global.info = CarbonCalculatorApi

const apiClient = CarbonCalculatorApi.ApiClient;

const client = apiClient.instance;

client.basePath = "https://sandbox.api.mastercard.com/carbon";
client.applyAuthToRequest = function(request) {
    const _end = request._end;
    request._end = function() {
        const authHeader = oauth.getAuthorizationHeader(request.url, request.method, request._data, consumerKey, signingKey);
        request.req.setHeader('Authorization', authHeader);
        _end.call(request);
    }
    return request;
};

let apiInstance = new CarbonCalculatorApi.ServiceProviderApi();
let serviceProviderConfig = new CarbonCalculatorApi.ServiceProviderConfig(); // ServiceProviderConfig | Configuration details for service provider which needs to be update. It should contain only those parameters which you want to update. If you are calling this API for the first time then it is recommended to send all the parameters.


serviceProviderConfig = {
  "customerName": "Nishan Dudakia",
  "supportedAccountRange": "535522",
  "customerId": "222"
}

console.log(serviceProviderConfig)

apiInstance.updateServiceProvider(JSON.stringify(serviceProviderConfig), (error, data, response) => {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    res.json({success: 'put call succeed!', data})


  }
});
});

app.put('/serviceProvider/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/serviceProvider', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/serviceProvider/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
