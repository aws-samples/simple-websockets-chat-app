import * as React from 'react'

import noop from '../helpers/noop'

import { RoomSetupState, EventListener, RoomSetupUpdatedEvent } from '../interfaces'
import { EventContext } from './eventContext'

interface RoomSetupStateContext extends RoomSetupState {
  setRoomSetupInfo: (info: RoomSetupState) => void;
}

const DEFAULT_ROOM_SETUP_STATE_CONTEXT: RoomSetupStateContext = {
  roomId: 'ignore',
  welcomeMessage: undefined,
  chatFeatures: undefined,
  setRoomSetupInfo: noop,
};

const RoomSetupContext = React.createContext<RoomSetupStateContext>(DEFAULT_ROOM_SETUP_STATE_CONTEXT);

const RoomSetupProvider: React.FC<RoomSetupState> = ({
  roomId,
  children
}) => {
  const events = React.useContext(EventContext);
  const [info, setInfo] = React.useState<RoomSetupState>({ roomId })

  const setupInfoUpdatedListener: EventListener = {
    eventType: 'ROOM_SETUP_UPDATED',
    callback: ({ data }: RoomSetupUpdatedEvent) => {
      console.log('new data', data)
      setInfo(data)
      console.log('post info')
    },
  }

  const setRoomSetupInfo = (setupInfo: RoomSetupState) => {
    events.send('ROOM_SETUP_UPDATE_REQUESTED', setupInfo);
    events.addEventListener(setupInfoUpdatedListener);
  }

  React.useEffect(() => {
    if (!roomId) {
      return;
    }

    events.addEventListener(setupInfoUpdatedListener);
    events.send('ROOM_SETUP_LOAD', { roomId });
    return () => events.removeEventListener(setupInfoUpdatedListener);
  }, [roomId])

  const state: RoomSetupStateContext = {
    ...info,
    setRoomSetupInfo
  }

  return (
    <RoomSetupContext.Provider value={state}>
      {children}
    </RoomSetupContext.Provider>
  )
}

export { RoomSetupContext, RoomSetupProvider };
