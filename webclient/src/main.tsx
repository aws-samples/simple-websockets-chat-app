import * as React from 'react'
import { render } from 'react-dom'
import App from './App'
import uuid from './helpers/uuid'

const getRoomToJoin = (search: string) => {
  try {
    return new URLSearchParams(search).get("j")
  } catch (error) {
    return null
  }
}

const room = getRoomToJoin(window.location.search)
const rootElement = document.getElementById("root")
const author = uuid()
const serverUrl = process.env.SERVER_URL

if (!serverUrl) {
  alert('Error in configuration')
  throw new Error("No serverUrl");
}

render(
  <App serverUrl={serverUrl} author={author} room={room} />,
  rootElement
)
