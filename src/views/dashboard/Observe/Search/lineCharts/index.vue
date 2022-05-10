<template>
    <div>

        <div class="header">
            <span>搜索用户数</span>

            <i class=" el-icon-info"></i>

        </div>
        <div class="main">
            <span class="main-title">222</span>
            <span class="main-content">56.67%</span>
            <i class=" el-icon-caret-top"></i>
            <i class=" el-icon-caret-bottom"></i>

        </div>
        <div class="footer">
            <div class="charts" ref="charts"></div>
        </div>

    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    // props:['title'],
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
.el-icon-info{
  margin-left: 10px;
  color: #999;
}
.header {
  font-size: 12px;
    display: flex;
    align-items: center;
}
.search-header {
    margin-right: 20px;
}
.main {
    margin: 10px 0px;
}
.main-title {
    margin-right: 30px;
}
.main-content {
    margin-right: 10px;
}
.charts {
    width: 100%;
    height: 50px;
}
</style>
