import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: String,
  project_id: mongoose.Types.ObjectId,
});

const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);

export { Category };
