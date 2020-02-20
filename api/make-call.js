require('dotenv').config()
const Nexmo = require('nexmo')

const nexmo = new Nexmo({
  apiKey: process.env.NEXMO_API_KEY,
  apiSecret: process.env.NEXMO_API_SECRET,
  applicationId: process.env.NEXMO_APPLICATION_ID,
  privateKey: process.env.NEXMO_PRIVATE_KEY
})

export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'GET') {
    const url = new URL(req.url, `http://${req.headers.host}`)    

    nexmo.calls.create({
      to: [{
        type: 'phone',
        number: url.searchParams.get('number')
      }],
      from: {
        type: 'phone',
        number: process.env.NEXMO_NUMBER
      },
      ncco: [{
        action: 'talk',
        text: `This is a text to speech call from Nexmo. The message is: ${url.searchParams.get('text')}`
      }]
    }, (err, responseData) => {
      let message

      if (err) {
        message = JSON.stringify(err)
      } else {
        message = 'Call in progress.'
      }
      res
        .writeHead(200, {
          'Content-Length': Buffer.byteLength(message),
          'Content-Type': 'text/plain'
        })
        .end(message)
    })
  } else {
    res.statusCode = 200
    res.end()
  }
}
