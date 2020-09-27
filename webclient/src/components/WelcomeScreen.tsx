import '../styles/WelcomeScreen.styl'
import * as React from 'react'
import { RoomSetupContext } from '../context/roomSetupContext';
import { getOrInitRoomData, appendRoomData } from '../store'


const WelcomeScreen: React.FC = () => {
  const { roomId } = React.useContext(RoomSetupContext)
  const roomData = getOrInitRoomData(roomId)
  const [closed, setClosed] = React.useState(roomData.dismissedWelcomeScreen)
  // const { title, message } = React.useContext(RoomSetupContext).welcomeMessage
  const title = 'Lisboa Central Hostel'
  const message = 'We want you to do this and that'

  React.useEffect(() => setClosed(roomData.dismissedWelcomeScreen), [roomData])

  const close = () => {
    appendRoomData(roomId, { ...roomData, dismissedWelcomeScreen: true })
    setClosed(true)
  }

  if (!title.length || !message.length) {
    return null;
  }

  if (closed) {
    return null;
  }

  return (
    <div className="welcome-screen">
        <h4>Welcome to</h4>
        <h1>{title}</h1>
        <p>{message}</p>
        <div>
          <button onClick={close}>Let's go</button>
        </div>
    </div>
  )
};

export default WelcomeScreen;
