import axios from 'axios';

export const getInterviews = async () => {
    const response = await axios.get('/interviews');
    return response.data;
}