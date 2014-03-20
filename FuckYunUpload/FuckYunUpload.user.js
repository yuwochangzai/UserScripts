// ==UserScript==
// @name        FuckYunUpload
// @namespace   UserScripts
// @description FuckYunUpload
// @match     http://www.yunupload.net/*
// @version     0.1
// @grant       none
// @require     http://code.jquery.com/jquery-1.11.0.min.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(function(){
    switchMethod();
});

function switchMethod(){
    var pathName = location.pathname;
    if(pathName.indexOf('/f/')>-1){//f目录
        gotoDownLoadPage();
    }
    else if (pathName.indexOf('/d/') > -1) {//d目录
        console.log(location);
        handleDPage();
    }
}

/**
 * d页面处理
 */
function handleDPage()
{
    setTimeout(function () {
        clearPageRubbish();
        var hint = '请不要点击任何地方，直接键盘输入验证码后回车，再点击弹出框中的下载链接。否则会疯狂地弹出广告！';
        //$('#yzm').append("<div style='background-color:yellow;width:100%;height:40px;position:relative;top:0;left:0;color:red;font-size:14px;font-weight:bold;'>请不要点击任何地方，直接键盘输入验证码后回车，再点击弹出框中的下载链接。否则会疯狂地弹出广告！</div>");
        $('.downqu span:first font').html(hint);
    }, 1000);   
    $('#code').focus();//焦点聚焦到验证码文本框，此时鼠标不要点击任何位置，直接输入验证码后回车提交。
    $('#code').keyup(function (event) {
        if (event.keyCode == 13) {
            clickDownbtn();
        }
    });
}

/**
 * 模拟点击下载按钮下载
 */
function clickDownbtn()
{
    setTimeout(function () {
        if ($('#downbtn').is(":visible")) {
            $('#downbtn').click();
            //clickDownsALabel();
        }
        else {
            arguments.callee();
        }
    }, 1000);
}

/**
 * 模拟点击弹出的a标签
 */
function clickDownsALabel() {
    setTimeout(function () {
        var $frameshowdown = $(window.frames['show_down'].document);
        console.log($frameshowdown);
        if ($frameshowdown.length > 0 && $frameshowdown.find('#downs').length > 0) {
            $frameshowdown.find('#downs').click();
        }
        else {
            arguments.callee();
        }
    }, 1000);
}

/**
 * 跳转到下载页面
 */
function gotoDownLoadPage() {
        redirectdown();//调用原页面函数，位于: yunupload.net/f/...html  http://www.yunupload.net/f/bf00e3ff82acc83c.html  
        alert('马上跳转到下载页面..');
}
/**
 * 清除页面垃圾
 */
function clearPageRubbish() {
    $('iframe').remove();
    $('a').remove();    
    $('body div:last').remove();
    //removeMask();
    $('body a:last').remove();
    $('body').unbind();
}
/**
 * 定时移除遮照
 */
function removeMask() {
    var $lastMask = $('body div:last');
    var zindex = $lastMask.css('z-index');
    if (zindex > 1000) {
        //$lastMask.remove();
    }
    setTimeout(function () {
        removeMask();
    }, 500);
}



//真正下载弹出框
function downLoadFile()
{
    var strHref = location.href;
    var pageName = strHref.slice(strHref.lastIndexOf("/")+1);
    var fileName = pageName.split('.')[0];
    down_file(fileName, '0');//the pagename is filename
    alert('download...');
}