import { useState } from 'react';
import Button from '../components/ui/Button';
import KanbanBoard from '../components/board/KanbanBoard';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'board' | 'analytics'>('board');

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">📚 StudyQuest</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Demo User</p>
              <p className="text-xs text-gray-500">Level 1 • 0 XP</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('board')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'board'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Study Board
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-8">
        {activeTab === 'board' ? (
          <KanbanBoard />
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <p className="text-xl mb-4">📈 Charts coming soon!</p>
              <p>This will show your study statistics and progress</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
