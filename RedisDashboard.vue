<template>
    <div>
        <div class="container-fluid">
            <div class="page-titles pa-page-titles row no-gutters">
                <div class="col-12">
                    <div class="wrapper-breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item">
                                <router-link to="/home">
                                    <svg class="svg-icon">
                                        <use xlink:href="#icon-home"/>
                                    </svg>
                                    Home
                                </router-link>
                            </li>
                            <li class="breadcrumb-item active">Redis Dashboard</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <div class="page-wrapper pa-page-wrapper">
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="card">
                                <div class="card-body">
                                    <form class="form-horizontal">
                                        <div class="row">
                                            <div class="col-md-4 col-lg-4 col-xl-4 ">
                                                <label for="status">Status</label>
                                                <div class="form-group ">
                                                    <input
                                                        v-model="filterParams.status"
                                                        type="text"
                                                        id="status"
                                                        name="status"
                                                        placeholder="status"
                                                        class="form-control custom-input">
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-lg-4 col-xl-4 ">
                                                <label for="modelName">Model Name</label>
                                                <div class="form-group ">
                                                    <input
                                                        v-model="filterParams.modelName"
                                                        type="text"
                                                        id="modelName"
                                                        name="modelName"
                                                        placeholder="modelName"
                                                        class="form-control custom-input">
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-lg-4 col-xl-4 ">
                                                <label for="jobName">Job Name</label>
                                                <div class="form-group ">
                                                    <input
                                                        v-model="filterParams.jobName"
                                                        type="text"
                                                        id="jobName"
                                                        name="jobName"
                                                        placeholder="jobName"
                                                        class="form-control custom-input">
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-lg-4 col-xl-4 ">
                                                <label for="attributesContain">Attributes Contain</label>
                                                <div class="form-group ">
                                                    <input
                                                        v-model="filterParams.attributesContain"
                                                        type="text"
                                                        id="attributesContain"
                                                        name="attributesContain"
                                                        placeholder="attributesContain"
                                                        class="form-control custom-input">
                                                </div>
                                            </div>
                                            <div class="col-md-4 col-lg-4 col-xl-3">
                                                <div class="w-100 form-group text-center text-lg-right">
                                                    <label>&nbsp;</label>
                                                    <div class="form-group ">
                                                        <button type="button" class="pa-btn pa-btn-responsive px-5 px-md-0  pa-btn-blue"
                                                                v-on:click="filter">
                                                            Filter
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                    <queue-table ref="queueTable"></queue-table>
                                    <job-results-table ref="jobTable"></job-results-table>
                                    <redis-charts></redis-charts>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>


import PpPagination from "@/components/UIElements/PpPagination";
import JobResultsTable from "@/components/system/redisMon/JobResultsTable.vue";
import QueueTable from "@/components/system/redisMon/QueueTable";
import RedisCharts from "@/components/system/redisMon/RedisCharts";

export default {
    name: 'RedisDashboard',
    components: {RedisCharts, QueueTable, JobResultsTable, PpPagination},
    data() {
        return {
            filterParams: {
                jobName: '',
                attributesContain: '',
                status: '',
                modelName: '',
            }
        }
    },
    created() {

    },
    methods: {
        filter: function () {
            this.$refs.queueTable.filter(this.filterParams);
            this.$refs.jobTable.filter(this.filterParams);
        }
    },
}

</script>