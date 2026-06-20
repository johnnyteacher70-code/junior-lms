import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/lessons`),
      api.get(`/enrollments/${id}/check`),
    ]).then(([c, l, e]) => {
      setCourse(c.data.course);
      setLessons(l.data.lessons);
      setEnrollment(e.data.enrollment);
      if (l.data.lessons.length > 0) setActiveLesson(l.data.lessons[0]);
    }).finally(() => setLoading(false));
  }, [id]);

  const markComplete = async () => {
    if (!activeLesson || !enrollment) return;
    setMarking(true);
    try {
      const res = await api.patch(`/enrollments/${id}/progress`, { lessonId: activeLesson._id });
      setEnrollment(res.data.enrollment);
      toast.success('Dars tugatildi deb belgilandi!');
    } catch {
      toast.error('Rivojlanishni yangilashda xatolik');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <div className="text-center py-20 text-gray-500">Kurs topilmadi.</div>;

  const isCompleted = enrollment?.completedLessons?.includes(activeLesson?._id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      <div className="flex-1 space-y-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          {enrollment && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full transition-all" style={{ width: `${enrollment.progress}%` }} />
              </div>
              <span className="text-sm text-gray-500">{enrollment.progress}%</span>
            </div>
          )}
        </div>

        {activeLesson ? (
          <div className="card overflow-hidden">
            {activeLesson.videoUrl ? (
              <div className="aspect-video bg-black">
                <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen title={activeLesson.title} />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <svg className="w-20 h-20 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            )}
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{activeLesson.title}</h2>
                  {activeLesson.content && <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">{activeLesson.content}</p>}
                </div>
                {enrollment && (
                  <Button
                    onClick={markComplete}
                    loading={marking}
                    disabled={isCompleted}
                    variant={isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {isCompleted ? '✓ Tugatilgan' : 'Tugatildi deb belgilash'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-10 text-center text-gray-500">Hali darslar mavjud emas.</div>
        )}
      </div>

      <div className="lg:w-72 xl:w-80">
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Kurs tarkibi</h3>
          <p className="text-xs text-gray-500 mb-3">{lessons.length} ta dars</p>
          <ul className="space-y-1">
            {lessons.map((lesson, i) => {
              const done = enrollment?.completedLessons?.includes(lesson._id);
              return (
                <li key={lesson._id}>
                  <button
                    onClick={() => setActiveLesson(lesson)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeLesson?._id === lesson._id
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium ${
                      done ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {done ? '✓' : i + 1}
                    </div>
                    <span className="line-clamp-2">{lesson.title}</span>
                    {lesson.duration > 0 && (
                      <span className="ml-auto text-xs text-gray-400 flex-shrink-0">{lesson.duration}daq</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
