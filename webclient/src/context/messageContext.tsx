import * as React from 'react'

import noop from '../helpers/noop'
import { MessagesState, Message } from '../interfaces'

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

const MessagesProvider: React.FC<MessagesState> = ({
  messages: initialMessages,
  children
}) => {
  const [messages, setMessages] = React.useState(initialMessages);
  const [selectedMessage, selectMessage] = React.useState<Message>();

  const state: MessagesStateContext = {
    messages,
    selectedMessage,
    sendMessage: noop,
    selectMessage: noop,
  }

  return (
    <MessagesContext.Provider value={state}>
      {children}
    </MessagesContext.Provider>
  )
}

export { MessagesContext, MessagesProvider };
