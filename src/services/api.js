const getCsrfToken = () => {
  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta ? meta.getAttribute('content') : '';
};

const request = async (url, options = {}) => {
  const csrfToken = getCsrfToken();
  
  options.headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  };

  if (csrfToken && options.method && options.method !== 'GET') {
    options.headers['X-CSRF-TOKEN'] = csrfToken;
  }

  options.credentials = 'include';

  const response = await fetch(url, options);
  
  if (response.status === 401) {
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin') {
      window.location.href = '/admin';
    }
  }

  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || 'Something went wrong');
  }
  return json;
};

export const api = {
  // Public APIs
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    return request(`/api/products?${query.toString()}`);
  },
  getProduct: (slug) => request(`/api/products/${slug}`),
  getCategories: () => request(`/api/categories?t=${Date.now()}`),
  getSettings: () => request(`/api/settings?t=${Date.now()}`),
  getBanner: () => request(`/api/banner?t=${Date.now()}`),

  // Auth APIs
  login: (username, password) => request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  }),
  logout: () => request('/api/admin/logout', { method: 'POST' }),
  checkAuth: () => request('/api/admin/check'),

  // Admin Dashboard
  getDashboardStats: () => request('/api/admin/dashboard'),

  // Admin Products
  getAdminProducts: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    return request(`/api/admin/products?${query.toString()}`);
  },
  getAdminProduct: (id) => request(`/api/admin/products/${id}`),
  createProduct: (data) => request('/api/admin/products', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateProduct: (id, data) => request(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: 'DELETE' }),
  restoreProduct: (id) => request(`/api/admin/products/${id}/restore`, { method: 'POST' }),
  forceDeleteProduct: (id) => request(`/api/admin/products/${id}/force`, { method: 'DELETE' }),
  bulkProductsAction: (data) => request('/api/admin/products/bulk', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Admin Categories
  getAdminCategories: () => request('/api/admin/categories'),
  createCategory: (data) => request('/api/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateCategory: (id, data) => request(`/api/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteCategory: (id) => request(`/api/admin/categories/${id}`, { method: 'DELETE' }),

  // Admin Settings
  getAdminSettings: () => request('/api/admin/settings'),
  updateSettings: (data) => request('/api/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  updateBanner: (data) => request('/api/admin/banner', {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // Admin Users
  getAdmins: () => request('/api/admin/admins'),
  createAdmin: (data) => request('/api/admin/admins', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateAdmin: (id, data) => request(`/api/admin/admins/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  disableAdmin: (id) => request(`/api/admin/admins/${id}/disable`, { method: 'PATCH' }),
  enableAdmin: (id) => request(`/api/admin/admins/${id}/enable`, { method: 'PATCH' }),
  deleteAdmin: (id) => request(`/api/admin/admins/${id}`, { method: 'DELETE' }),

  // Security Audit
  getLogs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/admin/logs?${query}`);
  },
  getBlockedIps: () => request('/api/admin/blocked-ips'),
  unblockIp: (id) => request(`/api/admin/blocked-ips/${id}`, { method: 'DELETE' }),

  // Backups
  getBackups: () => request('/api/admin/backups'),
  createBackup: () => request('/api/admin/backups', { method: 'POST' }),
  deleteBackup: (filename) => request(`/api/admin/backups/${filename}`, { method: 'DELETE' }),
  restoreBackup: (formData) => {
    const csrfToken = getCsrfToken();
    const headers = {};
    if (csrfToken) {
      headers['X-CSRF-TOKEN'] = csrfToken;
    }
    return fetch('/api/admin/backups/restore', {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include'
    }).then(async (res) => {
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Restore failed');
      return json;
    });
  }
};
