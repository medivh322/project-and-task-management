import mongoose, { InferSchemaType } from 'mongoose';
import express from 'express';
import { GridFSBucket } from 'src';

const TaskSchema = new mongoose.Schema({
  name: String,
  status: {
    type: String,
    default: 'open',
  },
  description: { type: String, default: '' },
  category_id: mongoose.Types.ObjectId,
  project_id: mongoose.Types.ObjectId,
  date_start: { type: Date, default: Date.now },
  date_end: Date,
  date_closed: Date,
  members: [
    {
      user_id: mongoose.Types.ObjectId,
    },
  ],
  attachments: [
    {
      url: String,
      name: String,
      date_upload: { type: Date, default: Date.now },
      file_id: mongoose.Types.ObjectId,
    },
  ],
});

export type TaskType = InferSchemaType<typeof TaskSchema>;

TaskSchema.pre('findOneAndDelete', async function () {
  const { attachments } = await this.model.findOne(this.getQuery()).select('attachments');

  if (attachments.length) {
    for (const file of attachments) {
      await GridFSBucket.delete(new mongoose.mongo.ObjectId(file.file_id));
    }
  }
});

TaskSchema.pre('deleteMany', async function () {
  const tasks = await this.model.find(this.getQuery());

  if (tasks.length) {
    for (const task of tasks) {
      for (const file of task.attachments) {
        await GridFSBucket.delete(new mongoose.mongo.ObjectId(file.file_id));
      }
    }
  }
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export { Task };
