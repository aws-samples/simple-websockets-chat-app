import * as React from 'react'

import noop from '../helpers/noop'
import { MessagesState, Message, EventListener, MessageEvent } from '../interfaces'

import { EventContext } from './eventContext'
import { RoomContext } from './roomContext'

interface MessagesStateContext extends MessagesState {
  sendMessage: (message: Message) => void;
  selectMessage: (message?: Message) => void;
}

const DEFAULT_MESSAGES_STATE_CONTEXT: MessagesStateContext = {
  messages: [],
  selectedMessage: undefined,
  sendMessage: noop,
  selectMessage: noop,
}

const MessagesContext = React.createContext<MessagesStateContext>(DEFAULT_MESSAGES_STATE_CONTEXT);

const sortByCreatedAt = (messages: Message[]) =>
  messages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 0));

const MessagesProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [selectedMessage, selectMessage] = React.useState<Message>();
  const events = React.useContext(EventContext);
  const { roomId } = React.useContext(RoomContext);

  const messageSentListener: EventListener = {
    eventType: 'MESSAGE_SENT',
    callback: ({ data: message }: MessageEvent) => {
      if (message.roomId !== roomId) return;

      const isNewMessage = !messages.find(
        ({ messageId }) => messageId === message.messageId
      );
      if (isNewMessage) {
        setMessages(oldMessages => sortByCreatedAt([...oldMessages, message]));
      }
    },
  }

  React.useEffect(() => {
    events.addEventListener(messageSentListener);
    return () => events.removeEventListener(messageSentListener);
  }, [roomId]);

  const sendMessage = (message: Message) => {
    if (roomId) {
      events.send('MESSAGE_SENT', message);
      setMessages(sortByCreatedAt([...messages, message]));
    }
  }

  const state: MessagesStateContext = {
    messages,
    selectedMessage,
    sendMessage,
    selectMessage,
  }

  return (
    <MessagesContext.Provider value={state}>
      {children}
    </MessagesContext.Provider>
  )
}

export { MessagesContext, MessagesProvider };
