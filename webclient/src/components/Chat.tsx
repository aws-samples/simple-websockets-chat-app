import * as React from 'react'

import { Message } from '../interfaces'

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
    connection.send(
      JSON.stringify({
        message: "sendmessage",
        data: JSON.stringify(message),
      })
    );
    setMessages(sortByCreatedAt([...messages, message]));
  };

  React.useEffect(() => {
    connection.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const isNewMessage = !messages.find(
          ({ id }) => id === message.id
        );
        if (isNewMessage) {
          setMessages(sortByCreatedAt([...messages, message]));
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
