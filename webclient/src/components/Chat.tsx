import * as React from 'react'

import { Message, Event } from '../interfaces'

import { broadcastMessage } from '../api/message'
import { RoomContext } from '../context/roomContext'

import Messages from './Messages'
import TextBox from './TextBox'

const Chat: React.FC = () => {
  const { authorId, roomId, messages, sendMessage } = React.useContext(RoomContext);

  // React.useEffect(() => {
  //   connection.onmessage = (event) => {
  //     try {
  //       const receivedEvent:Event = JSON.parse(event.data);
  //       const eventType = receivedEvent.meta.e;
  //       if (eventType == 'MESSAGE_SENT') {
  //         const message: Message = receivedEvent.data;
  //         const isNewMessage = !messages.find(
  //           ({ messageId }) => messageId === message.messageId
  //         );
  //         if (isNewMessage) {
  //           setMessages(sortByCreatedAt([...messages, message]));
  //         }
  //       } else {
  //         console.warn('Unknown event received', receivedEvent);
  //       }
  //     } catch (e) {
  //       console.error("Unable to process event data", event.data);
  //       console.error(e);
  //     }
  //   };
  // });

  return (
    <>
      <Messages messages={messages} authorId={authorId} />
      <TextBox onSend={sendMessage} authorId={authorId} roomId={roomId} />
    </>
  );
};

export default Chat;
