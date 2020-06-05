import * as React from 'react'
import uuid from '../helpers/uuid'
import { RoomState, Message, MessageEvent, EventListener, PeopleInRoomChangedEvent } from '../interfaces'

import { EventContext } from './eventContext'
import { MessagesProvider } from './messageContext'

interface RoomStateContext extends RoomState {
  newRoomId: () => string;
  getNewRoomUrl: () => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (message: Message) => void;
  selectMessage: (message?: Message) => void;
}

const getRoomUrl = (roomId: string): string => '/' + roomId;
const getNewRoomUrl = () => getRoomUrl(uuid());

const DEFAULT_ROOM_STATE_CONTEXT: RoomStateContext = {
  roomId: undefined,
  authorId: uuid(),
  peopleInRoom: 0,
  messages: [],
  selectedMessage: undefined,
  newRoomId: uuid,
  getNewRoomUrl,
  joinRoom: () => {},
  leaveRoom: () => {},
  sendMessage: () => {},
  selectMessage: () => {},
};


const RoomContext = React.createContext<RoomStateContext>(DEFAULT_ROOM_STATE_CONTEXT);

const sortByCreatedAt = (messages: Message[]) =>
  messages.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 0));

const RoomProvider: React.FC<RoomState> = ({
  roomId: initialRoomId,
  authorId,
  messages: initialMessages,
  peopleInRoom: initialPeopleInRoom,
  children
}) => {
  const [messages, setMessages] = React.useState(initialMessages);
  const [peopleInRoom, setPeopleInRoom] = React.useState(initialPeopleInRoom);
  const [roomId, setRoomId] = React.useState(initialRoomId);
  const [selectedMessage, selectMessage] = React.useState<Message>();

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
    setRoomId(roomId);
  }

  const leaveRoom = (newRoomId: string) => {
    events.send('ROOM_LEFT', { roomId: newRoomId, authorId });
    events.removeEventListener(messageSentListener);
    events.removeEventListener(peopleInRoomChangedListener);
    setRoomId(undefined);
  }

  React.useEffect(() => {
    if (!initialRoomId) {
      return;
    }

    joinRoom(initialRoomId)
    return () => leaveRoom(initialRoomId)
  }, [])

  const state: RoomStateContext = {
    roomId,
    authorId,
    messages,
    selectedMessage,
    peopleInRoom,
    newRoomId: uuid,
    getNewRoomUrl,
    joinRoom,
    leaveRoom,
    sendMessage,
    selectMessage,
  }

  return (
    <RoomContext.Provider value={state}>
      <MessagesProvider messages={messages}>
        {children}
      </MessagesProvider>
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomProvider };
