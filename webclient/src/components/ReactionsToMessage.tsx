import * as React from 'react'
import { MessageReaction } from '../interfaces'
import { Emoji, emojiFromReaction } from '../api/emoji'

interface ReactionComponentProps {
  emoji?: Emoji,
  count: number
}

const ReactionComponent: React.FC<ReactionComponentProps> = ({ emoji, count }) => {
  if (!emoji) return null;

  return (
    <div className="reaction">
      <span className="emoji">{emoji}</span>
      <span className="count">{count}</span>
    </div>
  )
}

const messageReactionsToEmojiCount = (reactions: MessageReaction[]): ReactionComponentProps[] => {
  return reactions.map(({ reaction, remove }) => ({
      emoji: emojiFromReaction(reaction),
      count: remove ? -1 : 1,
    }))
    .reduce((prev: ReactionComponentProps[], { emoji, count }) => {
      const props = prev.find(prop => prop.emoji == emoji);
      if (!props) {
         emoji && prev.push({ emoji, count })
      } else {
        props.count += count;
      }
      return prev;
    }, [])
    .filter(({ emoji, count }) => emoji && count > 0);
}

const ReactionsToMessage: React.FC<{reactions: MessageReaction[]}> = ({ reactions }) => {
  return (
    <div className="reactions-to-message">
      {
        messageReactionsToEmojiCount(reactions)
          .map(props => <ReactionComponent key={props.emoji} {...props} />)
      }
    </div>
  )
}

export default ReactionsToMessage;
