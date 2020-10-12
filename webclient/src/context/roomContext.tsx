import * as React from 'react'

import uuid from '../helpers/uuid'
import noop from '../helpers/noop'
import { getNewRoomUrl } from '../helpers/url'

import { RoomState, EventListener, PeopleInRoomChangedEvent } from '../interfaces'

import { EventContext } from './eventContext'
import { MessagesProvider } from './messagesContext'
import { appendRoomData } from '../store'
import { RoomSetupProvider } from './roomSetupContext'

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
  initialRoomId = initialRoomId === 'whats-up-lisbon' ? 'lisboacentralhostel' : initialRoomId;
  const [roomId, setRoomId] = React.useState(initialRoomId);
  const [peopleInRoom, setPeopleInRoom] = React.useState(initialPeopleInRoom);
  const [authorName, changeAuthorName] = React.useState<string | undefined>(initialAuthorName);

  const events = React.useContext(EventContext);

  const peopleInRoomChangedListener: EventListener = {
    eventType: 'CONNECTIONS_COUNT_CHANGED',
    callback: ({ data }: PeopleInRoomChangedEvent) => {
      setPeopleInRoom(data.connectionsCount);
    },
  }

  const joinRoom = (roomId: string) => {
    appendRoomData(roomId, { authorId, authorName });
    events.send('ROOM_JOINED', { roomId, authorId });
    events.addEventListener(peopleInRoomChangedListener);
    setRoomId(roomId);
  }

  const leaveRoom = (newRoomId: string) => {
    events.send('ROOM_LEFT', { roomId: newRoomId, authorId });
    events.removeEventListener(peopleInRoomChangedListener);
    setRoomId(undefined);
  }

  const setAuthorName = (authorName?: string) => {
    if (roomId) {
      appendRoomData(roomId, { authorId, authorName });
      changeAuthorName(authorName);
    }
  }

  React.useEffect(() => {
    if (!initialRoomId) {
      return;
    }

    joinRoom(initialRoomId)
    return () => leaveRoom(initialRoomId!)
  }, [initialRoomId])

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
      <RoomSetupProvider roomId={roomId!}>
        <MessagesProvider>
          {children}
        </MessagesProvider>
      </RoomSetupProvider>
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomProvider };
