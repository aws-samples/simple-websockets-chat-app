import * as React from 'react'

import noop from '../helpers/noop'

import { RoomSetupState, EventListener, RoomSetupUpdatedEvent } from '../interfaces'
import { EventContext } from './eventContext'

interface RoomSetupStateContext extends RoomSetupState {
  setRoomSetupInfo: (info: RoomSetupState) => void;
}

const DEFAULT_ROOM_SETUP_STATE_CONTEXT: RoomSetupStateContext = {
  roomId: 'ignore',
  welcomeMessage: { title: '', message: '' },
  chatFeatures: {
    shareOptionsDisabled: false,
    requiresAuthorNameToRead: false,
    requiresAuthorNameToWrite: false
  },
  setRoomSetupInfo: noop,
};

const RoomSetupContext = React.createContext<RoomSetupStateContext>(DEFAULT_ROOM_SETUP_STATE_CONTEXT);

const RoomSetupProvider: React.FC<{ roomId: string }> = ({
  roomId,
  children
}) => {
  const events = React.useContext(EventContext);
  const [info, setInfo] = React.useState<RoomSetupState>({ ...DEFAULT_ROOM_SETUP_STATE_CONTEXT, roomId })

  const setupInfoUpdatedListener: EventListener = {
    eventType: 'ROOM_SETUP_UPDATED',
    callback: ({ data }: RoomSetupUpdatedEvent) => {
      setInfo({ ...DEFAULT_ROOM_SETUP_STATE_CONTEXT, ...data })
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
