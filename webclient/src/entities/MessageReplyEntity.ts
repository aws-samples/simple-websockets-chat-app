import { Message, MessageReply } from '../interfaces'
import MessageEntity from './MessageEntity'

export default class MessageReplyEntity extends MessageEntity implements MessageReply {
  readonly toMessageId: string;
  readonly toAuthorId: string;
  readonly toText: string;

  constructor(ourReply: Message, messageWeReplyTo: Message) {
    super(ourReply);
    this.toMessageId = messageWeReplyTo.messageId;
    this.toAuthorId = messageWeReplyTo.authorId;
    this.toText = messageWeReplyTo.text;
  }
}
