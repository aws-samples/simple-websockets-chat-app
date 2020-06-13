import '../styles/MessageReactions.styl'
import * as React from 'react'
import { Reaction } from '../interfaces';
import { reactionEmojiPairs } from '../api/emoji'

interface Props {
  onReaction: (reaction: Reaction) => void;
}

const MessageReactions: React.FC<Props> = ({ onReaction }) => {
  const onClick = (reaction: Reaction) => (event: React.MouseEvent) => {
    event.stopPropagation();
    onReaction(reaction);
  }
  return (
    <div className="message-reactions">
      {reactionEmojiPairs().map(({reaction, emoji}) => (
        <button key={reaction} className="reaction" onClick={onClick(reaction)}>
          {emoji}
        </button>
      ))}
    </div>
  )
}

export default MessageReactions
