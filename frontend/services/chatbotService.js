import api from './api';

export const sendMessage = async (message, userId = null) => {
    const response = await api.post('/chatbot/message', { message, user_id: userId });
    return response.data.reply;
};
