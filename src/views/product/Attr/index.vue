<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <!-- 平台属性展示 -->
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加平台属性</el-button
        >

        <el-table border :data="arrtList" style="width: 100%; margin: 20px">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column label="属性列表" width="width">
            <!-- 组件中查标签要用插槽 -->
            <template slot-scope="{ row }">
              <el-tag
                size="mini"
                style="margin: 0 5px"
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                style="margin:0 10px;"
              ></el-button>
             

            <!-- 
            Popconfirm 气泡确认框
            -->
              <el-popconfirm :title="`确定删除${row.attrName}属性吗？`" @onConfirm="deleteAttr(row.id)" >
                   <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
              ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加、修改展示平台属性 -->
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              v-model="attrInfo.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          border
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="80px"
          >
          </el-table-column>
          <el-table-column prop="" width="width" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- 编辑input 正常span -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="toLook(row)"
                v-if="row.flag"
                @keyup.enter.native="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="" width="width" label="操作">
            <template slot-scope="{ row,$index }">
              <!-- 
                    Popconfirm 气泡确认框
                 -->
              <el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)" >
                     <el-button type="danger" icon="el-icon-delete" size="mini" slot="reference"
                ></el-button>
              </el-popconfirm>
              
          
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="AddOrUppdateAttr"
        :disabled="attrInfo.attrValueList.length<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash当中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      // 平台属性
      arrtList: [],
      isShowTable: true,
      //收集或修改的属性使用
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [], //属性值
        categoryId: 0, //category3Id 三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      },
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
        this.getAtrrList();
      }
    },
    //确定三级分类时，获取平台属性数据
    async getAtrrList() {
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.arrtList = result.data;
      }
    },
    //点击添加属性按钮
    addAttr() {
      this.isShowTable = false;
      //要清数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [], //属性值
        categoryId: this.category3Id, //category3Id 三级分类的id
        categoryLevel: 3, //因为服务器也需要区分几级id
      };
    },
    // 修改某个属性按钮
    updateAttr(row) {
      this.isShowTable = false;
      //选中结构赋值给attrInfo
      // 浅拷贝--直接赋值，对象的地址相同。。所以attrInfo修改了，row也修改
      this.attrInfo = row;
      //浅拷贝--{...row}属性值是引用类型(attrInfo.attrValueList)的话会相互影响，值类的话互补影响...所以attrInfo.attrValueList改变了。。。row.attrValueList也改变了
      //  this.attrInfo={...row};
      //所以要用深拷贝
      this.attrInfo = cloneDeep(row);
      //在修改某个属性，给属性值添加flag标识
      this.attrInfo.attrValueList.forEach((item) => {
        //给属性值自动添加了flag,但是视图不会发生变化，因为flag不是响应式数据
        //   item.flag=false;
        //vue无法探测普通的新增属性。this.$set。
        //本身身上没有flag,是没办法进行修改要用set
        // this.$set(row,'flag',true);
        // this.$set(要添加的对象,'新的响应式属性',新的属性值);
        this.$set(item, "flag", false);
      });
    },
  
    //添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id, //属性名的id，添加操作没有..修改有id
        valueName: "", //属性值名称
        flag: true, //添加一个标记，区分查看模式和编辑模式。响应式数据
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 失去焦点的回调
    toLook(row) {
      //属性值为空不能为新的属性值

      if (row.valueName.trim() == "") {
        this.$message("请输入属性值");
        return;
      }
      //已有属性值，你能添加
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        //判断是row要从 attrValueList中去除
        if (row !== item) {
          return item.valueName == row.valueName;
        }
      });
      if (isRepeat) {
        return;
      }
      row.flag = false;
    },
    //点击span编辑
    toEdit(row, index) {
      row.flag = true;
      //点击聚焦,获取input,聚焦，点哪一个用ref区分
      //点击切换变成input,要等input dom渲染完了再操作(重绘重排也需要时间,所以不能一点就就获取到)
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //删除按钮, 气泡确认框回调
    //目前模板的就版本，所以是onConfirm
    deleteAttrValue(index){
         this.attrInfo.attrValueList.splice(index,1)
    },
      // 添加/或修改属性
    async AddOrUppdateAttr() {
        //整理参数，1、属性值为空2、不应该出现flag字段
        this.attrInfo.attrValueList=this.attrInfo.attrValueList.filter(item=>{
             if(item.valueName!=''){
                delete item.flag
                return true;
             }
             
         })

      let result = await this.$API.attr.reqAddOrUppdateAttr(this.attrInfo);
      if (result.code == 200) {
          this.$message({
              type:'success',
              message:'保存成功'
          })
          this.isShowTable=true;
          this.getAtrrList();
      }else{
           this.$message('保存失败')
      }
    },
    // 删除自定义属性
    async deleteAttr(attrId){
        let result = await this.$API.attr.reqDeleteAttr(attrId);
        if (result.code == 200) {
          this.$message({
              type:'success',
              message:'删除成功'
          })
          this.getAtrrList();
      }else{
           this.$message('删除失败');
      }
 
    }
  },
};
</script>

<style scoped lang="less"></style>
