import { useState } from 'react';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'board' | 'analytics'>('board');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">StudyQuest</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Level 1 • 0 XP</span>
            <Button variant="secondary" size="sm">
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
          <div>
            <h2 className="text-2xl font-bold mb-6">My Study Board</h2>
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <p className="text-xl mb-4">🚧 Kanban board coming soon!</p>
              <p>This will show your courses and task cards</p>
            </div>
          </div>
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