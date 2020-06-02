import * as React from 'react';

import { ChatFeaturesState } from '../interfaces'

const DEFAULT_CHAT_FEATURES = {
  canToggleOptions: true
};

const ChatFeaturesContext = React.createContext<ChatFeaturesState>(DEFAULT_CHAT_FEATURES);

interface Props {
  features?: ChatFeaturesState;
}

const ChatFeaturesProvider: React.FC<Props> = ({ features, children }) => {
  const value: ChatFeaturesState = { ...DEFAULT_CHAT_FEATURES, ...features };
  return (
    <ChatFeaturesContext.Provider value={value}>
      {children}
    </ChatFeaturesContext.Provider>
  )
}

export { ChatFeaturesContext, ChatFeaturesProvider };
