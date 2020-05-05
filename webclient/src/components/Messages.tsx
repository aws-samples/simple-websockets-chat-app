import * as React from 'react'

import { Message } from '../interfaces'
import { colorFromUuid, shouldUseDark, clsn } from '../helpers/color'

interface Props {
  authorId: string;
  messages: Message[];
}

const Messages: React.FC<Props> = ({ authorId, messages }) => {
  return (
    <div className="messagesContainer">
      <ul className="messages">
        {messages.map((message) => {
          const backgroundColor = colorFromUuid(message.authorId);
          const useDark = shouldUseDark(backgroundColor);
          const style = { backgroundColor };
          const className = clsn("messageText txt", useDark && 'dark');
          return (
            <li
              key={message.id}
              className={message.authorId === authorId ? "mine" : "theirs"}
            >
              <span className={className} style={style}>
                {message.text}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Messages;
