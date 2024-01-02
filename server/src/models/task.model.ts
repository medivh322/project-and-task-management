import mongoose, { InferSchemaType } from 'mongoose';
import express from 'express';
import { GridFSBucket } from 'src';
import { File } from '@modelsfile.model';

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
});

export type TaskType = InferSchemaType<typeof TaskSchema>;

TaskSchema.pre('findOneAndDelete', async function () {
  const { _id } = this.getQuery();
  const attachments = await File.find({ 'metadata.taskId': _id }, '_id');

  if (attachments.length) {
    for (const file of attachments) {
      await GridFSBucket.delete(new mongoose.mongo.ObjectId(file._id));
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
