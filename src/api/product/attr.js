import request from '@/utils/request'

// 平台属性管理
// 获取一级分类数据  GET GET /admin/product/getCategory1
export const reqCategory1List=()=>request({url:`/admin/product/getCategory1`,method:'get'})
// 获取二级分类数据  /admin/product/getCategory2/{category1Id}
export const reqCategory2List=(category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
// 获取三级分类数据  /admin/product/getCategory3/{category2Id}
export const reqCategory3List=(category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})



//获取平台属性数据 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList=(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});
//添加属性值  POST /admin/product/saveAttrInfo

/*
{
  "attrName": "string",//属性名
  "attrValueList": [ //属性值
    {
      "attrId": 0,     //属性名 的id
      "id": 0,
      "valueName": "string"
    }
  ],
  "categoryId": 0,  //category3Id
  "categoryLevel": 0, //3
  "id": 0
}
*/
export const reqAddOrUppdateAttr=(data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data});
//删除属性 DELETE /admin/product/deleteAttr/{attrId}
export const reqDeleteAttr=(attrId)=>request({url:`/admin/product/deleteAttr/${attrId}`,method:'delete'})