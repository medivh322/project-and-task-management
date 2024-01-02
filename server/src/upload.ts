import mongoose from 'mongoose';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import path from 'path';

const storage = new GridFsStorage({
  url: 'mongodb://127.0.0.1:27017/project',
  file: (req, file) => {
    const { id: taskId } = req.params;
    return {
      filename: file.originalname,
      bucketName: 'uploads', // Используйте имя для коллекции
      metadata: {
        taskId: new mongoose.Types.ObjectId(taskId as string),
        url: req.protocol + '://' + req.get('host') + '/api/download/file/',
      },
    };
  },
});
const upload = multer({ storage: storage });

export { upload };
