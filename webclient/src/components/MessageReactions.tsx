import '../styles/MessageReactions.styl'
import * as React from 'react'
import { Reaction } from '../interfaces';

type Emoji = '😂' | '😍' | '😠' | '👍' | '👎';
const reactions: Map<Reaction, Emoji> = new Map();
reactions.set(Reaction.JOY, '😂')
reactions.set(Reaction.HEARTH_EYES, '😍')
reactions.set(Reaction.ANGRY, '😠')
reactions.set(Reaction.THUMBSUP, '👍')
reactions.set(Reaction.THUMBSDOWN, '👎')

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
      {Array.from(reactions, ([reaction, emoji]) => (
        <button key={reaction} className="reaction" onClick={onClick(reaction)}>
          {emoji}
        </button>
      ))}
    </div>
  )
}

export default MessageReactions
