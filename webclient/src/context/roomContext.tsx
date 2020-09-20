import * as React from 'react'

import uuid from '../helpers/uuid'
import noop from '../helpers/noop'
import { getNewRoomUrl } from '../helpers/url'

import { RoomState, EventListener, PeopleInRoomChangedEvent } from '../interfaces'

import { EventContext } from './eventContext'
import { MessagesProvider } from './messagesContext'
import { addRoom } from '../store'

interface RoomStateContext extends RoomState {
  setAuthorName: (name?: string) => void;
  newRoomId: () => string;
  getNewRoomUrl: () => string;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

const DEFAULT_ROOM_STATE_CONTEXT: RoomStateContext = {
  roomId: undefined,
  authorId: uuid(),
  authorName: undefined,
  peopleInRoom: 0,
  newRoomId: uuid,
  getNewRoomUrl,
  joinRoom: noop,
  leaveRoom: noop,
  setAuthorName: noop,
};


const RoomContext = React.createContext<RoomStateContext>(DEFAULT_ROOM_STATE_CONTEXT);

const RoomProvider: React.FC<RoomState> = ({
  roomId: initialRoomId,
  authorId,
  authorName: initialAuthorName,
  peopleInRoom: initialPeopleInRoom,
  children
}) => {
  const [peopleInRoom, setPeopleInRoom] = React.useState(initialPeopleInRoom);
  const [roomId, setRoomId] = React.useState(initialRoomId);
  const [authorName, changeAuthorName] = React.useState<string | undefined>(initialAuthorName);

  const events = React.useContext(EventContext);

  const peopleInRoomChangedListener: EventListener = {
    eventType: 'CONNECTIONS_COUNT_CHANGED',
    callback: ({ data }: PeopleInRoomChangedEvent) => {
      setPeopleInRoom(data.connectionsCount);
    },
  }

  const joinRoom = (roomId: string) => {
    addRoom(roomId, { authorId, authorName });
    events.send('ROOM_JOINED', { roomId, authorId });
    events.addEventListener(peopleInRoomChangedListener);
    setRoomId(roomId);
  }

  const leaveRoom = (newRoomId: string) => {
    events.send('ROOM_LEFT', { roomId: newRoomId, authorId });
    events.removeEventListener(peopleInRoomChangedListener);
    setRoomId(undefined);
  }

  const setAuthorName = (authorName: string) => {
    if (roomId) {
      addRoom(roomId, { authorId, authorName });
      changeAuthorName(authorName);
    }
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
    authorName,
    peopleInRoom,
    newRoomId: uuid,
    getNewRoomUrl,
    joinRoom,
    leaveRoom,
    setAuthorName
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
