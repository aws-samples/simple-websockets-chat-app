import '../styles/Message.styl'

import * as React from 'react'

import * as interfaces from '../interfaces';

import { RoomContext } from '../context/roomContext'
import { MessagesContext } from '../context/messagesContext'

import { colorFromUuid, shouldUseDark, clsn } from '../helpers/color'

import { MessageInteractions, Interaction } from './MessageInteractions';
import MessageReactions from './MessageReactions';
import MessageReactionEntity from '../entities/MessageReactionEntity';

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
    <button className={clsn("message-component", isReply && 'reply')} style={style}>
      {
        interfaces.instanceOfMessageReply(message) && !isReply &&
        <MessageComponent message={messageFromReply(message)} isReply={true} />
      }
      <span className={clsn(useDark && 'dark')}>
        {message.text}
      </span>
    </button>
  )
}

const areEqual = (one: interfaces.Message, another?: interfaces.Message) => {
  if (!another) return false;
  return one.messageId === another.messageId;
}

export const Message: React.FC<Props> = ({ message }) => {
  const { authorId } = React.useContext(RoomContext);
  const {
    selectedMessage,
    selectedMessageToReactTo,
    selectMessage,
    selectMessageToReplyTo,
    selectMessageToReactTo,
    sendMessageReaction,
    deleteMessage,
  } = React.useContext(MessagesContext);

  const isMine = message.authorId === authorId;
  const showInteractions = areEqual(message, selectedMessage);
  const showReactions = !selectedMessage && areEqual(message, selectedMessageToReactTo);

  const onInteraction = (interaction: Interaction) => {
    switch(interaction) {
      case 'delete':
        deleteMessage(message);
        break;
      case 'reply':
        selectMessageToReplyTo(message);
        break;
      case 'react':
        selectMessageToReactTo(message);
        break;
      default:
        throw new Error('Invalid interaction: ' + interaction);
    }
  }

  const onReaction = (reaction: interfaces.Reaction) => {
    if (selectedMessageToReactTo) {
      sendMessageReaction(new MessageReactionEntity({
        reaction,
        authorId,
      }, selectedMessageToReactTo));
    }
    selectMessageToReactTo(undefined);
  }

  const onMessageClick = () => {
    const isReact = areEqual(message, selectedMessageToReactTo);
    const isSelected = areEqual(message, selectedMessage);
    if (isReact || isSelected) {
      selectMessage(undefined);
    } else {
      selectMessage(isSelected ? undefined : message);
    }
  }

  return (
    <li
      key={message.messageId}
      className={clsn('message', isMine ? "mine" : "theirs")}
      onClick={onMessageClick}
    >
      <MessageComponent message={message} />
      {
        showInteractions &&
        <MessageInteractions onInteraction={onInteraction} reverse={isMine} />
      }
      {
        showReactions &&
        <MessageReactions onReaction={onReaction} />
      }
    </li>
  );
}
