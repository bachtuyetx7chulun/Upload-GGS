const express = require('express')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const errMiddleware = require('./middlewares/error.middleware')
const AWS = require('aws-sdk')
const {
  HttpResponse
} = require('aws-sdk')

AWS.config.update({
  region: 'ap-southeast-1',
})

const app = express()

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(awsServerlessExpressMiddleware.eventContext())

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.get('/api/v1/trigger', async function (req, res) {
  const body = "{\"CHARACTER_OCCUPATION_BASE_STAT\":[{\"id\":\"attack\",\"hp\":0,\"attack\":15,\"defense\":0,\"speed\":5},{\"id\":\"tanker\",\"hp\":30,\"attack\":0,\"defense\":10,\"speed\":0},{\"id\":\"mage\",\"hp\":0,\"attack\":10,\"defense\":3,\"speed\":3},{\"id\":\"support\",\"hp\":0,\"attack\":5,\"defense\":2,\"speed\":10}]}"
  const payload = {
    version: '1.0.0',
    data: JSON.parse(body)
  }

  console.log(payload);
  res.json({
    message: 'You just triggered the function!',
  });
});

app.post('/api/v1/trigger', async function (req, res) {
  const s3 = new AWS.S3({
    params: {
      Bucket: 'amplify-trigger-prod-105918-deployment/master-data'
    },
    accessKeyId: 'AKIA3E5MUNAIFR66TW4L',
    secretAccessKey: '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',
    signatureVersion: 'v4'
  })

  const data = JSON.parse(JSON.stringify(req.body));
  const payload = {
    Bucket: 'amplify-trigger-prod-105918-deployment/master-data',
    Key: 'masterdata.json',
    Body: JSON.stringify(req.body),
    ContentType: 'application/json',
    CacheControl: 'no-cache'
  }
  const result = await s3.upload(payload).promise()

  res.json({
    message: 'You just triggered the function!',
    version: req?.body?.version || 'Sub: ' + data?.version,
    result
  });
});


app.use(errMiddleware.notFoundHandler);
app.use(errMiddleware.errorHandler)

app.listen(3000, function () {
  console.log("App started")
});

module.exports = app