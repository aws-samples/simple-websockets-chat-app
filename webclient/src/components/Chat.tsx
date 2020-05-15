import * as React from 'react'

import { RoomContext } from '../context/roomContext'

import Messages from './Messages'
import TextBox from './TextBox'

const Chat: React.FC = () => {
  const { authorId, roomId, messages, sendMessage } = React.useContext(RoomContext);

  return (
    <>
      <Messages messages={messages} authorId={authorId} />
      <TextBox onSend={sendMessage} authorId={authorId} roomId={roomId} />
    </>
  );
};

export default Chat;
