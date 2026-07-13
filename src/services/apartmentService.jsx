import axios from "axios";


const APP_URL = import.meta.env.VITE_API + "/admin" + "/apartments";



export const getApartment = (id) => axios.get(`${APP_URL}/${id}`,  {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
    }
});

export const createApartment = (data) => axios.post(`${APP_URL}`, data, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
    }
});

export const deleteApartment = (id) => axios.delete(`${APP_URL}/${id}`, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
    }
})

export const updateApartment = (id,data) => axios.post(`${APP_URL}/${id}`, data, {
    headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${(JSON.parse(localStorage.getItem('user'))).token}`,
        'Content-Type': 'multipart/form-data',
    }
})



