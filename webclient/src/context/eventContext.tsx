import * as React from 'react'
import { Event, EventType, EventListener } from '../interfaces'
import { encodeEvent, decodePayload } from '../api/eventEmitter'
import { logger } from '../helpers/log'

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

const log = logger('EventProvider');

const EventProvider: React.FC<Props> = ({ connection, children }) => {
  log('rendering')
  const [listeners, setListeners] = React.useState<EventListener[]>([]);
  const [buffer, setBuffer] = React.useState<string[]>([]);
  log(buffer);
  const isOpen = connection.readyState == WebSocket.OPEN;

  React.useEffect(() => {
    log('mounted')
    return () => log('unmounting')
  }, [])

  React.useEffect(() => {
    if (isOpen) {
      if (buffer.length) {
        log('sending buffered payload')
        buffer.forEach(payload => connection.send(payload))
      }

      return;
    }

    const openListener = () => {
      log('connection open. buffer size ' + buffer.length);
      if (buffer.length) {
        log('sending ' + buffer.length + ' buffered messages');
        buffer.forEach(payload => connection.send(payload))
      }
      log('removing open listener');
      connection.removeEventListener('open', openListener)
    };

    log('adding openListener');
    connection.addEventListener('open', openListener);
  }, [isOpen])

  React.useEffect(() => {
    log('adding messageListener');
    const messageListener = (event: MessageEvent) => {
      const serverEvent = decodePayload(event.data);
      listeners.filter(({ eventType }) => eventType == serverEvent.meta.e)
        .forEach(listener => listener.callback(serverEvent))
    };
    connection.addEventListener('message', messageListener);

    return () => {
      log('removing message listener, buffer size: ' + buffer.length);
      connection.removeEventListener('message', messageListener);
    }
  }, [listeners])

  const send = (event: Event) => {
    log('sending', event);
    const payload = encodeEvent(event);
    if (isOpen) {
      connection.send(payload);
    } else {
      log('buffering...');
      setBuffer([...buffer, payload]);
    }
  }

  const addEventListener = (listener: EventListener) => {
    log('registering listener', listener);
    setListeners([...listeners, listener]);
  }

  const removeEventListener = (listener: EventListener) => {
    log('unregistering listener', listener);
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
