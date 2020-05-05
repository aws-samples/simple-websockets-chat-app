import * as React from 'react'
import { render } from 'react-dom'
import App from './App'
import uuid from './helpers/uuid'
import { getRoomToJoin } from './helpers/connection'

const roomId = getRoomToJoin(window.location.search)
const rootElement = document.getElementById("root")
const authorId = uuid()
const serverUrl = process.env.SERVER_URL

if (!serverUrl) {
  alert('Error in configuration')
  throw new Error("No serverUrl");
}

render(
  <App serverUrl={serverUrl} authorId={authorId} roomId={roomId} />,
  rootElement
)
