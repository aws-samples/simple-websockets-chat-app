import '../styles/SetAuthorName.styl'
import * as React from 'react'
import { RoomContext } from '../context/roomContext';

const SetAuthorName: React.FC<{ text: string, open?: boolean }> = ({ text, open }) => {
  const {
    authorName,
    setAuthorName
  } = React.useContext(RoomContext)
  const [isOpen, setIsOpen] = React.useState(open);
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
          <button className="clean" onClick={() => setIsOpen(true)}>
            {!hasName && text}
            {hasName && authorName}
          </button>
      </div>
    )
  }

  return (
    <div className="set-author-name">
      <form onSubmit={onSave}>
        <h4>{text}</h4>
        <input name="name" onChange={onChange} value={name} autoFocus />
        <button type="submit">Save</button>
        <button className="clean" type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  )
};

export default SetAuthorName;
