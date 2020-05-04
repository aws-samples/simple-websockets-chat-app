import * as React from 'react'
import {getRoomUrl, getNewRoomUrl, getQrUrl } from '../helpers/connection'

interface Props {
  room: string;
  showQr: boolean;
  showCopyLink: boolean;
  showJoinRoom: boolean;
  showNewRoom : boolean;
}

const ShareRoom: React.FC<Props> = ({ room, showQr, showCopyLink, showJoinRoom, showNewRoom }) => {
  const copyInputRef = React.useRef(null);
  const roomUrl = getRoomUrl(room);
  const newRoomUrl = getNewRoomUrl();
  const copyLink = () => {
    if (copyInputRef.current != null) {
      copyInputRef.current.select();
      document.execCommand("copy");
    }
  };
  return (
    <div className="share-room">
      {showQr && (
        <div className="qr-image">
          <img src={getQrUrl(roomUrl)} alt={roomUrl} />
        </div>
      )}
      {showCopyLink && (
        <div className="copy-link">
          <input
            style={{ position: "absolute", left: "-9999px" }}
            type="text"
            readonly
            value={roomUrl}
            ref={copyInputRef}
          />
          <button onClick={copyLink}><a>Copy link</a></button>
        </div>
      )}
      {showJoinRoom && (
        <button><a className="join-room" href={roomUrl}>
          Join room
        </a></button>
      )}
     {showNewRoom && (
        <button><a className="create-new-room" href={newRoomUrl}>
          Create new room
        </a></button>
      )}
    </div>
  );
};

export default ShareRoom
