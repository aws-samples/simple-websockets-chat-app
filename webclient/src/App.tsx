import * as React from 'react'

import './App.css'

import NewRoom from './components/NewRoom'
import ConnectionStatus from './components/ConnectionStatus'
import Chat from './components/Chat'

import { ConnectionContext } from './context/connectionContext';
import { joinRoom } from './api/room';

interface Props {
  authorId: string;
  roomId: string | null;
}

const App: React.FC<Props> = ({ authorId, roomId }) => {
  const { connection } = React.useContext(ConnectionContext);
  React.useEffect(() => {
    if (connection && roomId) {
      joinRoom(connection, roomId);
    }
  }, [roomId, connection])

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
