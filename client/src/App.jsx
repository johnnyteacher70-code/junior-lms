import { Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import RoleRoute from './components/common/RoleRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import StudentShell from './components/layout/StudentShell';

import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetail from './pages/CourseDetail';
import Auth from './pages/auth/Auth';

import StudentDashboard    from './pages/student/Dashboard';
import MyCourses           from './pages/student/MyCourses';
import CourseView          from './pages/student/CourseView';
import StudentAssignments  from './pages/student/Assignments';
import StudentMyGroup      from './pages/student/MyGroup';
import StudentProfile      from './pages/student/Profile';
import Lessons             from './pages/student/Lessons';
import Tests               from './pages/student/Tests';
import Certificates        from './pages/student/Certificates';
import Schedule            from './pages/student/Schedule';
import Messages            from './pages/student/Messages';

import TeacherDashboard   from './pages/teacher/Dashboard';
import TeacherMyCourses   from './pages/teacher/MyCourses';
import CourseCreate       from './pages/teacher/CourseCreate';
import CourseEdit         from './pages/teacher/CourseEdit';
import LessonManage       from './pages/teacher/LessonManage';
import AssignmentManage   from './pages/teacher/AssignmentManage';
import TeacherMyGroups    from './pages/teacher/MyGroups';

import AdminDashboard  from './pages/admin/Dashboard';
import AdminUsers      from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminCourses    from './pages/admin/Courses';
import AdminGroups     from './pages/admin/Groups';
import GroupDetail     from './pages/admin/GroupDetail';

import Profile  from './pages/Profile';
import NotFound from './pages/NotFound';

/* ── layout wrappers ── */
const SShell = ({ children }) => (
  <RoleRoute role="student"><StudentShell>{children}</StudentShell></RoleRoute>
);
const TeacherLayout = ({ children }) => (
  <RoleRoute role="teacher"><DashboardLayout>{children}</DashboardLayout></RoleRoute>
);
const AdminLayout = ({ children }) => (
  <RoleRoute role="admin"><DashboardLayout>{children}</DashboardLayout></RoleRoute>
);

export default function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/"          element={<LandingPage />} />
      <Route path="/courses"   element={<CoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/login"     element={<Auth initialTab="login" />} />
      <Route path="/register"  element={<Auth initialTab="signup" />} />

      {/* Student — all in StudentShell */}
      <Route path="/student"                  element={<RoleRoute role="student"><StudentDashboard /></RoleRoute>} />
      <Route path="/student/courses"          element={<SShell><MyCourses /></SShell>} />
      <Route path="/student/courses/:id"      element={<SShell><CourseView /></SShell>} />
      <Route path="/student/lessons"          element={<SShell><Lessons /></SShell>} />
      <Route path="/student/assignments"      element={<SShell><StudentAssignments /></SShell>} />
      <Route path="/student/tests"            element={<SShell><Tests /></SShell>} />
      <Route path="/student/certificates"     element={<SShell><Certificates /></SShell>} />
      <Route path="/student/schedule"         element={<SShell><Schedule /></SShell>} />
      <Route path="/student/messages"         element={<SShell><Messages /></SShell>} />
      <Route path="/student/group"            element={<SShell><StudentMyGroup /></SShell>} />
      <Route path="/student/profile"          element={<SShell><StudentProfile /></SShell>} />

      {/* Teacher */}
      <Route path="/teacher"                          element={<TeacherLayout><TeacherDashboard /></TeacherLayout>} />
      <Route path="/teacher/courses"                  element={<TeacherLayout><TeacherMyCourses /></TeacherLayout>} />
      <Route path="/teacher/courses/new"              element={<TeacherLayout><CourseCreate /></TeacherLayout>} />
      <Route path="/teacher/courses/:id/edit"         element={<TeacherLayout><CourseEdit /></TeacherLayout>} />
      <Route path="/teacher/courses/:id/lessons"      element={<TeacherLayout><LessonManage /></TeacherLayout>} />
      <Route path="/teacher/courses/:id/assignments"  element={<TeacherLayout><AssignmentManage /></TeacherLayout>} />
      <Route path="/teacher/groups"                   element={<TeacherLayout><TeacherMyGroups /></TeacherLayout>} />
      <Route path="/teacher/profile"                  element={<TeacherLayout><Profile /></TeacherLayout>} />

      {/* Admin */}
      <Route path="/admin"           element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/users"     element={<AdminLayout><AdminUsers /></AdminLayout>} />
      <Route path="/admin/users/:id" element={<AdminLayout><AdminUserDetail /></AdminLayout>} />
      <Route path="/admin/courses"   element={<AdminLayout><AdminCourses /></AdminLayout>} />
      <Route path="/admin/groups"    element={<AdminLayout><AdminGroups /></AdminLayout>} />
      <Route path="/admin/groups/:id" element={<AdminLayout><GroupDetail /></AdminLayout>} />
      <Route path="/admin/profile"   element={<AdminLayout><Profile /></AdminLayout>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
