import * as React from 'react'

import './App.css'

import NewRoom from './components/NewRoom'

import { connectToRoom } from './helpers/connection'

interface Props {
  serverUrl: string;
  author: string;
  room: string | null;
}

const App: React.FC<Props> = ({ serverUrl, author, room }) => {
  const [connection, setConnection] = React.useState<WebSocket>();
  React.useEffect(() => {
    if (room) {
      setConnection(connectToRoom(serverUrl, room));
    }
    return () => {
      if (connection) {
        connection.close();
      }
    };
  }, []);

  if (!room) {
    return <NewRoom room={author} />;
  }

  if (!connection) {
    return null;
  }

  return (
    <div className="room">
    </div>
  );
}

export default App;
