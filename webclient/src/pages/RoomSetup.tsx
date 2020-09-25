import './RoomSetup.styl'
import * as React from 'react'
import { RoomSetupState } from '../interfaces'

export const RoomSetup: React.FC<{ roomId: string }> = ({ roomId }) => {
  const [title, setTitle] = React.useState(roomId)
  const [message, setMessage] = React.useState('')

  const onSubmit = () => {
    const info: RoomSetupState = {
      roomId,
      welcomeMessage: {
        title,
        message
      }
    }
  }
  return (
    <div className="room-setup">
      <h1>Set up chat room</h1>
      <form onSubmit={onSubmit}>
        <label>id</label>
        <input readOnly value={roomId}/>
        <h2>Welcome message</h2>
        <label>title</label>
        <input value={title} onChange={e => setTitle(e.currentTarget.value)}/>
        <label>message</label>
        <textarea onChange={e => setMessage(e.currentTarget.value)}>
          {message}
        </textarea>
        <div>
          <button>Save</button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  )
}
