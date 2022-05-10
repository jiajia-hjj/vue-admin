<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId"  :show="scene!=0"/>
    </el-card>
    <el-card>
      <div v-show="scene==0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
       
        <el-table :data="records" style="width: 100%; margin: 20px" border>
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column  label="操作" width="width">
            <template slot-scope="{ row,$index }">
             <HintButton  type="success" size="mini" icon="el-icon-plus"  title="添加spu" @click="addSku(row)" />
             <HintButton type="warning" size="mini" icon="el-icon-edit"   title="编辑spu" @click="updateSku(row)"/>
            <HintButton  type="info" size="mini" icon="el-icon-info"  title="查看当前spu全部sku列表" @click="handler(row)"/>
             <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSku(row ) "
              >
                 <HintButton type="danger" size="mini" icon="el-icon-delete" title="删除spu"  slot="reference"/>
               
              </el-popconfirm>
              </template>
           <template>

            </template>
          </el-table-column>
        </el-table>
        <!-- pagination 分页器 
             current-page：当前第几页
             total： 总共多少条数据
             page-size="pageSize"  一页显示多少条
             page-sizes：代表设置每一页显示几条数据
             pager-count:展示多少个按钮数量 如果是9 连续的是7
             layout:分页布局，可以调位置  ->直接显示最右

              @current-change  --点击第几页
              @size-change--- 某一页数据的条数改变时
            -->
        <el-pagination
          style="margin-top: 20px; text-align: center"
          :current-page="page"
          :total="total"
          :page-size="limit"
          :pager-count="7"
          :page-sizes="[3, 6, 9]"
          layout=" prev, pager, next, jumper, ->,sizes,total"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
        >
        </el-pagination>
      </div>
      <!--        
          v-show 只是控制元素的显示个隐藏，组件并没有卸载，，，一共只渲染一次，mounted只执行一次
      v-if 真正的条件渲染，当为false是卸载，为true渲染，子组件mounted会被执行
       -->
      <SpuFrom v-show="scene==1" @changeScene="changeScene" ref="spu"/>
      <SkuFrom v-show="scene==2" ref="sku" @changeScenes="changeScenes"/>
       

      <!-- sku列表数据 -->
         <!-- 
           before-close
          -->
      <el-dialog :title="`${spu.spuName}的表格`" :visible.sync="dialogTableVisible" :before-close="close">
        <el-table :data="skuList"  v-loading="loading" border>
          <el-table-column property="skuName" label="名称" width="200"></el-table-column>
          <el-table-column property="price" label="价格" width="80"></el-table-column>
          <el-table-column property="weight" label="重量" width="80"></el-table-column>
          <el-table-column label="默认图片" align="center">
            <template slot-scope="{row}">
             <img :src="row.skuDefaultImg" alt="" style="width:80px;height:80px;">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
   
    </el-card>
  </div>
</template>

<script>
import SpuFrom from './SpuFrom'
import SkuFrom from './SkuFrom'
export default {
  name: "Spu",
  components:{
     SpuFrom,
     SkuFrom
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //当前页码
      page:1,
      //一页多少条数据
      limit:3,
      //一共多少条数据
      total:0,
      //spu列表
      records:[],
      scene:0,//0-列表 1-添加|修改  2添加sku
      // 控制对话框的显示隐藏
      dialogTableVisible:false,
      // sku列表数据
      skuList:[],
      spu:{},
      loading:true
    };
  },
  created() {},
  mounted() {},
  methods: {
     //自定义事件的回调，获取子组件的平台id
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    // 获取spu列表
    async getSpuList(pages=1){
        this.page=pages;
        const {page,limit,category3Id}=this;
        let result=await this.$API.spu.reqSpuList(page,limit,category3Id);
        if(result.code==200){
            this.records=result.data.records;
            this.total=result.data.total;
        }
    },
    //某一页条数发生变化时
    handleSizeChange(limit){
         this.limit=limit;
         this.getSpuList()

    },
    //添加SPU按钮
    addSpu(){
        this.scene=1;
        //通知子组件发请求  发了两
       this.$refs.spu.addSpuData(this.category3Id);
    },
    // 修改spu
    updateSku(row){
         this.scene=1
         //获取子组件的方法，发请求
         this.$refs.spu.initSpuData(row);
    },
    //自定义回调 spu
    changeScene({scene,flag}){
      //flag 为了判断保存是添加还是修改
        this.scene=scene;
        if(flag=="修改"){
           this.getSpuList(this.page);
        }else if(flag=="添加"){
          this.getSpuList(1);
        }
       
    },
    // 删除spu
    async deleteSku(row){
         
        let result=await this.$API.spu.reqDeleteSku(row.id);
        if(result.code==200){
           this.$message({
             type:'success',
             message:'删除成功'
           })
           this.getSpuList(this.records.length>1?this.page:this.page-1);
        }else{
              this.$message('删除失败');
        }
          
    },
    //添加sku
    addSku(row){
         this.scene=2;
         this.$refs.sku.getData(this.category1Id,this.category2Id,row);
    },
    //sku通知父组件切换场景
    changeScenes(scene){
        this.scene=0
    },
    //点击按钮查看对话框的回调
    async handler(spu){
      
        this.dialogTableVisible=true;
        this.spu=spu;
          console.log(this.spu);
          let result=await this.$API.spu.reqSkuList(spu.id);
           console.log(result);
        if(result.code==200){
            this.skuList=result.data;
            this.loading=false;
        }
  
    },
    // 关闭前的回调，会暂停 Dialog 的关闭
    close(done){
        this.loading=true;
        this.skuList=[];
        done();
    }
  },
};
</script>

<style scoped lang="less"></style>
