import * as React from 'react'
import { Event, EventType, EventListener } from '../interfaces'
import { buildEvent, encodeEvent, decodePayload } from '../api/eventEmitter'

interface EventContextState {
  send: (eventType: EventType, payload: any) => void;
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
  const [buffer, setBuffer] = React.useState<string[]>([]);
  const isOpen = connection.readyState == WebSocket.OPEN;

  const sendBufferedMessages = () => {
    if (buffer.length) {
      buffer.forEach(payload => connection.send(payload));
    }
    connection.removeEventListener('open', listenForConnectionOpen);
  }
  const listenForConnectionOpen = () => {
    if (isOpen) {
      return;
    }
    connection.addEventListener('open', sendBufferedMessages);
  };
  React.useEffect(listenForConnectionOpen, [isOpen, buffer]);

  const notifyEvent = (event: MessageEvent) => {
    const serverEvent = decodePayload(event.data);
    const receivedEventType = serverEvent.meta.e;
    listeners.filter(({ eventType }) => eventType == receivedEventType)
      .forEach(listener => listener.callback(serverEvent))
  };
  const listenForConnectionMessages = () => {
    connection.addEventListener('message', notifyEvent);
    return () => connection.removeEventListener('message', notifyEvent);
  }
  React.useEffect(listenForConnectionMessages, [listeners])

  const send = (eventType: EventType, payload: any) => {
    const event = buildEvent(eventType, payload);
    const data = encodeEvent(event);
    if (isOpen) {
      connection.send(data);
    } else {
      setBuffer(oldBuffer => [...oldBuffer, data]);
    }
  }

  const addEventListener = (listener: EventListener) => {
    setListeners(oldListeners => [...oldListeners, listener]);
  }

  const removeEventListener = (listener: EventListener) => {
    setListeners(oldListeners => oldListeners.filter(l => l !== listener));
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
