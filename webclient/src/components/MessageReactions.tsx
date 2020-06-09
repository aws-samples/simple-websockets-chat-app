import '../styles/MessageReactions.styl'
import * as React from 'react'

export type ReactionType = '😂' | '😅' | '😜' | '😍' | '😭' | '😠' | '👍' | '👎';
const reactions: ReactionType[] = ['😂', '😍', '😠', '👍', '👎'];

interface Props {
  onReaction: (reaction: ReactionType) => void;
}

const MessageReactions: React.FC<Props> = ({ onReaction }) => {
  const onClick = (reaction: ReactionType) => (event: React.MouseEvent) => {
    event.stopPropagation();
    onReaction(reaction);
  }
  return (
    <div className="message-reactions">
      {reactions.map(reaction => (
        <button key={reaction} className="reaction" onClick={onClick(reaction)}>
          {reaction}
        </button>
      ))}
    </div>
  )
}

export default MessageReactions
