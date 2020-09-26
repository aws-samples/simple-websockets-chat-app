import * as React from 'react';

import { ConnectionState } from '../interfaces'

const ConnectionContext = React.createContext<ConnectionState>({
  isConnected: false,
  isDisconnected: true,
  isConnecting: false,
});

interface Props {
  connection?: WebSocket;
}

const ConnectionProvider: React.FC<Props> = ({ connection, children }) => {
  const [connectionStatus, setConnectionStatus] = React.useState(connection ? connection.readyState : null);

  if (!connection) {
    return <>{children}</>
  }

  React.useEffect(() => {
    const listener = () => setConnectionStatus(connection.readyState);
    connection.addEventListener('open', listener);
    connection.addEventListener('close', listener);
    connection.addEventListener('error', listener);
    return () => {
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
      {children}
    </ConnectionContext.Provider>
  )
}

export { ConnectionContext, ConnectionProvider };
