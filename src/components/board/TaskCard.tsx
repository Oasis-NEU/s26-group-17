import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, Star } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  xp: number;
}

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const isOverdue = (dateString?: string) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'rotate-3 shadow-xl' : ''
      }`}
    >
      <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
      <p className="text-sm text-gray-600 mb-3">{task.description}</p>

      <div className="flex items-center justify-between text-sm">
        {task.dueDate && (
          <div className={`flex items-center gap-1 ${
            isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'
          }`}>
            <Calendar className="w-4 h-4" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}

        <div className="flex items-center gap-1 text-yellow-600">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">{task.xp} XP</span>
        </div>
      </div>
    </div>
  );
}