var url = "./";

function getType(type) {
    switch (type) {
        case "1": return "食品饮品";
        case "2": return "书籍";
        case "3": return "电子产品";
        case "4": return "服饰";
        case "5": return "化妆品";
        case "6": return "运动器材";
        case "7": return "日用品";
        case "8": return "账号";
        case "9": return "其他";
        default:  return "其他";
    }
}
// cookie相关操作
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        var ret = {};
        var spl = unescape(arr[2]).split(", ");
        for (var x in spl) {
            var item = spl[x].substring(0, spl[x].indexOf("="));
            var value = spl[x].substring(spl[x].indexOf("=") + 1);
            ret[item] = value;
        }
        return ret;
    } else {
        return null;
    }
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    // 这里需要判断一下cookie是否存在
    var c = getCookie(name);
    if (c != null) {
        document.cookie = name + "=" + c + ";expires=" + exp.toGMTString();
    }
}

function UidCheck(str) {
    // 判断字符串是否为数字
    var zg = /^[0-9]*[1-9][0-9]*$/;
    if (!zg.test(str)) {
        return false;
    } else {
        return true;
    }
}
function logout() {
    delCookie(1);
    console.log(getCookie(1));
    $("#logstatus").html("登录/注册");
    $("#logstatus").on("click", function () {});
}
function checkLog() {
    if (getCookie(1)) {
        console.log(getCookie(1));
        $("#logstatus").html("登出")
        $("#logstatus").on("click", logout);
        return true;
    }
    else
        return false;
}

// 提交注册信息
function reg() {
    var params = $("#regedit").serializeArray();
    var values_reg = {"op": "Register_auth"};
    for (var x in params) {
        values_reg[params[x].name] = params[x].value;
    }
    // 密码需要重新获取明文
    values_reg["U_password"] = document.getElementById("U_password").value;
    values_reg["U_password_r"] = document.getElementById("U_password_r").value;
    // 验证格式正确性
    var ErrorInfo = "";
    var check = true;
    if (values_reg["U_name"] == "" || values_reg["U_id"] == "" || values_reg["U_info"] == "" || values_reg["U_password"] == "" || values_reg["U_password_r"] == "") {
        ErrorInfo += "输入不能为空。\n";
        check = false;
    } else {
        if (!UidCheck(values_reg["U_id"])) {
            ErrorInfo += "QQ号只能为数字。\n";
            check = false;
        }
        if (values_reg["U_password"] != values_reg["U_password_r"]) {
            ErrorInfo += "两次输入的密码不一致。\n";
            check = false;
        }
    }
    values_reg["is_login"] = 1;
    values_reg["ErrorInfo"] = ErrorInfo;
    values_reg_post = JSON.stringify(values_reg);
    $.ajax({
            url: url,
            type: "POST",
            data: " " + values_reg_post,
            dataType: "text",
            success: function (responseTxt) {
                // responseTxt = responseTxt.substring(0, responseTxt.indexOf('}')+1);
                if (responseTxt == "false") {
                    alert(values_reg["ErrorInfo"]);
                } else {
                    alert("注册成功！即将跳转至首页。");
                    var cookieinfo = "";
                    cookieinfo += "U_name=" + values_reg["U_name"] + ", ";
                    cookieinfo += "U_id=" + values_reg["U_id"] + ", ";
                    cookieinfo += "U_password=" + values_reg["U_password"] + ", ";
                    cookieinfo += "U_info=" + values_reg["U_info"] + ", ";
                    cookieinfo += "is_login=1";
                    setCookie(values_reg["is_login"], cookieinfo);
                    window.location.href = "index.html";
                }
            }
        }
    );
}

// 提交登录表单
function login() {
    var xhr_log = new XMLHttpRequest();
    var params = $("#loginedit").serializeArray();


    var values_log = {"op": "Login_auth"};
    for (x in params) {
        values_log[params[x].name] = params[x].value;
    }
    values_log["U_password"] = document.getElementById("U_password").value;


    $.ajax({
            url: url,
            type: "POST",
            data: " " + JSON.stringify(values_log),
            dataType: "text",
            success: function (responseTxt) {
                responseTxt = responseTxt.substring(0, responseTxt.indexOf('}') + 1);
                // responseTxt = values_log;

                var ret = JSON.parse(responseTxt);

                switch (ret["@return"]) {
                    case ("0"): {
                        alert("用户不存在！请检查输入的QQ号。");
                        break;
                    }
                    case ("1"): {
                        alert("用户名与密码不匹配！");
                        break;
                    }
                    case ("2"): {

                        var cookieinfo = "";
                        cookieinfo += "U_id=" + values_log["U_id"] + ", ";
                        cookieinfo += "U_password=" + values_log["U_password"] + ", ";
                        cookieinfo += "is_login=1";
                        setCookie(1, cookieinfo);

                        alert("登陆成功！即将跳转至首页。");
                        window.location.href = "index.html";
                        break;
                    }

                }
            }
        }
    );


    // xhr_log.open("POST", url,false);
    // xhr_log.send(JSON.stringify(values_log));

}

function sg_publish() {
    if(!checkLog()) {
        alert("请登录！");
        window.location.href = "login.html";
    }
    // 获取表单中内容
    var params = $("#sgedit").serializeArray();


    var values_sg = { "op": "SG_publish" };
    for(x in params) {
        values_sg[params[x].name] = params[x].value;
    }
    values_sg["U_id"] = getCookie(1)["U_id"];
    // 读取图片
    var file = document.getElementById("image").files[0];
    var reader_sg = new FileReader();

    reader_sg.onload = function(e) {
        var formData = new FormData();
        formData.append("image", e.target.result);

        for(var pair of formData.entries()) {
            values_sg[pair[0]] = pair[1];
        }
        values_sg = JSON.stringify(values_sg);
        $.ajax({
            url: url,
            method: "POST",
            data: " "+values_sg,
            dataType: "text",
            success: function (responseTxt, statusTxt, xhr_log) {
                if(responseTxt == "true") {
                    window.alert("发布成功!");
                    window.location.href = "index.html";
                }
            }
        })
    };

    reader_sg.readAsDataURL(file);
}


// 提交欲购物品表单
function wg_publish() {
    if(!checkLog()) {
        alert("请登录！");
        window.location.href = "login.html";
    }
    // 获取表单中内容
    var params = $("#wgedit").serializeArray();

    var values_wg = {"op": "WG_publish"};
    for (x in params) {
        values_wg[params[x].name] = params[x].value;
    }
    values_wg["U_id"] = getCookie(1)["U_id"];
    values_wg = JSON.stringify(values_wg);
    $.ajax({
        url: url,
        data: " " + values_wg,
        dataType: "text",
        method: "POST",
        success: function () {
            alert("发布成功！");
            window.location.href = "needs.html";
        }
    })

}

// 预览图片
function readFile() {
    var file = this.files[0];
    var src = window.URL.createObjectURL(file);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        $('#showImg').attr('src', src);
    }
}

// 提交响应
function SG_respond(SG_id, U_id) {
    var values_sgres = {"op": "SG_response"};
    values_sgres["SG_id"] = parseInt(SG_id);
    values_sgres["U_id"] = U_id;
    values_sgres = JSON.stringify(values_sgres);
    $.ajax({
        url: url,
        data: " " + values_sgres,
        dataType: "text",
        method: "POST",
    })
}

function WG_respond(WG_id, U_id) {
    var values_wgres = {"op": "WG_response"};
    values_wgres["WG_id"] = parseInt(WG_id);
    values_wgres["U_id"] = U_id;
    values_wgres = JSON.stringify(values_wgres);
    $.ajax({
        url: url,
        data: " " + values_wgres,
        dataType: "text",
        method: "POST",
    })
}

function Confirm(Item_ID, Publisher_ID, Responsor_ID) {
    var confirm_item = { "op": "confirm_SG_deal", "G_id": Item_ID, "Publisher_id": Publisher_ID, "Responsor_id": Responsor_ID };
    confirm_item = " " + JSON.stringify(confirm_item);
    $.ajax({
        url: url,
        method: "POST",
        data: confirm_item,
        dataType: "text"
    });
}

// 商品详情页内容的显示
function showInfo_SG() {
    checkLog();
    // 商品信息的显示
    var query_item = {}, query_responsor = {};
    query_item["op"] = "query_SG_by_G_id";
    query_item["SG_id"] = parseInt(document.location.href.split('?')[1]);
    query_item = " " + JSON.stringify(query_item);
    var PublisherID;
    $.ajax({
        url: url,
        data: query_item,
        dataType: "text",
        method: "POST",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            var Item = JSON.parse(responseTxt);
            PublisherID = Item["U_id"];
            document.getElementById("Name").innerHTML = Item["SG_name"];
            document.getElementById("Image").src = Item["image"];
            document.getElementById("Price").innerHTML = Item["SG_price"];
            document.getElementById("Type").innerHTML = getType(Item["SG_type"]);
            document.getElementById("Info").innerHTML = Item["SG_info"];
            var cookieInfo = getCookie(1);
            $("#Response").on("click", function () {
                SG_respond(Item["SG_id"], cookieInfo["U_id"]);
                this.innerHTML = "已响应";
            });
        }
    });
    // 显示响应者，若是发布者自己浏览则额外显示确认按钮
    query_responsor["op"] = "get_SG_response_Users";
    query_responsor["SG_id"] = parseInt(document.location.href.split('?')[1]);
    query_responsor = " " + JSON.stringify(query_responsor);
    $.ajax({
        url: url,
        method: "POST",
        data: query_responsor,
        dataType: "text",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split('\n');
            for(i = 0; i < responseTxt.length; i++) {
                var responsors = JSON.parse(responseTxt[i]);
                if(getCookie(1)["U_id"] == PublisherID) {
                    var addTab = "        <tr name='responsor'>\n" +
                        "            <td>" + responsors["U_name"] + "</td>\n" +
                        "            <td>" + responsors["U_id"] + "</td>\n" +
                        "            <td><button id='Responsor_" + responsors["U_id"] + "'>确认交易完成</button></td>\n" +
                        "        </tr>";
                    $("#responsor").append(addTab);
                    $("#Responsor_" + responsors["U_id"]).on("click", function () {
                        // 物品id，发布者id，响应者id
                        Confirm(parseInt(document.location.href.split('?')[1]), getCookie(1)["U_id"], responsors["U_id"]);
                    })
                }
                else {
                    var addTab = "        <tr name='responsor'>\n" +
                        "            <td>" + responsors["U_name"] + "</td>\n" +
                        "            <td>" + responsors["U_id"] + "</td>\n" +
                        "        </tr>";
                    $("#responsor").append(addTab);
                }
            }
        }
    })
}
// 商品详情页内容的显示
function showInfo_WG() {
    checkLog();
    // 商品信息的显示
    var query_item = {}, query_responsor = {};
    query_item["op"] = "query_WG_by_G_id";
    query_item["WG_id"] = parseInt(document.location.href.split('?')[1]);
    query_item = " " + JSON.stringify(query_item);
    var ResponsorID;
    $.ajax({
        url: url,
        data: query_item,
        dataType: "text",
        method: "POST",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            var Item = JSON.parse(responseTxt);
            ResponsorID = Item["U_id"];
            document.getElementById("Name").innerHTML = Item["WG_name"];
            document.getElementById("Type").innerHTML = getType(Item["WG_type"]);
            document.getElementById("Info").innerHTML = Item["WG_info"];
            var cookieInfo = getCookie(1);
            $("#Response").on("click", function () {
                WG_respond(Item["WG_id"], cookieInfo["U_id"]);
                this.innerHTML = "已响应";
            });
        }
    });
    // 显示响应者，若是发布者自己浏览则额外显示确认按钮
    query_responsor["op"] = "get_WG_response_Users";
    query_responsor["WG_id"] = parseInt(document.location.href.split('?')[1]);
    query_responsor = " " + JSON.stringify(query_responsor);
    $.ajax({
        url: url,
        method: "POST",
        data: query_responsor,
        dataType: "text",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split('\n');
            for(i = 0; i < responseTxt.length; i++) {
                var responsors = JSON.parse(responseTxt[i]);
                if(getCookie(1)["U_id"] == ResponsorID) {
                    var addTab = "        <tr name='responsor'>\n" +
                        "            <td>" + responsors["U_name"] + "</td>\n" +
                        "            <td>" + responsors["U_id"] + "</td>\n" +
                        "            <td><button id='Responsor_" + responsors["U_id"] + "'>确认交易完成</button></td>\n" +
                        "        </tr>";
                    $("#responsor").append(addTab);
                    $("#Responsor_" + responsors["U_id"]).on("click", function () {
                        // 物品id，发布者id，响应者id
                        Confirm(parseInt(document.location.href.split('?')[1]), getCookie(1)["U_id"], responsors["U_id"]);
                    })
                }
                else {
                    var addTab = "        <tr name='responsor'>\n" +
                        "            <td>" + responsors["U_name"] + "</td>\n" +
                        "            <td>" + responsors["U_id"] + "</td>\n" +
                        "        </tr>";
                    $("#responsor").append(addTab);
                }
            }
        }
    })
}


// index页内容的显示
function showSG(amount, responseTxt) {
    for (i = 0; i < responseTxt.length; i++) {
        var responsors = JSON.parse(responseTxt[i]);
        var cookieInfo = getCookie(1);
        var addedTab = "        <tr name='SGitem'>\n" +
            "            <td>" + responsors["SG_name"] + "</td>\n" +
            "            <td>" + getType(responsors["SG_type"]) + "</td>\n" +
            "            <td>" + responsors["SG_info"] + "</td>\n" +
            "            <td>" + responsors["U_id"] + "</td>\n" +
            "            <td><a href='sg_info.html?"+responsors["SG_id"]+"' class=\"btn btn-primary\"" + " id=SG_" + responsors["SG_id"] + ">查看详情</a></td>\n" +
            "        </tr>";
        $(addedTab).appendTo("#sghead");
    }
}

// index页加载时执行
function query_SG() {
    checkLog();
    var query_SG = {};
    query_SG["op"] = "query_SG";
    $.ajax({
        method: 'POST',
        url: url,
        data: " " + JSON.stringify(query_SG),
        dataType: "text",
        success: function (responseTxt) {
            $("[name='SGitem']").remove();
            // 去掉结尾乱码，拆分为数量和商品信息
            // console.log(responseTxt);
            responseTxt = responseTxt.substring(0, responseTxt.lastIndexOf('}') + 1);
            var amount = responseTxt.substring(0, responseTxt.indexOf('}') + 1);
            responseTxt = responseTxt.replace(amount, "");
            responseTxt = responseTxt.substring(1, responseTxt.length - 1) + "}";
            responseTxt = responseTxt.split("\n");
            amount = JSON.parse(amount);
            amount = amount["count"];
            showSG(amount, responseTxt);
        },
    });
}

// needs页内容的显示
function showWG(responseTxt) {
    for (i = 0; i < responseTxt.length; i++) {
        var responsors = JSON.parse(responseTxt[i]);
        var cookieInfo = getCookie(1);
        var addedTab = "        <tr name='WGitem'>\n" +
            "            <td>" + responsors["WG_name"] + "</td>\n" +
            "            <td>" + getType(responsors["WG_type"]) + "</td>\n" +
            "            <td>" + responsors["WG_info"] + "</td>\n" +
            "            <td>" + responsors["U_id"] + "</td>\n" +
            "            <td><a href='wg_info.html?"+responsors["WG_id"]+"' class=\"btn btn-primary\"" + " id=WG_" + responsors["WG_id"] + ">查看详情</a></td>\n" +
            "        </tr>";
        $(addedTab).appendTo("#wghead");
    }
}

// needs页加载时执行
function query_WG() {
    checkLog();
    var query_WG = {};
    query_WG["op"] = "query_WG";
    $.ajax({
        url: url,
        method: "POST",
        data: " " + JSON.stringify(query_WG),
        success: function (responseTxt) {
            $("[name='WGitem']").remove();
            // 去掉结尾乱码，拆分为商品信息
            responseTxt = responseTxt.substring(0, responseTxt.lastIndexOf('}') + 1);
            var amount = responseTxt.substring(0, responseTxt.indexOf('}') + 1);
            responseTxt = responseTxt.replace(amount, "");
            responseTxt = responseTxt.substring(1, responseTxt.length - 1) + "}";
            responseTxt = responseTxt.split("\n");
            amount = JSON.parse(amount);
            amount = amount["count"];

            showWG(responseTxt);
        },
        dataType: "text"
    });
}

// index页的搜索功能
function SearchSG() {
    var search_SG = {};
    // 填入方法和字段
    search_SG["op"] = "search_SG";
    search_SG["keyWord"] = document.getElementById("searchtext").value;
    search_SG = " " + JSON.stringify(search_SG);
    $("[name='SGitem']").remove();
    $.ajax({
        url: url,
        method: "POST",
        data: search_SG,
        dataType: "text",
        success: function (responseTxt) {
            if (responseTxt == null) {
                alert("无结果！");
            }
            else {
                responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
                responseTxt = responseTxt.split("\n");
                for (i = 0; i < responseTxt.length; i++) {
                    var responsors = JSON.parse(responseTxt[i]);
                    var cookieInfo = getCookie(1);
                    var addedTab = "        <tr name = 'SGitem'>\n" +
                        "            <td>" + responsors["SG_name"] + "</td>\n" +
                        "            <td>" + getType(responsors["SG_type"]) + "</td>\n" +
                        "            <td>" + responsors["SG_info"] + "</td>\n" +
                        "            <td>" + responsors["U_id"] + "</td>\n" +
                        "            <td><a href='sg_info.html?"+responsors["SG_id"]+"' class=\"btn btn-primary\"" + " id=SG_" + responsors["SG_id"] + ">查看详情</a></td>\n" +
                        "        </tr>";
                    $(addedTab).appendTo("#sghead");

                }
            }

        }
    })
}

// needs页的搜索功能
function SearchWG() {
    var search_WG = {};
    // 填入方法和字段
    search_WG["op"] = "search_WG";
    search_WG["?"] = document.getElementById("#searchtext").value;
    search_WG = " " + JSON.stringify(search_WG);
    $("[name='WGitem']").remove();
    $.ajax({
        url: url,
        method: "POST",
        data: search_WG,
        dataType: "text",
        success: function (responseTxt) {
            if (responseTxt == null) {
                alert("无结果！");
            }
            else {
                responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
                responseTxt = responseTxt.split("\n");
                for (i = 0; i < responseTxt.length; i++) {
                    var responsors = JSON.parse(responseTxt[i]);
                    var cookieInfo = getCookie(1);
                    var addedTab = "        <tr>\n" +
                        "            <td>" + responsors["WG_name"] + "</td>\n" +
                        "            <td>" + responsors["WG_type"] + "</td>\n" +
                        "            <td>" + responsors["WG_info"] + "</td>\n" +
                        "            <td>" + responsors["U_id"] + "</td>\n" +
                        "            <td><btn class=\"btn btn-primary\"" + "name=\"WGitem\" id=WG_" + responsors["WG_id"] + ">申请交易</btn></td>\n" +
                        "        </tr>";
                    $(addedTab).appendTo("#wghead");
                    $("#WG_" + responsors["WG_id"]).on("click", function () {
                        WG_respond(responsors["WG_id"], cookieInfo["U_id"]);
                        this.innerHTML = "已响应";
                    })
                }
            }
        }
    })
}

// 分类筛选功能
function type_Select_SG(type) {
    var fillter_sg = {"op": "query_SG_by_type", "SG_type": parseInt(type)};
    fillter_sg = " " + JSON.stringify(fillter_sg);
    $.ajax({
        url: url,
        method: "POST",
        data: fillter_sg,
        dataType: "text",
        success: function (responseTxt) {
            console.log(responseTxt);
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split("\n");
            $("[name='SGitem']").remove();
            for (i = 0; i < responseTxt.length; i++) {
                var responsors = JSON.parse(responseTxt[i]);
                var cookieInfo = getCookie(1);
                var addedTab = "        <tr name='SGitem'>\n" +
                    "            <td>" + responsors["SG_name"] + "</td>\n" +
                    "            <td>" + getType(responsors["SG_type"]) + "</td>\n" +
                    "            <td>" + responsors["SG_info"] + "</td>\n" +
                    "            <td>" + responsors["U_id"] + "</td>\n" +
                    "            <td><a href='sg_info.html?"+responsors["SG_id"]+"' class=\"btn btn-primary\"" + " id=SG_" + responsors["SG_id"] + ">查看详情</a></td>\n" +
                    "        </tr>";
                $(addedTab).appendTo("#sghead");
            }
        }
    })
}
function type_Select_WG(type) {
    var fillter_wg = {"op": "query_WG_by_type", "WG_type": parseInt(type)};
    fillter_wg = " " + JSON.stringify(fillter_wg);
    $.ajax({
        url: url,
        method: "POST",
        data: fillter_wg,
        dataType: "text",
        success: function (responseTxt) {
            $("[name='WGitem']").remove();
            console.log(responseTxt);
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split("\n");
            $("[name='WGitem']").remove();
            for (i = 0; i < responseTxt.length; i++) {
                var responsors = JSON.parse(responseTxt[i]);
                var cookieInfo = getCookie(1);
                var addedTab = "        <tr name='WGitem'>\n" +
                    "            <td>" + responsors["WG_name"] + "</td>\n" +
                    "            <td>" + getType(responsors["WG_type"]) + "</td>\n" +
                    "            <td>" + responsors["WG_info"] + "</td>\n" +
                    "            <td>" + responsors["U_id"] + "</td>\n" +
                    "            <td><btn class=\"btn btn-primary\"" + " id=WG_" + responsors["WG_id"] + ">申请交易</btn></td>\n" +
                    "        </tr>";
                $(addedTab).appendTo("#wghead");
            }
        }
    })
}

// 个人信息页基本信息显示
function query_User() {
    checkLog();
    // 个人信息
    var query_User = {"op": "search_User_by_id", "U_id": getCookie(1)["U_id"]};
    query_User = " " + JSON.stringify(query_User);
    $.ajax({
        url: url,
        method: "POST",
        data: query_User,
        dataType: "text",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = JSON.parse(responseTxt);
            document.getElementById("U_name").innerHTML ="用户名："+ responseTxt["U_name"];
            document.getElementById("U_id").innerHTML ="QQ:"+ responseTxt["U_id"];
        }
    });

    // 发布的商品
    var query_Item_Published = {"op": "query_publish_by_User", "U_id": getCookie(1)["U_id"]};
    query_Item_Published = " " + JSON.stringify(query_Item_Published);
    $.ajax({
        url: url,
        method: "POST",
        data: query_Item_Published,
        dataType: "text",
        success: function (responseTxt) {
            if (!responseTxt) {
                return;
            }
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split('\n');
            for(i = 0; i < responseTxt.length; i++) {
                var responsors= JSON.parse(responseTxt[i]);
                if(responsors["SG_id"] != null) {
                    $("#item_published").append(
                        "        <tr>\n" +
                        "            <td> 待售商品 </td>\n" +
                        "            <td>" + responsors["SG_name"]+ "</td>\n" +
                        "            <td>" + getType(responsors["SG_type"]) + "</td>\n" +
                        "            <td>" + responsors["SG_publish_time"] + "</td>\n" +
                        "            <td><a href='sg_info.html?"+responsors["SG_id"]+"' class=\"btn btn-primary\"" + " id=SG_" + responsors["SG_id"] + ">查看详情</a></td>\n" +
                        "        </tr>"
                    );
                }
                else {
                    $("#item_published").append(
                        "        <tr name='WGitem'>\n" +
                        "            <td> 欲购商品 </td>\n" +
                        "            <td>" + responsors["WG_name"] + "</td>\n" +
                        "            <td>" + getType(responsors["WG_type"]) + "</td>\n" +
                        "            <td>" + responsors["WG_publish_time"] + "</td>\n" +
                        "            <td><a href='wg_info.html?"+responsors["WG_id"]+"' class=\"btn btn-primary\"" + " id=WG_" + responsors["WG_id"] + ">查看详情</a></td>\n" +
                        "        </tr>"
                    );
                }
            }
        }
    });

    // 响应的商品
    var queryItem_Responded = {"op": "query_response_by_User", "U_id": getCookie(1)["U_id"]};
    queryItem_Responded = " " + JSON.stringify(queryItem_Responded);
    $.ajax({
        url: url,
        method: "POST",
        data: queryItem_Responded,
        dataType: "text",
        success: function (responseTxt) {
            if (!responseTxt) {
                return;
            }
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split('\n');

            for(i = 0; i < responseTxt.length; i++) {
                responsors= JSON.parse(responseTxt[i]);
                if(responsors["SG_id"] != null) {
                    $("#item_responded").append(
                        "        <tr>\n" +
                        "            <td> 待售商品 </td>\n" +
                        "            <td>" + responsors["SG_name"]+ "</td>\n" +
                        "            <td>" + getType(responsors["SG_type"]) + "</td>\n" +
                        "            <td>" + responsors["SG_response_time"] + "</td>\n" +
                        "            <td><a href='sg_info.html?"+responsors["SG_id"]+"' class=\"btn btn-primary\"" + " id=SG_" + responsors["SG_id"] + ">查看详情</a></td>\n" +
                        "        </tr>"
                    );
                }
                else {
                    $("#item_responded").append(
                        "        <tr name='WGitem'>\n" +
                        "            <td> 欲购商品 </td>\n" +
                        "            <td>" + responsors["WG_name"] + "</td>\n" +
                        "            <td>" + getType(responsors["WG_type"]) + "</td>\n" +
                        "            <td>" + responsors["WG_response_time"] + "</td>\n" +
                        "            <td><a href='wg_info.html?"+responsors["WG_id"]+"' class=\"btn btn-primary\"" + " id=WG_" + responsors["WG_id"] + ">查看详情</a></td>\n" +
                        "        </tr>"
                    );
                }
            }
        }
    });

    var query_Record = {"op": "query_dealLog_by_User", "U_id": getCookie(1)["U_id"]};
    query_Record = " " + JSON.stringify(query_Record);
    $.ajax({
        url: url,
        method: "POST",
        data: query_Record,
        dataType: "text",
        success: function (responseTxt) {
            if (!responseTxt)
                return;

            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split('\n');
            for(i = 0; i < responseTxt.length; i++) {
                console.log(responseTxt[i]);
                var Item = JSON.parse(responseTxt[i]);
                    $("#trading_record").append(
                        "        <tr>\n" +
                        "            <td>" + Item["G_id"]+ "</td>\n" +
                        "            <td>" + Item["buyer_id"] + "</td>\n" +
                        "            <td>" + Item["seller_id"] + "</td>\n" +
                        "            <td>" + Item["deal_time"] + "</td>\n" +
                        "        </tr>"
                    );


            }
        }
    })
}
