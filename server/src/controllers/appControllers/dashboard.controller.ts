import express from 'express';
import { getProjectInfo } from '@services/dashboard.services';

const getBoard = async (req: express.Request, res: express.Response) => {
  const id = req.params.id;

  const projectInfo = await getProjectInfo(id);
  res.status(200).json({
    success: true,
    result: projectInfo,
  });
};

export { getBoard };
