import * as React from 'react'
import uuid from '../helpers/uuid'
import { RoomState, Message } from '../interfaces'

interface RoomStateContext extends RoomState {
  sendMessage: (message: Message) => void
}
const DEFAULT_ROOM_STATE_CONTEXT: RoomStateContext = {
  roomId: "lobby",
  authorId: uuid(),
  peopleInRoom: 0,
  messages: [],
  sendMessage: () => {}
};


const RoomContext = React.createContext<RoomStateContext>(DEFAULT_ROOM_STATE_CONTEXT);

const sortByCreatedAt = (messages: Message[]) =>
  messages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 0));

const RoomProvider: React.FC<RoomState> = ({
  roomId,
  authorId,
  messages: initialMessages,
  peopleInRoom: initialPeopleInRoom,
  children
}) => {
  const [messages, setMessages] = React.useState(initialMessages);
  const [peopleInRoom, setPeopleInRoom] = React.useState(initialPeopleInRoom);

  const sendMessage = (message: Message) => {
    const newMessages = sortByCreatedAt([...messages, message]);
    setMessages(newMessages);
  }

  const state: RoomStateContext = {
    roomId,
    authorId,
    messages,
    peopleInRoom,
    sendMessage,
  }
  return (
    <RoomContext.Provider value={state}>
    {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomProvider };
