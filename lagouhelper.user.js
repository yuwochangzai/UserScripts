// ==UserScript==
// @name         lagouhelper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  拉勾自定义标记
// @author       hujun
// @match        https://www.lagou.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

var cookieHelper={
    getCookie:function(c_name)
    {
        if (document.cookie.length>0)
        {
            var c_start=document.cookie.indexOf(c_name + "=");
            if (c_start!=-1)
            {
                c_start=c_start + c_name.length+1;
                c_end=document.cookie.indexOf(";",c_start);
                if (c_end==-1) c_end=document.cookie.length;
                return unescape(document.cookie.substring(c_start,c_end));
            }
        }
        return "";
    },
    setCookie:function(c_name,value,expiredays)
    {
        var exdate=new Date();
        exdate.setDate(exdate.getDate()+expiredays);
        document.cookie=c_name+ "=" +escape(value)+
            ((expiredays===null) ? "" : ";expires="+exdate.toGMTString());
    }
};


var markHelper={
    markJsonObject:cookieHelper.getCookie('lagouhelperusermark')?JSON.parse(cookieHelper.getCookie('lagouhelperusermark')):{},
    getMark:function(company){
        var remarkDict=markHelper.markJsonObject;
        if(remarkDict[company]){
            return {
                Company:company,
                Remark:remarkDict[company]
            };
        }
        for(var item in remarkDict){
            if(company.indexOf(item)!=-1){
                return {
                    Company:item,
                    Remark:remarkDict[item]
                };
            }
        }
        return null;
    },
    removeMark:function(oldCompany){
        if(oldCompany){
            delete markHelper.markJsonObject[oldCompany];
        }
        //保存到cookie
        cookieHelper.setCookie('lagouhelperusermark',JSON.stringify(markHelper.markJsonObject),365*10);
    },
    saveMark:function(oldCompany,newCompany,remark){
        if(oldCompany){
            delete markHelper.markJsonObject[oldCompany];
        }
        markHelper.markJsonObject[newCompany]=remark;
        //保存到cookie
        cookieHelper.setCookie('lagouhelperusermark',JSON.stringify(markHelper.markJsonObject),365*10);
    }
};

/*
 * 检查公司名称是否被标记
 */
function checkCompany(){
    $('.company_name').each(function(){
        var company=$(this).find('a').text();
        $(this).append('<i><img src="https://www.easyicon.net/api/resizeApi.php?id=1198227&size=24" width="24" alt="标记" title="标记" class="lagouhelper_mark" style="cursor:pointer;"/></i>');
        var mark=markHelper.getMark(company);
        if(mark){
            $(this).append('<i class="lagouhelper_remark"><font color="red">'+mark.Remark+'</font></i>');
        }
    });
}


/*
 * 刷新备注
 */
function refreshRemark(){
    $('.company_name').each(function(){
        var company=$(this).find('a').text();
        var mark=markHelper.getMark(company);
        $(this).find('.lagouhelper_remark').remove();
        if(mark){
            $(this).append('<i class="lagouhelper_remark"><font color="red">'+mark.Remark+'</font></i>');
        }
    });
}


$(function(){
    checkCompany();
    //点击“标记”图标弹出编辑框
    $(document).on('click','.lagouhelper_mark',function(){
        var $company_name=$(this).closest('.company_name');
        var lagoucompany=$company_name.find('a').text();
        var mark=markHelper.getMark(lagoucompany);
        var popupHtml='<div id="lagouhelper_popup_edit" style="width:400px;height:200px;background-color:white;z-index:9999;position:fixed;top:40%;left:40%;border:6px solid rgba(0,0,0,.3);border-radius:5px;box-shadow:none;text-align:center;font-size:16px;">'
        +'<div style="margin-top:50px;"><label>公司关键词：</label><input class="lagouhelper_company" type="text" style="width:250px;height:30px;font-size:16px;" value="'+(mark?mark.Company:lagoucompany)
        +'" data-oldcompany="'+(mark?mark.Company:'')+'"/></div>'
        +'<div style="margin:10px 0 0 48px;"><label>备注：</label><input class="lagouhelper_remark" type="text" style="width:250px;height:30px;font-size:16px;" value="'+(mark?mark.Remark:'')+'"/></div>'
        +'<div style="margin-top:10px;"><input type="button" value="保存" class="lagouhelper_btn_save" style="background-color:#00b38a;color:#fff;width:60px;height:35px;margin:0 5px;font-size:16px;"／>'
        +'<input type="button" value="取消" class="lagouhelper_btn_cancel" style="background-color:#00b38a;color:#fff;width:60px;height:35px;margin:0 5px;font-size:16px;"／></div></div>';
        $('body').append(popupHtml);
    })
    .on('click','.lagouhelper_btn_save',function(){
        var $lagouhelperPopupEdit=$('#lagouhelper_popup_edit');
        var oldCompany=$lagouhelperPopupEdit.find('.lagouhelper_company').attr('data-oldcompany');
        var newCompany=$lagouhelperPopupEdit.find('.lagouhelper_company').val().trim();
        var remark=$lagouhelperPopupEdit.find('.lagouhelper_remark').val().trim();
        //检查输入是否规范
        if(!newCompany){
            alert('公司关键词不能为空或空格');
            return;
        }
        if(!remark){
            markHelper.removeMark(oldCompany);
            markHelper.removeMark(newCompany);
        }
        else{
            markHelper.saveMark(oldCompany,newCompany,remark);
        }
        $('#lagouhelper_popup_edit').remove();
        refreshRemark();
    })
    .on('click','.lagouhelper_btn_cancel',function(){
        $('#lagouhelper_popup_edit').remove();
    })
    .on('click','.pager_container span',function(){
        setTimeout(function(){
        checkCompany();
        },1000);
    });
});
