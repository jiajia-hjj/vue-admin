<template>
    <div>
        <el-card>
        <div class="card-header">
            <span>{{title}}</span>
           
              <i class=" el-icon-info"></i>

        </div>
         <div class="card-content">
             {{count}}
         </div>
          <div class="card-charts">
              <slot name="charts"></slot>
          </div>
           <div class="card-footer">
               <slot name="footer"></slot>
           </div>
        </el-card>
    
    </div>
</template>

<script>
export default {
    name:'Detail',
    props:['title','count'],
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
.card-header{
  display: flex;
  justify-content:space-between;
   color:#d9d9d9;
}
.card-content{
  font-size: 30px;
  padding: 10px 0px;
}
.card-charts{
  height: 50px;
}
.card-footer{
  border-top: 1px solid #eee;
   padding-top: 10px;
}
</style>
