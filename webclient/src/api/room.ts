import { emitEvent } from './eventEmitter'

export const joinRoom = (connection: WebSocket, roomId: string) => {
  return emitEvent(connection, "ROOM_JOINED", { roomId });
}
export const leaveRoom = (connection: WebSocket, roomId: string) => {
  return emitEvent(connection, "ROOM_LEFT", { roomId });
}
