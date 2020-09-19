import '../styles/TextBox.css'
import * as React from 'react'

import ShareRoom from './ShareRoom'
import SendButton from './SendButton'
import OptionsToggle from './OptionsToggle'
import ReplyToMessage from './ReplyToMessage'

import { colorFromUuid, shouldUseDark } from '../helpers/color'

import { RoomContext } from '../context/roomContext'
import { ChatFeaturesContext } from '../context/chatFeaturesContext'
import { MessagesContext } from '../context/messagesContext'
import MessageEntity from '../entities/MessageEntity'
import MessageReplyEntity from '../entities/MessageReplyEntity'


const TextBox: React.FC = () => {
  const [text, setText] = React.useState("");
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
  const { authorId, roomId, peopleInRoom } = React.useContext(RoomContext);
  const {
    sendMessage,
    sendMessageReply,
    selectMessageToReplyTo,
    selectedMessageToReplyTo
  } = React.useContext(MessagesContext);
  const { canToggleOptions } = React.useContext(ChatFeaturesContext);

  if (!roomId) {
    return null
  }

  const onChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    setText(currentTarget.value);
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text || !text.length) {
      return;
    }

    const message = new MessageEntity({ roomId, authorId, text });
    if (selectedMessageToReplyTo) {
      sendMessageReply(new MessageReplyEntity(message, selectedMessageToReplyTo))
      selectMessageToReplyTo(undefined);
    } else {
      sendMessage(message);
    }

    setText("");
  };

  const backgroundColor = colorFromUuid(roomId);
  const style = { backgroundColor };
  const inverted = shouldUseDark(backgroundColor);
  const showShareRoom = canToggleOptions && (isOptionsOpen || peopleInRoom == 1);
  return (
    <div className="textbox-wrapper" style={style}>
      {
        showShareRoom && roomId &&
        <ShareRoom roomId={roomId}
          showQr
          showCopyLink
          showNewRoom
          showPeopleInRoom
          showInviteTitle
          />
      }
      <ReplyToMessage />
      <form className="textbox" onSubmit={onSubmit}>
        {peopleInRoom > 0 && (
          <div className="textbox-ppl slide-out-top" key={peopleInRoom}>
            {peopleInRoom}
          </div>
        )}
        <OptionsToggle inverted={inverted} active={showShareRoom}
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
