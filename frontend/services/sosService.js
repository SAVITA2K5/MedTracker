import api from './api';

export const triggerSOS = async (userId, latitude, longitude) => {
    const response = await api.post('/sos/trigger', {
        user_id: userId,
        latitude,
        longitude,
        message: '🚨 EMERGENCY: MedTrack SOS Alert triggered.',
    });
    return response.data;
};

export const addEmergencyContact = async (userId, contactData) => {
    const response = await api.post(`/sos/contacts?user_id=${userId}`, contactData);
    return response.data;
};

export const getEmergencyContacts = async (userId) => {
    const response = await api.get(`/sos/contacts/${userId}`);
    return response.data;
};
