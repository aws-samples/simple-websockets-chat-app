import { Message, MessageReaction, Reaction, RequiredExceptFor } from '../interfaces'

type MessageReactionEntityParams = RequiredExceptFor<MessageReaction, 'roomId' | 'createdAt' | 'toMessageId'>;

export default class MessageReactionEntity implements MessageReaction {
  readonly roomId: string;
  readonly authorId: string;
  readonly toMessageId: string;
  readonly createdAt: string;
  readonly reaction: Reaction;
  readonly remove?: boolean | undefined;

  constructor(messageReaction: MessageReactionEntityParams, messageWeReplyTo: Message) {
    this.authorId = messageReaction.authorId;
    this.roomId = messageWeReplyTo.roomId;
    this.reaction = messageReaction.reaction;
    this.remove = messageReaction.remove;
    this.toMessageId = messageWeReplyTo.messageId;
    this.createdAt = messageReaction.createdAt ? messageReaction.createdAt : new Date().toISOString();
  }
}
