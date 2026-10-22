import api from './axios'

const itineraryTemplateService = {
  list: (params = {}) => api.get('/itinerary-templates', { params }).then((res) => res.data.data),
  get: (id) => api.get(`/itinerary-templates/${id}`).then((res) => res.data.data.item),
  create: (payload) => api.post('/itinerary-templates', payload).then((res) => res.data.data.item),
  update: (id, payload) => api.patch(`/itinerary-templates/${id}`, payload).then((res) => res.data.data.item),
  duplicate: (id) => api.post(`/itinerary-templates/${id}/duplicate`).then((res) => res.data.data.item),
  archive: (id) => api.patch(`/itinerary-templates/${id}/archive`).then((res) => res.data.data.item),
}

export default itineraryTemplateService
