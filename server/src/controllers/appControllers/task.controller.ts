import { Category } from '@modelscategories.mode';
import { Project } from '@modelsproject.model';
import { Task, TaskType } from '@modelstask.model';
import express from 'express';
import mongoose from 'mongoose';
import { GridFSBucket } from 'src';

const taskCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { categoryId, name, projectId } = req.body;

    const task = await Task.create({
      name: name,
      category_id: categoryId,
      project_id: projectId,
    });

    res.status(200).json({
      success: true,
      result: {
        _id: task._id,
        name: task.name,
        status: task.status,
        members: [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const getTask = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id, 'name description date_start date_end').select({
      name: 1,
      description: 1,
      date_start: 1,
      status: 1,
    });

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const saveTask = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { name, description, date_end } = req.body;

    const task = await Task.updateOne(
      { _id: id },
      {
        name,
        description,
        date_end,
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

const closeTask = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    // await Task.findOneAndDelete({ _id: id });
    await Task.findOneAndUpdate<TaskType>({ _id: id }, { date_end: Date.now(), status: 'close' });
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
    await Task.findOneAndDelete({ _id: id });
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

    const { attachments } = await Task.findById(id, 'attachments');

    res.status(200).json({
      success: true,
      attachments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const fileFilesFromAttachments = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const deleteFile = await Task.updateOne({ 'attachments.file_id': id }, { $pull: { attachments: { file_id: id } } });

    res.status(200).json({
      success: true,
      result: deleteFile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const getTasksStatuses = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, taskId } = req.params;

    const statuses = await Category.aggregate([
      {
        $match: { project_id: new mongoose.mongo.ObjectId(projectId) },
      },
      {
        $lookup: {
          from: 'tasks',
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', new mongoose.Types.ObjectId(taskId as string)],
                    },
                  ],
                },
              },
            },
          ],
          as: 'matching_task',
        },
      },
      {
        $unwind: '$matching_task',
      },
      {
        $project: {
          _id: 0,
          key: '$_id',
          name: '$name',
          selected: { $eq: ['$matching_task.category_id', '$_id'] },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      statuses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const changeStatus = async (req: express.Request, res: express.Response) => {
  try {
    const { categoryId, taskId } = req.body;

    await Task.updateOne(
      { _id: new mongoose.mongo.ObjectId(taskId) },
      { $set: { category_id: new mongoose.mongo.ObjectId(categoryId) } },
    );

    res.status(200).json({
      success: true,
      message: 'статус был успешно изменен',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const searchTaskMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { query, projectId } = req.query;

    const members = await Project.aggregate([
      {
        $match: { _id: new mongoose.mongo.ObjectId(projectId as string) },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$members.user_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ['$_id', '$$userId'],
                    },
                    {
                      $regexMatch: { input: '$login', regex: query, options: 'i' },
                    },
                  ],
                },
              },
            },
            {
              $project: {
                key: '$_id',
                name: '$login',
                _id: 0,
              },
            },
          ],
          as: 'matching_members',
        },
      },
      {
        $project: {
          members: '$matching_members',
        },
      },
    ]);

    res.status(200).json({
      success: true,
      members: members[0].members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const setMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { membersArray, taskId } = req.body;

    await Task.updateOne(
      { _id: taskId },
      {
        $addToSet: {
          members: {
            $each: membersArray.map((user_id: string) => ({
              user_id,
            })),
          },
        },
      },
    );

    res.status(200).json({
      success: true,
      message: 'пользователь был успешно добавлен в исполнители задачи',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getTaskMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { taskId } = req.params;

    const members = await Task.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(taskId as string) },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$members.user_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ['$_id', '$$userId'],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                name: '$login',
              },
            },
          ],
          as: 'matching_users',
        },
      },
      {
        $project: {
          _id: 0,
          members: '$matching_users',
        },
      },
    ]);
    res.status(200).json({
      success: true,
      members: members[0].members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export {
  taskCreate,
  getTask,
  saveTask,
  getAttachments,
  fileFilesFromAttachments,
  closeTask,
  getTasksStatuses,
  changeStatus,
  searchTaskMembers,
  setMembers,
  getTaskMembers,
  deleteTask,
};
