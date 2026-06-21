import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/ui/Button';

function toEmbedUrl(url) {
  if (!url) return null;
  const watch = url.match(/[?&]v=([\w-]+)/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  const short = url.match(/youtu\.be\/([\w-]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const shorts = url.match(/youtube\.com\/shorts\/([\w-]+)/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
  return url;
}

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/lessons`),
      api.get(`/enrollments/${id}/check`),
    ]).then(([c, l, e]) => {
      setCourse(c.data.course);
      setLessons(l.data.lessons);
      setEnrollment(e.data.enrollment);
      if (l.data.lessons.length > 0) {
        setActiveLesson(l.data.lessons[0]);
        setVideoLoading(!!l.data.lessons[0]?.videoUrl);
      }
    }).finally(() => setLoading(false));
  }, [id]);

  const selectLesson = (lesson) => {
    setActiveLesson(lesson);
    setVideoLoading(!!lesson.videoUrl);
  };

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

  const goNext = () => {
    const idx = lessons.findIndex((l) => l._id === activeLesson?._id);
    if (idx < lessons.length - 1) selectLesson(lessons[idx + 1]);
  };

  const goPrev = () => {
    const idx = lessons.findIndex((l) => l._id === activeLesson?._id);
    if (idx > 0) selectLesson(lessons[idx - 1]);
  };

  if (loading) return <LoadingSpinner />;
  if (!course) return <div className="text-center py-20 text-gray-500">Kurs topilmadi.</div>;

  const activeIdx = lessons.findIndex((l) => l._id === activeLesson?._id);
  const isCompleted = enrollment?.completedLessons?.includes(activeLesson?._id);
  const embedUrl = toEmbedUrl(activeLesson?.videoUrl);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Main content */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Course title + progress */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
          {enrollment && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-600 rounded-full transition-all duration-500" style={{ width: `${enrollment.progress}%` }} />
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap">{enrollment.progress}% tugallangan</span>
            </div>
          )}
        </div>

        {activeLesson ? (
          <div className="card overflow-hidden">
            {/* Video area */}
            {embedUrl ? (
              <div className="aspect-video bg-black relative">
                {videoLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <svg className="animate-spin w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                )}
                <iframe
                  src={embedUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={activeLesson.title}
                  onLoad={() => setVideoLoading(false)}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center gap-3">
                <svg className="w-16 h-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-white/30 text-sm">Bu darsda video mavjud emas</p>
              </div>
            )}

            {/* Lesson info + controls */}
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-400 font-medium">{activeIdx + 1}/{lessons.length} - dars</span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                        Tugatilgan
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold text-gray-900 dark:text-white text-lg">{activeLesson.title}</h2>
                  {activeLesson.content && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">{activeLesson.content}</p>
                  )}
                </div>
              </div>

              {/* Navigation + complete */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={goPrev} disabled={activeIdx === 0}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Oldingi
                  </Button>
                  <Button variant="secondary" size="sm" onClick={goNext} disabled={activeIdx === lessons.length - 1}>
                    Keyingi
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </Button>
                </div>
                {enrollment && (
                  <Button
                    onClick={markComplete}
                    loading={marking}
                    disabled={isCompleted}
                    variant={isCompleted ? 'secondary' : 'primary'}
                    size="sm"
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

      {/* Sidebar: lesson list */}
      <div className="lg:w-72 xl:w-80 flex-shrink-0">
        <div className="card p-4 sticky top-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Kurs tarkibi</h3>
          <p className="text-xs text-gray-500 mb-3">{lessons.length} ta dars</p>
          <ul className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
            {lessons.map((lesson, i) => {
              const done = enrollment?.completedLessons?.includes(lesson._id);
              const active = activeLesson?._id === lesson._id;
              return (
                <li key={lesson._id}>
                  <button
                    onClick={() => selectLesson(lesson)}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium transition-colors ${
                      done
                        ? 'bg-green-500 text-white'
                        : active
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}>
                      {done ? (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                      ) : i + 1}
                    </div>
                    <span className="line-clamp-2 flex-1 text-left">{lesson.title}</span>
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
