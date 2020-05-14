import * as React from 'react';

import { ConnectionState } from '../interfaces'

import useConnection from '../hooks/useConnection'

const ConnectionContext = React.createContext<ConnectionState>({
  serverUrl: undefined,
  connection: undefined
});

interface Props {
  serverUrl: string;
}

const ConnectionProvider: React.FC<Props> = ({ serverUrl, children }) => {
  const connection = useConnection(serverUrl);

  return (
    <ConnectionContext.Provider value={{ serverUrl, connection }}>
      {children}
    </ConnectionContext.Provider>
  )
}

export { ConnectionContext, ConnectionProvider };
