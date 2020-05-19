import * as React from 'react'
import uuid from '../helpers/uuid'
import { RoomState, Message, MessageEvent, EventListener, PeopleInRoomChangedEvent } from '../interfaces'

import { EventContext } from './eventContext'

interface RoomStateContext extends RoomState {
  newRoomId: () => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (message: Message) => void;
}
const DEFAULT_ROOM_STATE_CONTEXT: RoomStateContext = {
  roomId: undefined,
  authorId: uuid(),
  peopleInRoom: 0,
  messages: [],
  newRoomId: uuid,
  joinRoom: () => {},
  leaveRoom: () => {},
  sendMessage: () => {},
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

  const events = React.useContext(EventContext);

  const messageSentListener: EventListener = {
    eventType: 'MESSAGE_SENT',
    callback: ({ data: message }: MessageEvent) => {
      const isNewMessage = !messages.find(
        ({ messageId }) => messageId === message.messageId
      );
      if (isNewMessage) {
        setMessages(oldMessages => sortByCreatedAt([...oldMessages, message]));
      }
    },
  }
  const peopleInRoomChangedListener: EventListener = {
    eventType: 'CONNECTIONS_COUNT_CHANGED',
    callback: ({ data }: PeopleInRoomChangedEvent) => {
      setPeopleInRoom(data.connectionsCount);
    },
  }

  const sendMessage = (message: Message) => {
    if (roomId) {
      events.send('MESSAGE_SENT', message);
      setMessages(sortByCreatedAt([...messages, message]));
    }
  }

  const joinRoom = (roomId: string) => {
    events.send('ROOM_JOINED', { roomId, authorId });
    events.addEventListener(messageSentListener);
    events.addEventListener(peopleInRoomChangedListener);
  }

  const leaveRoom = (roomId: string) => {
    events.send('ROOM_LEFT', { roomId, authorId });
    events.removeEventListener(messageSentListener);
    events.removeEventListener(peopleInRoomChangedListener);
  }

  React.useEffect(() => {
    if (!roomId) {
      return;
    }

    joinRoom(roomId)
    return () => leaveRoom(roomId)
  }, [roomId])

  const state: RoomStateContext = {
    roomId,
    authorId,
    messages,
    peopleInRoom,
    newRoomId: uuid,
    joinRoom,
    leaveRoom,
    sendMessage,
  }

  return (
    <RoomContext.Provider value={state}>
      {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomProvider };