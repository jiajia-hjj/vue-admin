<template>
    <div class="charts" ref="charts">

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {
        const lineCharts = echarts.init(this.$refs.charts);
        lineCharts.setOption({
            xAxis: {
                show: false,
                type: 'category'
            },
            yAxis: {
                show: false
            },
            series: [
                {
                    type: 'line',
                    data: [10, 7, 33, 48, 20, 9, 29, 10, 44],
                    smooth: true,
                    //拐点的样式的设置
                    itemStyle: {
                        opacity: 0,
                    },
                    //线条的样式
                    lineStyle: {
                        color: "purple",
                    },
                    //填充颜色设置
                    areaStyle: {
                        color: {
                            type: "linear",
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                {
                                    offset: 0,
                                    color: "purple", // 0% 处的颜色
                                },
                                {
                                    offset: 1,
                                    color: "#fff", // 100% 处的颜色
                                },
                            ],
                            global: false, // 缺省为 false
                        },
                    },

                }
            ],
            //布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
          
        })
    },
    methods: {

    }
};
</script>

<style scoped lang="scss">
.charts {
    width: 100%;
    height: 100%;
}
</style>
