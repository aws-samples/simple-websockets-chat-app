import '../styles/SetAuthorName.styl'
import * as React from 'react'
import { RoomContext } from '../context/roomContext';

const SetAuthorName: React.FC = () => {
  const {
    authorName,
    setAuthorName
  } = React.useContext(RoomContext)
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState(authorName);

  const onSave = () => {
    setAuthorName(name)
    setIsOpen(false)
  }

  const onCancel = () => {
    setName('')
    setIsOpen(false)
  }

  const onChange = ({ currentTarget }: React.FormEvent<HTMLInputElement>) => {
    setName(currentTarget.value);
  }

  if (!isOpen) {
    const hasName = authorName && authorName.length;
    return (
      <div className="set-author-name">
          <button className="open" onClick={() => setIsOpen(true)}>
            {!hasName && "(optional) set name"}
            {hasName && authorName}
          </button>
      </div>
    )
  }

  return (
    <div className="set-author-name">
      <form onSubmit={onSave}>
        <input name="name" onChange={onChange} value={name} />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
};

export default SetAuthorName;
