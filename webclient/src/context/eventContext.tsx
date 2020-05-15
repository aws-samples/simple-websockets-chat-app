import * as React from 'react'
import { Event, EventType, EventListener } from '../interfaces'
import { encodeEvent, decodePayload } from '../api/eventEmitter'
import log from '../helpers/log'

interface EventContextState {
  send: (event: Event) => void;
  addEventListener: (eventListener: EventListener) => void;
  removeEventListener: (eventListener: EventListener) => void;
}

const EventContext = React.createContext<EventContextState>({
  send: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
});

interface Props {
  connection: WebSocket;
}

const EventProvider: React.FC<Props> = ({ connection, children }) => {
  const [listeners, setListeners] = React.useState<EventListener[]>([]);

  React.useEffect(() => {
    connection.onmessage = (event: MessageEvent) => {
      const serverEvent = decodePayload(event.data);
      listeners.filter(({ eventType }) => eventType == serverEvent.meta.e)
        .forEach(listener => listener.callback(serverEvent))
    }
  }, [listeners])

  const send = (event: Event) => {
    const payload = encodeEvent(event);
    connection.send(payload);
  }

  const addEventListener = (listener: EventListener) => {
    log('adding listener', listener);
    setListeners([...listeners, listener]);
  }

  const removeEventListener = (listener: EventListener) => {
    log('removing listener', listener);
    setListeners(listeners.filter(l => l !== listener));
  }

  const state = {
    send,
    addEventListener,
    removeEventListener
  }

  return (
    <EventContext.Provider value={state}>
      {children}
    </EventContext.Provider>
  )
}

export { EventContext, EventProvider };
