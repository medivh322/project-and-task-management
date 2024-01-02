import { Category } from '@modelscategories.mode';
import { Task } from '@modelstask.model';
import express from 'express';
import mongoose from 'mongoose';

const categoryCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, name } = req.body;

    const checkExists = await Category.findOne({ name: name, project_id: new mongoose.Types.ObjectId(projectId) })
      .select('_id')
      .lean();
    if (checkExists) {
      return res.status(409).json({
        success: false,
        message: 'категория с таким названием уже создана',
      });
    }

    const category = await Category.create({
      name: name,
      project_id: projectId,
    });

    res.status(200).json({
      success: true,
      result: {
        _id: category._id,
        name: category.name,
        tasks: [],
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const categoryDelete = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    await Category.findOneAndDelete({ _id: id });

    res.status(200).json({
      success: true,
      message: 'категория была успешно удалена',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

export { categoryCreate, categoryDelete };
