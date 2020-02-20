const WebSocket = require('ws')

let websocket = {}

const wss = new WebSocket.Server({ port: 3001 })

wss.on('connection', (ws) => {
  websocket = ws
})

export default function (req, res, next) {
  console.log(req.method, req.url)
  if (req.method === 'POST') {
    const body = []
    req.on('data', (chunk) => {
      body.push(chunk)
    })
    req.on('end', () => {
      const event = JSON.parse(body)
      console.log(event)

      websocket.send(`Call from ${event.from} to ${event.to}. Status: ${event.status}`)
    })
  }

  res.statusCode = 200
  res.end()
}
