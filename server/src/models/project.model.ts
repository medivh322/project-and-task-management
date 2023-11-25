import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: String,
  description: String,
  status: Boolean,
  date_start: { type: Date, default: Date.now },
  date_end: Date,
  user_id: mongoose.Types.ObjectId,
});

const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export { Project };
