import * as React from 'react'
import { RoomContext } from '../context/roomContext';

const newMessageSound:string = require('../../public/sounds/new_message.mp3');

export const PlaySoundOnNewMessage = () => {
  const { messages, authorId } = React.useContext(RoomContext);
  const otherMessagesCount = messages.filter(message => message.authorId != authorId).length;

  const [lastMessageCount, setLastMessageCount] = React.useState(otherMessagesCount);
  const [isEnabled, setIsEnabled] = React.useState(document.visibilityState == 'hidden');

  const audioEl = React.useRef(null);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsEnabled(document.visibilityState == 'hidden');
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [])

  React.useEffect(() => {
    if (lastMessageCount < otherMessagesCount && audioEl.current && isEnabled) {
      audioEl.current.play();
      setLastMessageCount(otherMessagesCount);
    }
  }, [lastMessageCount, otherMessagesCount])

  return <audio ref={audioEl} src={newMessageSound} />
}
