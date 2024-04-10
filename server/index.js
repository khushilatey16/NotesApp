import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const app = express();
app.use(cors());
app.use(express.json());


//connection to mongo db
const connectDB = async () => {
  try {
      await mongoose.connect(process.env.MONGODB_URL);
      console.log("MongoDB database connected");
  } catch (error) {
      console.error("MongoDB connection error:", error);
  }
}
connectDB();


const PORT = 5000;

const notesSchema = new Schema({
  title: String,
  content: String,
  category: String
});

const Note = model("Note", notesSchema);

app.get("/health", (req, res) => {
  res.json({
    status: true,
    message: "server is running",
    data: null
  });
});

app.post("/notes", async (req, res) => {
  const { title, content, category } = req.body;

  try {
    const newNote = await Note.create({
      title: title,
      content: content,
      category: category
    });

    res.json({
      success: true,
      message: "Note added successfully",
      data: newNote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add note",
      error: error.message
    });
  }
});

app.get("/notes", async (req, res) => {
    const notes = await Note.find();
  try {
    const notes = await Note.find();
    res.json({
      success: true,
      message: "Notes fetched successfully",
      data: notes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
      error: error.message
    });
  }
});

app.get("/notes/:id",async(req,res)=>{
  const {id}= req.params;

  const note = await Note.findOne({
    _id:id
  })
    res.json({
      success:true,
      message:"Note fetched successfully",
      data:note
    })
})

//update
app.put("/notes/:id",async(req,res)=>{
  const {id}= req.params;

  const{title,content,category}= req.body;

  await Note.updateOne({_id:id},{$set: {
    title:title,
    content:content,
    category:category
  }})

  res.json({
    success:true,
    message:"Note updated successfully",
    data:null
  })
})
//delete 
app.delete("/notes/:id",async(req,res)=>{
  const {id} = req.params;

  await Note.deleteOne({_id:id})

  res.json({
    success:true,
    message:"Note deleted successfully",
    data:null
  })
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
