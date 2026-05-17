import mongoose, { mongo } from "mongoose";
const { Schema } = mongoose;
const NoteSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Note",
    },

    content: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      default: "General",
    },
    // ===========this section will be created by AI response //==========================
    summary: {
      type: String,
      default: "",
    },

    actionItems: [
      {
        type: String,
      },
    ],

    suggestedTitle: {
      type: String,
      default: "",
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: false,
    },

    shareId: {
      type: String,
      default: null,
    },

    aiGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);
const Note = mongoose.model("Note", NoteSchema);
export default Note;
