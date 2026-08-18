const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000'
    : 'https://todo-webapp-assessment.onrender.com/api/tasks';

export default API_URL;