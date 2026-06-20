import Badge from '../ui/Badge';

const levelColor = { beginner: 'green', intermediate: 'yellow', advanced: 'red' };
const levelLabel = { beginner: 'Boshlang\'ich', intermediate: 'O\'rta', advanced: 'Yuqori' };

export default function CourseCard({ course, action }) {
  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-44 bg-gradient-to-br from-primary-500 to-purple-600 overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge color={levelColor[course.level] || 'gray'}>{levelLabel[course.level] || course.level}</Badge>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">{course.category}</p>
        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {course.title}
        </h3>
        {course.instructor && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            O'qituvchi: {course.instructor.name}
          </p>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {course.totalStudents} talaba
            </span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white">
            {course.price === 0 ? 'Bepul' : `$${course.price}`}
          </span>
        </div>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
