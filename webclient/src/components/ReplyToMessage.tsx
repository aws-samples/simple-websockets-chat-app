import '../styles/ReplyToMessage.styl'
import * as React from 'react'

import { MessagesContext } from '../context/messagesContext'

import { MessageComponent } from './Message'

const ReplyToMessage: React.FC = () => {
  const {
    selectedMessageToReplyTo: message,
    selectMessageToReplyTo
  } = React.useContext(MessagesContext);
  if (!message) return null;

  return (
    <div className="reply-to-message">
      {message && <MessageComponent message={message} isReply={true} />}
      <button onClick={() => selectMessageToReplyTo(undefined)}>cancel</button>
    </div>
  )
}

export default ReplyToMessage;
