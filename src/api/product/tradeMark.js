//品牌管理
import request from '@/utils/request'
//品牌列表接口 /admin/product/baseTrademark/{page}/{limit}

export const reqTradeMarkList = (page,limit)=>request({ url: `/admin/product/baseTrademark/${page}/${limit}`,method: 'get'});
//处理添加品牌 POS /admin/product/baseTrademark/save  {"logoUrl": "string","tmName": "string" } 品牌 、logo品牌名称


//修改品牌操作  PUT /admin/product/baseTrademark/update  {"id": 0,"logoUrl": "string","tmName": "string" }

export const reqAddUpdateTradeMark=(tradeMark)=>{
   
    if(tradeMark.id){
       return  request({ url: '/admin/product/baseTrademark/update',method: 'put',data:tradeMark})
    }else{
        return  request({ url: '/admin/product/baseTrademark/save',method: 'post',data:tradeMark})
    }
}
//删除品牌信息 DELETE /admin/product/baseTrademark/remove/{id}

export const reqTradeTradeMark = (id)=>request({ url: `/admin/product/baseTrademark/remove/${id}`,method: 'delete'});