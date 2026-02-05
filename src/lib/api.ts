// API Configuration and Utility Functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Base fetch wrapper with authentication
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// API Methods
export const api = {
  get: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'GET' }),

  post: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown) =>
    apiFetch<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(endpoint: string) => apiFetch<T>(endpoint, { method: 'DELETE' }),
};

// Auth API
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  status?: string;
  accessAll?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signup', data),

  signin: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signin', data),

  googleLogin: (idToken: string) =>
    api.post<AuthResponse>('/auth/google', { idToken }),

  getMe: (userId: string) => api.get<User>(`/auth/me/${userId}`),

  updateProfile: (userId: string, data: Partial<User>) =>
    api.put<User>(`/auth/profile/${userId}`, data),

  changePassword: (userId: string, data: { currentPassword: string; newPassword: string }) =>
    api.put<void>(`/auth/change-password/${userId}`, data),

  forgotPassword: (email: string) =>
    api.post<void>('/auth/forgot-password', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post<void>('/auth/reset-password', { token, newPassword }),
};

// Dashboard API
export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalUsers: number;
  usersChange: number;
  totalCourses: number;
  coursesChange: number;
  totalEnrollments: number;
  enrollmentsChange: number;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface RecentEnrollment {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  course: {
    id: string;
    title: string;
    price: number;
  };
  enrolledAt: string;
  status: string;
}

export interface TopCourse {
  id: string;
  title: string;
  enrollments: number;
  revenue: number;
  trend: number;
  rating: number;
}

export const dashboardApi = {
  getStats: (period?: string) =>
    api.get<DashboardStats>(`/admin/dashboard/stats${period ? `?period=${period}` : ''}`),

  getRevenueChart: (months?: number) =>
    api.get<ChartData[]>(`/admin/dashboard/revenue-chart${months ? `?months=${months}` : ''}`),

  getUserGrowth: (months?: number) =>
    api.get<{ data: ChartData[]; trend: number }>(`/admin/dashboard/user-growth${months ? `?months=${months}` : ''}`),

  getRecentEnrollments: (limit?: number) =>
    api.get<RecentEnrollment[]>(`/admin/dashboard/recent-enrollments${limit ? `?limit=${limit}` : ''}`),

  getTopCourses: (limit?: number) =>
    api.get<TopCourse[]>(`/admin/dashboard/top-courses${limit ? `?limit=${limit}` : ''}`),
};

// Categories API
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  iconBgColor: string;
  order: number;
  courseCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
  icon?: string;
  iconBgColor?: string;
}

export const categoryApi = {
  getAll: () => api.get<Category[]>('/categories'),

  getById: (id: string) => api.get<Category>(`/categories/${id}`),

  create: (data: CategoryInput) => api.post<Category>('/categories', data),

  update: (id: string, data: CategoryInput) =>
    api.put<Category>(`/categories/${id}`, data),

  delete: (id: string) => api.delete<void>(`/categories/${id}`),

  reorder: (categories: { id: string }[]) =>
    api.patch<void>('/categories/reorder', { categories }),

  getStats: () => api.get<{ totalCategories: number; totalCourses: number; avgCoursesPerCategory: number }>('/categories/stats'),
};

// Courses API
export interface Course {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  thumbnail?: string;
  price: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED';
  category?: Category;
  categoryId?: string;
  instructor?: User;
  instructorId?: string;
  enrollments?: number;
  moduleCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseInput {
  title: string;
  summary?: string;
  description?: string;
  thumbnail?: string;
  categoryId: string;
  instructorId: string;
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  price?: number;
  status?: 'DRAFT' | 'PUBLISHED';
}

export interface CoursesResponse {
  courses: Course[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Module Types
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;  // Base64 encoded video/image
  contentType?: string;  // MIME type
  duration: number;
  order: number;
  moduleId?: string;
}

export interface Module {
  id: string;
  title: string;
  summary?: string;
  description?: string;
  content?: string;  // Base64 encoded video/image
  contentType?: string;  // MIME type
  order: number;
  courseId?: string;
  lessons: Lesson[];
  lessonCount?: number;
  _count?: {
    lessons: number;
  };
}

export interface ModuleInput {
  title: string;
  summary?: string;
  description?: string;
  content?: string;
  contentType?: string;
}

export interface LessonInput {
  title: string;
  description?: string;
  videoUrl?: string;
  content?: string;
  contentType?: string;
  duration?: number;
}

// Extended Course type with full details
export interface CourseDetails extends Course {
  modules?: Module[];
  totalDuration?: number;
  totalLessons?: number;
  revenue?: number;
}

export const courseApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    level?: string;
    status?: string;
    sortBy?: string;
    order?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });
    }
    const queryString = queryParams.toString();
    return api.get<CoursesResponse>(`/courses${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => api.get<CourseDetails>(`/courses/${id}`),

  create: (data: CourseInput) => api.post<Course>('/courses', data),

  update: (id: string, data: Partial<CourseInput>) =>
    api.put<Course>(`/courses/${id}`, data),

  delete: (id: string) => api.delete<void>(`/courses/${id}`),

  toggleStatus: (id: string, status: 'DRAFT' | 'PUBLISHED') =>
    api.patch<Course>(`/courses/${id}/status`, { status }),

  getStats: () =>
    api.get<{
      total: number;
      published: number;
      draft: number;
      totalEnrollments: number;
    }>('/courses/stats'),
};

// Module API
export const moduleApi = {
  getByCourse: (courseId: string) =>
    api.get<Module[]>(`/courses/${courseId}/modules`),

  getById: (id: string) => api.get<Module>(`/modules/${id}`),

  create: (courseId: string, data: ModuleInput) =>
    api.post<Module>(`/courses/${courseId}/modules`, data),

  update: (id: string, data: ModuleInput) =>
    api.put<Module>(`/modules/${id}`, data),

  delete: (id: string) => api.delete<void>(`/modules/${id}`),

  reorder: (courseId: string, modules: { id: string }[]) =>
    api.patch<void>(`/courses/${courseId}/modules/reorder`, { modules }),
};

// Lesson API
export const lessonApi = {
  getByModule: (moduleId: string) =>
    api.get<Lesson[]>(`/modules/${moduleId}/lessons`),

  getById: (id: string) => api.get<Lesson>(`/lessons/${id}`),

  create: (moduleId: string, data: LessonInput) =>
    api.post<Lesson>(`/modules/${moduleId}/lessons`, data),

  update: (id: string, data: LessonInput) =>
    api.put<Lesson>(`/lessons/${id}`, data),

  delete: (id: string) => api.delete<void>(`/lessons/${id}`),

  reorder: (moduleId: string, lessons: { id: string }[]) =>
    api.patch<void>(`/modules/${moduleId}/lessons/reorder`, { lessons }),
};

// Users API
export interface UserDetails extends User {
  enrolledCourses?: number;
  isEmailVerified?: boolean;
}

export interface UsersResponse {
  users: UserDetails[];
  count: number;
}

export const userApi = {
  getAll: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });
    }
    const queryString = queryParams.toString();
    return api.get<UserDetails[]>(`/users${queryString ? `?${queryString}` : ''}`);
  },

  getById: (id: string) => api.get<UserDetails>(`/users/${id}`),

  create: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
  }) => api.post<UserDetails>('/users', data),

  update: (id: string, data: Partial<UserDetails>) =>
    api.put<UserDetails>(`/users/${id}`, data),

  delete: (id: string) => api.delete<void>(`/users/${id}`),

  toggleStatus: (id: string, status: 'ACTIVE' | 'INACTIVE') =>
    api.patch<UserDetails>(`/users/${id}/status`, { status }),

  changeRole: (id: string, role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN') =>
    api.patch<UserDetails>(`/users/${id}/role`, { role }),

  getStats: () =>
    api.get<{
      total: number;
      students: number;
      instructors: number;
      admins: number;
      active: number;
      inactive: number;
    }>('/users/stats'),
};

// Enrollment API for user dashboard
export interface EnrolledCourse {
  enrollmentId: string;
  progress: number;
  status: string;
  enrolledAt: string;
  completedAt?: string;
  course: {
    id: string;
    title: string;
    slug: string;
    summary?: string;
    thumbnail?: string;
    level: string;
    price: number;
    category?: { id: string; name: string; slug: string };
    instructor?: string;
    moduleCount: number;
    lessonCount: number;
    enrollments: number;
  };
}

export interface UserDashboardStats {
  totalEnrolled: number;
  inProgress: number;
  completed: number;
  avgProgress: number;
}

// Course with enrollment status for dashboard
export interface CourseWithStatus {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  thumbnail?: string;
  level: string;
  price: number;
  status?: 'DRAFT' | 'PUBLISHED';
  category?: { id: string; name: string; slug: string };
  instructor?: string;
  moduleCount: number;
  lessonCount: number;
  enrollments: number;
  isEnrolled: boolean;
  hasAccess: boolean;
  enrollmentId?: string;
  progress: number;
  enrolledAt?: string;
}

// Checkout course details
export interface CheckoutCourse {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  description?: string;
  thumbnail?: string;
  level: string;
  price: number;
  category?: { id: string; name: string; slug: string };
  instructor?: string;
  moduleCount: number;
  lessonCount: number;
  enrollments: number;
  modules: { id: string; title: string; lessonCount: number }[];
  hasAccess: boolean;
  isEnrolled: boolean;
  enrollmentId?: string;
}

export const enrollmentApi = {
  // Get user's enrolled courses
  getMyCourses: () =>
    api.get<EnrolledCourse[]>('/enrollments/my-courses'),

  // Get user's dashboard stats
  getMyStats: () =>
    api.get<UserDashboardStats>('/enrollments/my-stats'),

  // Get all courses with enrollment status
  getAllCoursesWithStatus: () =>
    api.get<CourseWithStatus[]>('/enrollments/all-courses'),

  // Get checkout details for a course
  getCheckoutDetails: (courseId: string) =>
    api.get<CheckoutCourse>(`/enrollments/checkout/${courseId}`),

  // Purchase/enroll in a single course
  purchaseCourse: (courseId: string) =>
    api.post<{ enrollmentId: string; course: { id: string; title: string; slug: string } }>(`/enrollments/purchase/${courseId}`, {}),

  // Enroll in all available courses (free access for now)
  enrollInAll: () =>
    api.post<{ enrolled: number }>('/enrollments/enroll-all', {}),

  // Create single enrollment
  create: (data: { userId: string; courseId: string }) =>
    api.post<unknown>('/enrollments', data),

  // Update progress
  updateProgress: (enrollmentId: string, progress: number) =>
    api.patch<unknown>(`/enrollments/${enrollmentId}/progress`, { progress }),
};

export default api;
