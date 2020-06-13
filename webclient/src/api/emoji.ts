import { Reaction } from '../interfaces';

export type Emoji = '😂' | '😍' | '😠' | '👍' | '👎';
const reactions: Map<Reaction, Emoji> = new Map();
reactions.set(Reaction.JOY, '😂')
reactions.set(Reaction.HEARTH_EYES, '😍')
reactions.set(Reaction.ANGRY, '😠')
reactions.set(Reaction.THUMBSUP, '👍')
reactions.set(Reaction.THUMBSDOWN, '👎')

export const emojiFromReaction = (reaction: Reaction) => reactions.get(reaction);
export const reactionEmojiPairs = () => Array.from(reactions, ([reaction, emoji]) => ({
  reaction, emoji
}));
