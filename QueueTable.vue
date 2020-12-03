<template>
    <div>
        <div v-if="isDetailsShown">
            <div>
                <h4>{{ detailsTitle }} <a href="#" @click="collapseDetails">close</a> </h4>
            </div>
            <div>
                <pre>{{ detailsContent }}</pre>
            </div>
        </div>
        <h4>Jobs In Queue</h4>
        <div class="table-responsive m-l-10 m-r-10 m-b-25">
            <table class="table pa-table pa-table-hover no-wrap table-bordered">
                <thead>
                <tr>
                    <th>id</th>
                    <th>name</th>
                    <th>pushed at</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in items">
                    <td @click="showPayload(item)"><a href="#">{{ item.id }}</a></td>
                    <td>{{ item.commandName }}</td>
                    <td>{{ getDateFromTimestamp(item.pushedAt) }}</td>
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
import {mapActions, mapState} from "vuex";
import PpPagination from "@/components/UIElements/PpPagination";

export default {
    name: 'QueueTable',
    components: {PpPagination},
    props: ['filterParams'],
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
        this.getQueueInfo({page: this.currentPage})
    },
    methods: {
        getDateFromTimestamp: function (timestamp) {
            return getPrettyDate(timestamp);
        },
        showPayload: function (item) {
            this.isDetailsShown = true;
            this.detailsTitle = 'Payload for job_' + item.id;
            this.detailsContent = showObjectAsText(item);
        },
        ...mapActions('redisMonitor', {
            getQueueInfo: 'getQueueInfo',
        }),
        pageChanged: function (page) {
            this.currentPage = page;
            this.getQueueInfo({page: this.currentPage, ...this.params})
        },
        filter: function (params) {
            this.params = params;
            this.getQueueInfo(this.params);
        },
        collapseDetails: function () {
            this.isDetailsShown = false;
            return false;
        }
    },
    computed: {
        ...mapState({
            items: state => state.redisMonitor.queueInfo,
            pageCount: state => state.redisMonitor.qiPageCount,
        }),
    },
}
</script>
