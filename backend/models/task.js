import mongoose, { Schema } from 'mongoose';

const toDoSchema = Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: true }
});

const taskSchema = Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  Status: { type: String, enum: ['pending', 'in progress', 'completed'], default: 'pending' },
  dueDate: { type: Date, required: true },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },


  attachments: [{ type: String }],

  todoCheckList: [toDoSchema],
  progress: { type: Number, default: 0 }
}, { timestamps: true }); 

export default mongoose.model('Task', taskSchema);