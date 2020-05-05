import * as React from 'react'
import ShareRoom from './ShareRoom'

interface Props {
  room: string;
}

const NewRoom: React.FC<Props> = ({ room }) => (
  <div className="newRoom">
    <h1>New chat room</h1>
    <p>
      Get the others to scan this code.
      <br />
      Click on it to join the chat.
    </p>
    <ShareRoom room={room} showCopyLink showQr showJoinRoom />
  </div>
)

export default NewRoom
