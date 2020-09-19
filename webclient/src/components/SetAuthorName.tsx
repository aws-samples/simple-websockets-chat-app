import * as React from 'react'
import { RoomContext } from '../context/roomContext';

const SetAuthorName: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const {
    authorName,
    setAuthorName
  } = React.useContext(RoomContext)

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
      <input name="name" onChange={onChange} value={name} />
      <button onClick={onSave}>Save</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
};

export default SetAuthorName;
