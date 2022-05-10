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
                type:'category'
            },
            yAxis: {
                show: false
            },
            series: [
                {
                    type: 'bar',
                    data: [10, 7, 33, 12, 20, 9, 29, 10, 44,49],
                    color:'#00b8ff'
           
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
            tooltip:{
               
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
