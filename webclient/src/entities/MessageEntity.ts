import { Message, RequiredExceptFor } from '../interfaces'
import uuid from '../helpers/uuid';

type RequiredMessageEntityParams = 'messageId' | 'createdAt'
type MessageEntityParams = RequiredExceptFor<Message, RequiredMessageEntityParams>;

export default class MessageEntity implements Message {
  readonly messageId: string;

  readonly roomId: string;

  readonly authorId: string;

  readonly authorName?: string;

  readonly text: string;

  readonly createdAt: string;

  constructor(params: MessageEntityParams) {
    this.authorId = params.authorId;
    this.authorName = params.authorName;
    this.roomId = params.roomId;
    this.text = params.text;
    this.messageId = params.messageId ? params.messageId : uuid();
    this.createdAt = params.createdAt ? params.createdAt : new Date().toISOString();
  }
}
