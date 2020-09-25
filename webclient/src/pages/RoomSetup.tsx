import './RoomSetup.styl'
import * as React from 'react'
import { RoomSetupState } from '../interfaces'
import { RoomSetupContext } from '../context/roomSetupContext'

export const RoomSetup: React.FC<{ roomId: string }> = ({ roomId }) => {
  const { welcomeMessage, setRoomSetupInfo } = React.useContext(RoomSetupContext)
  const [title, setTitle] = React.useState(welcomeMessage?.title)
  const [message, setMessage] = React.useState(welcomeMessage?.message)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    let wm = welcomeMessage
    if (title && message) {
      wm = { title, message }
    }
    const info: RoomSetupState = {
      roomId,
      welcomeMessage: wm
    }
    setRoomSetupInfo(info)
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
