import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  name: String,
  description: String,
  category_id: mongoose.Types.ObjectId,
  project_id: mongoose.Types.ObjectId,
  attachment: [
    {
      url: String,
      name: String,
    },
  ],
});

const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

export { Task };
