<template>
    <div>
        <el-table style="width: 100%" border :data="records">
            <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
            <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
            <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
            <el-table-column label="默认图片" width="110">
                <template slot-scope="{ row, $index }">
                    <img :src="row.skuDefaultImg" alt="" style="width: 80px; height: 80px" />
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="80"></el-table-column>
            <el-table-column prop="price" label="价格" width="80"></el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{ row, $index }">
                    <!-- 下按钮 ---已经下架---点击变成上架-->
                    <el-button type="success" icon="el-icon-bottom" size="mini" v-if="row.isSale==0" @click="sale(row)"></el-button>
                    <!-- 上按钮---已经上架 ---点击变成下架-->
                    <el-button type="success" icon="el-icon-top" size="mini" v-else @click="cancel(row)"></el-button>
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
                    <el-button type="info" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination style="text-align:center;" @size-change="handleSizeChange" @current-change="getSkuList" :current-page="page" :page-sizes="[3, 5,10]" :page-size="limit" layout="prev, pager, next, jumper,->, sizes,total" :total="total">
        </el-pagination>

        <!-- Drawer 抽屉 :before-close="handleClose" -->
        <el-drawer :visible.sync="show" :show-close="false" size="700px">
            <el-row>
                <el-col :span="5">名称</el-col>
                <el-col :span="16">{{skuInfo.skuName}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">描述</el-col>
                <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">价格</el-col>
                <el-col :span="16">{{skuInfo.price}}元</el-col>
            </el-row>
            <el-row>
                <el-col :span="5">平台属性</el-col>
                <el-col :span="16">
                    <template>
                        <el-tag type="success" v-for="(attr,index) in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
                    </template>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="5">商品图片</el-col>
                <el-col :span="16">
                    <el-carousel height="200px">
                    <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                       <img :src="item.imgUrl" style="width:150px;height:150px;display:block;margin:20px auto;">
                    </el-carousel-item>
                    </el-carousel>
                </el-col>
            </el-row>
        </el-drawer>
    </div>
</template>

<script>
export default {
    name: 'Sku',
    data() {
        return {
            page: 1, //代表当前第几页
            limit: 5, //代表当前页面有几条数据
            records: [], //存储SKU列表的数据
            total: 0, //存储分页器一共展示的数据
            skuInfo: {},//存储SKU信息
            show: false,
        };
    },
    created() {

    },
    mounted() {
        this.getSkuList();
    },
    methods: {
        //获取sku列表
        async getSkuList(pages = 1) {
            this.page = pages
            const { page, limit } = this;
            let result = await this.$API.sku.reqSkuList(page, limit);
            if (result.code == 200) {
                this.records = result.data.records;
                this.total = result.data.total;
            }
        },
        // 每页页码发生变化
        handleSizeChange(limit) {
            this.limit = limit;
            this.getSkuList()
        },
        // 上架
        async sale(row) {
            let result = await this.$API.sku.reqSale(row.id);
            if (result.code == 200) {
                row.isSale = 1;
                this.$message({ type: 'success', message: '上架成功' });
            }
        },
        // 下架
        async cancel(row) {
            let result = await this.$API.sku.reqCancel(row.id);
            if (result.code == 200) {
                row.isSale = 0;
                this.$message({ type: 'success', message: '下架成功' });
            }
        },
        edit() {
            this.$message('正在开发中....')
        },
        //获取SKU详情的方法
        async getSkuInfo(sku) {
            //展示抽屉
            this.show = true;
            //获取SKU数据
            let result = await this.$API.sku.reqSkuById(sku.id);
            if (result.code == 200) {
                this.skuInfo = result.data;
            }
        }
    }
};
</script>
<style>


  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

</style>
<style scoped >
.el-row .el-col-5 {
    font-size: 18px;
    text-align: right;
}
.el-col {
    margin: 10px 10px;
}

   >>>.el-carousel__button{
    width:10px;
    height:10px;
    background:red;
    border-radius:50%;
  }



</style>
