import '../styles/TextBox.css'
import * as React from 'react'

import ShareRoom from './ShareRoom'
import SendButton from './SendButton'
import OptionsToggle from './OptionsToggle'
import ReplyToMessage from './ReplyToMessage'
import SetAuthorName from './SetAuthorName'

import { colorFromUuid, shouldUseDark } from '../helpers/color'

import { RoomContext } from '../context/roomContext'
import { MessagesContext } from '../context/messagesContext'
import MessageEntity from '../entities/MessageEntity'
import MessageReplyEntity from '../entities/MessageReplyEntity'
import { RoomSetupContext } from '../context/roomSetupContext'

const TextBox: React.FC = () => {
  const [text, setText] = React.useState("");
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false);
  const { authorId, authorName, roomId, peopleInRoom } = React.useContext(RoomContext);
  const {
    sendMessage,
    sendMessageReply,
    selectMessageToReplyTo,
    selectedMessageToReplyTo
  } = React.useContext(MessagesContext);
  const { requiresAuthorNameToWrite } = React.useContext(RoomSetupContext).chatFeatures;

  const backgroundColor = colorFromUuid(roomId);
  const style = { backgroundColor };
  const inverted = shouldUseDark(backgroundColor);


  if (!roomId) {
    return null
  }

  if ((!authorName || !authorName.length) && requiresAuthorNameToWrite) {
    return (
      <div className="textbox-wrapper" style={style}>
        <SetAuthorName text="choose a name to chat" open={true} />
      </div>
    )
  }

  const onChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    setText(currentTarget.value);
  }

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text || !text.length) {
      return;
    }

    const message = new MessageEntity({ roomId, authorId, authorName, text });
    if (selectedMessageToReplyTo) {
      sendMessageReply(new MessageReplyEntity(message, selectedMessageToReplyTo))
      selectMessageToReplyTo(undefined);
    } else {
      sendMessage(message);
    }

    setText("");
  };

  return (
    <div className="textbox-wrapper" style={style}>
      {
        isOptionsOpen && roomId &&
        <ShareRoom roomId={roomId}
          showQr
          showCopyLink
          showPeopleInRoom
          showInviteTitle
          />
      }
      <ReplyToMessage />
      <SetAuthorName text={ (requiresAuthorNameToWrite ? "" : "(optional) ") + "choose a name"} />
      <form className="textbox" onSubmit={onSubmit}>
        {peopleInRoom > 0 && (
          <div className="textbox-ppl slide-out-top" key={peopleInRoom}>
            {peopleInRoom}
          </div>
        )}
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
