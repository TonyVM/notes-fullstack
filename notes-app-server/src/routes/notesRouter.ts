import { Response, Request, Router } from "express";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

export const notesRouter: Router = Router();
const prisma = new PrismaClient({ log: ["query"] }).$extends(withAccelerate());

interface NoteRequestBody {
  title: string;
  content: string;
}

notesRouter.get("/", async (req: Request, res: Response) => {
  console.log(">>>>>>> Requesting data from GET /api/notes <<<<<<<<");
  const startTime = Date.now();
  try {
    const notes = await prisma.note.findMany( { orderBy: { id: "asc" }} );
    if (notes.length === 0) {
      res.status(404).json({ message: "No notes found" });
      return;
    }
    res.status(200).json(notes);
  } catch (error) {
    console.error("An error occurred while fetching notes", error);
    res.status(500).send({
      message: "An error occurred while fetching notes",
      error: (error as Error).message,
    });
  }
});
notesRouter.post("/", async (req: Request, res: Response) => {
  const { title, content } = req.body as NoteRequestBody;
  if (!title || !content) {
    const requiredFields = [];
    title ? "" : requiredFields.push("title required")
    content ? "" : requiredFields.push("content required")
    res.status(400).json({ message: requiredFields });
    return;
  }
  try {
    const createdNote = await prisma.note.create({
      data: { title, content },
    });

    res.status(201).json({
      message: "Note created successfully",
      note: createdNote,
    });
  } catch (error: unknown) {
    console.error("Error creating note", error);
    res.status(500).send({
      message: "An error occurred while creating note",
      error: (error as Error).message,
    });
  }
});

notesRouter.get("/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) {
    res.status(400).json({ message: "Invalid id provided" });
    return;
  }
  try {
    const note = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    })
    if (!note) {
      res.status(404).json({ message: "No note found with given id: " + id });
      return;
    }
    res.status(200).json(note);
  } catch (error) {
    console.error("An error occurred while fetching note", error);
    res.status(500).send({
      message: "An error occurred while fetching note",
      error: (error as Error).message,
    });
  }
});

notesRouter.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body as NoteRequestBody;
  if (!id || isNaN(parseInt(id))) {
    res.status(400).send("Id must be a valid number" );
    return;
  }
  console.log(title, content);
  if(Object.keys(req.body).length === 0) {
    res.status(400).send("Request body is empty" );
    return;
  }
  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingNote) {
      res.status(404).json({ message: "No note found with given id: " + id });
      return;
    }
    // console.log('====== Title:', title, 'Content:', content);
    const updateNote = await prisma.note.update({
      where: { id: parseInt(id) },
      data: { title, content },
    });
    res.status(201).json({ message: "Note updated successfully", note: updateNote });
  } catch (error: unknown) {
    console.error("An error occurred while fetching note\n", error);
    res.status(500).send({
      message: "An error occurred while fetching note",
      error: (error as Error).message,
    });
  }
});

notesRouter.delete("/:id", async (req, res) => {
  let { id } = req.params;
  if(!id || isNaN(parseInt(id))) {
    res.status(400).send("Invalid id provided" );
    return;
  }
  
  try {
    const existingNote = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });
    if (!existingNote) {
      res.status(404).json({ message: "No note found with given id: " + id });
      return;
    }
    await prisma.note.delete({ where: { id: parseInt(id) } });
    console.log('deleted note with id:', id);
    res.status(204).send("Note deleted successfully");
  } catch (error) {
    console.error("An error occurred while deleting note", error);
    res.status(500).send({
      message: "An error occurred while deleting note",
      error: (error as Error).message,
    });
  }
});
