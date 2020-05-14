export interface Message {
  messageId: string;
  roomId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export type EventType = 'CONNECTIONS_COUNT_CHANGED'
  | 'CONNECTION_CONNECTED'
  | 'CONNECTION_DISCONNECTED'
  | 'MESSAGE_SENT'
  | 'ROOM_JOINED'
  | 'ROOM_LEFT';

export interface Event {
  meta: {
    e: EventType;
    ts: number;
  };
  data: any;
}

export interface ConnectionState {
  serverUrl?: string;
  connection?: WebSocket;
}

export interface RoomState {
  roomId?: string;
  authorId: string;
  peopleInRoom: number;
}
