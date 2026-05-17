import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
// Load env first
dotenv.config()
const app = express();
const port = process.env.PORT || 8080;
//==============models================
import User from "./models/User.js";
import Note from "./models/Note.js";
import { GenerateNoteInsights } from "./utils/groq.js";
//==============generateToken================
import generateToken from "./utils/generateToken.js";

//==============middleware================
import authFile from "./middleware/authFile.js";

//==============Database Connection================
const databaseConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Error:", error.message);
    process.exit(1);
  }
};
// connect database
databaseConnection();
//==============Middlewares================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ai-notes-workspace-eta.vercel.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
//==============================Root=Routes====================================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running good",
  });
});
//=============================Auth Routes //===================================

app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All credentials are required",
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const savedData = await User.create({
      name,
      email,
      password: hashPassword,
    });
    //res.cookie ==============================
    const token = generateToken(savedData._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const user = await User.findById(savedData._id).select("-password");
    res.status(201).json({
      success: true,
      message: "user Data successfully Saved",
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All creditional required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const userWithoutPassword = await User.findById(user._id).select(
      "-password",
    );
    res.status(200).json({
      success: true,
      message: "Successfully logged in ",
      user: userWithoutPassword,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
app.post("/auth/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
app.get("/auth/me", authFile, async (req, res) => {
  // basically we are sending a data to the backend that is guy is authenticated no
  res
    .status(200)
    .json({ success: true, message: "User is Authorized ", user: req.user });
});
////==================================================Note Route //====================================================
app.post("/notes", authFile, async (req, res) => {
  try {
    const note = await Note.create({ ...req.body, userId: req.user._id });
    res.status(201).json({
      success: true,
      message: "Notes DATA has been stored ",
      note,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
// All Notes
app.get("/notes", authFile, async (req, res) => {
  try {
    const AllNotes = await Note.find({
      // this is the user id comes from the authmiddleware
      userId: req.user._id,

      isArchived: false,
    }).sort({
      updatedAt: -1,
    });
    res.json(AllNotes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});
////==============================Search Routes //==================================================================
app.get("/notes/search", authFile, async (req, res) => {
  try {
    const { query, tag } = req.query;
    const userid = req.user._id;
    const findSearchData = await Note.find({
      userId: userid,
      $or: [
        {
          title: {
            $regex: query,
            $options: "i",
          },
        },

        {
          content: {
            $regex: query,
            $options: "i",
          },
        },

        {
          tags: tag,
        },
      ],
    });
    res.status(200).json(findSearchData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//================================AI ROUTE ==========================
app.post("/notes/:id/generate-summary", authFile, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not Found" });
    }
    //little Authentication here
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,

        message: "Unauthorized",
      });
    }
    const aiResponse = await GenerateNoteInsights({
      title: note.title,
      content: note.content,
      tags: note.tags,
      category: note.category,
    });
    note.summary = aiResponse.summary;
    note.actionItems = aiResponse.actionItems;
    note.suggestedTitle = aiResponse.suggestedTitle;
    note.aiGenerated = true;
    await note.save();
    res.status(200).json({ success: true, note });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
app.patch("/notes/:id/share", authFile, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      res.status(404).json({ success: false, message: "Note dont found" });
    }
    if (note.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }
    note.shareId = uuidv4();
    note.isPublic = true;
    await note.save();
    res.json({ success: true, shareLink: `/shared/${note.shareId}` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
//============================ Get -Archieve Note route ===============================================

// GET archived notes
app.get("/notes/archived", authFile, async (req, res) => {
  try {
    const archivedNotes = await Note.find({
      userId: req.user._id,
      isArchived: true,
    }).sort({ updatedAt: -1 });

    res.json(archivedNotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Unarchive a note
app.patch("/notes/:id/unarchive", authFile, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
      { returnDocument: "after" },
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//======================================================================================================
app.get("/notes/:id", authFile, async (req, res) => {
  try {
    const { id } = req.params;
    const SpecificNoteData = await Note.findOne({
      _id: id,
      userId: req.user._id,
    });
    if (!SpecificNoteData) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }
    res.json(SpecificNoteData);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
app.patch("/notes/:id", authFile, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findOneAndUpdate(
      {
        _id: id,
        userId: req.user._id, // these is used to update only that user data who is logged in
      },
      req.body,
      {
        new: true,
      },
    );
    res.json(note);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});
app.patch("/notes/:id/archive", authFile, async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        isArchived: req.body.isArchived,
      },
      { returnDocument: "after" }, // this line measn update the document first then return the document
    );
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.delete("/notes/:id", authFile, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteNote = await Note.findOneAndDelete({
      _id: id,
      userId: req.user._id, // again this is for delete specific route data
    });
    res.status(200).json({ message: "Data has been SuccessFully Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// =================================================DASHBOARD ROUTES============================
app.get("/dashboard/stats", authFile, async (req, res) => {
  try {
    const userId = req.user._id;
    const totalNotes = await Note.countDocuments({
      userId,
    });
    const aiUsage = await Note.countDocuments({
      userId,
      aiGenerated: true,
    });
    const recentNotes = await Note.find({
      userId,
    })
      .sort({
        updatedAt: -1,
      })
      .limit(5);
    const notes = await Note.find({
      userId,
    });
    const tagCount = {};
    notes.forEach((note) => {
      note.tags.forEach((tag) => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    const mostUsedTag =
      Object.keys(tagCount).sort((a, b) => tagCount[b] - tagCount[a])[0] ||
      null;

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const weeklyActivity = await Note.countDocuments({
      userId,
      updatedAt: {
        $gte: lastWeek,
      },
    });
    res.json({
      success: true,

      stats: {
        totalNotes,

        recentNotes,

        mostUsedTag,

        aiUsage,

        weeklyActivity,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
});
//================================Public Shared Routes================================
// as this route dont require authfile function as this is shared route
app.get("/shared/:shareId", async (req, res) => {
  try {
    // means find the note or docs where is public true and
    const note = await Note.findOne({
      shareId: req.params.shareId,
      isPublic: true,
    }).populate("userId", "name");
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Shared note not found",
      });
    }
    res.status(200).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//=========================================Server======================================================================
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
