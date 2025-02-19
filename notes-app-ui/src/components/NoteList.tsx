import React from 'react';
import Note from '../types/Note';

type NoteListProps = {
  notes: Note[];
  handleSelectedNote: (note: Note) => void;
  handleDelete: (note: Note, e: React.MouseEvent) => void;
}

export default function NoteList ({ notes, handleSelectedNote, handleDelete }: NoteListProps)  {
  return (
    <div className="notes-grid">
          {notes.map((note) => (
            <div
              className="note-item" key={note.id}
              onClick={() => {
                handleSelectedNote(note);
              }}
            >
              <div className="notes-header">
                <button
                  onClick={(e) => {
                    handleDelete(note, e)
                  }}
                >
                  x
                </button>
              </div>
              <h2>{note.title}</h2>
              <p>{note.content}</p>
            </div>
          ))}
        </div>
  )
}