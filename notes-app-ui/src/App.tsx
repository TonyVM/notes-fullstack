import { useEffect, useState } from "react";
import "./App.css";
// import notas from "./utils/db.json";
import NoteForm from "./components/NoteForm";
import Note from "./types/Note";
import NoteList from "./components/NoteList";
import apiAcces from "./dataAccess/apiAccess";


const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const resetForm = () => {
    setTitle("");
    setContent("");
  }
  useEffect(() => {
    const allNotes = async () => {
      const response: Note[] = (await apiAcces.fetchAllNotes()) as Note[];
      if (response) {
        setNotes(response);
      } else {
        setNotes([]);
      }
    };
    allNotes();
  }, []);

  const handleSelectedNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    const updatedNote: Note =
      (await apiAcces.updateNote(selectedNote.id, title, content))
    if (!updatedNote) {
      console.error("Error updating the note");
      return;
    }
    const updatedList = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return updatedNote;
      } else {
        return note;
      }
    });
    setNotes(updatedList);
    resetForm()
    setSelectedNote(null);
  };
  const handleCancel = () => {
    resetForm()
    setSelectedNote(null);
  };

  const handleDelete = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();

    const response = await apiAcces.deleteNote(note.id);
    if ( response?.status === 204) alert("Note deleted successfully");
    const updateList = notes.filter(noteElement => {
      if ( noteElement.id !== note.id) {
        return noteElement;
      }
    });
    setNotes(updateList);
  };

  return (
    <>
      <div className="app-container">
        <NoteForm
          update={handleUpdate}
          cancel={handleCancel}
          selectedNote={selectedNote}
          title={title}
          content={content}
          setContent={setContent}
          setTitle={setTitle}
          allNotes={notes}
          setNotes={setNotes}
        />
        <NoteList
          notes={notes}
          handleSelectedNote={handleSelectedNote}
          handleDelete={handleDelete}
        />
      </div>
    </>
  );
};

export default App;
