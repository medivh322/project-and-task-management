import { Task } from '@modelstask.model';
import express from 'express';

const taskCreate = async (req: express.Request, res: express.Response) => {
  try {
    const { id, name } = req.body;

    const task = await Task.create({
      name: name,
      category_id: id,
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

export { taskCreate, getTask };
