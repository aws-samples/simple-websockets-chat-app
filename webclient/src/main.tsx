import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom';

import App from './App'

import { Home } from './pages/Home'

import { ConnectionProvider } from './context/connectionContext'

import ConnectionStatus from './components/ConnectionStatus'
import { Rooms } from './pages/Rooms';

const rootElement = document.getElementById("root")
const serverUrl = process.env.SERVER_URL || 'wss://at7ejxghod.execute-api.eu-west-2.amazonaws.com/Prod'

if (!serverUrl) {
  alert('Error in configuration')
  throw new Error("No serverUrl");
}

const connection = new WebSocket(serverUrl);

render(
  <BrowserRouter>
    <ConnectionProvider connection={connection}>
      <ConnectionStatus />
      <Route exact={true} path="/" component={Home} />
      <Route
        exact={true}
        path="/o"
        render={(props) => <Rooms />}
      />
      <Route
        exact={true}
        path="/r/:roomId"
        render={(props) => <App roomId={props.match.params.roomId} />}
      />
    </ConnectionProvider>
  </BrowserRouter>,
  rootElement
)