import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourse } from '../api/courses';
import { getLessons } from '../api/lessons';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const levelColor = { beginner: 'green', intermediate: 'yellow', advanced: 'red' };
const levelLabel = { beginner: 'Boshlang\'ich', intermediate: 'O\'rta', advanced: 'Yuqori' };

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    Promise.all([
      getCourse(id),
      getLessons(id),
      user ? api.get(`/enrollments/${id}/check`) : Promise.resolve({ data: { enrolled: false } }),
    ]).then(([c, l, e]) => {
      setCourse(c.data.course);
      setLessons(l.data.lessons);
      setEnrolled(e.data.enrolled);
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) return navigate('/login');
    if (user.role !== 'student') return toast.error('Faqat talabalar yozilishi mumkin');
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}`);
      toast.success('Muvaffaqiyatli yozildingiz!');
      setEnrolled(true);
      navigate(`/student/courses/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Yozilishda xatolik');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <><Navbar /><LoadingSpinner /></>;
  if (!course) return <><Navbar /><div className="text-center py-20 text-gray-500">Kurs topilmadi.</div></>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse lg:grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Badge color={levelColor[course.level]}>{levelLabel[course.level] || course.level}</Badge>
              <Badge color="blue">{course.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-gray-300 text-lg mb-6">{course.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>👨‍🏫 {course.instructor?.name}</span>
              <span>👥 {course.totalStudents} talaba</span>
              <span>🌐 {course.language}</span>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="h-48 bg-gradient-to-br from-primary-500 to-purple-600 relative">
                {course.thumbnail && <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />}
              </div>
              <div className="p-6">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {course.price === 0 ? <span className="text-green-600">Bepul</span> : `$${course.price}`}
                </div>
                {enrolled ? (
                  <Link to={`/student/courses/${id}`}>
                    <Button className="w-full" size="lg">Davom etish →</Button>
                  </Link>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleEnroll} loading={enrolling}>
                    {user ? 'Yozilish' : 'Yozilish uchun kiring'}
                  </Button>
                )}
                <p className="text-xs text-gray-500 text-center mt-3">30 kunlik pul qaytarish kafolati</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {lessons.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kurs tarkibi</h2>
              <div className="card overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500">{lessons.length} ta dars</p>
                </div>
                <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                  {lessons.map((l, i) => (
                    <li key={l._id} className="flex items-center gap-3 px-4 py-3">
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 text-xs flex items-center justify-center flex-shrink-0">{i + 1}</div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{l.title}</span>
                      {l.duration > 0 && <span className="text-xs text-gray-400">{l.duration}daq</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">O'qituvchi haqida</h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-primary-600 text-white text-lg flex items-center justify-center font-bold">
                {course.instructor?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{course.instructor?.name}</p>
                <p className="text-xs text-gray-500">O'qituvchi</p>
              </div>
            </div>
            {course.instructor?.bio && <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructor.bio}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
