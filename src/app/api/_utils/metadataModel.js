import mongoose from "mongoose";

const metadataSchema = new mongoose.Schema({
  
  entityType: {
    type: String,
    // enum: ["home", "results", "history", "predictions", "statistics", "tools", "privacy", "faq"],
    required: true,
  },

  title: { type: String, trim: true },
  description: { type: String, trim: true },
 keywords: { type: [String], trim: true },
  canonical: { type: String, trim: true },
  ogTitle: { type: String, trim: true },
  ogDescription: { type: String, trim: true },
  ogImageId: { type: String, trim: true },
  ogImageAlt: { type: String, trim: true },
});

export const MetadataModel =
  mongoose.models.Metadata || mongoose.model("Metadata", metadataSchema);
