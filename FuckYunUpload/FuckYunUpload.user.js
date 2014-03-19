// ==UserScript==
// @name        FuckYunUpload
// @namespace   UserScripts
// @description FuckYunUpload
// @include     http://www.yunupload.net/*
// @version     1
// @grant       none
// @require     jquery-1.11.0.min.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
$(function(){
    switchMethod();
});

function switchMethod(){
    var pathName = location.pathname;
    console.log(pathName);
    if(pathName.indexOf('/f/')>-1){//f目录
        gotoDownLoadPage();
    }
    else if (pathName.indexOf('/d/') > -1) {//d目录
        //$('iframe').load(function () {
        //    clearPageRubbish();
        //});
        //popupYmPrompt();
        setTimeout(function () {
            clearPageRubbish();
            //popupYmPrompt();
            //downLoadFile();
        }, 1000);
        //popup();
    }
}
//跳转到下载页面
function gotoDownLoadPage() {
    clearInterval(timer1);
        redirectdown();//调用原页面函数，位于: yunupload.net/f/...html  http://www.yunupload.net/f/bf00e3ff82acc83c.html  
        alert('跳转到下载页面..');
}
/**
 * 清除页面垃圾
 */
function clearPageRubbish() {
    $('a').remove();    
    console.log($('body div:last').attr('style'));
    //$('body div:last').remove();
    removeMask();
    console.log($('a div:last').attr('href'));
    $('body a:last').remove();
    $('body').unbind();
    //$('.downqu').css('z-index', 2147483647);
    $('.downqu').mouseover(function () {
        console.log('mouseover');
        $('body div:last').remove();
    });
    //var downqu = $('.downqu').html();
    //console.log(downqu);
    //$('body').html(downqu);
}

function removeMask() {
    var $lastMask = $('body div:last');
    var zindex = $lastMask.css('z-index');
    if (zindex > 1000) {
        //$lastMask.remove();
    }
    $('body').unbind();
    setTimeout(function () {
        removeMask();
    }, 500);
}

function popup() {
    var div = "<div id='divPopup' style='position:fixed;width:200px;height:200px;top:300px;left:200px;z-index:2147483647;background-color:red;'></div>";
    $('body').append(div);
}

//弹出ymPrompt弹出框（没办法只好用自己的弹出框盖过它们）
function popupYmPrompt()
{
    //$("<link>")
    //.attr({
    //    rel: "stylesheet",
    //    type: "text/css",
    //    href: "ymPrompt.css"
    //}).appendTo("head");

    var popupHtml = '<div><label>输入验证码：</label><input type="text"/></div>';
    setTimeout(function () {
        ymPrompt.win({ message: popupHtml, width: 200, height: 200, msgCls: '', showMask: true, title: '输入验证码' });
        $('.ym-window').css({
            'z-index': 20000000,
            'background-color': 'white'
        });
        $('.ym-body').css('z-index', 20000200);
        $('*').unbind('click');
    },1000);
}
function getInput()
{
    var code = $('#myInput').val();
    console.log(code);
    $('#code').val($('#myInput').val());
    $('.submit[name="Submit"]').click();
    ymPrompt.close();
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