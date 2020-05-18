import * as React from 'react'
import { render } from 'react-dom'
import App from './App'

import uuid from './helpers/uuid'
import { getRoomToJoin } from './helpers/connection'

import { ConnectionProvider } from './context/connectionContext'

import ConnectionStatus from './components/ConnectionStatus'

const roomId = getRoomToJoin(window.location.search)
const rootElement = document.getElementById("root")
const authorId = uuid()
const serverUrl = process.env.SERVER_URL

if (!serverUrl) {
  alert('Error in configuration')
  throw new Error("No serverUrl");
}

const connection = new WebSocket(serverUrl);

render(
  <ConnectionProvider connection={connection}>
    <ConnectionStatus />
    <App authorId={authorId} roomId={roomId} />
  </ConnectionProvider>,
  rootElement
)
