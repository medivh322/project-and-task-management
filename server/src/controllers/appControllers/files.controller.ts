import { GridFSBucket } from 'src';
import mongoose from 'mongoose';
import { Task } from '@modelstask.model';
import mime from 'mime-types';

const uploadFilesTask = async (req: any, res: any) => {
  try {
    // const { id } = req.params;

    // const file = req.file?.buffer;
    // const name = req.file?.originalname;
    // const mimetype = req.file?.mimetype;

    // let writestream = GridFSBucket.openUploadStream(name);
    // writestream.end(file);

    // writestream.on('error', () => {
    //   res.status(500).json({ success: false, message: 'не удалось загрузить файл' });
    // });
    // writestream.on('finish', async () => {
    //   res.status(200).json({ success: true, message: 'файл успшено загружен' });
    // });
    res.status(200).json({ success: true, message: 'файл успешно загружен' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'ошибка' });
  }
};

const downloadFiles = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const objectId = new mongoose.mongo.ObjectId(id);

    const files = await GridFSBucket.find({ _id: objectId }).toArray();
    if (files.length === 0) {
      return res.status(404).json({ error: 'Файл не найден' });
    }

    const file = files[0];
    const filename = file.filename;
    const contentType = mime.lookup(filename) || 'application/octet-stream';

    res.set('Content-Type', contentType);

    const downloadStream = GridFSBucket.openDownloadStream(objectId);
    downloadStream.pipe(res);

    downloadStream.on('end', () => {
      res.end();
    });

    downloadStream.on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: 'Не удалось получить файл' });
    });
  } catch (error) {
    console.error(error); // Логирование для отладки
    res.status(500).json({ success: false, message: 'Ошибка' });
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
