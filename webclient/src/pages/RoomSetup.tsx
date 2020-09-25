import './RoomSetup.styl'
import * as React from 'react'
import { RoomSetupState } from '../interfaces'
import { RoomSetupContext, RoomSetupProvider } from '../context/roomSetupContext'

export const RoomSetupForm: React.FC = () => {
  const { roomId, welcomeMessage, setRoomSetupInfo } = React.useContext(RoomSetupContext)
  const [title, setTitle] = React.useState('')
  const [message, setMessage] = React.useState('')

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const info: RoomSetupState = {
      roomId,
      welcomeMessage: {
        ...welcomeMessage,
        title,
        message
      }
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
        <input value={title || welcomeMessage?.title} onChange={e => setTitle(e.currentTarget.value)}/>
        <label>message</label>
        <textarea value={message || welcomeMessage?.message} onChange={e => setMessage(e.currentTarget.value)}>
        </textarea>
        <div>
          <button>Save</button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export const RoomSetup: React.FC<{ roomId: string }> = ({ roomId }) => {
  return (
    <RoomSetupProvider roomId={roomId}>
      <RoomSetupForm  />
    </RoomSetupProvider>
  )
}
