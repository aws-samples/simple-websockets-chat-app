import { Event, EventType } from '../interfaces';

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

  return payload;
}

export const decodePayload = (payload: string): Event => JSON.parse(payload);
