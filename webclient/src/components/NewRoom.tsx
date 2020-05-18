import * as React from 'react'
import '../styles/NewRoom.css'

import ShareRoom from './ShareRoom'
import { RoomContext } from '../context/roomContext';

interface Props {
}

const NewRoom: React.FC<Props> = ({}) => {
  const { newRoomId, joinRoom, peopleInRoom } = React.useContext(RoomContext);
  const [roomId] = React.useState(newRoomId());

  React.useEffect(() => {
    joinRoom(roomId);
  }, [roomId]);

  return (
    <div className="newRoom">
    <h1>
    {peopleInRoom > 1 ? "Someone is already waiting for you!" : "You're the only one here"}
    </h1>
      <p>
      {peopleInRoom < 2 && (
        <>
        Get more people to scan this code and start an anonymous chat room.
        <br />
      </>
      )}
        You can also use the buttons to copy the link and share it.
        <br />
        Or if you are ready, just click to join the chat.
      </p>
      <ShareRoom roomId={roomId} showCopyLink showQr showJoinRoom />
    </div>
  )
}
export default NewRoom
