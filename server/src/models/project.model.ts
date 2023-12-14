import { Category } from '@modelscategories.mode';
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: { type: String, default: '' },
  date_start: { type: Date, default: Date.now },
  date_end: Date,
  members: [
    {
      user_id: mongoose.Types.ObjectId,
      role: [String],
    },
  ],
});

ProjectSchema.pre('findOneAndDelete', async function () {
  const { _id } = this.getQuery();
  await Category.deleteMany({ project_id: _id });
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export { Project };
