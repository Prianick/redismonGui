import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);
import redisMonitorService from "./redismonitor.service"

const state = {
    loading: false,
    jobsResults: {},
    jbPageCount: 1,
    queueInfo: {},
    qiPageCount: 1,
    consolidatedInfo: {},
    error: {},
}

const actions = {
    getJobResultsInfo({commit}, params) {
        commit('loading');
        const res = redisMonitorService.getJobResultsInfo(params)
            .then(
                item => commit('getJobResultsInfoSuccess', item),
                error => commit('getJobResultsInfoFailed', error)
            );
        return res;
    },
    getQueueInfo({commit}, params) {
        commit('loading');
        const res = redisMonitorService.getQueueInfo(params)
            .then(
                item => commit('getQueueInfoSuccess', item),
                error => commit('getQueueInfoFailed', error)
            );
        return res;
    },
    getChartData({commit}, params) {
        commit('loading');
        const res = redisMonitorService.getChartInfo(params)
            .then(
                item => commit('getChartDataSuccess', item),
                error => commit('getChartDataFailed', error)
            );
        return res;
    },
    clearItems({commit}) {
        commit('cleanItems');
    }
}

const mutations = {
    loading: function (state) {
        state.loading = true;
    },
    cleanItems: function (state) {
        state.jobsResults = [];
    },
    getJobResultsInfoSuccess: function (state, response) {
        state.loading = false;
        state.jobsResults = response.items;
        state.jbPageCount = response.pageCount;
    },
    getChartDataSuccess: function (state, response){
        state.consolidatedInfo = {
            recent_jobs: response.recent_jobs,
            completed_jobs: response.completed_jobs,
            recent_failed_jobs: response.recent_failed_jobs,
            failed_jobs: response.failed_jobs,
            measured_jobs: response.measured_jobs,
            measured_queues: response.measured_queues,
            jobCountInQueue: response.jobCountInQueue,
            time: response.time,
            timeStr: response.timeStr,
        };
    },
    getQueueInfoSuccess: function (state, response) {
        state.loading = false;
        state.queueInfo = response.items;
        state.qiPageCount = response.pageCount;
    },
    getJobResultsInfoFailed: function (state, error) {
        state.loading = false;
        state.error = error
    }
}

const getters = {}

const redisMonitor = {
    namespaced: true,
    state,
    actions,
    mutations,
    getters
};

export default redisMonitor;