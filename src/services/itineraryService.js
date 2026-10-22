import api from './axios';

const API_BASE = api.defaults.baseURL; // e.g. '/api/v1'

const itineraryService = {
  list: (params = {}) => api.get('/itineraries', { params }).then((res) => res.data.data),
  create: (payload) => api.post('/itineraries', payload).then((res) => res.data.data.item),
  get: (id) => api.get(`/itineraries/${id}`).then((res) => res.data.data.item),
  update: (id, payload) => api.patch(`/itineraries/${id}`, payload).then((res) => res.data.data.item),
  previewHtml: (id) => api.get(`/itineraries/${id}/preview`, { responseType: 'text' }).then((res) => res.data),
  findByEnquiry: (enquiryId) => api.get(`/itineraries/by-enquiry/${enquiryId}`).then((res) => res.data.data.item || null),
  findByInquiry: (inquiryId) => api.get(`/itineraries/by-inquiry/${inquiryId}`).then((res) => res.data.data.item || null),

  // These hit the API directly (not via axios) so the browser can stream/download the file
  // with the auth token attached as a query param or via a signed link, depending on your
  // authMiddleware setup. If routes require a Bearer token, fetch the blob instead - see
  // downloadAsBlob below.
  pdfUrl: (id) => `${API_BASE}/itineraries/${id}/pdf`,
  docxUrl: (id) => `${API_BASE}/itineraries/${id}/docx`,

  pdfBlob: async (id) => (await api.get('/itineraries/' + id + '/pdf', { responseType: 'blob' })).data,
  downloadAsBlob: async (id, type = 'pdf') => {
    const res = await api.get(`/itineraries/${id}/${type}`, { responseType: 'blob' });
    const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = blobUrl;
    const disposition = res.headers?.['content-disposition'] || '';
    const encodedFilename = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
    const quotedFilename = disposition.match(/filename="?([^";]+)"?/i)?.[1];
    let filename = encodedFilename ? decodeURIComponent(encodedFilename) : quotedFilename;
    if (!filename || !filename.toLowerCase().endsWith(`.${type}`)) filename = `itinerary.${type}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  }
};

export default itineraryService;
