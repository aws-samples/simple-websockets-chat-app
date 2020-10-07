import uuid from "./uuid";

export const getRoomUrl = (room: string): string => {
  const roomUrl = new URL(window.location.origin + `/r/` + room);
  return roomUrl.toString();
};

export const getNewRoomUrl = () => 'r/' + uuid();

export const getQrUrl = (url: string) => {
  const data = encodeURIComponent(url);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=300x300`;
  return qrUrl;
};
