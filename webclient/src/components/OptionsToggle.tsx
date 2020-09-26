import * as React from 'react'
import '../styles/OptionsToggle.css'

import { clsn } from '../helpers/color'
import { RoomSetupContext } from '../context/roomSetupContext'

interface Props {
  active?: boolean;
  inverted?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const OptionsToggle: React.FC<Props> = ({ active, onClick, inverted }) => {
  const { shareOptionsDisabled } = React.useContext(RoomSetupContext).chatFeatures;

  if (shareOptionsDisabled) {
    return null;
  }

  return (
  <a href="#" className={clsn("txt circle", active && "active", inverted && 'dark')}
    onClick={e => {e.preventDefault(); onClick && onClick(e)}}
  >
  </a>
);}

export default OptionsToggle
