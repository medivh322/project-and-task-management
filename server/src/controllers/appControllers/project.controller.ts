import { Category } from '@modelscategories.mode';
import { Project } from '@modelsproject.model';
import { Task } from '@modelstask.model';
import express from 'express';
import mongoose from 'mongoose';

const projectCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, name } = req.body;

    const project = await Project.create({
      name: name,
      status: true,
      user_id: userId,
    });

    res.status(200).json({
      success: true,
      message: 'проект был успешно создан',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error });
  }
};

const getProjectsList = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const projects = await Project.find({ user_id: id }, 'id name');

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message, error });
  }
};

const getCurrentProjectInfo = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const projectInfoForKanban = await Category.aggregate([
      {
        $match: { project_id: new mongoose.Types.ObjectId(id) },
      },
      {
        $lookup: {
          from: 'tasks',
          localField: '_id',
          foreignField: 'category_id',
          as: 'tasks',
        },
      },
      {
        $project: {
          name: 1,
          tasks: {
            $map: {
              input: '$tasks',
              as: 'task',
              in: {
                _id: '$$task._id',
                name: '$$task.name',
              },
            },
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      result: projectInfoForKanban.length ? projectInfoForKanban : null,
      message: 'информация успешно получена',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    await Project.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'проект был успешно удален',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

export { projectCreate, getProjectsList, getCurrentProjectInfo, deleteProject };
