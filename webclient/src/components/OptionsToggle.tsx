import * as React from 'react'
import '../styles/OptionsToggle.css'

import { clsn } from '../helpers/color'

interface Props {
  active?: boolean;
  inverted?: boolean;
  onClick: (e: React.MouseEvent) => void;
}

const OptionsToggle: React.FC<Props> = ({ active, onClick, inverted }) => (
  <a href="#" className={clsn("txt circle", active && "active", inverted && 'dark')}
    onClick={e => {e.preventDefault(); onClick && onClick(e)}}
  >
  </a>
);

export default OptionsToggle
