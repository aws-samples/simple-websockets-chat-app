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
    return (
      <div>
        <button onClick={() => setIsOpen(true)}>set name</button>
        {authorName && authorName.length && (
          <span>{authorName}</span>
        )}
      </div>
    )
  }

  return (
    <div>
      <form onSubmit={onSave}>
        <input name="name" onChange={onChange} value={name} />
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
};

export default SetAuthorName;
