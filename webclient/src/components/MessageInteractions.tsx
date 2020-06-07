import * as React from 'react'
import '../styles/MessageInteractions.styl'
import { Message } from '../interfaces'
import { clsn } from '../helpers/color';
import { MessagesContext } from '../context/messagesContext';

interface Props {
  message: Message;
  reverse?: boolean;
}

export const MessageInteractions: React.FC<Props> = ({ reverse, message }) => {
  const { deleteMessage, selectMessageToReply } = React.useContext(MessagesContext);
  return (
    <div className={clsn("message-interactions", reverse && 'reverse')}>
      <button onClick={() => deleteMessage(message)}>delete</button>
      <button onClick={() => selectMessageToReply(message)}>reply</button>
    </div>
  );
}
