import { Category } from '@modelscategories.mode';
import { Project } from '@modelsproject.model';
import { Task } from '@modelstask.model';
import { User } from '@modelsuser.model';
import express from 'express';
import mongoose from 'mongoose';

const projectCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { userId, name } = req.body;

    await Project.create({
      name: name,
      members: [
        {
          role: ['Admin', 'User'],
          user_id: userId,
        },
      ],
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

    const projects = await Project.find(
      { 'members.user_id': id },
      {
        _id: 1,
        name: 1,
      },
    );

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
        $unwind: '$tasks',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'tasks.members.userId',
          foreignField: '_id',
          as: 'taskMembers',
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          tasks: {
            $push: {
              _id: '$tasks._id',
              name: '$tasks.name',
              members: '$taskMembers.name',
            },
          },
        },
      },
      {
        $project: {
          name: 1,
          tasks: 1,
        },
      },
    ]);
    res.status(200).json({
      success: true,
      result: projectInfoForKanban,
      message: 'информация успешно получена',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    await Project.findOneAndDelete({ _id: id });

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

const shareMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { membersArray, projectId } = req.body;

    await Project.updateOne(
      { _id: projectId },
      {
        $addToSet: {
          members: {
            $each: membersArray.map((user_id: string) => ({
              user_id,
              role: ['User'],
            })),
          },
        },
      },
    );

    res.status(200).json({
      success: true,
      message: 'пользователь был успешно добавлен в участники проекта',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const searchMembers = async (req: express.Request, res: express.Response) => {
  try {
    const { query, id } = req.query;

    const members = await User.aggregate([
      {
        $match: { login: { $regex: query, $options: 'i' } },
      },
      {
        $lookup: {
          from: 'projects',
          let: {
            userId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', new mongoose.Types.ObjectId(id as string)],
                    },
                    {
                      $not: {
                        $in: ['$$userId', '$members.user_id'],
                      },
                    },
                  ],
                },
              },
            },
          ],
          as: 'matching_docs',
        },
      },
      {
        $match: {
          matching_docs: { $ne: [] },
        },
      },
      {
        $project: {
          login: 1,
          _id: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      members,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error,
    });
  }
};

const getMembersProject = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const members = await User.aggregate([
      {
        $lookup: {
          from: 'projects',
          let: {
            userId: '$_id',
            login: '$login',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_id', new mongoose.Types.ObjectId(id as string)],
                    },
                    {
                      $in: ['$$userId', '$members.user_id'],
                    },
                  ],
                },
              },
            },
            {
              $addFields: {
                role: {
                  $map: {
                    input: '$members',
                    as: 'member',
                    in: {
                      $cond: {
                        if: { $eq: ['$$member.user_id', '$$userId'] },
                        then: { $arrayElemAt: ['$$member.role', 0] },
                        else: '',
                      },
                    },
                  },
                },
              },
            },
          ],
          as: 'matching_docs',
        },
      },
      {
        $unwind: '$matching_docs',
      },
      {
        $match: {
          matching_docs: { $ne: [] },
        },
      },
      {
        $project: {
          _id: 0,
          key: '$_id',
          name: '$login',
          matching_docs: 1,
          role: {
            $switch: {
              branches: [
                { case: { $in: ['Admin', '$matching_docs.role'] }, then: 'Администратор' },
                { case: { $in: ['User', '$matching_docs.role'] }, then: 'Пользователь' },
              ],
              default: 'Роль не найдена',
            },
          },
        },
      },
    ]);
    res.status(200).json({
      success: true,
      members,
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
  projectCreate,
  getProjectsList,
  getCurrentProjectInfo,
  deleteProject,
  searchMembers,
  shareMembers,
  getMembersProject,
};
