<template>
  <div>
    <!-- :model="form"  -->
    <el-form ref="form" :model="skuInfo" label-width="80px">
      <el-form-item label="SPU名称">
        {{ spu.name }}
      </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          placeholder="价格(元)"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input
          v-model="skuInfo.skuDesc"
          placeholder="规格描述"
          type="textarea"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <!--  v-model=收集attrId、 valueId -->
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="saleAttr.saleAttreName"
            v-for="saleAttr in spuSaleAttrList"
            :key="saleAttr.id"
          >
            <!--  v-model="model" -->
            <el-select
              placeholder="请选择"
              v-model="saleAttr.attrIdAndValueId"
            >
              <el-option
                :label="saleAttrValue.saleAttreValueName"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList"   @selection-change="handleSelectionChange">
          <el-table-column
            prop=""
            label="label"
            width="80"
            type="selection"
            align="center"
          
          >
          </el-table-column>
          <el-table-column prop="" label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuFrom",
  data() {
    return {
      //存储图片的信息
      spuImageList: [],
      //销售属性
      spuSaleAttrList: [],
      //平台属性
      attrInfoList: [],
      //搜集sku
      skuInfo: {
        //第一类数据：父组件给的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类数据双向绑定
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类，服务器请求，自己写
        //默认图片
        skuDefaultImg: "string",
        //平台属性值列表
        skuAttrValueList: [
          {
            // attrId: 0,
            // valueId: 0,
            // attrName: "",
            // id: 0,
            // skuId: 0,
            // valueName: "string",
          },
        ],

        //图片列表
        skuImageList: [
          {
            // id: 0,
            // imgName: "string",
            // imgUrl: "string",
            // isDefault: "string",
            // skuId: 0,
            // spuImgId: 0,
          },
        ],
        //销售属性
        skuSaleAttrValueList: [
          {
            // saleAttrId: 0,
            // saleAttrValueId: 0,
            // id: 0,
            // saleAttrName: "string",
            // saleAttrValueName: "string",
            // skuId: 0,
            // spuId: 0,
          },
        ],
      },
      spu: {},
       //收集选中的图片，当前收集的数据当中，缺少isDefault字段
      imageList:[]
    };
  },
  created() {},
  mounted() {},
  methods: {
    //获取skuFrom数据
    async getData(category1Id, category2Id, spu) {
      this.spu = spu;
      //搜集父组件给的
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      //获取图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let list = spuImageResult.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性的数据
      let spuSaleAttrResult = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (spuSaleAttrResult.code == 200) {
        this.spuSaleAttrList = spuSaleAttrResult.data;
      }
      //获取平台属性的数据
      let attrInfoResult = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrInfoResult.code == 200) {
        this.attrInfoList = attrInfoResult.data;
      }
    },
    //table表格复选框
    handleSelectionChange(params) {
      //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      this.imageList = params;
    },
    //排他操作
    changeDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //搜集默认图片的地址
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    // 取消回调
    cancel() {
      this.$emit("changeScenes", 0);
    //   清理数据
    Object.assign(this._data,this.$options.data());
    },
    // 保存回调
    async addSpu() {
      // skuAttrValueList、 skuImageList、skuSaleAttrValueList
      //  attrInfoList 、spuImageList(imageList) 、  spuSaleAttrList

      const  {attrInfoList,spuSaleAttrList,skuInfo,imageList}=this;
   /* // 方式1：   
       let arr=[]
       attrInfoList.forEach(item=>{
           //当前平台属性被选择
           if(item.attrIdAndValueId){
             const [attrId,valueId]=item.attrIdAndValueId.split(':');
             let obj={attrId,valueId}
             arr.push(obj)
           }
        })
        skuInfo.skuAttrValueList= arr;*/
    //方式2：reduce
    // 整理平台属性
     skuInfo.skuAttrValueList=attrInfoList.reduce((prev,item)=>{
          if(item.attrIdAndValueId){
             const [attrId,valueId]=item.attrIdAndValueId.split(':');
             prev.push({attrId,valueId})
           }
           return prev
     },[]);

      // 整理销售属性
    skuInfo.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
          if(item.attrIdAndValueId){
            const [saleAttrId,saleAttrValueId]=item.attrIdAndValueId.split(':');
             prev.push({saleAttrId,saleAttrValueId})
           }
           return prev
     },[]);
     //整理图片数据
      skuInfo.skuImageList=imageList.map(item=>{
          return {
            imgName: item.imgName,
            imgUrl: item.imgUrl,
            isDefault: item.isDefault,
            spuImgId:item.spuImgId,
          }
      });
    
     let result = await this.$API.spu.reqAddSpu(skuInfo);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "添加sku成功",
        });
        this.$emit("changeScenes", 0);
      } else {
        this.$message.error("添加sku失败");
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
