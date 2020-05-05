import * as React from 'react'
import ShareRoom from './ShareRoom'

interface Props {
  roomId: string;
}

const NewRoom: React.FC<Props> = ({ roomId }) => (
  <div className="newRoom">
    <h1>New chat room</h1>
    <p>
      Get the others to scan this code.
      <br />
      Click on it to join the chat.
    </p>
    <ShareRoom roomId={roomId} showCopyLink showQr showJoinRoom />
  </div>
)

export default NewRoom
