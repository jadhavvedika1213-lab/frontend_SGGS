import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})

export const mockApi = {
  confirmComplaint: async (draft) => ({ ok: true, mode: 'mock', draft }),
  submitHumanDecision: async (decision) => ({ ok: true, mode: 'mock', decision }),
  assignOfficer: async (officerId, grievanceId) => ({ ok: true, mode: 'mock', officerId, grievanceId })
}
