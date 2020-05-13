import { Message } from '../interfaces'
import { emitEvent } from './eventEmitter'

export const broadcastMessage = (connection: WebSocket, message: Message) => {
  emitEvent(connection, 'MESSAGE_SENT', message);
}
