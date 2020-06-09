import '../styles/MessageInteractions.styl'
import * as React from 'react'
import { clsn } from '../helpers/color';

export type Interaction = 'delete' | 'reply' | 'react';

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
      <button onClick={interact('react')}>:)</button>
      <button onClick={interact('reply')}>reply</button>
      <button onClick={interact('delete')}>delete</button>
    </div>
  )
}
