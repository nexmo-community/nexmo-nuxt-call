export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'GET') {
    const ncco = JSON.stringify([{
      action: 'talk',
      text: 'Thank you for calling my Nexmo number.'
    }])
    res
      .writeHead(200, {
        'Content-Length': Buffer.byteLength(ncco),
        'Content-Type': 'application/json'
      })
      .end(ncco)
  } else {
    res.statusCode = 200
    res.end()
  }
}
