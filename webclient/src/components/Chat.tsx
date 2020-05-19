import * as React from 'react'

import { RoomContext } from '../context/roomContext'

import Messages from './Messages'
import TextBox from './TextBox'
import { PlaySoundOnNewMessage } from './PlaySoundOnNewMessage';

const Chat: React.FC = () => {
  const { authorId, messages } = React.useContext(RoomContext);

  return (
    <>
      <PlaySoundOnNewMessage />
      <Messages messages={messages} authorId={authorId} />
      <TextBox />
    </>
  );
};

export default Chat;
