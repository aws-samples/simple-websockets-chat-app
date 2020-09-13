const key = 'dilo'
const initialValue = {
  rooms: {}
}

export const getData = () => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : setData(initialValue)
  } catch (e) {
    console.error(e.message)
    return setData(initialValue)
  }
}

const setData = (data: typeof initialValue) => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return data
  } catch (e) {
    console.error(e.message)
    return data
  }
}

export const addRoom = (room: string) => {
  const data = getData()

  data.rooms = data.rooms || {}
  data.rooms[room] = true

  setData(data)
}