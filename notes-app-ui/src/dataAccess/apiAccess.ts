import axios from "axios";
import Note from "../types/Note";

const apiAcces =  {
  fetchAllNotes: async () => {
    try {
      const response = await axios({
        method: "GET",
        headers: { "Content-Type": "application/json" },
        url: "http://localhost:3000/api/notes",
      });
      const notes: Note[] = await response.data;
      return notes || [];
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  updateNote: async (noteId: number, title: string, content: string) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `http://localhost:3000/api/notes/${noteId}`,
        data: {
          title,
          content
        }
      })
      const updated: Note = await response.data.note;
      return updated;
    } catch (error) {
      console.error(error);
    }
  },

  addNote: async (title: string, content: string) => {
    
    try {
      const response = await axios ({
        method: 'POST',
        url: 'http://localhost:3000/api/notes/',
        headers: {'Content-Type': 'application/json'},
        data: {
          title, content
        }
      });
      const data: object = await response.data;
      return data;
    } catch (error) {
      console.error(error)
      return undefined;
    }
  },

  deleteNote: async (noteId: number) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `http://localhost:3000/api/notes/${noteId}`
      })
      // console.log(response);
      
      return response;
    } catch (error) {
      console.error(error);
    }
  }
 
  // const updateNote = async (id: number = Infinity) => {
  //   if (!id || isNaN(id)) {
  //     return;
  //   }
  //   try {
      
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
}

export default apiAcces;
