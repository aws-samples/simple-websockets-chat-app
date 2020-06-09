import '../styles/Message.styl'

import * as React from 'react'

import * as interfaces from '../interfaces';

import { RoomContext } from '../context/roomContext'
import { MessagesContext } from '../context/messagesContext'

import { colorFromUuid, shouldUseDark, clsn } from '../helpers/color'

import { MessageInteractions, Interaction } from './MessageInteractions';

interface Props {
  message: interfaces.Message;
}


export const messageFromReply = ({ roomId, toText, toAuthorId, toMessageId, createdAt }: interfaces.MessageReply): interfaces.Message => ({
  messageId: toMessageId,
  text: toText,
  authorId: toAuthorId,
  roomId: roomId,
  createdAt
})

interface MessageComponentProps extends Props {
  isReply?: boolean;
}

export const MessageComponent: React.FC<MessageComponentProps> = ({ message, isReply }) => {
  const backgroundColor = colorFromUuid(message.authorId);
  const useDark = shouldUseDark(backgroundColor);
  const style = { backgroundColor };
  return (
    <div className={clsn("message-component", isReply && 'reply')} style={style}>
      {
        interfaces.instanceOfMessageReply(message) && !isReply &&
        <MessageComponent message={messageFromReply(message)} isReply={true} />
      }
      <span className={clsn(useDark && 'dark')}>
        {message.text}
      </span>
    </div>
  )
}

export const Message: React.FC<Props> = ({ message }) => {
  const { authorId } = React.useContext(RoomContext);
  const {
    selectedMessage,
    selectMessage,
    selectMessageToReplyTo,
    deleteMessage,
  } = React.useContext(MessagesContext);

  const isMine = message.authorId === authorId;
  const isSelected = selectedMessage && message.messageId === selectedMessage.messageId;

  const onInteraction = (interaction: Interaction) => {
    switch(interaction) {
      case 'delete':
        deleteMessage(message);
        break;
      case 'reply':
        selectMessageToReplyTo(message);
        break;
      case 'react':
        selectMessageToReplyTo(message);
        break;
      default:
        throw new Error('Invalid interaction: ' + interaction);
    }

    selectMessage(undefined);
  }

  return (
    <li
      key={message.messageId}
      className={clsn('message', isMine ? "mine" : "theirs")}
      onClick={() => selectMessage(isSelected ? undefined : message)}
    >
      <MessageComponent message={message} />
      {
        isSelected &&
        <MessageInteractions onInteraction={onInteraction} reverse={isMine} />
      }
    </li>
  );
}
