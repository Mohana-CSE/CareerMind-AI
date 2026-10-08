import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to inject JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('careermind_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Auth API
export const authAPI = {
  register: async (userData) => {
    const res = await apiClient.post('/auth/register', userData);
    if (res.data.access_token) {
      localStorage.setItem('careermind_token', res.data.access_token);
      localStorage.setItem('careermind_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  login: async (credentials) => {
    const res = await apiClient.post('/auth/login', credentials);
    if (res.data.access_token) {
      localStorage.setItem('careermind_token', res.data.access_token);
      localStorage.setItem('careermind_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },
  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
  logout: () => {
    localStorage.removeItem('careermind_token');
    localStorage.removeItem('careermind_user');
  }
};

// Resume API
export const resumeAPI = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
  loadSampleResume: async () => {
    const res = await apiClient.post('/resume/sample-demo');
    return res.data;
  },
  getCurrentResume: async () => {
    const res = await apiClient.get('/resume/current');
    return res.data;
  }
};

// Roles API
export const rolesAPI = {
  getAllRoles: async () => {
    const res = await apiClient.get('/roles/');
    return res.data;
  },
  getRoleById: async (roleId) => {
    const res = await apiClient.get(`/roles/${roleId}`);
    return res.data;
  },
  selectRole: async (roleId) => {
    const res = await apiClient.post('/roles/select', { role_id: roleId });
    return res.data;
  }
};

// Skill Gap API
export const skillGapAPI = {
  analyze: async (roleId) => {
    const res = await apiClient.get('/skill-gap/analyze', {
      params: roleId ? { role_id: roleId } : {},
    });
    return res.data;
  }
};

// Career Readiness API
export const readinessAPI = {
  getScore: async (roleId) => {
    const res = await apiClient.get('/readiness/score', {
      params: roleId ? { role_id: roleId } : {},
    });
    return res.data;
  }
};

// Adaptive Roadmap API
export const roadmapAPI = {
  getCurrentRoadmap: async (roleId) => {
    const res = await apiClient.get('/roadmap/current', {
      params: roleId ? { role_id: roleId } : {},
    });
    return res.data;
  },
  updateTaskProgress: async (milestoneId, taskId, completed, roleId) => {
    const res = await apiClient.post('/roadmap/task-progress', {
      milestone_id: milestoneId,
      task_id: taskId,
      completed: completed,
    }, {
      params: roleId ? { role_id: roleId } : {},
    });
    return res.data;
  },
  regenerateRoadmap: async (roleId) => {
    const res = await apiClient.post('/roadmap/regenerate', {}, {
      params: roleId ? { role_id: roleId } : {},
    });
    return res.data;
  }
};

// Jobs API
export const jobsAPI = {
  getMatchedJobs: async (roleId) => {
    const res = await apiClient.get('/jobs/matched', {
      params: roleId ? { role_id: roleId } : {},
    });
    return res.data;
  }
};

export default apiClient;
