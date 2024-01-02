import mongoose, { Schema, Types } from 'mongoose';

const fileSchema = new Schema(
  {
    filename: String,
    metadata: {
      taskId: Types.ObjectId,
      url: String,
    },
  },
  { strict: false },
);

const File = mongoose.models.File || mongoose.model('File', fileSchema, 'uploads.files');

export { File };
