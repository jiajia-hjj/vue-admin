<template>
    <div>
        <!-- 栅格系统 -->
        <el-row :gutter="10">
            <el-col :span="6">
                <Detail title="总销售额" count="¥ 126560">
                    <template slot="charts">
                        <span>周同比&nbsp;&nbsp;56.67% <i class=" el-icon-caret-top"></i></span>
                        &nbsp;&nbsp;
                        <span>日同比&nbsp;&nbsp;19.96% &nbsp;<i class=" el-icon-caret-bottom"></i></span>
                    </template>
                    <template slot="footer">
                        <span>日销售额￥ 12423</span>
                    </template>
                </Detail>
            </el-col>
            <el-col :span="6">
                <Detail title="访问量" count="88460">
                    <template slot="charts">
                        <lineChart></lineChart>   
                    </template>
                    <template slot="footer">
                        <span>日访问量 1234</span>
                    </template>
                </Detail>

            </el-col>
            <el-col :span="6">
                <Detail title="支付笔数" count="88460">
                    <template slot="charts">
                           <barCharts></barCharts>   
                    </template>
                    <template slot="footer">
                        <span>转换率64%</span>
                    </template>
                </Detail>

            </el-col>
            <el-col :span="6">
                <Detail title="运营活动效果" count="78%">
                    <template slot="charts">
                     <progressCharts></progressCharts>
                    </template>
                    <template slot="footer">
                        <span>周同比&nbsp;&nbsp;56.67% <i class=" el-icon-caret-top"></i></span>
                        &nbsp;&nbsp;
                        <span>日同比&nbsp;&nbsp;19.96% &nbsp;<i class=" el-icon-caret-bottom"></i></span>
                    </template>
                </Detail>

            </el-col>
        </el-row>

    </div>
</template>

<script>
import Detail from './Detail'
import lineChart from './lineChart'
import barCharts from './barCharts'
import progressCharts from './progressCharts'
export default {
    name: 'Card',
    components: {
        Detail,
        lineChart,
        barCharts,
        progressCharts
    },
    data() {
        return {

        };
    },
    created() {

    },
    mounted() {

    },
    methods: {

    }
};
</script>

<style scoped lang="scss">
.el-icon-caret-top {
    color: #ff1e00;
}
.el-icon-caret-bottom {
    color: #00ff55;
}
</style>
