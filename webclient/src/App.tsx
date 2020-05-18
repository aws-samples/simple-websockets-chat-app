import * as React from 'react'

import './App.css'

import NewRoom from './components/NewRoom'
import Chat from './components/Chat'

import { RoomProvider } from './context/roomContext'

interface Props {
  authorId: string;
  roomId: string | null;
}

const App: React.FC<Props> = ({ authorId, roomId }) => {
  if (!roomId) {
    return <NewRoom roomId={authorId} />;
  }

  return (
    <RoomProvider authorId={authorId} roomId={roomId} messages={[]} peopleInRoom={0}>
      <div className="room">
        <Chat />
      </div>
    </RoomProvider>
  );
}

export default App;
