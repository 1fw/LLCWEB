/**
 * Created by BlueFisher on 2016/10/31 0031.
 */
$(document).ready(function () {
    getTeachers(teacherJSON);

    /****************************************日历插件*******************************************/
    calendar();
    /****************************************高级搜索页面弹出与收起*******************************************/
    adSearch();
});

/****************************************填充论文表单*******************************************/
function teacherJSON(obj) {
    if (obj.status) {
        $("tbody.paperTable>tr").remove();
        fillTeachersTable(obj, "paper");
    }
}

/****************************************填充表格方法*******************************************/
function fillTeachersTable(obj, type) {
    $.each(obj.data, function (i, item) {
        $("tbody." + type + "Table").append("<tr id=" + i + ">");
        $("tbody." + type + "Table tr").eq(i).append("<td id='id'>" + item.id + "</td>");
        $("tbody." + type + "Table tr").eq(i).append("<td id='tname'>" + item.tname + "</td>");
        $("tbody." + type + "Table tr").eq(i).append("<td id='pic_code' >" + item.picCode + "</td>");
        $("tbody." + type + "Table tr").eq(i).append("<td id='title' >" + item.title + "</td>");
        $("tbody." + type + "Table tr").eq(i).append("<td id='introduction'class='ellipsis'>" + item.introduction + "</td>");
        //$("tbody.paperTable tr").eq(i).append("<td id='paper_url'>" + item.paper_url + "</td>");
        $("tbody." + type + "Table tr").eq(i).append("<td id='ope" + i + "'>");
        $("tbody." + type + "Table tr").find("#ope" + i).append("<a href='#'class='edit' onclick='edit(this)' id='" + i + "'></a>");
        $("tbody." + type + "Table tr").find("#ope" + i).append("<a href='#' class='del' onclick='firmDel(this)' id='" + i + "'></a>");
    });
}

// /****************************************页面按键事件*******************************************/
// function getStudentPage(page) {
//     var teamNumUrl = window.location.search;
//     var teamNum = teamNumUrl.substring(teamNumUrl.lastIndexOf('=') + 1, teamNumUrl.length);
//     getProjectByPage(page, 15, teamNum, projectJSON);
// }
//
// /****************************************获取总共的页数*******************************************/
// function page() {
//     var studentUrl = window.location.search;
//     var degreeNum=studentUrl.substring(8,9)
//     var gradeNum = studentUrl.substring(studentUrl.lastIndexOf('=') + 1, studentUrl.length);
//     var totalPage;
//     $.ajax({
//         url: '/stu_DandG?grade='+gradeNum+'&degree='+degreeNum,
//         async: false,
//         dataType: 'json',
//         success: function (obj) {
//             totalPage = obj.data.totalPage;
//         }
//     });
//     return totalPage;
// }

/****************************************填充编辑页面*******************************************/
function edit(obj) {
    $(".content").addClass("disappear");
    $(".content_edit").removeClass("appear");
    $(".save,#first").removeClass("disappear");
    $(".submit").addClass("appear");
    var idValue = $(obj).attr("id");
    fill("id", idValue);
    fill("tname", idValue);
    fill("pic_code",idValue);
    fill("title", idValue);
    fill("introduction", idValue);

    var picCode = $("tbody.tableContent tr").eq(idValue).find('#pic_code').text();
    $('#preview img').attr('src','../getPic?id='+picCode);
}

/****************************************确认是否删除事件*******************************************/
function firmDel(obj) {
    //利用对话框返回的值 （true 或者 false）
    if (confirm("你确定删除吗？")) {
        del(obj,'Teacher');
    }
    else {
        // alert("点击了取消");
    }
}

/****************************************封装数组对象为JSON*******************************************/
function genJson() {
    var obj = new Object();

    obj.id = $(".input_id").val();
    obj.tname = $(".input_tname").val();
    obj.picCode = $(".input_pic_code").val();
    obj.title = $(".input_title").val();
    obj.introduction = $(".input_introduction").val();

    var postdata = JSON.stringify(obj);
    return postdata;

}

/****************************************保存事件*******************************************/
function save() {
    $(".content").removeClass("disappear");
    $(".content_edit").addClass("appear");
    //$(".search_text input").attr("value", genJson());
    sentJSON('modifyTeacher');
}

/****************************************提交事件*******************************************/
function submit() {
    $(".content").removeClass("disappear");
    $(".content_edit").addClass("appear");
    sentJSON("addTeacher");
}

/****************************************发送JSON到后台*******************************************/
function sentJSON(type) {
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '/admin/' + type,
        data: genJson(),
        success: function (obj) {
            if (obj.errorCode != "0x03") {
                // window.location.reload();           //成功后刷新页面
                alert('操作成功！！！');
                getTeachers(teacherJSON);
            }
            else
                alert('无权访问！！！');
        }
    });
}

/****************************************添加事件*******************************************/
function add() {
    $(".content,#first").addClass("disappear");
    $(".content_edit").removeClass("appear");
    $(".save").addClass("disappear");
    $(".submit").removeClass("appear");

    clear();

    getInput("id");
    getInput("tname");
    getInput("pic_code");
    getInput("title");
    getInput("introduction");
}

/****************************************通过回车触发的搜索事件*******************************************/
function searchByEnter(event) {
    var keyCode = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;       //处理兼容性问题
    $("input[name='search']").bind('input propertychange', function () {
        $("input[name='search']").attr("value", $(this).val());
    });
    if (keyCode == "13") {
        searchFill();
    }
}

/****************************************通过鼠标触发的搜索事件*******************************************/
function searchByClick() {
    $("input[name='search']").bind('input propertychange', function () {
        $("input[name='search']").attr("value", $(this).val());
    });
    searchFill();
}

/****************************************搜索事件的填充方法*******************************************/
function searchFill() {
    $('.searchTable').html("");
    var obj = new Object();
    obj.title = $("input[name='search']").val();
    var postdata = JSON.stringify(obj);
    $.ajax({
        type: 'POST',
        contentType: "application/json",
        url: '../limitPapers?currentPage=1&pageSize=100',
        data: postdata,
        success: function (obj) {
            $('.paperTable').addClass('disappear').removeClass('tableContent');
            $('.searchTable').removeClass('appear').addClass('tableContent');
            fillProjectTable(obj, "search");
        }
    });
}