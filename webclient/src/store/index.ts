import uuid, { UUID } from '../helpers/uuid'

const key = 'dilo'

type Data = {
  rooms: { [roomId: string]: RoomData};
}

type RoomData = {
  authorId: string;
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

export const getAuthorIdOrInit = (roomId: string): UUID => {
  const data = getData()
  const room =  data.rooms[roomId] || addRoom(roomId, { authorId: uuid() }).rooms[roomId]
  return room.authorId
}