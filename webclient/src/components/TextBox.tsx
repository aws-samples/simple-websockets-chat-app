import * as React from 'react'
import '../styles/TextBox.css'

import ShareRoom from './ShareRoom'
import SendButton from './SendButton'
import OptionsToggle from './OptionsToggle'

import uuid from '../helpers/uuid'
import { colorFromUuid, shouldUseDark } from '../helpers/color'

import { Message } from '../interfaces'

interface Props {
  authorId: string;
  roomId: string;
  onSend: (message: Message) => void;
}

const TextBox: React.FC<Props> = ({ authorId, onSend, roomId }) => {
  const [text, setText] = React.useState("");
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
  const onChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    setText(currentTarget.value);
  }
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text || !text.length) {
      return;
    }
    onSend({
      createdAt: new Date().toISOString(),
      authorId,
      roomId,
      text,
      id: uuid(),
    });
    setText("");
  };

  const backgroundColor = colorFromUuid(authorId);
  const style = { backgroundColor };
  const inverted = shouldUseDark(backgroundColor);
  return (
    <div style={style}>
      {
        isOptionsOpen &&
        <ShareRoom roomId={roomId} showQr showCopyLink showNewRoom />
      }
      <form className="textbox" onSubmit={onSubmit}>
        <OptionsToggle inverted={inverted} active={isOptionsOpen}
          onClick={() => setIsOptionsOpen(!isOptionsOpen)}
        />
        <input
          type="text"
          value={text}
          placeholder="Type your message"
          onChange={onChange}
        />
        <SendButton onClick={onSubmit} inverted={inverted} />
      </form>
    </div>
  );
};

export default TextBox;
