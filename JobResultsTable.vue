<template>
    <div>
        <div v-if="isDetailsShown" >
            <div>
                <h4>{{ detailsTitle }} <a href="#" @click="collapseDetails">close</a></h4>
            </div>
            <div>
                <pre>{{ detailsContent }}</pre>
            </div>
        </div>
        <h4>Job Results List</h4>
        <div class="table-responsive m-l-10 m-r-10 m-b-25">
            <table class="table pa-table pa-table-hover no-wrap table-bordered">
                <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>status</th>
                    <th>attempts</th>
                    <th>exception</th>
                    <th>created_at</th>
                    <th>updated_at</th>
                    <th>payload</th>
                    <th>queue</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items">
                    <td @click="showPayload(item)"><a href="#">{{ item.id }}</a></td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.status }}</td>
                    <td>{{ getAttemptsCount(item) }}</td>
                    <td @click="showException(item)"><a href="#">{{ getPartOfException(item.exception) }}</a></td>
                    <td>{{ getDateFromTimestamp(item.createdAt) }}</td>
                    <td>{{ getDateFromTimestamp(item.updatedAt) }}</td>
                    <td>{{ item.payload.commandName }}</td>
                    <td>{{ item.queue }}</td>
                </tr>
                </tbody>
            </table>
        </div>
        <div>
            <pp-pagination
                :page-count="pageCount"
                :current-page="currentPage"
                v-on:pageChanged="pageChanged">
            </pp-pagination>
        </div>
    </div>
</template>
<script>

import {getPrettyDate, showObjectAsText} from "@/components/system/redisMon/helper-functions";
import PpPagination from "@/components/UIElements/PpPagination";
import {mapActions, mapState} from "vuex";

export default {
    name: 'JobResultsTable',
    components: {PpPagination},
    data() {
        return {
            detailsTitle: '',
            detailsContent: '',
            isDetailsShown: false,
            currentPage: 1,
            params: {},
        }
    },
    created() {
        this.getJobResultsInfo({page: this.currentPage});
    },
    methods: {
        getDateFromTimestamp: function (timestamp) {
            return getPrettyDate(timestamp);
        },
        getPartOfException: function (exception) {
            if (exception == undefined) {
                return '';
            }
            return exception.substr(0, 30) + '...'
        },
        getAttemptsCount: function (item) {
            if (item.payload != undefined) {
                return item.payload.attempts;
            } else {
                return '';
            }
        },
        showPayload: function (item) {
            this.isDetailsShown = true;
            this.detailsTitle = 'Job for job_' + item.id;
            this.detailsContent = showObjectAsText(item.payload);
        },
        showException: function (item) {
            this.isDetailsShown = true;
            this.detailsTitle = 'Exception for job_' + item.id;
            this.detailsContent = item.exception;
        },
        ...mapActions('redisMonitor', {
            getJobResultsInfo: 'getJobResultsInfo',
            clearItems: 'clearItems',
        }),
        pageChanged: function (page) {
            this.currentPage = page;
            this.clearItems();
            this.getJobResultsInfo({page: this.currentPage, ...this.params});
        },
        filter: function (params) {
            this.params = params;
            this.getJobResultsInfo(this.params);
        },
        collapseDetails: function () {
            this.isDetailsShown = false;
            return false;
        }
    },
    computed: {
        ...mapState({
            items: state => state.redisMonitor.jobsResults,
            pageCount: state => state.redisMonitor.jbPageCount,
            consolidatedInfo: state => state.redisMonitor.consolidatedInfo,
        }),
    },
}
</script>
