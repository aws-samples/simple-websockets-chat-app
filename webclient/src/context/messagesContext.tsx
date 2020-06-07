import * as React from 'react'

import noop from '../helpers/noop'
import {
  MessagesState,
  Message,
  MessageReply,
  EventListener,
  MessageEvent,
  MessageReplySentEvent
} from '../interfaces'

import { EventContext } from './eventContext'
import { RoomContext } from './roomContext'

interface MessagesStateContext extends MessagesState {
  sendMessage: (message: Message) => void;
  sendMessageReply: (replyMessage: MessageReply) => void;
  selectMessage: (message?: Message) => void;
  selectMessageToReply: (message?: Message) => void;
  deleteMessage: (message: Message) => void;
}

const DEFAULT_MESSAGES_STATE_CONTEXT: MessagesStateContext = {
  messages: [],
  selectedMessage: undefined,
  selectedMessageToReply: undefined,
  sendMessage: noop,
  sendMessageReply: noop,
  selectMessage: noop,
  selectMessageToReply: noop,
  deleteMessage: noop,
}

const MessagesContext = React.createContext<MessagesStateContext>(DEFAULT_MESSAGES_STATE_CONTEXT);

const sortByCreatedAt = (messages: Message[]) =>
  messages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 0));

const findUnique = (messages: Message[]): Message[] => {
  const uniqueMessages = new Map<string, Message>();
  messages.forEach(m => uniqueMessages.set(m.messageId, m))
  return Array.from(uniqueMessages.values())
}

const MessagesProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [selectedMessage, selectMessage] = React.useState<Message>();
  const [selectedMessageToReply, selectMessageToReply] = React.useState<Message>();
  const events = React.useContext(EventContext);
  const { roomId } = React.useContext(RoomContext);

  const setLocalMessages = (updateMessagesFn: (messages: Message[]) => Message[]) => {
    setMessages(messages => updateMessagesFn(sortByCreatedAt(findUnique(messages))))
  }

  const addMessage = (message: Message) => (messages: Message[]) => {
    if (message.roomId !== roomId) return messages;
    return [...messages, message]
  };
  const removeMessage = (message: Message) => (messages: Message[]) => {
    if (message.roomId !== roomId) return messages;
    return messages.filter(({messageId}) => message.messageId !== messageId)
  }

  const messageSentListener: EventListener = {
    eventType: 'MESSAGE_SENT',
    callback: ({ data: message }: MessageEvent) => {
      setLocalMessages(addMessage(message));
    },
  }

  const messageReplySentListener: EventListener = {
    eventType: 'MESSAGE_REPLY_SENT',
    callback: ({ data: message }: MessageReplySentEvent) => {
      setLocalMessages(addMessage(message));
    },
  }

  const messageDeletedListener: EventListener = {
    eventType: 'MESSAGE_DELETED',
    callback: ({ data: message }: MessageEvent) => {
      setLocalMessages(removeMessage(message));
    },
  }

  React.useEffect(() => {
    events.addEventListener(messageSentListener);
    events.addEventListener(messageReplySentListener);
    events.addEventListener(messageDeletedListener);
    return () => {
      events.removeEventListener(messageSentListener);
      events.removeEventListener(messageReplySentListener);
      events.removeEventListener(messageDeletedListener);
    }
  }, [roomId]);

  const sendMessage = (message: Message) => {
    if (roomId) {
      events.send('MESSAGE_SENT', message);
      setLocalMessages(addMessage(message));
    }
  }

  const sendMessageReply = (message: MessageReply) => {
    if (roomId) {
      events.send('MESSAGE_REPLY_SENT', message);
      setLocalMessages(addMessage(message));
    }
  }

  const deleteMessage = (message: Message) => {
    events.send('MESSAGE_DELETED', message);
    setLocalMessages(removeMessage(message));
  }

  const state: MessagesStateContext = {
    messages,
    selectedMessage,
    selectedMessageToReply,
    sendMessage,
    sendMessageReply,
    selectMessage,
    selectMessageToReply,
    deleteMessage,
  }

  return (
    <MessagesContext.Provider value={state}>
      {children}
    </MessagesContext.Provider>
  )
}

export { MessagesContext, MessagesProvider };