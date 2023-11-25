import { getBoard } from '@controllers/appControllers/dashboard.controller';
import { categoryCreate } from '@controllersappControllers/category.controller';
import {
  projectCreate,
  getProjectsList,
  getCurrentProjectInfo,
  deleteProject,
} from '@controllersappControllers/project.controller';
import { getTask, taskCreate } from '@controllersappControllers/task.controller';
import { downloadFiles, uploadFilesTask } from '@controllersappControllers/upload.controller';
import { catchErrors } from '@handlerserrorHandlers';
import express from 'express';
import { upload } from 'src/upload';

const router = express.Router();

router.get('/dashboard/:id', catchErrors(getBoard));

router.post('/projects', catchErrors(projectCreate));
router.get('/projects/getlist/:id', catchErrors(getProjectsList));
router.get('/projects/:id', catchErrors(getCurrentProjectInfo));
router.delete('project/:id', catchErrors(deleteProject));

router.post('/categories', catchErrors(categoryCreate));

router.post('/tasks', catchErrors(taskCreate));
router.get('/tasks/:id', catchErrors(getTask));

router.put('/upload/:id', upload.single('file'), catchErrors(uploadFilesTask));
router.get('/download/file/:id', catchErrors(downloadFiles));

export { router as coreApiRouter };
