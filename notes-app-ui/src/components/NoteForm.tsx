import Note from "../types/Note";
import axios from "axios";
import React from "react";

interface NoteFormProps {
  title: string;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  allNotes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
  selectedNote: Note | null;
  cancel: () => void;
  update: (e: React.FormEvent) => void;
}

export default function NoteForm({
  title,
  content,
  setContent,
  setTitle,
  allNotes,
  setNotes,
  selectedNote,
  cancel,
  update
}: NoteFormProps) {
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await axios(
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          url: 'http://localhost:3000/api/notes/',
          data: {
            title,
            content
          }
        }
      )
      const newNote: Note = await response.data.note
      setNotes([newNote, ...allNotes]);
      setContent("");
      setTitle("");
    } catch (error) {
      console.error(error);
      
    }

  };
  return (
    <form className="note-form" onSubmit={(e) => 
      selectedNote ? update(e) : handleAddNote(e)}>
      <input
        placeholder="Note Title"
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Your note"
        rows={10}
        value={content}
        required
        onChange={(e) => setContent(e.target.value)}
      ></textarea>

      
      
      {selectedNote ? (
        <div className="edit-buttons">
          <button id="btnUpdate">Save</button>
          <button onClick={cancel}>Cancel</button>
        </div>
      ) : (<button id="btnAddNote">Add note</button>)}
    </form>
  );
}
