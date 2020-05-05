import * as React from 'react'

import './App.css'

import NewRoom from './components/NewRoom'
import ConnectionStatus from './components/ConnectionStatus'
import Chat from './components/Chat'

import { connectToRoom } from './helpers/connection'

interface Props {
  serverUrl: string;
  authorId: string;
  roomId: string | null;
}

const App: React.FC<Props> = ({ serverUrl, authorId, roomId }) => {
  const [connection, setConnection] = React.useState<WebSocket>();
  React.useEffect(() => {
    if (roomId) {
      setConnection(connectToRoom(serverUrl, roomId));
    }
    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, []);

  if (!roomId) {
    return <NewRoom roomId={authorId} />;
  }

  if (!connection) {
    return null;
  }

  return (
    <div className="room">
      <ConnectionStatus connection={connection} />
      <Chat connection={connection} authorId={authorId} roomId={roomId} />
    </div>
  );
}

export default App;
