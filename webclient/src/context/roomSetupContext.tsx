import * as React from 'react'
import { api } from '../api';
import { EventListener } from '../api/Api';

import noop from '../helpers/noop'

import { RoomSetupState } from '../interfaces'

interface RoomSetupStateContext extends RoomSetupState {
  setRoomSetupInfo: (info: RoomSetupState) => void;
}

const DEFAULT_ROOM_SETUP_STATE_CONTEXT: RoomSetupStateContext = {
  roomId: 'ignore',
  welcomeMessage: undefined,
  setRoomSetupInfo: noop,
};

const RoomSetupContext = React.createContext<RoomSetupStateContext>(DEFAULT_ROOM_SETUP_STATE_CONTEXT);

const RoomSetupProvider: React.FC<RoomSetupState> = ({
  roomId,
  children
}) => {
  const events = api;
  const [info, setInfo] = React.useState<RoomSetupState>()

  const setupInfoUpdatedListener: EventListener<'ROOM_SETUP_UPDATED'> = {
    eventType: 'ROOM_SETUP_UPDATED',
    callback: (_: Error, { data }) => {
      setInfo(data)
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
    roomId,
    welcomeMessage: info?.welcomeMessage,
    setRoomSetupInfo
  }

  return (
    <RoomSetupContext.Provider value={state}>
      {children}
    </RoomSetupContext.Provider>
  )
}

export { RoomSetupContext, RoomSetupProvider };
