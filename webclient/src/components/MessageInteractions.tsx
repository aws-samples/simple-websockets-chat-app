import * as React from 'react'
import '../styles/MessageInteractions.styl'
import { clsn } from '../helpers/color';

export type Interaction = 'delete' | 'reply';
export type ReactionType = '😂' | '😅' | '😜' | '😍' | '😭' | '😠' | '👍' | '👎';

interface Props {
  onInteraction: (interaction: Interaction) => void;
  reverse?: boolean;
}

interface ReactionProps {
  reaction: ReactionType;
  onClick: (reaction: ReactionType) => void;
}

const reactions: ReactionType[] = ['😂', '😅', '😜', '😍', '😭', '😠', '👍', '👎'];

const Reaction: React.FC<ReactionProps> = ({ reaction, onClick }) => (
  <a
    href="#"
    className="reaction"
    onClick={(event: React.MouseEvent) => {
      event.preventDefault();
      onClick(reaction);
    }}>{reaction}</a>
)

export const MessageInteractions: React.FC<Props> = ({ reverse, onInteraction }) => {
  const interact = (interaction: Interaction) => (event: React.MouseEvent) => {
    event.stopPropagation()
    onInteraction(interaction);
  }
  const onReactionClicked = (reaction: ReactionType) => {
    setIsOpen(false);
    alert(reaction);
  }

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="message-interactions">
      { !isOpen && (
        <div className="reactions">
          {reactions.map(reaction => (
            <Reaction
              key={reaction}
              reaction={reaction}
              onClick={reaction => onReactionClicked(reaction)}
            />))
          }
        </div>
      )}
      <div className={clsn("interactions", reverse && 'reverse')}>
        <button onClick={(event: React.MouseEvent) => {
          event.stopPropagation();
          setIsOpen(!isOpen);
        }}>
          :)
        </button>
        <button onClick={interact('reply')}>reply</button>
        <button onClick={interact('delete')}>delete</button>
      </div>
    </div>
  )
}
