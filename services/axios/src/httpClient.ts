import axios from 'axios';

const DEFAULT_TIMEOUT = 60000;

const http = axios.create({
    headers: {
        'Cache-control': 'no-cache',
        Pragma: 'no-cache',
        'X-Requested-With': 'XMLHttpRequest'
    },
    timeout: DEFAULT_TIMEOUT
});

export { axios };
export default http;
