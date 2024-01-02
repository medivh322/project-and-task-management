import { getBoard } from '@controllers/appControllers/dashboard.controller';
import { categoryCreate, categoryDelete } from '@controllersappControllers/category.controller';
import {
  projectCreate,
  getProjectsList,
  getCurrentProjectInfo,
  getMembersProject,
  deleteProject,
  searchMembers,
  shareMembers,
} from '@controllersappControllers/project.controller';
import {
  changeStatus,
  closeTask,
  deleteTask,
  fileFilesFromAttachments,
  getAttachments,
  getTask,
  getTaskMembers,
  getTasksStatuses,
  saveTask,
  searchTaskMembers,
  setMembers,
  taskCreate,
} from '@controllersappControllers/task.controller';
import { deleteFile, downloadFiles, uploadFilesTask } from '@controllersappControllers/files.controller';
import { catchErrors } from '@handlerserrorHandlers';
import express from 'express';
import { upload } from 'src/upload';
import { User } from '@modelsuser.model';
import { Task } from '@modelstask.model';
import mongoose from 'mongoose';
import { Project } from '@modelsproject.model';
import { checkAccess } from '@helpersindex';

const router = express.Router();

router.post('/role', checkAccess(), (req: express.Request, res: express.Response) => {
  res.status(200).json({
    success: true,
  });
});

router.get('/dashboard/:id', catchErrors(getBoard));

router.post('/projects', catchErrors(projectCreate));
router.post('/projects/share', catchErrors(shareMembers));
router.get('/projects/s/members', catchErrors(searchMembers));
router.get('/projects/getlist/:id', catchErrors(getProjectsList));
router.get('/projects/:id', catchErrors(getCurrentProjectInfo));
router.get('/projects/members/:projectId', catchErrors(getMembersProject));
router.delete('/projects/:id', checkAccess('Admin'), catchErrors(deleteProject));

router.post('/categories', catchErrors(categoryCreate));
router.delete('/categories/:id', catchErrors(categoryDelete));

router.post('/tasks', catchErrors(taskCreate));
router.post('/tasks/statuses', catchErrors(changeStatus));
router.post('/tasks/members', catchErrors(setMembers));
router.get('/tasks/:id', catchErrors(getTask));
router.get('/tasks/attachments/:id', catchErrors(getAttachments));
router.get('/tasks/statuses/:projectId/:taskId', catchErrors(getTasksStatuses));
router.get('/tasks/s/members', catchErrors(searchTaskMembers));
router.get('/tasks/members/:taskId', catchErrors(getTaskMembers));
router.put('/tasks/:id', catchErrors(saveTask));
router.put('/tasks/c/:id', catchErrors(closeTask));
router.delete('/tasks/:id', catchErrors(deleteTask));

router.post('/upload/:id', upload.single('file'), catchErrors(uploadFilesTask));
router.get('/download/file/:id', catchErrors(downloadFiles));
router.delete('/file/:id', catchErrors(deleteFile), catchErrors(fileFilesFromAttachments));

export { router as coreApiRouter };
