<template>
    <div>
        <div class="row">
            <div class="col-md-4 col-lg-4 col-xl-3">
                <div class="w-100 form-group text-center text-lg-right">
                    <label>&nbsp;</label>
                    <div class="form-group ">
                        <button type="button" class="pa-btn pa-btn-responsive px-5 px-md-0  pa-btn-blue"
                                v-on:click="startWatch">
                            Start Watch ({{ watchingOn }})
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-lg-4 col-xl-3">
                <div class="w-100 form-group text-center text-lg-right">
                    <label>&nbsp;</label>
                    <div class="form-group ">
                        <button type="button" class="pa-btn pa-btn-responsive px-5 px-md-0  pa-btn-blue"
                                v-on:click="stopWatch">
                            Stop Watch
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-12" v-if="visible">
            <line-chart :chart-data="dataSetWithJobCountInQueue" :options="optionForJobCountInQueue"
                        :height="500"></line-chart>
        </div>
        <h4>BackLog</h4>
        <div class="table-responsive m-l-10 m-r-10 m-b-25">
            <table class="table pa-table pa-table-hover no-wrap table-bordered">
                <tr>
                    <th>completed_jobs</th>
                    <th>failed_jobs</th>
                    <th>jobCountInQueue</th>
                    <th>recent_failed_jobs</th>
                    <th>recent_jobs</th>
                    <th>time</th>
                    <th>timeStr</th>
                </tr>
                <tr v-for="values in backLog">
                    <td>{{ values.completed_jobs }}</td>
                    <td>{{ values.failed_jobs }}</td>
                    <td>{{ values.jobCountInQueue }}</td>
                    <td>{{ values.recent_failed_jobs }}</td>
                    <td>{{ values.recent_jobs }}</td>
                    <td>{{ values.time }}</td>
                    <td>{{ values.timeStr }}</td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>

import {mapState, mapActions} from "vuex";
import LineChart from "@/components/system/redisMon/LineChart";
import Table from "@/components/UIElements/Table";

export default {
    name: 'RedisCharts',
    components: {Table, LineChart},
    data() {
        return {
            dataSetWithJobCountInQueue: {
                labels: [],
                datasets: [
                    {
                        label: ['Job Count In Queue'],
                        data: [],
                        backgroundColor: "#acc236"
                    }
                ],
            },
            optionForJobCountInQueue: {},
            watchingOn: false,
            visible: true,
            completed_jobs: 0,
            failed_jobs: 0,
            jobCountInQueue: 0,
            recent_failed_jobs: 0,
            recent_jobs: 0,
            time: 0,
            timeStr: "",
            maxValue: 50,
            isNeedTheHardChartRefreshing: false,
            backLog: [],
        }
    },
    created() {
        let self = this;
        setInterval(function () {
            if (self.watchingOn) {
                self.getData();
            }
        }, 2000);
        this.optionForJobCountInQueue = this.getCommonOptions();
    },
    methods: {
        startWatch: function () {
            this.watchingOn = true;
        },
        getData: function () {
            let promise = this.getChartData();
            let self = this;

            promise.then(function () {
                let labels = self.dataSetWithJobCountInQueue.labels;
                labels.push(self.consolidatedInfo.timeStr);
                let data = self.dataSetWithJobCountInQueue.datasets[0].data;
                data.push(self.consolidatedInfo.jobCountInQueue);
                self.optionForJobCountInQueue = self.getCommonOptions();

                self.dataSetWithJobCountInQueue = {
                    labels: labels,
                    datasets: [
                        {
                            label: ['Job Count In Queue'],
                            data: data,
                            backgroundColor: "#acc236"
                        }
                    ],
                }

                let dataKit = {};
                dataKit.completed_jobs = self.consolidatedInfo.completed_jobs;
                dataKit.failed_jobs = self.consolidatedInfo.failed_jobs;
                dataKit.jobCountInQueue = self.consolidatedInfo.jobCountInQueue;
                dataKit.recent_failed_jobs = self.consolidatedInfo.recent_failed_jobs;
                dataKit.recent_jobs = self.consolidatedInfo.recent_jobs;
                dataKit.time = self.consolidatedInfo.time;
                dataKit.timeStr = self.consolidatedInfo.timeStr;
                self.backLog.push(dataKit);
                self.rotateBackLog();
                if (self.isNeedTheHardChartRefreshing) {
                    self.executeTheHardChartRefresh();
                }
            })
        },
        rotateBackLog: function () {
            if (this.backLog.length > 10) {
                this.backLog.shift();
            }
        },
        stopWatch: function () {
            this.watchingOn = false;
        },
        getCommonOptions: function () {
            return {
                responsive: true,
                title: {
                    display: true,
                    text: 'Jobs'
                },
                maintainAspectRatio: false,
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Time'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Count'
                        },
                        ticks: {
                            min: 0,
                            max: this.getMaxValue(),
                            stepSize: 10
                        }
                    }]
                }
            }
        },
        executeTheHardChartRefresh: function () {
            this.visible = false;
            let self = this;
            setTimeout(function () {
                self.visible = true;
                self.isNeedTheHardChartRefreshing = false;
            }, 0)
        },
        getMaxValue: function () {
            for (let key in this.dataSetWithJobCountInQueue.datasets[0].data) {
                if (this.maxValue < this.dataSetWithJobCountInQueue.datasets[0].data[key]) {
                    this.maxValue = this.dataSetWithJobCountInQueue.datasets[0].data[key];
                    this.isNeedTheHardChartRefreshing = true;
                }
            }
            return this.maxValue;
        },
        ...mapActions('redisMonitor', {
            getChartData: 'getChartData',
        })
    },
    computed: {
        ...mapState({
            consolidatedInfo: state => state.redisMonitor.consolidatedInfo,
        }),
    },
}

</script>