import api from '@/lib/api';

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getActivities: () => api.get('/dashboard/activities'),
  getChartData: (type: string) => api.get(`/dashboard/charts/${type}`),
};

export const projectApi = {
  getAll: () => api.get('/projects'),
  getStats: () => api.get('/projects/stats'),
  getById: (id: string) => api.get(`/projects/${id}`),
  getKanban: (id: string) => api.get(`/projects/${id}/kanban`),
  updateTaskStatus: (projectId: string, taskId: string, status: string) =>
    api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status }),
};

export const crmApi = {
  getCustomers: () => api.get('/crm/customers'),
  getDeals: () => api.get('/crm/deals'),
  getStats: () => api.get('/crm/stats'),
  getPipeline: () => api.get('/crm/pipeline'),
};

export const hrApi = {
  getEmployees: () => api.get('/hr/employees'),
  getTodayAttendance: () => api.get('/hr/attendance/today'),
  getLeaves: () => api.get('/hr/leaves'),
  getStats: () => api.get('/hr/stats'),
};

export const organizationApi = {
  getDepartments: () => api.get('/organization/departments'),
  getStats: () => api.get('/organization/stats'),
};
