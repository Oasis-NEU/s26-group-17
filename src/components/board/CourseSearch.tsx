import { useState } from 'react';
import { Search, X, Plus, BookOpen } from 'lucide-react';

interface Course {
  courseReferenceNumber: string;
  subject: string;
  courseNumber: string;
  courseTitle: string;
  seatsAvailable: number;
  maximumEnrollment: number;
  faculty: { displayName: string }[];
  meetingsFaculty: { meetingTime: { beginTime: string; endTime: string; monday: boolean; tuesday: boolean; wednesday: boolean; thursday: boolean; friday: boolean } }[];
}

interface CourseSearchProps {
  onSelectCourse: (name: string) => void;
  onClose: () => void;
}

const TERM = '202630'; // Spring 2026

export default function CourseSearch({ onSelectCourse, onClose }: CourseSearchProps) {
  const [subject, setSubject] = useState('');
  const [courseNumber, setCourseNumber] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!subject.trim()) return;
    setLoading(true);
    setError('');
    setCourses([]);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        subject: subject.toUpperCase(),
        course_number: courseNumber,
        term: TERM,
      });
      const res = await fetch(`http://localhost:8000/auth/nu/courses?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.data) {
        setCourses(data.data);
      } else {
        setError('No courses found. Try a different subject or course number.');
      }
    } catch (err) {
      setError('Failed to reach NU Banner. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const days = (m: any) => {
    const d = m?.meetingTime;
    if (!d) return '';
    return [d.monday && 'M', d.tuesday && 'T', d.wednesday && 'W', d.thursday && 'Th', d.friday && 'F']
      .filter(Boolean).join('');
  };

  const formatTime = (t: string) => {
    if (!t) return '';
    const h = parseInt(t.slice(0, 2));
    const m = t.slice(2);
    return `${h > 12 ? h - 12 : h}:${m}${h >= 12 ? 'PM' : 'AM'}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl border border-sky-200 bg-white shadow-2xl mx-4">
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-500" />
            <h2 className="text-lg font-semibold text-slate-900">Search NEU Courses</h2>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-slate-500 mb-1 block">Subject</label>
              <input
                value={subject}
                onChange={e => setSubject(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder="e.g. CS, MATH, PHYS"
                className="w-full rounded-lg border border-sky-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>
            <div className="w-32">
              <label className="text-xs font-medium text-slate-500 mb-1 block">Course #</label>
              <input
                value={courseNumber}
                onChange={e => setCourseNumber(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder="e.g. 2500"
                className="w-full rounded-lg border border-sky-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={search}
                disabled={loading || !subject.trim()}
                className="flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
              >
                <Search className="h-4 w-4" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-rose-500 mb-3">{error}</p>}

          <div className="max-h-80 overflow-y-auto space-y-2">
            {courses.map(course => (
              <div key={course.courseReferenceNumber}
                className="flex items-center justify-between rounded-xl border border-sky-100 bg-sky-50/50 px-4 py-3 hover:border-sky-300 hover:bg-sky-50">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm">
                      {course.subject} {course.courseNumber}
                    </span>
                    <span className="text-xs text-slate-400">CRN: {course.courseReferenceNumber}</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">{course.courseTitle}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    {course.faculty[0] && <span>👤 {course.faculty[0].displayName}</span>}
                    {course.meetingsFaculty[0] && (
                      <span>🕐 {days(course.meetingsFaculty[0])} {formatTime(course.meetingsFaculty[0].meetingTime?.beginTime)}</span>
                    )}
                    <span>👥 {course.seatsAvailable}/{course.maximumEnrollment} seats</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectCourse(`${course.subject} ${course.courseNumber} - ${course.courseTitle}`)}
                  className="ml-3 flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Board
                </button>
              </div>
            ))}
          </div>

          {courses.length === 0 && !loading && !error && (
            <p className="text-center text-sm text-slate-400 py-6">
              Search for a NEU course to create a board (e.g. CS 3500)
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
