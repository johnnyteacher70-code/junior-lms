import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTeacherCourses, deleteCourse, publishCourse } from '../../api/courses';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const statusLabel = { published: 'Nashr etilgan', draft: 'Qoralama' };

export default function TeacherMyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getTeacherCourses().then((r) => setCourses(r.data.courses)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handlePublish = async (id) => {
    try {
      const r = await publishCourse(id);
      setCourses((prev) => prev.map((c) => (c._id === id ? r.data.course : c)));
      toast.success(`Kurs ${r.data.course.status === 'published' ? 'nashr etildi' : 'qoralamaga olindi'}`);
    } catch { toast.error('Xatolik yuz berdi'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kursni o\'chirasizmi?')) return;
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success('Kurs o\'chirildi');
    } catch { toast.error('O\'chirishda xatolik'); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mening kurslarim</h1>
        <Link to="/teacher/courses/new">
          <Button>+ Yangi kurs</Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">Hali kurslar yo'q.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <div key={c._id} className="card overflow-hidden">
              <div className="h-36 bg-gradient-to-br from-primary-500 to-purple-600 relative">
                {c.thumbnail && <img src={c.thumbnail} alt="" className="w-full h-full object-cover" />}
                <div className="absolute top-2 left-2">
                  <Badge color={c.status === 'published' ? 'green' : 'gray'}>{statusLabel[c.status] || c.status}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{c.title}</h3>
                <p className="text-xs text-gray-500 mt-1">{c.totalStudents} talaba · {c.price === 0 ? 'Bepul' : `$${c.price}`}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Link to={`/teacher/courses/${c._id}/edit`}>
                    <Button size="sm" variant="secondary">Tahrirlash</Button>
                  </Link>
                  <Link to={`/teacher/courses/${c._id}/lessons`}>
                    <Button size="sm" variant="outline">Darslar</Button>
                  </Link>
                  <Button size="sm" variant={c.status === 'published' ? 'secondary' : 'primary'} onClick={() => handlePublish(c._id)}>
                    {c.status === 'published' ? 'Noshir etmaslik' : 'Nashr etish'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(c._id)}>O'chirish</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
