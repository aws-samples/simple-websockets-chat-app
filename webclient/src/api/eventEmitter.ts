import { Event, EventType } from '../interfaces';
import log from '../helpers/log';

export const buildEvent = (e: EventType, data: any): Event => {
  const ts = new Date().getTime();
  const event: Event = { meta: { e, ts }, data };
  return event;
}

export const encodeEvent = (event: Event): string => {
  const payload = JSON.stringify({
    message: "sendmessage",
    data: JSON.stringify(event),
  });

  log('encoding payload', event);

  return payload;
}

export const decodePayload = (payload: string): Event => {
  const event = JSON.parse(payload);
  log('decoded payload', event);
  return event;
}
