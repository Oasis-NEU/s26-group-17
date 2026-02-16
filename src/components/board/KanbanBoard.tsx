import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import Button from '../ui/Button';
import { Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  xp: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function KanbanBoard() {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [columns, setColumns] = useState<Column[]>([
    {
      id: 'todo',
      title: 'To Do',
      tasks: [
        { id: '1', title: 'Read Chapter 5', description: 'Object-Oriented Design patterns', dueDate: '2026-02-20', xp: 10 },
        { id: '2', title: 'Complete Lab 3', description: 'Implement MVC pattern', dueDate: '2026-02-18', xp: 25 },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: [
        { id: '3', title: 'Study for Midterm', description: 'Review chapters 1-5', dueDate: '2026-02-22', xp: 50 },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      tasks: [
        { id: '4', title: 'Assignment 2', description: 'Completed and submitted', xp: 30 },
      ],
    },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = columns
      .flatMap(col => col.tasks)
      .find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = active.id as string;
    const overColumnId = over.id as string;

    let sourceColumn: Column | undefined;
    let task: Task | undefined;

    for (const col of columns) {
      const foundTask = col.tasks.find(t => t.id === activeTaskId);
      if (foundTask) {
        sourceColumn = col;
        task = foundTask;
        break;
      }
    }

    if (!sourceColumn || !task) return;

    const destColumn = columns.find(col => col.id === overColumnId);
    if (!destColumn) return;

    if (sourceColumn.id === destColumn.id) return;

    setColumns(prev => prev.map(col => {
      if (col.id === sourceColumn!.id) {
        return {
          ...col,
          tasks: col.tasks.filter(t => t.id !== activeTaskId),
        };
      }
      if (col.id === destColumn!.id) {
        return {
          ...col,
          tasks: [...col.tasks, task!],
        };
      }
      return col;
    }));
  };

  const handleAddTask = () => {
    alert('Add task modal coming soon!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">CS 3500 - Object-Oriented Design</h2>
        <Button onClick={handleAddTask}>
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
