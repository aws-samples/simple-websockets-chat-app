import * as React from 'react'

import { clsn } from '../helpers/color'

interface Props {
  onClick: (e: React.MouseEvent) => void;
  inverted?: boolean;
}

const SendButton: React.FC<Props> = ({ onClick, inverted }) => (
  <a href="#" className={clsn("arrow", inverted && 'dark')}
    onClick={e => {e.preventDefault(); onClick && onClick(e)}}
  >
    <span></span>
    <span></span>
  </a>
);

export default SendButton
