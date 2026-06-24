import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetail from './pages/CourseDetail';
import Auth from './pages/auth/Auth';

import StudentDashboard from './pages/student/Dashboard';
import MyCourses from './pages/student/MyCourses';
import CourseView from './pages/student/CourseView';
import StudentAssignments from './pages/student/Assignments';

import TeacherDashboard from './pages/teacher/Dashboard';
import TeacherMyCourses from './pages/teacher/MyCourses';
import CourseCreate from './pages/teacher/CourseCreate';
import CourseEdit from './pages/teacher/CourseEdit';
import LessonManage from './pages/teacher/LessonManage';
import AssignmentManage from './pages/teacher/AssignmentManage';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminUserDetail from './pages/admin/UserDetail';
import AdminCourses from './pages/admin/Courses';
import AdminGroups from './pages/admin/Groups';
import GroupDetail from './pages/admin/GroupDetail';
import TeacherMyGroups from './pages/teacher/MyGroups';
import StudentMyGroup from './pages/student/MyGroup';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const StudentLayout = ({ children }) => (
  <RoleRoute role="student"><DashboardLayout>{children}</DashboardLayout></RoleRoute>
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
      <Route path="/" element={<LandingPage />} />
      <Route path="/courses" element={<CoursesPage />} />
      <Route path="/courses/:id" element={<CourseDetail />} />
      <Route path="/login"    element={<Auth initialTab="login" />} />
      <Route path="/register" element={<Auth initialTab="signup" />} />

      {/* Student */}
      <Route path="/student" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
      <Route path="/student/courses" element={<StudentLayout><MyCourses /></StudentLayout>} />
      <Route path="/student/courses/:id" element={<StudentLayout><CourseView /></StudentLayout>} />
      <Route path="/student/assignments" element={<StudentLayout><StudentAssignments /></StudentLayout>} />

      {/* Teacher */}
      <Route path="/teacher" element={<TeacherLayout><TeacherDashboard /></TeacherLayout>} />
      <Route path="/teacher/courses" element={<TeacherLayout><TeacherMyCourses /></TeacherLayout>} />
      <Route path="/teacher/courses/new" element={<TeacherLayout><CourseCreate /></TeacherLayout>} />
      <Route path="/teacher/courses/:id/edit" element={<TeacherLayout><CourseEdit /></TeacherLayout>} />
      <Route path="/teacher/courses/:id/lessons" element={<TeacherLayout><LessonManage /></TeacherLayout>} />
      <Route path="/teacher/courses/:id/assignments" element={<TeacherLayout><AssignmentManage /></TeacherLayout>} />

      {/* Student */}
      <Route path="/student/group" element={<StudentLayout><StudentMyGroup /></StudentLayout>} />
      <Route path="/student/profile" element={<StudentLayout><Profile /></StudentLayout>} />

      {/* Teacher */}
      <Route path="/teacher/groups" element={<TeacherLayout><TeacherMyGroups /></TeacherLayout>} />
      <Route path="/teacher/profile" element={<TeacherLayout><Profile /></TeacherLayout>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
      <Route path="/admin/users/:id" element={<AdminLayout><AdminUserDetail /></AdminLayout>} />
      <Route path="/admin/courses" element={<AdminLayout><AdminCourses /></AdminLayout>} />
      <Route path="/admin/groups" element={<AdminLayout><AdminGroups /></AdminLayout>} />
      <Route path="/admin/groups/:id" element={<AdminLayout><GroupDetail /></AdminLayout>} />
      <Route path="/admin/profile" element={<AdminLayout><Profile /></AdminLayout>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
