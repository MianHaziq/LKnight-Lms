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
  avatar?: string;
  role?: string;
  status?: string;
  accessAll?: boolean;
  isEmailVerified?: boolean;
  hasPassword?: boolean;
  isGoogleUser?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  isNewUser?: boolean;
}

export const authApi = {
  signup: (data: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signup', data),

  signin: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/signin', data),

  googleLogin: (token: string, type: 'credential' | 'accessToken' = 'credential') =>
    api.post<AuthResponse>('/auth/google', type === 'credential' ? { credential: token } : { accessToken: token }),

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

// Contact API
export interface ContactFormData {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export const contactApi = {
  submit: (data: ContactFormData) =>
    api.post<void>('/contact', data),
};

// Contact Admin API
export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: string;
  adminNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageStats {
  total: number;
  new: number;
  read: number;
  replied: number;
  archived: number;
}

export const contactAdminApi = {
  getMessages: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) queryParams.append(key, String(value));
      });
    }
    const queryString = queryParams.toString();
    return api.get<ContactMessage[]>(`/contact/admin/messages${queryString ? `?${queryString}` : ''}`);
  },

  getStats: () =>
    api.get<ContactMessageStats>('/contact/admin/stats'),

  getById: (id: string) =>
    api.get<ContactMessage>(`/contact/admin/${id}`),

  updateStatus: (id: string, status: string) =>
    api.patch<ContactMessage>(`/contact/admin/${id}/status`, { status }),

  addNote: (id: string, note: string) =>
    api.patch<ContactMessage>(`/contact/admin/${id}/note`, { note }),

  delete: (id: string) =>
    api.delete<void>(`/contact/admin/${id}`),
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

// Analytics API (admin analytics page)
export interface AnalyticsOverview {
  totalRevenue: { value: number; currency: string };
  totalUsers: { value: number };
  totalEnrollments: { value: number };
  avgOrderValue: { value: number };
  completionRate: number;
  averageRating: number;
  avgSessionDuration: number;
  satisfactionRate: number;
}

export const analyticsApi = {
  getOverview: (period?: string) =>
    api.get<AnalyticsOverview>(
      `/admin/dashboard/analytics/overview${period ? `?period=${period}` : ''}`
    ),

  getRevenueChart: (months?: number) =>
    api.get<ChartData[]>(
      `/admin/dashboard/revenue-chart${months ? `?months=${months}` : ''}`
    ),

  getUserGrowth: (months?: number) =>
    api.get<{ data: ChartData[]; trend: number }>(
      `/admin/dashboard/user-growth${months ? `?months=${months}` : ''}`
    ),

  getEnrollmentChart: (months?: number) =>
    api.get<ChartData[]>(
      `/admin/dashboard/analytics/enrollment-chart${months ? `?months=${months}` : ''}`
    ),

  getEnrollmentsByCourse: (limit?: number) =>
    api.get<ChartData[]>(
      `/admin/dashboard/analytics/enrollments-by-course${limit ? `?limit=${limit}` : ''}`
    ),

  getRevenueByCategory: () =>
    api.get<(ChartData & { color?: string })[]>(
      `/admin/dashboard/analytics/revenue-by-category`
    ),

  getTopCourses: (limit?: number) =>
    api.get<TopCourse[]>(
      `/admin/dashboard/top-courses${limit ? `?limit=${limit}` : ''}`
    ),
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
  instructorName?: string;
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
  instructorName?: string;
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
  content?: string;  // Base64 encoded video/image (deprecated - use Bunny Stream)
  contentType?: string;  // MIME type
  duration: number;
  order: number;
  moduleId?: string;
  documents?: Document[];
  // Bunny Stream fields
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  videoStatus?: string;  // none | uploaded | processing | encoding | finished | failed
  thumbnailUrl?: string;
  embedUrl?: string;  // Signed embed URL (included in getLessonById response)
}

export interface VideoUploadResponse {
  lessonId: string;
  bunnyVideoId: string;
  videoStatus: string;
  thumbnailUrl: string;
}

export interface TusUploadCredentials {
  endpoint: string;
  videoId: string;
  libraryId: string;
  expirationTime: number;
  authSignature: string;
}

export interface CreateVideoUploadResponse {
  lessonId: string;
  bunnyVideoId: string;
  videoStatus: string;
  thumbnailUrl: string;
  tusUpload: TusUploadCredentials;
}

export interface VideoUrlResponse {
  embedUrl: string;
  expires: number;
  videoStatus: string;
  thumbnailUrl: string;
}

export interface VideoStatusResponse {
  videoStatus: string;
  bunnyVideoId: string;
  thumbnailUrl: string;
  live?: {
    status: number;
    encodeProgress: number;
    length: number;
  };
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
  documents?: Document[];
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
  documents?: Document[];
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

  // Bunny Stream video methods
  uploadVideo: (
    lessonId: string,
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<ApiResponse<VideoUploadResponse>> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('video', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE_URL}/lessons/${lessonId}/video`);

      const token = getAuthToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.message || 'Upload failed'));
          }
        } catch {
          reject(new Error('Failed to parse response'));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.onabort = () => reject(new Error('Upload cancelled'));

      xhr.send(formData);
    });
  },

  getVideoUrl: (lessonId: string) =>
    api.get<VideoUrlResponse>(`/lessons/${lessonId}/video-url`),

  getVideoStatus: (lessonId: string) =>
    api.get<VideoStatusResponse>(`/lessons/${lessonId}/video-status`),

  // TUS direct upload: create video entry in Bunny and get upload credentials
  createVideoUpload: (lessonId: string) =>
    api.post<CreateVideoUploadResponse>(`/lessons/${lessonId}/create-video-upload`, {}),

  // Confirm TUS upload completed
  confirmVideoUpload: (lessonId: string) =>
    api.patch<VideoUploadResponse>(`/lessons/${lessonId}/confirm-video-upload`),
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

// Stripe checkout types
export interface CheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
}

export interface FreeEnrollmentResponse {
  enrollmentId: string;
  free: true;
}

export interface SessionEnrollment {
  enrollmentId: string;
  status: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail?: string;
  };
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

  // Create Stripe checkout session (or enroll directly for free courses)
  createCheckoutSession: (courseId: string) =>
    api.post<CheckoutSessionResponse | FreeEnrollmentResponse>(
      '/enrollments/create-checkout-session',
      { courseId }
    ),

  // Check enrollment status by Stripe session ID (for polling after payment)
  getSessionEnrollment: (sessionId: string) =>
    api.get<SessionEnrollment>(`/enrollments/session/${sessionId}`),

  // Legacy: Purchase/enroll in a single course (kept for backward compatibility)
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

// Team API
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description?: string;
  image?: string;
  email?: string;
  facebook?: string;
  linkedin?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TeamMemberInput {
  name: string;
  role: string;
  description?: string;
  image?: string;
  email?: string;
  facebook?: string;
  linkedin?: string;
  isActive?: boolean;
}

export const teamApi = {
  getAll: (includeInactive?: boolean) =>
    api.get<TeamMember[]>(`/team${includeInactive ? '?all=true' : ''}`),

  getById: (id: string) => api.get<TeamMember>(`/team/${id}`),

  create: (data: TeamMemberInput) => api.post<TeamMember>('/team', data),

  update: (id: string, data: Partial<TeamMemberInput>) =>
    api.put<TeamMember>(`/team/${id}`, data),

  delete: (id: string) => api.delete<void>(`/team/${id}`),

  reorder: (members: { id: string }[]) =>
    api.patch<void>('/team/reorder', { members }),
};

// Testimonial API
export interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  image?: string;
  gender: string;
  showOnHome: boolean;
  showOnAbout: boolean;
  showOnCourses: boolean;
  showOnDashboard: boolean;
  isActive: boolean;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TestimonialInput {
  name: string;
  content: string;
  rating?: number;
  image?: string;
  gender?: string;
  showOnHome?: boolean;
  showOnAbout?: boolean;
  showOnCourses?: boolean;
  showOnDashboard?: boolean;
  isActive?: boolean;
}

export const testimonialApi = {
  getByPage: (page: 'home' | 'about' | 'courses' | 'dashboard') =>
    api.get<Testimonial[]>(`/testimonials?page=${page}`),

  getAll: (includeInactive?: boolean) =>
    api.get<Testimonial[]>(`/testimonials${includeInactive ? '?all=true' : ''}`),

  getById: (id: string) => api.get<Testimonial>(`/testimonials/${id}`),

  create: (data: TestimonialInput) => api.post<Testimonial>('/testimonials', data),

  update: (id: string, data: Partial<TestimonialInput>) =>
    api.put<Testimonial>(`/testimonials/${id}`, data),

  delete: (id: string) => api.delete<void>(`/testimonials/${id}`),

  reorder: (testimonials: { id: string }[]) =>
    api.patch<void>('/testimonials/reorder', { testimonials }),
};

// Document API
export interface Document {
  id: string;
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  content?: string; // Base64 encoded - only returned from getById
  order: number;
  courseId?: string;
  moduleId?: string;
  lessonId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DocumentInput {
  title: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  content: string; // Base64 encoded file
}

export const documentApi = {
  // Course documents
  getByCourse: (courseId: string) =>
    api.get<Document[]>(`/courses/${courseId}/documents`),

  uploadToCourse: (courseId: string, data: DocumentInput) =>
    api.post<Document>(`/courses/${courseId}/documents`, data),

  // Module documents
  getByModule: (moduleId: string) =>
    api.get<Document[]>(`/modules/${moduleId}/documents`),

  uploadToModule: (moduleId: string, data: DocumentInput) =>
    api.post<Document>(`/modules/${moduleId}/documents`, data),

  // Lesson documents
  getByLesson: (lessonId: string) =>
    api.get<Document[]>(`/lessons/${lessonId}/documents`),

  uploadToLesson: (lessonId: string, data: DocumentInput) =>
    api.post<Document>(`/lessons/${lessonId}/documents`, data),

  // Standalone
  getById: (id: string) => api.get<Document>(`/documents/${id}`),

  update: (id: string, data: Partial<DocumentInput>) =>
    api.put<Document>(`/documents/${id}`, data),

  delete: (id: string) => api.delete<void>(`/documents/${id}`),
};

// Vault API (Anonymous Discussion Forum)
export interface VaultDiscussion {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  author: string; // "Anonymous" | "Admin" | "You"
  isAdmin: boolean;
  isOwn: boolean;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
}

export interface VaultComment {
  id: string;
  content: string;
  createdAt: string;
  author: string;
  isAdmin: boolean;
  isOwn: boolean;
  likesCount: number;
  repliesCount: number;
  isLiked: boolean;
  replies: VaultComment[];
}

export interface VaultStats {
  activeMembers: number;
  discussions: number;
  replies: number;
}

export interface VaultDiscussionsResponse {
  discussions: VaultDiscussion[];
  nextCursor: string | null;
}

export interface VaultCommentsResponse {
  comments: VaultComment[];
  nextCursor: string | null;
}

export interface VaultRepliesResponse {
  replies: VaultComment[];
  nextCursor: string | null;
}

export const vaultApi = {
  // Discussions
  getDiscussions: (params?: { category?: string; cursor?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.category && params.category !== 'all') queryParams.append('category', params.category);
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const qs = queryParams.toString();
    return api.get<VaultDiscussionsResponse>(`/vault/discussions${qs ? `?${qs}` : ''}`);
  },

  getDiscussionById: (id: string) =>
    api.get<VaultDiscussion>(`/vault/discussions/${id}`),

  createDiscussion: (data: { title: string; description: string; category: string }) =>
    api.post<VaultDiscussion>('/vault/discussions', data),

  deleteDiscussion: (id: string) =>
    api.delete<void>(`/vault/discussions/${id}`),

  // Likes
  toggleDiscussionLike: (id: string) =>
    api.post<{ isLiked: boolean; likesCount: number }>(`/vault/discussions/${id}/like`, {}),

  toggleCommentLike: (commentId: string) =>
    api.post<{ isLiked: boolean; likesCount: number }>(`/vault/comments/${commentId}/like`, {}),

  // Comments
  getComments: (discussionId: string, params?: { cursor?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const qs = queryParams.toString();
    return api.get<VaultCommentsResponse>(`/vault/discussions/${discussionId}/comments${qs ? `?${qs}` : ''}`);
  },

  createComment: (discussionId: string, data: { content: string; parentId?: string }) =>
    api.post<VaultComment>(`/vault/discussions/${discussionId}/comments`, data),

  deleteComment: (commentId: string) =>
    api.delete<void>(`/vault/comments/${commentId}`),

  // Replies
  getReplies: (commentId: string, params?: { cursor?: string; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.cursor) queryParams.append('cursor', params.cursor);
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const qs = queryParams.toString();
    return api.get<VaultRepliesResponse>(`/vault/comments/${commentId}/replies${qs ? `?${qs}` : ''}`);
  },

  // Polling — lightweight endpoint to fetch new discussions since a timestamp
  pollDiscussions: (params: { since: string; category?: string }) => {
    const queryParams = new URLSearchParams();
    queryParams.append('since', params.since);
    if (params.category && params.category !== 'all') queryParams.append('category', params.category);
    return api.get<{ discussions: VaultDiscussion[] }>(`/vault/discussions/poll?${queryParams.toString()}`);
  },

  // Stats
  getStats: () => api.get<VaultStats>('/vault/stats'),
};

// ============================================
// SETTINGS API
// ============================================

export interface Settings {
  id: string;
  siteName: string;
  logo: string | null;
  contactEmail: string;
  supportEmail: string;
  currency: string;
  defaultCourseStatus: string;
  enrollmentNotifications: boolean;
  marketingEmails: boolean;
  maintenanceMode: boolean;
  hiddenPages: string[];
  updatedAt: string;
}

export interface PublicSettings {
  hiddenPages: string[];
  maintenanceMode: boolean;
}

export const settingsApi = {
  getSettings: () => api.get<Settings>('/settings'),

  getPublicSettings: () => api.get<PublicSettings>('/settings/public'),

  updateSettings: (data: Partial<Omit<Settings, 'id' | 'updatedAt'>>) =>
    api.put<Settings>('/settings', data),
};

// ============================================
// PLAN API
// ============================================

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  closeLine?: string;
  monthlyPrice?: number | null;
  yearlyPrice?: number | null;
  maxUsers: number;
  additionalUserPrice?: number | null;
  features: PlanFeature[];
  ctaText: string;
  ctaType: 'CHECKOUT' | 'CONTACT_SALES';
  isPopular: boolean;
  order: number;
  isActive: boolean;
  stripeMonthlyPriceId?: string | null;
  stripeYearlyPriceId?: string | null;
  stripeProductId?: string | null;
  subscriptionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const planApi = {
  // Public
  getAll: () => api.get<Plan[]>('/plans'),
};

// ============================================
// SUBSCRIPTION API
// ============================================

export interface SubscriptionInfo {
  id: string;
  status: string;
  billingCycle: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
  maxUsers: number;
  organizationName?: string;
  plan: {
    id: string;
    name: string;
    slug: string;
    monthlyPrice?: number | null;
    yearlyPrice?: number | null;
    maxUsers?: number;
  };
  memberCount?: number;
  isTeamMember?: boolean;
  memberRole?: string;
  createdAt?: string;
}

export interface AccessCheckResponse {
  hasAccess: boolean;
  accessAll: boolean;
  subscription?: {
    id: string;
    planName: string;
    expiresAt: string;
    isTeamMember?: boolean;
  };
}

export const subscriptionApi = {
  createCheckoutSession: (data: { planId: string; billingCycle: string; organizationName?: string }) =>
    api.post<{ sessionId: string; sessionUrl: string }>('/subscriptions/create-checkout-session', data),

  getMySubscription: () => api.get<SubscriptionInfo | null>('/subscriptions/my-subscription'),

  cancel: () => api.post<{ cancelAtPeriodEnd: boolean; currentPeriodEnd: string }>('/subscriptions/cancel', {}),

  checkAccess: () => api.get<AccessCheckResponse>('/subscriptions/check-access'),

  getSessionSubscription: (sessionId: string) =>
    api.get<SubscriptionInfo>(`/subscriptions/session/${sessionId}`),

  // Team management
  getTeamMembers: (subscriptionId: string) =>
    api.get<{ id: string; user: User; role: string; joinedAt: string }[]>(`/subscriptions/${subscriptionId}/members`),

  addTeamMember: (subscriptionId: string, email: string) =>
    api.post<{ email: string; invited?: boolean } | { id: string; user: User; role: string; joinedAt: string }>(`/subscriptions/${subscriptionId}/members`, { email }),

  acceptInvite: (token: string) =>
    api.post<{ subscriptionId: string }>('/subscriptions/accept-invite', { token }),

  removeTeamMember: (subscriptionId: string, memberId: string) =>
    api.delete<void>(`/subscriptions/${subscriptionId}/members/${memberId}`),
};

export default api;
