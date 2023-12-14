import { GridFSBucket } from 'src';
import mongoose from 'mongoose';
import { Task } from '@modelstask.model';

const uploadFilesTask = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const file = req.file?.buffer;
    const name = req.file?.originalname;

    let writestream = GridFSBucket.openUploadStream(name);
    writestream.end(file);

    writestream.on('error', () => {
      res.status(500).json({ success: false, message: 'не удалось загрузить файл' });
    });
    writestream.on('finish', async () => {
      const file = await Task.updateOne(
        { _id: id },
        {
          $push: {
            attachments: {
              url: req.protocol + '://' + req.get('host') + '/api/download/file/' + writestream.id,
              name: name,
              file_id: new mongoose.mongo.ObjectId(writestream.id),
            },
          },
        },
      );
      res.status(200).json({ success: true, message: 'файл успшено загружен', file });
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'ошибка' });
  }
};

const downloadFiles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const downloadStream = GridFSBucket.openDownloadStream(new mongoose.mongo.ObjectId(id));
    downloadStream.pipe(res);
    downloadStream.on('end', () => {
      res.end();
    });
    downloadStream.on('error', (error) => {
      res.status(500).json({ error: 'не удалось получить файл' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'ошибка' });
  }
};

const deleteFile = async (req: any, res: any, next: any) => {
  try {
    const { id } = req.params;
    await GridFSBucket.delete(new mongoose.mongo.ObjectId(id));
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'ошибка' });
  }
};
export { uploadFilesTask, downloadFiles, deleteFile };
