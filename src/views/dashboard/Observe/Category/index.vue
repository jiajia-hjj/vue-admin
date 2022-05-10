<template>
    <el-card>
        <div slot="header">
            <div class="category-header">
                <span>销售额类别占比</span>
                <el-radio-group v-model="value" size="small">
                    <el-radio-button label="全部渠道"></el-radio-button>
                    <el-radio-button label="线上"></el-radio-button>
                    <el-radio-button label="门店"></el-radio-button>
                </el-radio-group>
            </div>
        </div>
        <div>
            <div class="charts" ref="charts"></div>
        </div>
    </el-card>
</template>

<script>
import * as echarts from 'echarts'
export default {
    data() {
        return {
            value: "全部渠道",
        };
    },
    created() {

    },
    mounted() {
        const myCharts = echarts.init(this.$refs.charts);
        myCharts.setOption({
            title: {
                text: "视频",
                subtext: 1048,
                left: "center",
                top: "center",
            },
            tooltip: {
                trigger: 'item'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {

                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        position: 'outside'
                    },
                    // emphasis: {
                    //     label: {
                    //         show: true,
                    //         fontSize: '40',
                    //         fontWeight: 'bold'
                    //     }
                    // },
                    labelLine: {
                        show: true,
                    },
                    data: [
                        { value: 1048, name: "视频" },
                        { value: 735, name: "Direct" },
                        { value: 580, name: "Email" },
                        { value: 484, name: "Union Ads" },
                        { value: 300, name: "Video Ads" },
                    ]
                }
            ],


        })
        //绑定事件
        myCharts.on('mouseover', (params) => {
            //获取试试吧移动上去的值
            const { value, name } = params.data;
            myCharts.setOption({
                title: {
                    text: name,
                    subtext: value,
                }
            })
        });
    },
    methods: {

    }
};
</script>

<style scoped lang="scss">
.category-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.header {
    border-bottom: 1px solid #eee;
}
.charts {
    width: 100%;
    height: 300px;
}
</style>
