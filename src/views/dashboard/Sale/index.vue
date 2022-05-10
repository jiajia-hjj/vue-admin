<template>
    <div>
        <el-card style="margin:10px;">
            <div slot="header" class="clearfix">
                <!-- v-model="activeName" @tab-click="handleClick" -->
                <el-tabs class="tab" v-model="activeName">
                    <el-tab-pane label="销售额" name="sale"></el-tab-pane>
                    <el-tab-pane label="访问量" name="visite"></el-tab-pane>
                </el-tabs>
                <!-- 头部右侧内容 -->
                <div class="right">
                    <span @click="setDay">今日</span>
                    <span @click="setWeek">本周</span>
                    <span @click="setMonth">本月</span>
                    <span @click="setYear">本年</span>
                    <!--   -->
                    <el-date-picker v-model="date" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div>
                <el-row :gutter="10">
                    <el-col :span="16">
                        <div class="charts" ref="charts"></div>
                    </el-col>
                    <el-col :span="8" class="right">
                        <h3>门店{{title}}额排名</h3>
                        <ul>
                            <li>
                                <span class="rindex">0</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="rindex">1</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span class="rindex">3</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>4</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>5</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>6</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                            <li>
                                <span>7</span>
                                <span>肯德基</span>
                                <span class="rvalue">123456</span>
                            </li>
                        </ul>
                    </el-col>
                </el-row>
            </div>
        </el-card>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    data() {
        return {
            activeName: "sale",
            myCharts: null,
            // 收集日历
            date: []
        };
    },
    computed: {
        title() {
            return this.activeName == 'sale' ? '销售额' : '访问量';
        },
        ...mapState({
            listState: state => state.home.list
        })
    },
    watch: {
        title() {
            //重新修改图标的配置数据
            //图标配置数据可以再次修改，如果有新的数值，新的数值，没有新的数值，还是用以前的
            this.updateCharts();
        },
        listState() {
            // 有数据了就理解更新
            this.updateCharts();
        }
    },
    created() {

    },
    mounted() {
        this.myCharts = echarts.init(this.$refs.charts);
        this.myCharts.setOption({
            title: {
                text: '销售额趋势',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: []
                }
            ]
        });
    },
    methods: {
        // 本天
        setDay() {

            let day = dayjs().format('YYYY-MM-DD');
            this.date = [day, day]
        },
        //    本周
        setWeek() {
            let start = dayjs().day(1).format('YYYY-MM-DD');
            let end = dayjs().day(7).format('YYYY-MM-DD');
            this.date = [start, end]
        },
        //本月
        setMonth() {
            let start = dayjs().startOf('month').format('YYYY-MM-DD');
            let end = dayjs().endOf('month').format('YYYY-MM-DD');
            this.date = [start, end]
        },
        setYear() {
            let start = dayjs().startOf('years').format('YYYY-MM-DD');
            let end = dayjs().endOf('years').format('YYYY-MM-DD');
            this.date = [start, end]
        },
        updateCharts() {
            const listState = this.listState;
            let xAxisData = [], seriesData = [];
            if (this.activeName == 'sale') {
                xAxisData = listState.orderFullYearAxis;
                seriesData = listState.orderFullYear;
            } else {
                xAxisData = listState.userFullYearAxis;
                seriesData = listState.userFullYear;
            }
            this.myCharts.setOption({
                title: {
                    text: this.title + '趋势',
                },
                xAxis: {
                    data: xAxisData
                },
                series: {
                    data: seriesData
                }

            })
        }
    }
};
</script>

<style scoped lang="scss">
::v-deep .el-card__header {
    border: none;
}
.clearfix {
    position: relative;
    display: flex;
    justify-content: space-between;
}
.tab {
    width: 100%;
}
.right {
    position: absolute;
    right: 0px;
}
.date {
    width: 250px;
    margin: 0px 20px;
}
.right > span {
    cursor: pointer;
}
.right span {
    margin: 0px 10px;
}
.charts {
    width: 100%;
    height: 300px;
}
ul {
    list-style: none;
    width: 100%;
    height: 300px;
    padding: 0px;
}
ul li {
    height: 8%;
    margin: 10px 0px;
}
.rindex {
    float: left;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: black;
    color: white;
    text-align: center;
}
.rvalue {
    float: right;
}
</style>
