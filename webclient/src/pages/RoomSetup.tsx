import './RoomSetup.styl'
import * as React from 'react'

export const RoomSetup: React.FC<{ roomId: string }> = ({ roomId }) => {
  return (
    <div className="room-setup">
      <h1>Set up chat room</h1>
      <form>
        <label>id</label>
        <input readOnly value={roomId}/>
        <label>Welcome message</label>
        <textarea></textarea>
      </form>
    </div>
  )
}
