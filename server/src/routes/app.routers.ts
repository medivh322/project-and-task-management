import { getBoard } from '@controllers/appControllers/dashboard.controller';
import { categoryCreate, categoryDelete } from '@controllersappControllers/category.controller';
import {
  projectCreate,
  getProjectsList,
  getCurrentProjectInfo,
  deleteProject,
} from '@controllersappControllers/project.controller';
import {
  deleteTask,
  fileFilesFromAttachments,
  getAttachments,
  getTask,
  saveTask,
  taskCreate,
} from '@controllersappControllers/task.controller';
import { deleteFile, downloadFiles, uploadFilesTask } from '@controllersappControllers/files.controller';
import { catchErrors } from '@handlerserrorHandlers';
import express from 'express';
import { upload } from 'src/upload';

const router = express.Router();

router.get('/dashboard/:id', catchErrors(getBoard));

router.post('/projects', catchErrors(projectCreate));
router.get('/projects/getlist/:id', catchErrors(getProjectsList));
router.get('/projects/:id', catchErrors(getCurrentProjectInfo));
router.delete('/projects/:id', catchErrors(deleteProject));

router.post('/categories', catchErrors(categoryCreate));
router.delete('/categories/:id', catchErrors(categoryDelete));

router.post('/tasks', catchErrors(taskCreate));
router.get('/tasks/:id', catchErrors(getTask));
router.get('/tasks/attachments/:id', catchErrors(getAttachments));
router.put('/tasks/:id', catchErrors(saveTask));
router.delete('/tasks/:id', catchErrors(deleteTask));

router.post('/upload/:id', upload.single('file'), catchErrors(uploadFilesTask));
router.get('/download/file/:id', catchErrors(downloadFiles));
router.delete('/file/:id', catchErrors(deleteFile), catchErrors(fileFilesFromAttachments));

export { router as coreApiRouter };
