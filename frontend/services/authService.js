import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/constants';

export const register = async (userData) => {
    const response = await api.post('/users/register', userData);
    const { access_token, user } = response.data;
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return response.data;
};

export const login = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const { access_token, user } = response.data;
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, access_token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    return response.data;
};

export const logout = async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
};

export const getStoredUser = async () => {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
};
