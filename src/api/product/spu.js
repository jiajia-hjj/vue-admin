import request from '@/utils/request'

// spu管理  
//获取spu列表 GET /admin/product/{page}/{limit}  category3Id
export const reqSpuList=(page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})


//获取品牌数据 GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademarkList=()=>request({url:'admin/product/baseTrademark/getTrademarkList',method:'get'})
// 获取销售数据--整个平台最多三个  GET /admin/product/baseSaleAttrList
export const reqBaseSaleAttrList=()=>request({url:'/admin/product/baseSaleAttrList',method:'get'})
// 获取spu信息 GET /admin/product/getSpuById/{spuId}
export const reqSpu=(spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
//获取spu图片  GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

//添加spu POST /admin/product/saveSpuInfo
//修改spu POST /admin/product/updateSpuInfo  
//区别是否带id
/**
 {
  "category3Id": 0,
  "description": "string",
  "id": 0,
  "spuName": "string",
  "spuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "spuId": 0
    }
  ],
  "spuSaleAttrList": [
    {
      "baseSaleAttrId": 0,
      "id": 0,
      "saleAttrName": "string",
      "spuId": 0,
      "spuSaleAttrValueList": [
        {
          "baseSaleAttrId": 0,
          "id": 0,
          "isChecked": "string",
          "saleAttrName": "string",
          "saleAttrValueName": "string",
          "spuId": 0
        }
      ]
    }
  ],
  "tmId": 0
}
 */

export const reqAddAndUpdateSpu=(spuInfo)=>{
    if(spuInfo.id){
      return  request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    
    }else{
      return  request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
     }   
}
// 删除spu DELETE /admin/product/deleteSpu/{spuId}

export const reqDeleteSku=(spuId)=> request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'});

//获取添加spu数据  
//获取图片列表  GET /admin/product/spuImageList/{spuId}
// export const reqSpuImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});
//获取销售属性的数据 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList=(spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});
//获取平台属性的数据  GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 
export const reqAttrInfoList =(category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});

//添加sku POST /admin/product/saveSkuInfo
/**
 {
  "category3Id": 0,
  "createTime": "2022-02-24T15:21:14.700Z",
  "id": 0,
  "isSale": 0,
  "price": 0,
  "skuAttrValueList": [
    {
      "attrId": 0,
      "attrName": "string",
      "id": 0,
      "skuId": 0,
      "valueId": 0,
      "valueName": "string"
    }
  ],
  "skuDefaultImg": "string",
  "skuDesc": "string",
  "skuImageList": [
    {
      "id": 0,
      "imgName": "string",
      "imgUrl": "string",
      "isDefault": "string",
      "skuId": 0,
      "spuImgId": 0
    }
  ],
  "skuName": "string",
  "skuSaleAttrValueList": [
    {
      "id": 0,
      "saleAttrId": 0,
      "saleAttrName": "string",
      "saleAttrValueId": 0,
      "saleAttrValueName": "string",
      "skuId": 0,
      "spuId": 0
    }
  ],
  "spuId": 0,
  "tmId": 0,
  "weight": "string"
}
 */

export const reqAddSpu =(skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});
//获取sku列表数据 GET /admin/product/findBySpuId/{spuId}
export const reqSkuList =(spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});