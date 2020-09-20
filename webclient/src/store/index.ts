import uuid, { UUID } from '../helpers/uuid'

const key = 'dilo'

type Data = {
  rooms: { [roomId: string]: RoomData};
}

type RoomData = {
  authorId: string;
  authorName?: string;
}

const initialValue = {
  rooms: {}
}

export const getData = (): Data => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : setData(initialValue)
  } catch (e) {
    console.error(e.message)
    return setData(initialValue)
  }
}

const setData = (data: Data): Data => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return data
  } catch (e) {
    console.error(e.message)
    return data
  }
}

export const addRoom = (roomId: string, roomData: RoomData): Data => {
  const data = getData()

  data.rooms = data.rooms || {}
  data.rooms[roomId] = roomData

  return setData(data)
}

export const getRoomData = (roomId: string): RoomData | undefined => {
  const data = getData()
  data.rooms = data.rooms || {}
  return data.rooms[roomId]
}

export const getOrInitRoomData = (roomId: string): RoomData => {
  if (getRoomData(roomId)) return getRoomData(roomId)!

  addRoom(roomId, { authorId: uuid(), authorName: undefined })
  return getRoomData(roomId)!
}
