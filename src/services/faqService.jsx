import axios from "axios";


const APP_URL = import.meta.env.VITE_API;



export const getFaqs = () => axios.get(`${APP_URL}/faqs`,  {
    headers: {
        'Accept': 'application/json',
    }
});

export const getFaq = (id) => axios.get(`${APP_URL}/faqs/${id}`,  {
    headers: {
        'Accept': 'application/json',
    }
});

export const createFaq = (data) => axios.post(`${APP_URL}/admin/faqs`, data, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
    }
});

export const deleteFaq = (id) => axios.delete(`${APP_URL}/admin/faqs/${id}`, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
    }
})

export const updateFaq = (id,data) => axios.put(`${APP_URL}/admin/faqs/${id}`, data, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
    }
})



