import axios from 'axios';

export const getInterviews = async () => {
    const response = await axios.get('/interviews');
    return response.data;
}

export const getInterviewById = async id => {
    const response = await axios.get(`/interviews/${id}`);
    return response.data;
}