import * as React from 'react'

import { Message, Event } from '../interfaces'

import Messages from './Messages'
import TextBox from './TextBox'

interface Props {
  connection: WebSocket;
  authorId: string;
  roomId: string;
}

const sortByCreatedAt = (messages: Message[]) =>
  messages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 0));


const Chat: React.FC<Props> = ({ connection, authorId, roomId }) => {
  const [messages, setMessages] = React.useState<Message[]>([]);

  const onSend = (message: Message) => {
    const event: Event = {
      meta: { e: 'MESSAGE_SENT', ts: new Date().getTime() },
      data: message
    };
    connection.send(
      JSON.stringify({
        message: "sendmessage",
        data: JSON.stringify(event),
      })
    );
    setMessages(sortByCreatedAt([...messages, message]));
  };

  React.useEffect(() => {
    connection.onmessage = (event) => {
      try {
        const receivedEvent:Event = JSON.parse(event.data);
        const eventType = receivedEvent.meta.e;
        if (eventType == 'MESSAGE_SENT') {
          const message: Message = receivedEvent.data;
          const isNewMessage = !messages.find(
            ({ messageId }) => messageId === message.messageId
          );
          if (isNewMessage) {
            setMessages(sortByCreatedAt([...messages, message]));
          }
        } else {
          console.warn('Unknown event received', receivedEvent);
        }
      } catch (e) {
        console.error("Unable to process event data", event.data);
        console.error(e);
      }
    };
  });

  return (
    <>
      <Messages messages={messages} authorId={authorId} />
      <TextBox onSend={onSend} authorId={authorId} roomId={roomId} />
    </>
  );
};

export default Chat;
