import axios from 'axios';

import { API_URL } from '../constants';

const API_BASE_URL = API_URL;

// Mock Data for Offline Demo Mode
const mockCategories = [];
const mockDesigns = [];
const mockTeam = [];
const mockInquiries = [];

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to automatically append JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rliw_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to intercept network failures and serve mock data in demo mode
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend is offline, return mock data for GET requests
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message.includes('Network Error'))) {
      console.warn('Backend server offline. Falling back to local frontend demo data.');
      
      const config = error.config;
      const url = config.url;
      const method = config.method;

      if (method === 'get') {
        if (url.includes('/categories')) {
          return { data: mockCategories };
        }
        
        if (url.includes('/team')) {
          return { data: mockTeam };
        }
        
        // Single design details (by designId or mongo ObjectId)
        if (url.includes('/designs/')) {
          const parts = url.split('/designs/');
          const id = parts[1];
          const design = mockDesigns.find(d => d.designId === id || d._id === id);
          if (design) {
            return { data: design };
          }
        }
        
        // List designs
        if (url.includes('/designs')) {
          let filtered = [...mockDesigns];
          
          // Apply category filter if query params exist in URL config
          if (config.params && config.params.category) {
            filtered = filtered.filter(d => d.category._id === config.params.category);
          }
          
          // Apply search filter
          if (config.params && config.params.search) {
            const query = config.params.search.toLowerCase();
            filtered = filtered.filter(d => 
              d.title_en.toLowerCase().includes(query) || 
              d.title_te.includes(query) ||
              d.designId.toLowerCase().includes(query)
            );
          }
          
          return { data: filtered };
        }
      } else if (method === 'post' && url.includes('/admin/login')) {
        // Allow mock admin login with credentials
        const data = JSON.parse(config.data);
        if (data.username === 'Rajamoulichary' && data.password === 'Rajamoulichary@779') {
          return {
            data: {
              token: 'mock_jwt_token_for_offline_demo',
              admin: { id: 'mock_admin_id', username: 'Rajamoulichary' }
            }
          };
        }
      } else if (method === 'post' && url.includes('/designs')) {
        // Simulate creating designs in offline mode
        const mockNewDesign = {
          _id: `design_${Date.now()}`,
          designId: `RLIW-${1000 + mockDesigns.length + 1}`,
          title_en: config.data.get('title_en'),
          title_te: config.data.get('title_te'),
          category: mockCategories.find(c => c._id === config.data.get('category')) || mockCategories[0],
          images: [
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
          ],
          description_en: config.data.get('description_en') || '',
          description_te: config.data.get('description_te') || '',
          createdAt: new Date().toISOString()
        };
        mockDesigns.push(mockNewDesign);
        return { data: mockNewDesign };
      } else if (method === 'post' && url.includes('/categories')) {
        // Simulate creating categories in offline mode
        const mockNewCategory = {
          _id: `cat_${Date.now()}`,
          name_en: config.data.get('name_en'),
          name_te: config.data.get('name_te'),
          image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
        };
        mockCategories.push(mockNewCategory);
        return { data: mockNewCategory };
      } else if (method === 'post' && url.includes('/team')) {
        // Simulate creating team member in offline mode
        const mockNewMember = {
          _id: `team_${Date.now()}`,
          name: config.data.get('name'),
          role: config.data.get('role'),
          role_te: config.data.get('role_te') || '',
          exp: config.data.get('exp'),
          image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"
        };
        mockTeam.push(mockNewMember);
        return { data: mockNewMember };
      } else if (method === 'delete' && url.includes('/team/')) {
        const parts = url.split('/team/');
        const id = parts[1];
        const index = mockTeam.findIndex(m => m._id === id);
        if (index !== -1) {
          mockTeam.splice(index, 1);
        }
        return { data: { message: 'Team member removed successfully' } };
      } else if (method === 'delete' && url.includes('/designs/')) {
        const parts = url.split('/designs/');
        const id = parts[1];
        const index = mockDesigns.findIndex(d => d._id === id || d.designId === id);
        if (index !== -1) {
          mockDesigns.splice(index, 1);
        }
        return { data: { message: 'Design removed successfully' } };
      } else if (method === 'delete' && url.includes('/categories/')) {
        const parts = url.split('/categories/');
        const id = parts[1];
        const index = mockCategories.findIndex(c => c._id === id);
        if (index !== -1) {
          mockCategories.splice(index, 1);
        }
        return { data: { message: 'Category removed successfully' } };
      } else if (method === 'put' && url.includes('/categories/')) {
        const parts = url.split('/categories/');
        const id = parts[1];
        const index = mockCategories.findIndex(c => c._id === id);
        if (index !== -1) {
          const name_en = config.data.get('name_en');
          const name_te = config.data.get('name_te');
          const imageFile = config.data.get('image');
          if (name_en) mockCategories[index].name_en = name_en;
          if (name_te) mockCategories[index].name_te = name_te;
          if (imageFile) {
            mockCategories[index].image = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80";
          }
          return { data: mockCategories[index] };
        }
        return { status: 404, data: { message: 'Category not found' } };
      } else if (method === 'put' && url.includes('/team/')) {
        const parts = url.split('/team/');
        const id = parts[1];
        const index = mockTeam.findIndex(t => t._id === id);
        if (index !== -1) {
          const name = config.data.get('name');
          const role = config.data.get('role');
          const role_te = config.data.get('role_te');
          const exp = config.data.get('exp');
          const imageFile = config.data.get('image');
          if (name) mockTeam[index].name = name;
          if (role) mockTeam[index].role = role;
          if (role_te) mockTeam[index].role_te = role_te;
          if (exp) mockTeam[index].exp = exp;
          if (imageFile) {
            mockTeam[index].image = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80";
          }
          return { data: mockTeam[index] };
        }
        return { status: 404, data: { message: 'Team member not found' } };
      } else if (method === 'post' && url.includes('/inquiries')) {
        const payload = JSON.parse(config.data);
        const newInquiry = {
          _id: `inq_${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service: payload.service,
          message: payload.message,
          replied: false,
          createdAt: new Date().toISOString()
        };
        mockInquiries.push(newInquiry);
        return { data: newInquiry };
      } else if (method === 'get' && url.includes('/inquiries')) {
        return { data: mockInquiries };
      } else if (method === 'put' && url.includes('/inquiries/')) {
        const parts = url.split('/inquiries/');
        const id = parts[1];
        const index = mockInquiries.findIndex(i => i._id === id);
        if (index !== -1) {
          mockInquiries[index].replied = true;
          return { data: mockInquiries[index] };
        }
        return { status: 404, data: { message: 'Inquiry not found' } };
      } else if (method === 'delete' && url.includes('/inquiries/')) {
        const parts = url.split('/inquiries/');
        const id = parts[1];
        const index = mockInquiries.findIndex(i => i._id === id);
        if (index !== -1) {
          mockInquiries.splice(index, 1);
        }
        return { data: { message: 'Inquiry removed successfully' } };
      }
    }
    return Promise.reject(error);
  }
);


export const authService = {
  login: async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('rliw_admin_token', response.data.token);
      localStorage.setItem('rliw_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('rliw_admin_token');
    localStorage.removeItem('rliw_admin_user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('rliw_admin_token');
  }
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  create: async (formData) => {
    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const designService = {
  getAll: async (filters = {}) => {
    const response = await api.get('/designs', { params: filters });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/designs/${id}`);
    return response.data;
  },
  create: async (formData) => {
    const response = await api.post('/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await api.put(`/designs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/designs/${id}`);
    return response.data;
  },
};

export const teamService = {
  getAll: async () => {
    const response = await api.get('/team');
    return response.data;
  },
  create: async (formData) => {
    const response = await api.post('/team', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await api.put(`/team/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
};

export const inquiryService = {
  getAll: async () => {
    const response = await api.get('/inquiries');
    return response.data;
  },
  create: async (payload) => {
    const response = await api.post('/inquiries', payload);
    return response.data;
  },
  markReplied: async (id) => {
    const response = await api.put(`/inquiries/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  },
};

export default api;
