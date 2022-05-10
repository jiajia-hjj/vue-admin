<template>
    <!-- 三级联动 表单下拉框-->
    <div>
        <!-- 
         :inline   行内表单  ，代表一行可以放多个表单 
         :model="formInline"   搜集到的数据
        -->
        <el-form :inline="true" c1ass="demo-form-inline" :model="cFrom">
            <el-form-item label="一级分类">
                <!-- v-model 收集到的是:value -->
                <el-select v-model="cFrom.category1Id" placeholder="请选择" @change="handler1" 
                :disabled="show">
                    <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id">{{c1.name}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="cFrom.category2Id" placeholder="请选择" @change="handler2" :disabled="show">
                    <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id">{{c2.name}}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="cFrom.category3Id" placeholder="请选择" @change="handler3" :disabled="show">
                    <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id">{{c3.name}}</el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    props:['show'],
    name: 'CategorySelect',
    data() {
        return {
            //一级分类数据
            list1: [],
            //二级分类数据
            list2: [],
            //三级分类数据
            list3: [],
            //搜集id
            cFrom: {
                category1Id: '',
                category2Id: '',
                category3Id: ''
            }
        };
    },
    created() {

    },
    mounted() {
        this.getCategory1List();
    },
    methods: {
        //获取一级分类数据
        async getCategory1List() {
            let result = await this.$API.attr.reqCategory1List();
            if (result.code == 200) {
                this.list1 = result.data;
 
            }
        },
        //一级分类选中变化时，去获取二级分类
        async handler1() {
            //一级数据变化，要清除一二级数据
            this.list2 =[];
            this.list3 =[];
            this.cFrom.category2Id='';
            this.cFrom.category3Id='';
            const { category1Id } = this.cFrom;
            this.$emit('getCategoryId',{categoryId:category1Id,level:1});
            let result = await this.$API.attr.reqCategory2List(category1Id);
            if (result.code == 200) {
                this.list2 = result.data;
                
            }
        },
        //二级分类选中变化时，去获取三级分类
        async handler2() {
              //二级数据变化，要清除三级数据
            this.list3 =[];
            this.cFrom.category3Id='';
            const { category2Id } = this.cFrom;
            this.$emit('getCategoryId',{categoryId:category2Id,level:2});
            let result = await this.$API.attr.reqCategory3List(category2Id);
            if (result.code == 200) {
                this.list3 = result.data;
            }
        },
        //三级分类选中变化时
        handler3() {
            const { category3Id } = this.cFrom;
             this.$emit('getCategoryId',{categoryId:category3Id,level:3});
        },
    }
};
</script>

<style scoped lang="less">
</style>
