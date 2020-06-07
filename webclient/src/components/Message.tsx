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

// const RegularMessage: React.FC<Props> = ({ message }) => {}

export const Message: React.FC<Props> = ({ message }) => {
  const { authorId } = React.useContext(RoomContext);
  const {
    selectedMessage,
    selectMessage,
    selectMessageToReply,
    deleteMessage,
  } = React.useContext(MessagesContext);

  const backgroundColor = colorFromUuid(message.authorId);
  const useDark = shouldUseDark(backgroundColor);
  const style = { backgroundColor };
  const isMine = message.authorId === authorId;
  const isSelected = selectedMessage && message.messageId === selectedMessage.messageId;

  const onInteraction = (interaction: Interaction) => {
    switch(interaction) {
      case 'delete':
        deleteMessage(message);
        break;
      case 'reply':
        selectMessageToReply(message);
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
      <div className="messageText" style={style}>
        <span className={clsn(useDark && 'dark')}>
          {message.text}
        </span>
      </div>
      {
        isSelected &&
        <MessageInteractions onInteraction={onInteraction} reverse={isMine} />
      }
    </li>
  );
}
