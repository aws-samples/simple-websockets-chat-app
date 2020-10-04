import './RoomSetup.styl'
import * as React from 'react'
import { RoomSetupState, ChatFeaturesState } from '../interfaces'
import { RoomSetupContext, RoomSetupProvider } from '../context/roomSetupContext'

export const RoomSetupForm: React.FC = () => {
  const { roomId, roomName: name, welcomeMessage, chatFeatures, setRoomSetupInfo } = React.useContext(RoomSetupContext)
  const [roomName, setRoomName] = React.useState(name);
  const [welcome, setWelcome] = React.useState({
    title: welcomeMessage.title,
    message: welcomeMessage.message,
  })
  const [features, setFeatures] = React.useState<ChatFeaturesState>({
    shareOptionsDisabled: chatFeatures.shareOptionsDisabled,
    requiresAuthorNameToRead: chatFeatures.requiresAuthorNameToRead,
    requiresAuthorNameToWrite: chatFeatures.requiresAuthorNameToWrite,
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const info: RoomSetupState = {
      roomId,
      roomName,
      welcomeMessage: welcome,
      chatFeatures: features
    }
    setRoomSetupInfo(info)
  }

  React.useEffect(() => {
    if (welcomeMessage) {
      setWelcome(welcomeMessage)
    }
    if (chatFeatures) {
      setFeatures(chatFeatures)
    }
    if (name) {
      setRoomName(name)
    }
  }, [welcomeMessage, chatFeatures, name])

  return (
    <div className="room-setup">
      <h1>Set up chat room</h1>
      <form onSubmit={onSubmit}>
        <label>
          id
          <input type="text" readOnly value={roomId}/>
        </label>
        <label>
          name
          <input type="text" value={roomName} onChange={e => setRoomName(e.currentTarget.value)}/>
        </label>
        <h2>Welcome message</h2>
        <label>title</label>
        <input type="text" value={welcome.title} onChange={e => setWelcome({ ...welcome, title: e.currentTarget.value })}/>
        <label>message</label>
        <textarea value={welcome.message} onChange={e => setWelcome({ ...welcome, message: e.currentTarget.value })}>
        </textarea>
        <label>
          <input type="checkbox" checked={features.shareOptionsDisabled} onChange={() => setFeatures({...features, shareOptionsDisabled: !features.shareOptionsDisabled})} />
          Share option disabled
        </label>
        <label>
          <input type="checkbox" checked={features.requiresAuthorNameToRead} onChange={() => setFeatures({...features, requiresAuthorNameToRead: !features.requiresAuthorNameToRead})} />
          Requires Author Name to Read
        </label>
        <label>
          <input type="checkbox" checked={features.requiresAuthorNameToWrite} onChange={() => setFeatures({...features, requiresAuthorNameToWrite: !features.requiresAuthorNameToWrite})} />
          Requires Author Name to Write
        </label>
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
