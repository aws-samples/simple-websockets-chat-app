import * as React from 'react'
import uuid from '../helpers/uuid'
import { RoomState } from '../interfaces'

const DEFAULT_ROOM_STATE: RoomState = {
  roomId: undefined,
  authorId: uuid(),
  peopleInRoom: 0
};

const RoomContext = React.createContext<RoomState>(DEFAULT_ROOM_STATE)

const RoomProvider: React.FC = ({ children }) => {
  const [state, setState] = React.useState<RoomState>(DEFAULT_ROOM_STATE);
  return (
    <RoomContext.Provider value={state}>
    {children}
    </RoomContext.Provider>
  )
}

export { RoomContext, RoomProvider };
