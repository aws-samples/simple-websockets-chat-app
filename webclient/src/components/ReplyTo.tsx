import * as React from 'react'

import { MessagesContext } from '../context/messagesContext'
import { colorFromUuid } from '../helpers/color';

export default () => {
  const { selectedMessageToReply } = React.useContext(MessagesContext);
  
  if (!selectedMessageToReply) {
    return null;
  }

  return (
    <div>
      <b>Replying to: </b>
      <span style={{ backgroundColor: colorFromUuid(selectedMessageToReply.authorId)}}>
        {selectedMessageToReply.text}
      </span>
    </div>
  )
}
