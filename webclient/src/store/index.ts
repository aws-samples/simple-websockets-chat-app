import uuid from '../helpers/uuid'

const key = 'dilo'

type Data = {
  rooms: { [roomId: string]: RoomData};
}

type RoomData = {
  authorId: string;
  authorName?: string;
  dismissedWelcomeScreen?: boolean;
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

const setRoomData = (roomId: string, roomData: RoomData) => {
  const data = getData()

  data.rooms = data.rooms || {}
  data.rooms[roomId] = roomData
  setData(data)
}

export const appendRoomData = (roomId: string, data:Partial<RoomData>) => {
  const roomData = getOrInitRoomData(roomId)
  setRoomData(roomId, { ...roomData, ...data })
}

export const getRoomData = (roomId: string): RoomData | undefined => {
  const data = getData()
  data.rooms = data.rooms || {}
  return data.rooms[roomId]
}

export const getOrInitRoomData = (roomId: string): RoomData => {
  if (getRoomData(roomId)) return getRoomData(roomId)!
  console.log('no initial data', getRoomData(roomId))
  setRoomData(roomId, { authorId: uuid(), authorName: undefined })
  return getRoomData(roomId)!
}

export const getRoomIds = (): string[] => {
  return Object.keys(getData().rooms)
}

export const getRoomIdsWithoutHome = (): string[] => {
  return getRoomIds().filter(id => id !== 'home')
}
