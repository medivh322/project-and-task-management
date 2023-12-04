import { Task } from '@modelstask.model';
import express from 'express';
import mongoose from 'mongoose';
import { GridFSBucket } from 'src';

const taskCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { categoryId, name } = req.body;

    const task = await Task.create({
      name: name,
      category_id: categoryId,
    });

    res.status(200).json({
      success: true,
      result: {
        name: task.name,
        message: 'задача была успешна создана',
        task_id: task._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const getTask = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    res.status(200).json({
      success: true,
      result: task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const saveTask = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const task = await Task.updateOne(
      { _id: id },
      {
        name,
        description,
      },
      {
        returnOriginal: false,
        new: true,
      },
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const deleteTask = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const data = await Task.findById(id, 'attachment');
    await Task.deleteOne({ _id: id });
    for (const file of data.attachment) {
      await GridFSBucket.delete(new mongoose.mongo.ObjectId(file.file_id));
    }
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const getAttachments = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const attachments = await Task.findById(id, 'attachment');

    res.status(200).json({
      success: true,
      result: attachments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const fileFilesFromAttachments = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const deleteFile = await Task.updateOne({ 'attachment.file_id': id }, { $pull: { attachment: { file_id: id } } });

    res.status(200).json({
      success: true,
      result: deleteFile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

export { taskCreate, getTask, saveTask, getAttachments, fileFilesFromAttachments, deleteTask };
