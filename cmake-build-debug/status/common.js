var url = "./";

function getType(type) {
    switch (type) {
        case "1": {
            return "食品饮品";
        }
        case "2": {
            return "书籍";
        }
        case "3": {
            return "电子产品";
        }
        case "4": {
            return "服饰";
        }
        case "5": {
            return "化妆品";
        }
        case "6": {
            return "运动器材";
        }
        case "7": {
            return "日用品";
        }
        case "8": {
            return "账号";
        }
        case "9": {
            return "其他";
        }
        default:
            return "其他";
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
        // return unescape(arr[2]);
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

// 提交注册信息
function reg() {
    // var xhr_reg = new XMLHttpRequest();
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
    // 获取表单中内容
    var params = $("#sgedit").serializeArray();


    var values_sg = {"op": "SG_publish"};
    for (x in params) {
        values_sg[params[x].name] = params[x].value;
    }
    values_sg["U_id"] = getCookie(1)["U_id"];
    // 读取图片
    var file = document.getElementById("image").files[0];
    var reader_sg = new FileReader();

    reader_sg.onload = function (e) {
        var formData = new FormData();
        formData.append("image", e.target.result);

        for (var pair of formData.entries()) {
            values_sg[pair[0]] = pair[1];
        }
        values_sg = JSON.stringify(values_sg);
        $.ajax({
            url: url,
            method: "POST",
            data: " " + values_sg,
            dataType: "text",
            success: function (responseTxt) {
                if (responseTxt == "true") {
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
    // 获取表单中内容
    var params = $("#wgedit").serializeArray();

    var values_wg = {"op": "WG_publish"};
    for (x in params) {
        values_wg[params[x].name] = params[x].value;
    }
    values_wg["U_id"] = getCookie(1)["U_id"];
    values_wg = JSON.stringify(values_wg);
    console.log(values_wg)
    $.ajax({
        url: url,
        data: " " + values_wg,
        dataType: "text",
        method: "POST",
        success: function () {
            alert("发布成功！");
            //window.location.href = "needs.html";
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

// 商品详情页内容的显示
function showInfo() {
    var query_item = {};
    query_item["op"] = "query_SG_by_G_id";
    query_item["SG_id"] = parseInt(document.location.href.split('?')[1]);

    console.log(query_item);
    query_item = " " + JSON.stringify(query_item);
    $.ajax({
        url: url,
        data: query_item,
        dataType: "text",
        method: "POST",
        success: function (responseTxt) {
            ConcreteItemInfo = responseTxt;

            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            var Item = JSON.parse(responseTxt);
            console.log(Item["SG_name"]);
            document.getElementById("Name").innerHTML = Item["SG_name"];
            document.getElementById("Image").src = Item["image"];
            document.getElementById("Price").innerHTML = Item["SG_price"];
            document.getElementById("Type").innerHTML = getType(Item["SG_type"]);
            document.getElementById("Info").innerHTML = Item["SG_info"];
            var cookieInfo = getCookie(1);
            $("#Response").on("click", function () {
                SG_respond(Item["SG_id"], cookieInfo["U_id"]);
                this.innerHTML = "已响应";
            })
        }
    })
}

// index页内容的显示
function showSG(amount, responseTxt) {
    for (i = 0; i < responseTxt.length; i++) {
        var addedItem = JSON.parse(responseTxt[i]);
        var cookieInfo = getCookie(1);
        var addedTab = "        <tr name='SGitem'>\n" +
            "            <td>" + addedItem["SG_name"] + "</td>\n" +
            "            <td>" + getType(addedItem["SG_type"]) + "</td>\n" +
            "            <td>" + addedItem["SG_info"] + "</td>\n" +
            "            <td>" + addedItem["U_id"] + "</td>\n" +
            "            <td><a href='sg_info.html?"+addedItem["SG_id"]+"' class=\"btn btn-primary\"" + " id=SG_" + addedItem["SG_id"] + ">查看详情</a></td>\n" +
            "        </tr>";
        $(addedTab).appendTo("#sghead");

    }
}

// index页加载时执行
function query_SG() {
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
        var addedItem = JSON.parse(responseTxt[i]);
        var cookieInfo = getCookie(1);
        var addedTab = "        <tr>\n" +
            "            <td>" + addedItem["WG_name"] + "</td>\n" +
            "            <td>" + addedItem["WG_type"] + "</td>\n" +
            "            <td>" + addedItem["WG_info"] + "</td>\n" +
            "            <td>" + addedItem["U_id"] + "</td>\n" +
            "            <td><btn class=\"btn btn-primary\"" + "name=\"WGitem\" id=WG_" + addedItem["WG_id"] + ">申请交易</btn></td>\n" +
            "        </tr>";
        $(addedTab).appendTo("#wghead");
        $("#WG_" + addedItem["WG_id"]).on("click", function () {
            WG_respond(addedItem["WG_id"], cookieInfo["U_id"]);
            this.innerHTML = "已响应";
        })
    }
}

// needs页加载时执行
function query_WG() {
    var query_WG = {};
    query_WG["op"] = "query_WG";
    $.ajax({
        url: url,
        method: "POST",
        data: " " + JSON.stringify(query_WG),
        success: function (responseTxt) {
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
    var searchText = document.getElementById("#searchtext").value;
    var search_SG = {};
    // 填入方法和字段
    search_SG["op"] = "";
    search_SG["?"] = "";
    search_SG = " " + JSON.stringify(search_SG);
    $.ajax({
        url: url,
        method: "POST",
        data: search_SG,
        dataType: "text",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split("\n");
            for (item in document.getElementsByName("SGitem")) {
                item.remove();
            }
            for (i = 0; i < responseTxt.length; i++) {
                var addedItem = JSON.parse(responseTxt[i]);
                var cookieInfo = getCookie(1);
                var addedTab = "        <tr>\n" +
                    "            <td>" + addedItem["SG_name"] + "</td>\n" +
                    "            <td>" + addedItem["SG_type"] + "</td>\n" +
                    "            <td>" + addedItem["SG_info"] + "</td>\n" +
                    "            <td>" + addedItem["U_id"] + "</td>\n" +
                    "            <td><a href='sg_info.html' class=\"btn btn-primary\"" + "name=\"SGitem\" id=SG_" + addedItem["SG_id"] + ">查看详情</a></td>\n" +
                    "        </tr>";
                $(addedTab).appendTo("#sghead");

            }
        }
    })
}

// needs页的搜索功能
function SearchWG() {
    var searchText = document.getElementById("#searchtext").value;
    var search_WG = {};
    // 填入方法和字段
    search_WG["op"] = "";
    search_WG["?"] = "";
    search_WG = " " + JSON.stringify(search_WG);
    $.ajax({
        url: url,
        method: "POST",
        data: search_WG,
        dataType: "text",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split("\n");
            for (item in document.getElementsByName("WGitem")) {
                item.remove();
            }
            for (i = 0; i < responseTxt.length; i++) {
                var addedItem = JSON.parse(responseTxt[i]);
                var cookieInfo = getCookie(1);
                var addedTab = "        <tr>\n" +
                    "            <td>" + addedItem["WG_name"] + "</td>\n" +
                    "            <td>" + addedItem["WG_type"] + "</td>\n" +
                    "            <td>" + addedItem["WG_info"] + "</td>\n" +
                    "            <td>" + addedItem["U_id"] + "</td>\n" +
                    "            <td><btn class=\"btn btn-primary\"" + "name=\"WGitem\" id=WG_" + addedItem["WG_id"] + ">申请交易</btn></td>\n" +
                    "        </tr>";
                $(addedTab).appendTo("#wghead");
                $("#WG_" + addedItem["WG_id"]).on("click", function () {
                    WG_respond(addedItem["WG_id"], cookieInfo["U_id"]);
                    this.innerHTML = "已响应";
                })
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
                var addedItem = JSON.parse(responseTxt[i]);
                var cookieInfo = getCookie(1);
                var addedTab = "        <tr name='SGitem'>\n" +
                    "            <td>" + addedItem["SG_name"] + "</td>\n" +
                    "            <td>" + getType(addedItem["SG_type"]) + "</td>\n" +
                    "            <td>" + addedItem["SG_info"] + "</td>\n" +
                    "            <td>" + addedItem["U_id"] + "</td>\n" +
                    "            <td><a href='sg_info.html' class=\"btn btn-primary\"" + " id=SG_" + addedItem["SG_id"] + ">查看详情</a></td>\n" +
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
            console.log(responseTxt);
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split("\n");
            for (item in document.getElementsByName("WGitem")) {
                item.remove();
            }
            for (i = 0; i < responseTxt.length; i++) {
                var addedItem = JSON.parse(responseTxt[i]);
                var cookieInfo = getCookie(1);
                var addedTab = "        <tr>\n" +
                    "            <td>" + addedItem["WG_name"] + "</td>\n" +
                    "            <td>" + addedItem["WG_type"] + "</td>\n" +
                    "            <td>" + addedItem["WG_info"] + "</td>\n" +
                    "            <td>" + addedItem["U_id"] + "</td>\n" +
                    "            <td><btn class=\"btn btn-primary\"" + "name=\"WGitem\" id=WG_" + addedItem["WG_id"] + ">申请交易</btn></td>\n" +
                    "        </tr>";
                $(addedTab).appendTo("#wghead");
                $("#WG_" + addedItem["WG_id"]).on("click", function () {
                    WG_respond(addedItem["WG_id"], cookieInfo["U_id"]);
                    this.innerHTML = "已响应";
                })
            }
        }
    })
}

// 个人信息页基本信息显示
function query_User() {
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
    })

    // 发布的商品
    var query_Item_Published = {"op": "query_SG_by_User", "U_id": getCookie(1)["U_id"]};
    query_Item_Published = " " + JSON.stringify(query_Item_Published);
    $.ajax({
        url: url,
        method: "POST",
        data: query_Item_Published,
        dataType: "text",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split('\n');
            for(i = 0; i < responseTxt.length; i++) {
                addedItem= JSON.parse(responseTxt[i]);
                $("#item_published").append(
                    "        <tr>\n" +
                    "            <td>" + addedItem["SG_name"]+ "</td>\n" +
                    "            <td><button value='" + addedItem["SG_id"] + "' onclick=\"show_Responsor(this.value)\">显示响应者</button></td>\n" +
                    "            <td><button>交易状态</button></td>\n" +
                    "        </tr>"
                );
            }
        }
    })

    // 响应的商品
    var queryItem_Responded = {"op": "", "U_id": getCookie(1)["U_id"]};
    queryItem_Responded = " " + JSON.stringify(queryItem_Responded);
    $.ajax({
        url: url,
        method: "POST",
        data: queryItem_Responded,
        dataType: "text",
        success: function (responseTxt) {
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}') + 1);
            responseTxt = responseTxt.split('\n');
            for(i = 0; i < responseTxt.length; i++) {
                addedItem= JSON.parse(responseTxt[i]);
                $("#trading_record").append(
                    "    <tr>\n" +
                    "        <td>" + addedItem["SG_name"] + "</td>\n" +
                    "        <td>" + addedItem["U_id"] + "</td>\n" +
                    "        <td>" + "status" + "</td>\n" +
                    "    </tr>"
                );
            }
        }
    })
}

// 发布的商品显示
function show_Item_Pubilshed() {

}


// 发布的商品显示
function show_Item_Responded() {

}

// 显示当前商品的响应者
function show_Responsor() {
    
}