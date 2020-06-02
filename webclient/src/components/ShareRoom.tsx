import * as React from 'react'
import '../styles/ShareRoom.css'

import { getRoomUrl, getNewRoomUrl, getQrUrl } from '../helpers/connection'
import { RoomContext } from '../context/roomContext';

interface Props {
  roomId: string;
  showQr?: boolean;
  showCopyLink?: boolean;
  showJoinRoom?: boolean;
  showNewRoom?: boolean;
  showPeopleInRoom?: boolean;
  showInviteTitle?: boolean;
}

const ShareRoom: React.FC<Props> = ({ roomId, showQr, showCopyLink, showJoinRoom, showNewRoom, showPeopleInRoom, showInviteTitle }) => {
  const copyInputRef = React.useRef(null);
  const roomUrl = getRoomUrl(roomId);
  const newRoomUrl = getNewRoomUrl();
  const { peopleInRoom } = React.useContext(RoomContext);
  const copyLink = () => {
    if (copyInputRef.current) {
      copyInputRef.current.select();
      document.execCommand("copy");
    }
  };
  return (
    <div className="share-room">

      {showInviteTitle && (
        <div className="invite-title">
          <h2>Invite others</h2>
        </div>
      )}

      {showCopyLink && (
        <div className="copy-link">
          <input
            style={{ position: "absolute", left: "-9999px" }}
            type="text"
            readOnly
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
      {showQr && (
        <div className="qr-image">
          <img src={getQrUrl(roomUrl)} alt={roomUrl} />
        </div>
      )}
      {showPeopleInRoom && (
        <div className="people-in-room">
          You and {peopleInRoom < 2 ? "no one else" : (peopleInRoom - 1) + " more"} in the room
        </div>
      )}
    </div>
  );
};

export default ShareRoom
