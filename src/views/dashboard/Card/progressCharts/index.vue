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
                min: 0,
                max: 100
            },
            yAxis: {
                show: false,
                // 均分
                type: 'category'
            },
            series: [
                {
                    type: 'bar',
                    data: [78],
                    color: 'pink',
                    barWidth: 10,
                    showBackground: true,
                    //设置背景颜色
                    backgroundStyle: {
                        color: "#eee",

                    },
                    // 文本
                    label:{
                        show:true,
                        formatter:'|',
                        position:'right',
                        color:'pink'
                        
                    }
                }
            ],
            //布局调试
            grid: {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
            },
            // 提示插件
            tooltip: {

            }
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
