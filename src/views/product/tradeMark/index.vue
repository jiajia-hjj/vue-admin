<template>
  <div>
    <!--button 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- table 表格组件 
           :data  展示数据[数组类型]
           border 加边框
         
           el-table-column 一列一列
           label： 标题
           width：列的宽度
           align: 标题对齐方式
           
           type:序号
           prop：列的key

          -->
    <el-table :data="list" style="width: 100%" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row, index }">
          <img :src="row.logoUrl" alt="logo" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row, index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
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
      @current-change="getPageList"
    >
    </el-pagination>
    <!-- Dialog 对话框
            :visible.sync :控制显示隐藏

            el-form:表单
           :model="tmFrom" 搜集表单数据
           v-model="tmFrom.tmName"  搜集品牌名称
         -->
    <!-- Form 表单
      Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。校验规则参见 async-validator

      :rules="rules"：验证规则
     -->
    <el-dialog
      :title="this.tmFrom.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="tmFrom" :rules="rules" ref="ruleFrom">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmFrom.tmName"></el-input>
        </el-form-item>

        <el-form-item label="品牌LoGo" label-width="100px" prop="logoUrl">
          <!-- Upload 上传  
               不是表单元素，不能用v-model
               action  上传图片地址 ，报错
               :on-success  上传成功执行 
               :before-upload上传之前会执行
             -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpadteTradeMakr"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    //自定义校验规则
    var validateTmName = (rule, value, callback) => {
      if (value.length < 2 || value.length > 10) {
        callback(new Error("品牌名称需要2到10位"));
      } else {
        callback();
      }
    };
    return {
      //当前页码
      page: 1,
      //当前显示页码条数
      limit: 3,
      //总条数
      total: 0,
      //列表展示数据
      list: [],
      // 控制对话框显示隐藏
      dialogFormVisible: false,
      //搜集品牌信息
      tmFrom: {
        logoUrl: "",
        tmName: "",
      },
      //表单验证规则
      rules: {
        // required 必填:五角星   trigger: 用戶行为
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //名称长度变化
          // { min: 2,max: 10,message: "长度在 2 到 10 个字符", trigger: "change",},
          // 自定义校验规则
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [
          //图片是upload，文本不会变化
          { required: true, message: "请选品牌图片" },
        ],
      },
    };
  },
  created() {},
  mounted() {
    this.getPageList();
  },
  methods: {
    //获取品牌列表数据
    async getPageList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        this.list = result.data.records;
        this.total = result.data.total;
      }
    },
    //  某一页数据的条数改变时
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //添加
    showDialog() {
      this.dialogFormVisible = true;
      //清除数据
      this.tmFrom = {
        logoUrl: "",
        tmName: "",
      };
    },
    //修改
    updateTradeMark(row) {
      //row当前用户选中的品牌信息
      //把服务器返回的信息赋值给了tmFrom
      //tmFrom即为服务器的返回信息
      //浅拷贝--直接赋值，对象的地址相同。。所以tmFrom修改了，row也修改
      // this.tmFrom=row;
      //浅拷贝--{...row}属性值是引用类型的话会相互影响，值类的话互补影响
      this.tmFrom = { ...row };
      this.dialogFormVisible = true;
    },
    //删除
    deleteTradeMark(row) {
      // MessageBox 弹框
      this.$confirm(`此操作将永久删除${row.tmName}品牌, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {//点击确定
         let result=await this.$API.tradeMark.reqTradeTradeMark(row.id);
         if(result.code==200){
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getPageList(this.list>1?this.page:this.page-1);
         }else{
           this.$message.error( "删除失败!");
         }

        })
        .catch(() => {//点击取消按钮
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //上传图片成功
    handleAvatarSuccess(res, file) {
      //res file  上传成功之后返回前端的数据
      this.tmFrom.logoUrl = res.data;
    },
    //上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //添加品牌或修改品牌
    addOrUpadteTradeMakr() {
      //全部验证字段通过才能做其他业务获奖操作

      this.$refs.ruleFrom.validate(async (success) => {
        if (success) {
          this.dialogFormVisible = false;
          //发请求
          let result = await this.$API.tradeMark.reqAddUpdateTradeMark(
            this.tmFrom
          );
          if (result.code == 200) {
            //弹出信息  添加成功、修改成功
            this.$message({
              type: "success",
              message: this.tmFrom.id ? "修改成功" : "添加成功",
            });
            // Math.ceil(this.total/this.limit)
            this.getPageList(this.tmFrom.id ? this.page : 1);
          } else {
            this.$message.error(this.tmFrom.id ? "修改失败" : "添加失败");
          }
        } else {
          this.$message.error("请正确填写信息");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
