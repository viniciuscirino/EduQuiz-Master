
import { AppData } from './types';
import { INITIAL_DATA } from './constants';

const STORAGE_KEY = 'eduquiz_data_v1';

export const getStorageData = (): AppData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DATA));
    return INITIAL_DATA;
  }
  return JSON.parse(saved);
};

export const saveStorageData = (data: AppData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};
