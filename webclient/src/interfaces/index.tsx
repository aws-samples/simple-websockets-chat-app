export interface Message {
  messageId: string;
  roomId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

type EventType = 'CONNECTIONS_COUNT_CHANGED'
  | 'MESSAGE_SENT'
  | 'CONNETION_JOINED'
  | 'CONNETION_LEFT';

export interface Event {
  meta: {
    e: EventType;
    ts: number;
  };
  data: any;
}
