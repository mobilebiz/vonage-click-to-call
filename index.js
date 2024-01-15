const { tokenGenerate } = require('@vonage/jwt')
const express = require('express')
const cors = require('cors')
const { readFileSync } = require('fs')
require('dotenv').config()

const APPLICATION_ID = process.env.APPLICATION_ID
const privateKey = readFileSync('./private.key')

const FROM_NUMBER = process.env.FROM_NUMBER
const TO_NUMBER = process.env.TO_NUMBER

const app = express()
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', async (req, res, next) => {
  try {
    res.send('public/index.html')
  } catch (error) {
    next(error)
  }
})

app.post('/event', async (req, res, next) => {
  try {
    console.log(`🐞 Event: ${JSON.stringify(req.body, null, '\t')}`)
    res.sendStatus(200)
  } catch (error) {
    next(error)
  }
})

app.post('/answer', async (req, res, next) => {
  try {
    console.log(`🐞 Answer: ${JSON.stringify(req.body, null, '\t')}`)
    res.json([ 
      { 
        "action": "talk", 
        "language": "ja-JP",
        "style": 0,
        "text": "接続します。しばらくお待ち下さい。"
      },
      { 
        "action": "connect",
        "from": FROM_NUMBER,
        "endpoint": [ 
          { "type": "phone", "number": TO_NUMBER } 
        ]
      }
    ]);
  } catch (error) {
    next(error)
  }
})

app.get('/get-token', async (req, res, next) => {
  const aclPaths = {
    "paths": {
      "/*/rtc/**": {},
      "/*/users/**": {},
      "/*/conversations/**": {},
      "/*/sessions/**": {},
      "/*/devices/**": {},
      "/*/image/**": {},
      "/*/media/**": {},
      "/*/knocking/**": {},
      "/*/legs/**": {}
    }
  }

  try {
    const token = tokenGenerate(APPLICATION_ID, privateKey, {
      //expire in 24 hours
      exp: Math.round(new Date().getTime()/1000)+86400,
      sub: "supportuser",
      acl: aclPaths,
    });
    res.json({ jwt: token })
  } catch (error) {
    console.error(`👺 ERROR: ${JSON.stringify(error, null, '\t')}`)
    res.sendStatus(401)
  }
})

app.listen(port, () => {
    console.log(`Server app listening on port ${port}`);
});