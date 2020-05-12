import { Event, EventType } from '../interfaces';

export const emitEvent = (connection: WebSocket, e: EventType, data: any) => {
  const ts = new Date().getTime();
  const event: Event = { meta: { e, ts }, data };
  const payload = JSON.stringify({
    message: "sendmessage",
    data: JSON.stringify(event),
  });

  if (process.env.NODE_ENV == 'development') {
    console.log('sending event', event);
  }

  connection.send(payload);
}
