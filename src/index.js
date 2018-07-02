const http = require('http')
const WebSocket = require('ws')
const clivas = require('clivas')
const printii = require('printii')(__dirname)
const clear = require('clear')

clear()
printii()

// Hide cursor.
clivas.cursor(false)

const port = process.env.PORT || 3333
const wss = new WebSocket.Server({port})

wss.on('connection', (ws) => {
  log(`Total clients: ${wss.clients.size}`)
  ws.on('message', (data) => broadcast(ws, data))
})

function broadcast (ws, data) {
  wss.clients.forEach((client) => {
    if (client === ws) return
    if (client.readyState !== WebSocket.OPEN) return
    client.send(data, (error) => {}) // eslint-disable-line
  })
}

function log (message) {
  const ts = (new Date()).toISOString()
  clivas.clear() // Always log on the same line.
  clivas.line(`{blue:${ts}:} ${message}`)
}
