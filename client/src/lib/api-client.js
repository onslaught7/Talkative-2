import axios from 'axios';
import { HOST } from '../utils/constants.js'; // This is the base URL for the API.

export const apiClient = axios.create({
    // Setting the base URL to the value of the HOST constant
    // All requests made using 'apiClient' will use this URL as the base
    baseURL: HOST,
});
