import * as React from 'react'

import Messages from './Messages'
import TextBox from './TextBox'
import WhenDocumentIsHidden from './WhenDocumentIsHidden'
import WelcomeScreen from './WelcomeScreen'

const Chat: React.FC = () => (
  <>
    <WhenDocumentIsHidden />
    <Messages />
    <TextBox />
    <WelcomeScreen />
  </>
);

export default Chat;
