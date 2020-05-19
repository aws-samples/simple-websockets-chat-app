import * as React from 'react'
import '../styles/TextBox.css'

import ShareRoom from './ShareRoom'
import SendButton from './SendButton'
import OptionsToggle from './OptionsToggle'

import uuid from '../helpers/uuid'
import { colorFromUuid, shouldUseDark } from '../helpers/color'

import { RoomContext } from '../context/roomContext'


const TextBox: React.FC = () => {
  const [text, setText] = React.useState("");
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
  const { authorId, roomId, peopleInRoom, sendMessage } = React.useContext(RoomContext);

  const onChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    setText(currentTarget.value);
  }
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text || !text.length || !roomId) {
      return;
    }
    sendMessage({
      createdAt: new Date().toISOString(),
      authorId,
      roomId,
      text,
      messageId: uuid(),
    });
    setText("");
  };

  const backgroundColor = colorFromUuid(authorId);
  const style = { backgroundColor };
  const inverted = shouldUseDark(backgroundColor);
  return (
    <div style={style}>
      {
        isOptionsOpen && roomId &&
        <ShareRoom roomId={roomId} showQr showCopyLink showNewRoom showPeopleInRoom/>
      }
      <form className="textbox" onSubmit={onSubmit}>
        <div className="textbox-ppl slide-out-top" key={peopleInRoom}>
        {peopleInRoom}
        </div>
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
