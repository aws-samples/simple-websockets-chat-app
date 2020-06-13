import '../styles/ReplyToMessage.styl'
import * as React from 'react'

import { MessagesContext } from '../context/messagesContext'

import { ReplyComponent } from './Message'
import MessageReplyEntity from '../entities/MessageReplyEntity'

const ReplyToMessage: React.FC = () => {
  const {
    selectedMessageToReplyTo: message,
    selectMessageToReplyTo
  } = React.useContext(MessagesContext);
  if (!message) return null;

  return (
    <div className="reply-to-message">
      {message && <ReplyComponent reply={new MessageReplyEntity(message, message)} />}
      <button onClick={() => selectMessageToReplyTo(undefined)}>cancel</button>
    </div>
  )
}

export default ReplyToMessage;
