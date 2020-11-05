import {authHeader, ResponseHandler, prepeareUrl} from '../../../_helpers';

const redisMonitorService = {
    getJobResultsInfo, getQueueInfo, getChartInfo
}

function getJobResultsInfo(params) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    const url = prepeareUrl('/redismonitor/job-results', params);
    return fetch(url, requestOptions).then(handleResponse);
}

function getQueueInfo(params) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    const url = prepeareUrl('/redismonitor/queue-info', params);
    return fetch(url, requestOptions).then(handleResponse);
}

function getChartInfo(params) {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    const url = prepeareUrl('/redismonitor/chart-data');
    return fetch(url, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        return ResponseHandler.parseResponse(text)
    })
}

export default redisMonitorService;