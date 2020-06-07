import './App.css'

import * as React from 'react'

import uuid from './helpers/uuid'
import Chat from './components/Chat'

import { RoomProvider } from './context/roomContext'

const App: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [authorId] = React.useState(uuid());

  return (
    <RoomProvider authorId={authorId} roomId={roomId} peopleInRoom={0}>
      <div className="room">
        <Chat />
      </div>
    </RoomProvider>
  );
}

export default App;
