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
        <br class="row">
            <div> completed_jobs: {{ completed_jobs }}</div></br>
            <div> failed_jobs: {{ failed_jobs }}</div></br>
            <div> jobCountInQueue: {{ jobCountInQueue }}</div></br>
            <div> recent_failed_jobs: {{ recent_failed_jobs }}</div></br>
            <div> recent_jobs: {{ recent_jobs }}</div></br>
            <div> time: {{ time }}</div></br>
            <div> timeStr: {{ timeStr }}</div>
        </div>
    </div>
    </div>
</template>

<script>

import {mapState, mapActions} from "vuex";
import LineChart from "@/components/system/redisMon/LineChart";

export default {
    name: 'RedisCharts',
    components: {LineChart},
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
            timeStr: ""
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
                self.visible = false;
                let labels = self.dataSetWithJobCountInQueue.labels;
                labels.push(self.consolidatedInfo.timeStr);
                let data = self.dataSetWithJobCountInQueue.datasets[0].data;
                data.push(self.consolidatedInfo.jobCountInQueue);

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
                self.visible = true;

                self.completed_jobs = self.consolidatedInfo.completed_jobs;
                self.failed_jobs = self.consolidatedInfo.failed_jobs;
                self.jobCountInQueue = self.consolidatedInfo.jobCountInQueue;
                self.recent_failed_jobs = self.consolidatedInfo.recent_failed_jobs;
                self.recent_jobs = self.consolidatedInfo.recent_jobs;
                self.time = self.consolidatedInfo.time;
                self.timeStr = self.consolidatedInfo.timeStr;
            })
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
                            max: 50,
                            stepSize: 10
                        }
                    }]
                }
            }
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