import * as React from 'react'

import './App.css'

import NewRoom from './components/NewRoom'
import ConnectionStatus from './components/ConnectionStatus'
import Chat from './components/Chat'

import useConnection from './hooks/useConnection';

interface Props {
  serverUrl: string;
  authorId: string;
  roomId: string | null;
}

const App: React.FC<Props> = ({ serverUrl, authorId, roomId }) => {
  const connection = useConnection(serverUrl);

  if (!connection) {
    return null;
  }

  if (!roomId) {
    return <NewRoom roomId={authorId} />;
  }

  return (
    <div className="room">
      <ConnectionStatus connection={connection} />
      <Chat connection={connection} authorId={authorId} roomId={roomId} />
    </div>
  );
}

export default App;
