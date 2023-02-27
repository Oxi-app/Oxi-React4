/*
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

app.get('/getSupportedCurrencies', function(req, res) {
  const forge = require("node-forge");
  const fs = require("fs");
  const p12Content = fs.readFileSync("MCD_Sandbox_Oxi_API_Keys/Oxi-test-sandbox.p12", 'binary');
  console.log(p12Content)
  const p12Asn1 = forge.asn1.fromDer(p12Content, false);
  const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, "keystorepassword");
  const keyObj = p12.getBags({
      friendlyName: "keyalias",
      bagType: forge.pki.oids.pkcs8ShroudedKeyBag
  }).friendlyName[0];
  const signingKey = forge.pki.privateKeyToPem(keyObj.key);

  
  //console.log(signingKey)
  
  
  const consumerKey = "t_bQDoEQ8ROz3jhZ82rUXT8G0x97cU381J9JvHuzfc51f323!51e47ba5982a48f18309667b14036d4f0000000000000000";
  // const url = "https://sandbox.api.mastercard.com/carbon/supported-currencies";
  // const method = "GET";
  // const payload = "";
  
  const oauth = require('mastercard-oauth1-signer');
  //console.log(oauth)
  //const authHeader = oauth.getAuthorizationHeader(uri, method, consumerKey, signingKey);
  
  //console.log(authHeader)
  
  // const service = require('../MastercardTest/node_modules/carbon_calculator_api/dist/index.js');
  
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
  
  let apiInstance = new CarbonCalculatorApi.SupportedParametersApi();
  apiInstance.getSupportedCurrencies((error, data, response) => {
    if (error) {
      console.error(error);
    } else {
     console.log('API called successfully. Returned data: ' + JSON.stringify(data));    
      
      res.json({success: 'get call succeed!', data});
    }
  });  

});

app.get('/getSupportedCurrencies/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

app.post('/getSupportedCurrencies', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

app.post('/getSupportedCurrencies/*', function(req, res) {
  // Add your code here
  res.json({success: 'post call succeed!', url: req.url, body: req.body})
});

/****************************
* Example put method *
****************************/

app.put('/getSupportedCurrencies', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/getSupportedCurrencies/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/getSupportedCurrencies', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/getSupportedCurrencies/*', function(req, res) {
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
