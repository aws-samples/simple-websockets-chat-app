import * as React from 'react'
import '../styles/Messages.styl'

import { MessagesContext } from '../context/messagesContext'
import { Message } from './Message';

const Messages: React.FC = () => {
  const { messages } = React.useContext(MessagesContext);
  return (
    <div className="messagesContainer">
      <ul className="messages">
        {messages.map(message => <Message key={message.messageId} message={message} />)}
      </ul>
    </div>
  );
};

export default Messages;
