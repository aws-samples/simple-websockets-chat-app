import * as React from 'react'
import '../styles/Messages.styl'

import { RoomContext } from '../context/roomContext'
import { MessagesContext } from '../context/messagesContext'
import { colorFromUuid, shouldUseDark, clsn } from '../helpers/color'

import { MessageInteractions } from './MessageInteractions';

const Messages: React.FC = () => {
  const { authorId } = React.useContext(RoomContext);
  const { messages, selectedMessage, selectMessage } = React.useContext(MessagesContext);

  return (
    <div className="messagesContainer">
      <ul className="messages">
        {messages.map((message) => {
          const backgroundColor = colorFromUuid(message.authorId);
          const useDark = shouldUseDark(backgroundColor);
          const style = { backgroundColor };
          const className = clsn("messageText txt", useDark && 'dark');
          const isMine = message.authorId === authorId;
          const isSelected = message.messageId === selectedMessage?.messageId;
          return (
            <li
              key={message.messageId}
              className={isMine ? "mine" : "theirs"}
              onClick={() => selectMessage(message)}
            >
              <span className={className} style={style}>
                {message.text}
              </span>
              {
                isSelected &&
                <MessageInteractions message={message} reverse={isMine} />
              }
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
