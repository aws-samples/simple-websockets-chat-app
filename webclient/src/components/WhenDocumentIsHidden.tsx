import * as React from 'react'
import { RoomContext } from '../context/roomContext';
import { RoomSetupContext } from '../context/roomSetupContext';
import { MessagesContext } from '../context/messagesContext';

const newMessageSound:string = require('../../public/sounds/new_message.mp3');

const buildTitle = (newMessages: number, originalTitle: string): string => {
  let title = newMessages + ' new message';
  title += newMessages > 1 ? 's' : '';
  title += ' - ' + originalTitle;
  return title;
}

const WhenDocumentIsHidden = () => {
  const { roomName } = React.useContext(RoomSetupContext);
  const { authorId } = React.useContext(RoomContext);
  const { messages } = React.useContext(MessagesContext);
  const otherMessagesCount = messages.filter(message => message.authorId != authorId).length;

  const [lastMessageCount, setLastMessageCount] = React.useState(otherMessagesCount);
  const [isEnabled, setIsEnabled] = React.useState(document.visibilityState == 'hidden');
  const [originalTitle] = React.useState(document.title);

  const audioEl = React.useRef(null);

  React.useEffect(() => {
    const handleVisibilityChange = () => {
      setIsEnabled(document.visibilityState == 'hidden');
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.title = originalTitle;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [])

  React.useEffect(() => {
    const newMessages = otherMessagesCount - lastMessageCount;
    const title = roomName ? roomName + ' Chat' : originalTitle;
    if (newMessages && isEnabled) {
      document.title = buildTitle(newMessages, title);
      audioEl.current && audioEl.current.play();
    }
    if (!isEnabled) {
      document.title = title;
      setLastMessageCount(otherMessagesCount);
    }
  }, [lastMessageCount, otherMessagesCount, isEnabled])

  return <audio ref={audioEl} src={newMessageSound} />
}

export default WhenDocumentIsHidden;
