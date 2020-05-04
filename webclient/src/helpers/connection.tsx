export const getRoomToJoin = (search: string) => {
  try {
    return new URLSearchParams(search).get("j")
  } catch (error) {
    return null
  }
}

export const connectToRoom = (serverUrl: string, room: string) => {
  try {
    const url = new URL(serverUrl);
    url.searchParams.append("j", room);
    return new WebSocket(url.toString());
  } catch (error) {
    alert(error.message);
    throw error;
  }
};

export const getRoomUrl = (room: string): string => {
  const roomUrl = new URL(window.location.href);
  roomUrl.searchParams.delete("j");
  roomUrl.searchParams.append("j", room);
  return roomUrl.toString();
};

export const getNewRoomUrl = () => {
  // in the future keep track of old
  return window.location.origin;
}

export const getQrUrl = (url: string) => {
  const data = encodeURIComponent(url);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=300x300`;
  return qrUrl;
};
