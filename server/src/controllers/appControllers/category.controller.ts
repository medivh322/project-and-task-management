import { Category } from '@modelscategories.mode';
import express from 'express';

const categoryCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { id, name } = req.body;

    const category = await Category.create({
      name: name,
      project_id: id,
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

export { categoryCreate };
