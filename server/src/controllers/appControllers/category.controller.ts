import { Category } from '@modelscategories.mode';
import express from 'express';

const categoryCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { projectId, name } = req.body;

    const checkExists = await Category.findOne({ name: name }).select('_id').lean();
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
        name: category.name,
        message: 'категория была успешно создана',
        project_id: category._id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

const categoryDelete = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    await Category.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'категория была успешно удалена',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: '', error });
  }
};

export { categoryCreate, categoryDelete };
