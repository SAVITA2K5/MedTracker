import api from './api';

export const predictDiabetes = async (features) => {
    const response = await api.post('/predict/diabetes', features);
    return response.data;
};

export const predictHeart = async (features) => {
    const response = await api.post('/predict/heart', features);
    return response.data;
};

export const getRecommendations = async (disease, riskLevel) => {
    const response = await api.post('/recommendations/', {
        disease,
        risk_level: riskLevel,
    });
    return response.data.recommendations;
};

export const explainPrediction = async (disease, features, probability) => {
    const response = await api.post('/explain/', { 
        disease, 
        features,
        probability
    });
    return response.data;
};
