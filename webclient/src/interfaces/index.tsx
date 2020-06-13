type Diff<T, U> = T extends U ? never : T;
export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>
export type RequiredExceptFor<T, TOptional extends keyof T> = Pick<T, Diff<keyof T, TOptional>> & Partial<T>;

export interface Message {
  messageId: string;
  roomId: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface MessageReply extends Message {
  toMessageId: string;
  toAuthorId: string;
  toText: string;
}

// emoji colon codes
export enum Reaction {
  JOY = ':joy:',
  HEARTH_EYES = ':hearth_eyes:',
  ANGRY = ':angry:',
  THUMBSUP = ':thumbsup:',
  THUMBSDOWN = ':thumbsdown:',
}
export type ReactionType = keyof typeof Reaction;

export interface MessageReaction {
  roomId: string;
  authorId: string;
  toMessageId: string;
  reaction: Reaction;
  remove?: boolean;
  createdAt: string;
}

export type EventType = 'CONNECTIONS_COUNT_CHANGED'
  | 'CONNECTION_CONNECTED'
  | 'CONNECTION_DISCONNECTED'
  | 'MESSAGE_SENT'
  | 'MESSAGE_REPLY_SENT'
  | 'MESSAGE_REACTION_SENT'
  | 'MESSAGE_DELETED'
  | 'ROOM_JOINED'
  | 'ROOM_LEFT';

export interface Event {
  meta: {
    e: EventType;
    ts: number;
  };
  data: any;
}

export interface MessageEvent extends Event {
  data: Message;
}

export interface MessageReplySentEvent extends MessageEvent {
  data: MessageReply;
}
export const instanceOfMessageReply = (message: Message): message is MessageReply => {
  return 'toMessageId' in message
}

export interface MessageReactionSentEvent {
  data: MessageReaction;
}


export interface PeopleInRoomChangedEvent extends Event {
  data: {
    roomId: string;
    connectionsCount: number;
  }
}

export interface EventListener {
  eventType: EventType;
  callback: (event: Event) => void;
}

export interface ConnectionState {
  isConnected: boolean;
  isDisconnected: boolean;
  isConnecting: boolean;
}

export interface RoomState {
  roomId?: string;
  authorId: string;
  peopleInRoom: number;
}

export interface ChatFeaturesState {
  canToggleOptions?: boolean;
}

export interface MessagesState {
  readonly messages: Message[];
  readonly selectedMessage?: Message;
  readonly selectedMessageToReplyTo?: Message;
  readonly selectedMessageToReactTo?: Message;
}
