import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getCourses } from '../api/courses';
import Navbar from '../components/layout/Navbar';
import CourseCard from '../components/common/CourseCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Photography', 'Music', 'Other'];
const CATEGORY_LABELS = {
  'All': 'Barchasi',
  'Web Development': 'Veb ishlab chiqish',
  'Mobile Development': 'Mobil ishlab chiqish',
  'Data Science': 'Ma\'lumotlar fanlari',
  'Design': 'Dizayn',
  'Business': 'Biznes',
  'Marketing': 'Marketing',
  'Photography': 'Fotografiya',
  'Music': 'Musiqa',
  'Other': 'Boshqa',
};
const LEVELS = [['all', 'Barcha darajalar'], ['beginner', 'Boshlang\'ich'], ['intermediate', 'O\'rta'], ['advanced', 'Yuqori']];

export default function CoursesPage() {
  const [searchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [level, setLevel] = useState('all');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const params = { status: 'published' };
    if (category !== 'All') params.category = category;
    if (level !== 'all') params.level = level;
    if (debouncedSearch) params.search = debouncedSearch;
    getCourses(params).then((r) => setCourses(r.data.courses)).finally(() => setLoading(false));
  }, [category, level, debouncedSearch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Page header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Kurslarni ko'rish</h1>
          <p className="text-gray-500 dark:text-gray-400">Mutaxassis o'qituvchilardan yuzlab kurslarni o'rganing</p>

          {/* Search + filters */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kurslarni qidirish..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="flex gap-2">
              {LEVELS.map(([v, l]) => (
                <button
                  key={v}
                  onClick={() => setLevel(v)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${level === v ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-primary-400'}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto pb-px scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                  category === c
                    ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Kurslar topilmadi</h3>
            <p className="text-gray-500 dark:text-gray-400">Boshqa so'rov yoki kategoriyani sinab ko'ring</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {courses.length} ta kurs topildi
              {debouncedSearch && <> — "<span className="font-medium text-gray-900 dark:text-white">{debouncedSearch}</span>"</>}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {courses.map((c) => (
                <Link key={c._id} to={`/courses/${c._id}`}>
                  <CourseCard course={c} />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
