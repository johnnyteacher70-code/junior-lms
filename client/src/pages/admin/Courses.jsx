import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getAdminCourses, deleteAdminCourse } from '../../api/admin';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

const statusLabel = { published: 'Nashr etilgan', draft: 'Qoralama' };

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { getAdminCourses().then((r) => setCourses(r.data.courses)).finally(() => setLoading(false)); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Bu kurs va uning barcha mazmunini o\'chirasizmi?')) return;
    try {
      await deleteAdminCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      toast.success('Kurs o\'chirildi');
    } catch { toast.error('O\'chirishda xatolik'); }
  };

  if (loading) return <LoadingSpinner />;

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.instructor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Barcha kurslar ({courses.length})</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Kurslarni qidirish..."
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-64"
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Kurs', 'O\'qituvchi', 'Kategoriya', 'Holati', 'Talabalar', 'Narxi', 'Amallar'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1 max-w-[200px]">{c.title}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{c.instructor?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{c.category}</td>
                  <td className="px-4 py-3">
                    <Badge color={c.status === 'published' ? 'green' : 'gray'}>{statusLabel[c.status] || c.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.totalStudents}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{c.price === 0 ? 'Bepul' : `$${c.price}`}</td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant="danger" onClick={() => handleDelete(c._id)}>O'chirish</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="text-center text-gray-500 py-8 text-sm">Kurslar topilmadi.</p>}
      </div>
    </div>
  );
}
