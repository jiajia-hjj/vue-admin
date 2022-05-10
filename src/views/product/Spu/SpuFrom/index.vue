<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            v-for="(tm, index) in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="SPU描述"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片
               list-type  -文件列表
              :on-preview  预览
              :on-remove    删除
              file-list 显示图片 [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
           -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="`还有${unSelectSaleAttr.length}个未选择`" v-model="attrIdAndAttrName">
          <el-option v-for="unselect in unSelectSaleAttr" :key="unselect.d" :label="unselect.name" :value="`${unselect.id}:${unselect.name}`"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" style="margin: 0 10px" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button
        >
        <el-table
          style="width: 100%; margin: 15px 0"
          border
          :data="spu.spuSaleAttrList"
        >
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column  label="属性值列表" width="width">
            <template slot-scope="{ row,$index }">
        
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
             <!-- 底下类似input 和 span切换 -->
             <!-- 
                 @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                 -->
                 <!-- v-if  自己的属性，不能放在全局中 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>

              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form>
        <el-button type="primary" @click="addAndUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuFrom",
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //spu信息,修改是服务器会返回对象，添加时，没有向服务器发请求，收集数据时有哪些字端呢
      spu: {
        //三级分类id
        category3Id: '',
        //描述
        description: '',
        // 品牌id
        tmId: '',
        //spu名称
        spuName: '',
        //spu图片信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "",
          //   imgUrl: "",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "",
          //       saleAttrName: "",
          //       saleAttrValueName: "",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      trademarkList: [], //品牌信息
      spuImageList: [], //spu图片
      saleAttrList: [], //销售属性数据
      attrIdAndAttrName:'',//收集未选择的id
    };
  },
  computed:{
    //计算出还未选择的销售属性 saleAttrList-销售属性数据  尺寸、颜色、版本
    //当前spu拥有的自己的销售属性 spu.spuSaleAttrList  颜色、版本
    unSelectSaleAttr(){
        let result=this.saleAttrList.filter((item)=>{
            //every 返回布尔值
           return this.spu.spuSaleAttrList.every(item1=>{
              return item.name!=item1.saleAttrName;
           }) 
        })
        return result;
    }
  },
  created() {},
  mounted() {
 
  },
  methods: {
    // 图片移除
    handleRemove(file, fileList) {
     //file 删除的图片, fileList 除删除的图片外声音的图片
     //搜集照片墙图片数据
     //服务器不需要name 和 url  提交服务器需要处理
     this.spuImageList=fileList;
     
    },
    // 图片预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
    //   预览的显示和隐藏
      this.dialogVisible = true;
    },
    // 上传成功
    handleSuccess(respon,file,fileList){
        //搜集照片墙图片数据
          this.spuImageList=fileList;
    },
    async initSpuData(spu) {
      //获取spu信息
      let spuResult = await this.$API.spu.reqSpu(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      //获取spu图片
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        let listAttr = spuImageResult.data;
        //照片墙中的图片需要数据，数组的元素需要name和url
        //所以要对数据进行处理
        listAttr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = listAttr;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //添加销售属性按钮
    addSaleAttr(){
     
        const [baseSaleAttrId,saleAttrName]= this.attrIdAndAttrName.split(':');
        // this.spu.spuSaleAttrList 添加新的销售属性
        let newSaleAttr={baseSaleAttrId,saleAttrName,spuSaleAttrValueList: []};
        this.spu.spuSaleAttrList.push(newSaleAttr);
        //清空数据
        this.attrIdAndAttrName='';
    },
    //添加属性值
    addSaleAttrValue(row){
        //点击button->input
        this.$set(row,'inputVisible',true);
        //通过响应式inputValue收集新增的属性值
        this.$set(row,'inputValue','');
    },
    //el-input 失去焦点事件
    handleInputConfirm(row){
        // spu.spuSaleAttrList的item===>row       
        const {baseSaleAttrId,inputValue}=row;
        //判断 1、名称不能为空
        if(inputValue.trim()==''){
            this.$message('属性值不能为空')
        }
        console.log(row.spuSaleAttrValueList)
        const isRepeat=row.spuSaleAttrValueList&&row.spuSaleAttrValueList.some(item=>{
             return item.saleAttrValueName==inputValue;
         })
        if(isRepeat){
           this.$message('属性值不能重复');
           return;
        }
        //新增的属性值 spu.spuSaleAttrList[index].spuSaleAttrValueList
         let newSaleAttrValue= {baseSaleAttrId,saleAttrValueName:inputValue};
         row.spuSaleAttrValueList.push(newSaleAttrValue);
        row.inputVisible=false;
      
    },
    //点击保存按钮回调
   async addAndUpdateSpu(){
          //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段  
        this.spu.spuImageList=this.spuImageList.map(item=>{
          return {
            imgName:item.name,
            imgUrl:(item.respon&&item.respon.data)||item.url,
          }
        })  
        let result = await this.$API.spu.reqAddAndUpdateSpu(this.spu);
        if (result.code == 200) {
            this.$message({
              type:'success',
              message:'保存成功'
            });
            
            this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
        }
      //清理数据
      Object.assign(this._data,this.$options.data());
    },
    //点击添加按钮发请求
    async addSpuData(category3Id){
      this.spu.category3Id=category3Id;
      //获取品牌信息
      let trademarkResult = await this.$API.spu.reqTrademarkList();
      if (trademarkResult.code == 200) {
        this.trademarkList = trademarkResult.data;
      }
      //获取平台全部销售属性
      let saleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (saleResult.code == 200) {
        this.saleAttrList = saleResult.data;
      }
    },
    //取消按钮回调
    cancel(){
      this.$emit('changeScene', {scene:0,flag:''});
      //清理数据
       //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data,this.$options.data());
    }
  },
};
</script>

<style lang="scss">
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
