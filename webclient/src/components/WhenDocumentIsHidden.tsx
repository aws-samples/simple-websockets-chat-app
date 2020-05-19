import * as React from 'react'
import { RoomContext } from '../context/roomContext';

const newMessageSound:string = require('../../public/sounds/new_message.mp3');

const buildTitle = (newMessages: number, originalTitle: string): string => {
  let title = newMessages + ' new message';
  title += newMessages > 1 ? 's' : '';
  title += ' - ' + originalTitle;
  return title;
}

export const WhenDocumentIsHidden = () => {
  const { messages, authorId } = React.useContext(RoomContext);
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
    if (newMessages && isEnabled) {
      const title = buildTitle(newMessages, originalTitle);
      document.title = title;
      audioEl.current && audioEl.current.play();
    }
    if (!isEnabled) {
      document.title = originalTitle;
      setLastMessageCount(otherMessagesCount);
    }
  }, [lastMessageCount, otherMessagesCount, isEnabled])

  return <audio ref={audioEl} src={newMessageSound} />
}
