import * as React from 'react'
import '../styles/MessageInteractions.styl'
import { Message } from '../interfaces'
import { clsn } from '../helpers/color';

interface Props {
  message: Message;
  reverse?: boolean;
}

export const MessageInteractions: React.FC<Props> = ({ reverse }) => {
  return (
    <div className={clsn("message-interactions", reverse && 'reverse')}>
      <button>emoji</button>
      <button>reply</button>
      <button>delete</button>
    </div>
  );
}
