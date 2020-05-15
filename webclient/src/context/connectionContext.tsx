import * as React from 'react';

import { ConnectionState } from '../interfaces'

const ConnectionContext = React.createContext<ConnectionState>({
  isConnected: false,
  isDisconnected: true,
  isConnecting: false,
});

interface Props {
  serverUrl: string;
}

const ConnectionProvider: React.FC<Props> = ({ serverUrl, children }) => {
  const [connection] = React.useState<WebSocket>(new WebSocket(serverUrl));
  const [connectionStatus, setConnectionStatus] = React.useState(connection.readyState);

  React.useEffect(() => {
    return () => connection.close();
  }, []);

  connection.onopen = () => setConnectionStatus(connection.readyState);
  connection.onclose = () => setConnectionStatus(connection.readyState);

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
