import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom';

import App from './App'

import { Home } from './pages/Home'

import { ConnectionProvider } from './context/connectionContext'

import ConnectionStatus from './components/ConnectionStatus'
import { Rooms } from './pages/Rooms'
import { RoomSetup } from './pages/RoomSetup'
import { api } from './api';

const rootElement = document.getElementById("root")


render(
  <BrowserRouter>
    <ConnectionProvider connection={api.connection}>
      <ConnectionStatus />
      <Route exact={true} path="/" component={Home} />
      <Route
        exact={true}
        path="/o"
        render={() => <Rooms />}
      />
      <Route
        exact={true}
        path="/r/:roomId/setup"
        render={(props) => <RoomSetup roomId={props.match.params.roomId} />}
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
