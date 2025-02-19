import Note from "../types/Note";
import axios from "axios";
import React from "react";
import apiAcces from "../dataAccess/apiAccess";

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
  update,
}: NoteFormProps) {
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();

    const newNote: {message: string, note: Note} = await apiAcces.addNote(title, content);
    if (newNote.message === 'Note created successfully') {
      //for debugging purposes
      console.log(newNote.message); //log the message to console
      alert(newNote.message);       //show the message in an alert box
      //-----------------------
      setNotes([...allNotes, newNote.note]);  //add the new note to the notes array
      setTitle("");  //clear the title field
      setContent(""); //clear the content field
    } else {
      console.error('Error creating note');
      return;
    }
  };
  return (
    <form
      className="note-form"
      onSubmit={(e) => (selectedNote ? update(e) : handleAddNote(e))}
    >
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
      ) : (
        <button id="btnAddNote">Add note</button>
      )}
    </form>
  );
}
