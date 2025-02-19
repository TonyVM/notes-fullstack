import { useEffect, useState } from "react";
import "./App.css";
// import notas from "./utils/db.json";
import NoteForm from "./components/NoteForm";
import Note from "./types/Note";
import axios from "axios";

const App = () => {
  
  const [notes, setNotes] = useState<Note[]>([]);
  

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const data = await axios({
          method: 'get',
          url: 'http://localhost:3000/api/notes/'
        })
        const notes: Note[] = await data.data;
        setNotes(notes)
      } catch (error) {
        console.log("Error fetching data: ", error);
        
      }
    }
    fetchData();
  }, []);

  

  const handleSelectedNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNote) return;

    try {
      const response = await axios(
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          url: `http://localhost:3000/api/notes/${selectedNote.id}`,
          data: {
            title,
            content
          }
        }
      )
      const updatedNote: Note = await response.data.note;
      const updatedList = notes.map((note) => {
        if (note.id === updatedNote.id) {
          return updatedNote;
        } else {
          return note;
        }
      });
      setNotes(updatedList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (error) {
      console.error(error);
      
    }

  };
  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const handleDelete = async (note: Note, e: React.MouseEvent) => {
    e.stopPropagation()

    try {
      await axios({
        method: 'DELETE',
        url: `http://localhost:3000/api/notes/${note.id}`

      })
      const updateList = notes.filter(noteItem => {
        return noteItem.id !== note.id
      })
      setNotes(updateList);
    } catch (error) {
      console.error(error);
      
    }
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
      </div>
    </>
  );
};

export default App;
