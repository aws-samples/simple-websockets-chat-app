import * as React from 'react'

import uuid from '../helpers/uuid'
import noop from '../helpers/noop'

import { RoomState, EventListener, PeopleInRoomChangedEvent } from '../interfaces'

import { EventContext } from './eventContext'
import { MessagesProvider } from './messagesContext'
import { addRoom } from '../store'

interface RoomStateContext extends RoomState {
  newRoomId: () => string;
  getNewRoomUrl: () => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

const getRoomUrl = (roomId: string): string => '/' + roomId;
const getNewRoomUrl = () => getRoomUrl(uuid());

const DEFAULT_ROOM_STATE_CONTEXT: RoomStateContext = {
  roomId: undefined,
  authorId: uuid(),
  peopleInRoom: 0,
  newRoomId: uuid,
  getNewRoomUrl,
  joinRoom: noop,
  leaveRoom: noop,
};


const RoomContext = React.createContext<RoomStateContext>(DEFAULT_ROOM_STATE_CONTEXT);

const RoomProvider: React.FC<RoomState> = ({
  roomId: initialRoomId,
  authorId,
  peopleInRoom: initialPeopleInRoom,
  children
}) => {
  const [peopleInRoom, setPeopleInRoom] = React.useState(initialPeopleInRoom);
  const [roomId, setRoomId] = React.useState(initialRoomId);

  const events = React.useContext(EventContext);

  const peopleInRoomChangedListener: EventListener = {
    eventType: 'CONNECTIONS_COUNT_CHANGED',
    callback: ({ data }: PeopleInRoomChangedEvent) => {
      setPeopleInRoom(data.connectionsCount);
    },
  }

  const joinRoom = (roomId: string) => {
    addRoom(roomId);
    events.send('ROOM_JOINED', { roomId, authorId });
    events.addEventListener(peopleInRoomChangedListener);
    setRoomId(roomId);
  }

  const leaveRoom = (newRoomId: string) => {
    events.send('ROOM_LEFT', { roomId: newRoomId, authorId });
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
    peopleInRoom,
    newRoomId: uuid,
    getNewRoomUrl,
    joinRoom,
    leaveRoom,
  }

  return (
    <RoomContext.Provider value={state}>
      <MessagesProvider>
        {children}
      </MessagesProvider>
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomProvider };
