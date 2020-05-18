import * as React from 'react';

import { logger } from '../helpers/log'

import { ConnectionState } from '../interfaces'
import { EventProvider } from '../context/eventContext'

const ConnectionContext = React.createContext<ConnectionState>({
  isConnected: false,
  isDisconnected: true,
  isConnecting: false,
});

interface Props {
  connection: WebSocket;
}

const log = logger('ConnectionProvider')
const ConnectionProvider: React.FC<Props> = ({ connection, children }) => {
  log('rendering')
  const [connectionStatus, setConnectionStatus] = React.useState(connection.readyState);

  React.useEffect(() => {
    log('adding listeners')
    const listener = () => {
      log('setting connectionStatus to ' + connection.readyState);
      setConnectionStatus(connection.readyState);
    }
    connection.addEventListener('open', listener);
    connection.addEventListener('close', listener);
    connection.addEventListener('error', listener);
    return () => {
      log('removing listeners')
      connection.removeEventListener('open', listener);
      connection.removeEventListener('close', listener);
      connection.removeEventListener('error', listener);
    }
  }, [connection])

  const state = {
    isConnected: connectionStatus == WebSocket.OPEN,
    isDisconnected: connectionStatus == WebSocket.CLOSED,
    isConnecting: connectionStatus == WebSocket.CONNECTING
  }

  return (
    <ConnectionContext.Provider value={state}>
      <EventProvider connection={connection}>
        {children}
      </EventProvider>
    </ConnectionContext.Provider>
  )
}

export { ConnectionContext, ConnectionProvider };
