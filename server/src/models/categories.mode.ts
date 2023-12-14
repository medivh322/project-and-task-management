import { Task } from '@modelstask.model';
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: String,
  project_id: mongoose.Types.ObjectId,
});

CategorySchema.pre('findOneAndDelete', async function () {
  const { _id } = this.getQuery();
  await Task.deleteMany({ category_id: _id });
});

CategorySchema.pre('deleteMany', async function () {
  await Task.deleteMany(this.getQuery());
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export { Category };
