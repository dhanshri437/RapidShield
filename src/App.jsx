import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from '@/lib/theme';
import { RSAuthProvider } from '@/lib/rsAuth';
import { UserRoute, AdminRoute } from '@/components/ProtectedRoute';
import Layout, { AdminLayout } from '@/components/Layout';
import Home from '@/pages/Home';
import Flow from '@/pages/Flow';
import Support from '@/pages/Support';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import MyCase from '@/pages/MyCase';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminCaseDetail from '@/pages/AdminCaseDetail';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError && authError.type === 'user_not_registered') {
    return <UserNotRegisteredError />;
  }

  return (
    <RSAuthProvider>
      <ThemeProvider>
        <Routes>
          {/* Public site */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* User-protected */}
            <Route element={<UserRoute />}>
              <Route path="/flow" element={<Flow />} />
              <Route path="/my-case" element={<MyCase />} />
            </Route>
          </Route>

          {/* Admin (separate layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/case/:id" element={<AdminCaseDetail />} />
            </Route>
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </ThemeProvider>
    </RSAuthProvider>
  );
};


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App