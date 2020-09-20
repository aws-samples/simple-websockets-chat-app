import '../styles/Message.styl'

import * as React from 'react'

import * as interfaces from '../interfaces';

import { RoomContext } from '../context/roomContext'
import { MessagesContext } from '../context/messagesContext'

import { colorFromUuid, shouldUseDark, clsn } from '../helpers/color'

import { MessageInteractions, Interaction } from './MessageInteractions';
import MessageReactions from './MessageReactions';
import ReactionsToMessage from './ReactionsToMessage';
import MessageReactionEntity from '../entities/MessageReactionEntity';

interface Props {
  message: interfaces.Message;
}

interface MessageComponentProps extends Props {
  reactions?: interfaces.MessageReaction[]
  onReaction?: (reaction: interfaces.Reaction) => void;
}


export const ReplyComponent: React.FC<{ reply: interfaces.MessageReply }> = ({ reply }) => (
  <div className="message-component-reply" style={{ background: colorFromUuid(reply.toAuthorId)}}>
    <span className={clsn('txt', shouldUseDark(colorFromUuid(reply.toAuthorId)) && 'dark')}>
      {reply.toText}
    </span>
  </div>
)

export const MessageComponent: React.FC<MessageComponentProps> = ({
  message,
  reactions,
  onReaction
}) => {
  const backgroundColor = colorFromUuid(message.authorId);
  const style = { backgroundColor };
  const className = clsn('txt', shouldUseDark(backgroundColor) && 'dark');

  return (
    <a className="message-component" style={style}>
      {
        interfaces.instanceOfMessageReply(message) && <ReplyComponent reply={message} />
      }
      { message.authorName && message.authorName.length && (
        <span className={className + " author-name"}>
          {message.authorName}
        </span>
      )}
      <span className={className}>
        {message.text}
      </span>
      {
        reactions &&
        <ReactionsToMessage reactions={reactions} onReaction={onReaction} />
      }
    </a>
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
    getReactionsToMessage
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

  const onReaction = (message: interfaces.Message, reaction: interfaces.Reaction) => {
    const lastReactionByAuthor = getReactionsToMessage(message)
      .filter(messageReaction => messageReaction.authorId === authorId && messageReaction.reaction === reaction)
      .sort((a, b) => a.createdAt < b.createdAt ? -1 : 1)
      .pop();

    const remove = lastReactionByAuthor ? !lastReactionByAuthor.remove : false;
    sendMessageReaction(new MessageReactionEntity({
      reaction,
      authorId,
      remove
    }, message));
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
      <MessageComponent message={message} reactions={getReactionsToMessage(message)} onReaction={reaction => onReaction(message, reaction)} />
      {
        showInteractions &&
        <MessageInteractions onInteraction={onInteraction} reverse={isMine} />
      }
      {
        showReactions &&
        <MessageReactions onReaction={reaction => onReaction(message, reaction)} />
      }
    </li>
  );
}
