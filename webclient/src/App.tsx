import './App.css'

import * as React from 'react'

import uuid from './helpers/uuid'
import Chat from './components/Chat'

import { RoomProvider } from './context/roomContext'
import { getAuthorIdOrInit } from './store'
import { Link } from 'react-router-dom'

const App: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [authorId] = React.useState(getAuthorIdOrInit(roomId));

  return (
    <RoomProvider authorId={authorId} roomId={roomId} peopleInRoom={0}>
      <div className="room">
        <div>
          <Link to="/o">
            <svg viewBox="0 0 24 24" fill="black" width="48px" height="48px"><path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
            </svg>
          </Link>
        </div>
        <Chat />
      </div>
    </RoomProvider>
  );
}

export default App;
