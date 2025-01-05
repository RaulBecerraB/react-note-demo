import { useState,useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  const hook = () => {
    console.log('effect')
    noteService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }

  useEffect(hook, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then(response => {
        setNotes(notes.concat(response.data))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data))
      })
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  return (
    <div className='m-6 p-6 bg-white shadow-lg rounded-lg'>
      <h1 className='text-2xl font-bold mb-4'>Notes</h1>
      <div className='mb-4'>
        <button 
          className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300'
          onClick={() => setShowAll(!showAll)}
        >
          Show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul className='mb-4'>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote} className='flex flex-col space-y-4'>
        <input
          className='border border-gray-300 rounded-md p-2'
          value={newNote}
          onChange={handleNoteChange}
          placeholder='Enter a new note'
        />
        <button 
          type="submit" 
          className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300'
        >
          Save
        </button>
      </form>
    </div>
  )
}

export default App