import * as React from 'react'
import '../styles/MessageInteractions.styl'
import { clsn } from '../helpers/color';

export type Interaction = 'delete' | 'reply';
interface Props {
  onInteraction: (interaction: Interaction) => void;
  reverse?: boolean;
}

export const MessageInteractions: React.FC<Props> = ({ reverse, onInteraction }) => {
  const interact = (interaction: Interaction) => (event: React.MouseEvent) => {
    event.stopPropagation()
    onInteraction(interaction);
  }
  
  return (
    <div className={clsn("message-interactions", reverse && 'reverse')}>
      <button onClick={interact('delete')}>delete</button>
      <button onClick={interact('reply')}>reply</button>
    </div>
  )
}
