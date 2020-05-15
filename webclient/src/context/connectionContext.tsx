import * as React from 'react';

import { ConnectionState } from '../interfaces'
import useConnection from '../hooks/useConnection'
import { EventContext, EventProvider } from '../context/eventContext'

const ConnectionContext = React.createContext<ConnectionState>({
  isConnected: false,
  isDisconnected: true,
  isConnecting: false,
});

interface Props {
  serverUrl: string;
}

const ConnectionProvider: React.FC<Props> = ({ serverUrl, children }) => {
  const connection = useConnection(serverUrl);
  const [connectionStatus, setConnectionStatus] = React.useState(connection.readyState);

  connection.onopen = () => setConnectionStatus(connection.readyState);
  connection.onclose = () => setConnectionStatus(connection.readyState);
  
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
