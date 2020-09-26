import * as React from 'react'

import noop from '../helpers/noop'
import {
  MessagesState,
  Message,
  MessageReply,
  MessageReaction,
  instanceOfMessageReaction,
} from '../interfaces'

import {
  EventListener
} from '../api/Api'

import { RoomContext } from './roomContext'
import { api } from '../api'

interface MessagesStateContext extends MessagesState {
  sendMessage: (message: Message) => void;
  sendMessageReply: (replyMessage: MessageReply) => void;
  sendMessageReaction: (reactionMessage: MessageReaction) => void;
  selectMessage: (message?: Message) => void;
  selectMessageToReplyTo: (message?: Message) => void;
  selectMessageToReactTo: (message?: Message) => void;
  deleteMessage: (message: Message) => void;
  getReactionsToMessage: (message: Message) => MessageReaction[];
}

const DEFAULT_MESSAGES_STATE_CONTEXT: MessagesStateContext = {
  messages: [],
  selectedMessage: undefined,
  selectedMessageToReplyTo: undefined,
  selectedMessageToReactTo: undefined,
  sendMessage: noop,
  sendMessageReply: noop,
  sendMessageReaction: noop,
  selectMessage: noop,
  selectMessageToReplyTo: noop,
  selectMessageToReactTo: noop,
  deleteMessage: noop,
  getReactionsToMessage: () => []
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
  const [selectedMessageToReplyTo, selectMessageToReplyTo] = React.useState<Message>();
  const [selectedMessageToReactTo, selectMessageToReactTo] = React.useState<Message>();
  const [messageReations, setMessageReactions] = React.useState<MessageReaction[]>([]);
  const events = api;
  const { roomId } = React.useContext(RoomContext);

  const setLocalMessages = (newMessages: Message[]) => {
    setMessages(currentMessages => {
      return findUnique([...currentMessages, ...newMessages])
        .filter(m => m.roomId === roomId)
        .sort((a, b) => (a.createdAt > b.createdAt) ? -1 : 1)
    })
  }

  function addToArray<T extends { roomId: string}>(item: T) {
    return (items: T[]) => {
      if (item.roomId !== roomId) return items;
      return [...items, item];
    }
  }

  const addMessageReaction = (messageReaction: MessageReaction) => addToArray<MessageReaction>(messageReaction);

  const messageReactionsChanged = (reaction: MessageReaction) => {
    setMessageReactions(addMessageReaction(reaction));
  }

  const messageSentListener: EventListener<'MESSAGE_SENT'> = {
    eventType: 'MESSAGE_SENT',
    callback: (_: Error, { data: message }) => {
      setLocalMessages([...messages, message]);
    },
  }

  const messageBatchSentListener: EventListener<'MESSAGE_BATCH_SENT'> = {
    eventType: 'MESSAGE_BATCH_SENT',
    callback: (_: Error, { data: { messages } }) => {
      messages.forEach(message => {
        if (instanceOfMessageReaction(message)) {
          messageReactionsChanged(message);
        } else {
          setLocalMessages([...messages, message]);
        }
      })
    },
  }

  const messageReplySentListener: EventListener<'MESSAGE_REPLY_SENT'> = {
    eventType: 'MESSAGE_REPLY_SENT',
    callback: (_: Error, { data: message }) => {
      setLocalMessages([...messages, message]);
    },
  }

  const messageReactionSentListener: EventListener<'MESSAGE_REACTION_SENT'> = {
    eventType: 'MESSAGE_REACTION_SENT',
    callback: (_: Error, { data: message }) => {
      messageReactionsChanged(message);
    },
  }

  const messageDeletedListener: EventListener<'MESSAGE_DELETED'> = {
    eventType: 'MESSAGE_DELETED',
    callback: (_: Error, { data: message }) => {
      setMessages(currentMessages => currentMessages.filter(
        m => m.messageId !== message.messageId
      ));
    },
  }

  React.useEffect(() => {
    events.addEventListener(messageSentListener);
    events.addEventListener(messageBatchSentListener);
    events.addEventListener(messageReplySentListener);
    events.addEventListener(messageReactionSentListener);
    events.addEventListener(messageDeletedListener);
    return () => {
      events.removeEventListener(messageSentListener);
      events.removeEventListener(messageBatchSentListener);
      events.removeEventListener(messageReplySentListener);
      events.removeEventListener(messageReactionSentListener);
      events.removeEventListener(messageDeletedListener);
    }
  }, [roomId]);

  const sendMessage = (message: Message) => {
    if (roomId) {
      events.send('MESSAGE_SENT', message);
      setLocalMessages([...messages, message]);
    }
  }

  const sendMessageReply = (message: MessageReply) => {
    if (roomId) {
      events.send('MESSAGE_REPLY_SENT', message);
      setLocalMessages([...messages, message]);
    }
  }

  const sendMessageReaction = (message: MessageReaction) => {
    if (roomId) {
      events.send('MESSAGE_REACTION_SENT', message);
      messageReactionsChanged(message);
    }
  }

  const deleteMessage = (message: Message) => {
    events.send('MESSAGE_DELETED', message);
    setLocalMessages(messages.filter(x => x !== message));
  }

  const getReactionsToMessage = (message: Message) => {
    return messageReations.filter(({ toMessageId }) => message.messageId == toMessageId);
  }

  const state: MessagesStateContext = {
    messages,
    selectedMessage,
    selectedMessageToReplyTo,
    selectedMessageToReactTo,
    sendMessage,
    sendMessageReply,
    sendMessageReaction,
    selectMessage: (message?: Message) => {
      selectMessageToReactTo(undefined);
      selectMessageToReplyTo(undefined);
      selectMessage(message);
    },
    selectMessageToReplyTo: (message?: Message) => {
      selectMessage(undefined);
      selectMessageToReactTo(undefined);
      selectMessageToReplyTo(message);
    },
    selectMessageToReactTo: (message?: Message) => {
      selectMessage(undefined);
      selectMessageToReplyTo(undefined);
      selectMessageToReactTo(message);
    },
    deleteMessage,
    getReactionsToMessage
  }

  return (
    <MessagesContext.Provider value={state}>
      {children}
    </MessagesContext.Provider>
  )
}

export { MessagesContext, MessagesProvider };
