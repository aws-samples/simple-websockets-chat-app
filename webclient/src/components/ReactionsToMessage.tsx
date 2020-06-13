import '../styles/ReactionsToMessage.styl'
import * as React from 'react'
import { Reaction, MessageReaction } from '../interfaces'
import { Emoji, emojiFromReaction } from '../api/emoji'

interface ReactionComponentProps {
  reaction: Reaction;
  emoji?: Emoji;
  count: number;
  onReaction?: (reaction: Reaction) => void;
}

const ReactionComponent: React.FC<ReactionComponentProps> = ({ reaction, emoji, count, onReaction }) => {
  if (!emoji) return null;

  const onClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onReaction && onReaction(reaction);
  }

  return (
    <div className="reaction" onClick={onClick}>
      <span className="emoji">{emoji}</span>
      <span className="count">{count}</span>
    </div>
  )
}

const messageReactionsToEmojiCount = (reactions: MessageReaction[]): ReactionComponentProps[] => {
  return reactions.map(({ reaction, remove }) => ({
      reaction,
      emoji: emojiFromReaction(reaction),
      count: remove ? -1 : 1,
    }))
    .reduce((prev: ReactionComponentProps[], { reaction, emoji, count }) => {
      const props = prev.find(prop => prop.emoji == emoji);
      if (!props) {
         emoji && prev.push({ reaction, emoji, count })
      } else {
        props.count += count;
      }
      return prev;
    }, [])
    .filter(({ emoji, count }) => emoji && count > 0);
}

interface Props {
  reactions: MessageReaction[];
  onReaction?: (reaction: Reaction) => void;
}
const ReactionsToMessage: React.FC<Props> = ({ reactions, onReaction }) => {
  const emojis = messageReactionsToEmojiCount(reactions);
  if (!emojis.length) return null

  return (
    <div className="reactions-to-message">
      {
        emojis.map(props => <ReactionComponent key={props.emoji} {...props} onReaction={onReaction} />)
      }
    </div>
  )
}

export default ReactionsToMessage;
