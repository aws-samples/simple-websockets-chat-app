import * as React from 'react'

import Messages from './Messages'
import TextBox from './TextBox'
import WhenDocumentIsHidden from './WhenDocumentIsHidden';

const Chat: React.FC = () => (
  <>
    <WhenDocumentIsHidden />
    <Messages />
    <TextBox />
  </>
);

export default Chat;
