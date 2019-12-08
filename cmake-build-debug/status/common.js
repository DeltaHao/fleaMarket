
var url = "./";
var ConcreteItemID = 0;

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)){
        var ret = {};
        var spl = unescape(arr[2]).split(", ");
        for (var x in spl) {
            var item = spl[x].substring(0, spl[x].indexOf("="));
            var value = spl[x].substring(spl[x].indexOf("=")+1);
            ret[item] = value;
        }
        // return unescape(arr[2]);
        return ret;
    }else{
        return null;
    }
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    // 这里需要判断一下cookie是否存在
    var c = getCookie(name);
    if (c != null){
        document.cookie = name + "=" + c + ";expires=" + exp.toGMTString();
    }
}
// 提交注册表单
function UidCheck(str){
    // 判断字符串是否为数字
    var zg = /^[0-9]*[1-9][0-9]*$/;
    if (!zg.test(str)) {
        return false;
    } else {
        return true;
    }
}
function reg() {

    // var xhr_reg = new XMLHttpRequest();
    var params = $("#regedit").serializeArray();

    var values_reg = { "op": "Register_auth" };
    for(var x in params) {
        values_reg[params[x].name] = params[x].value;
    }
    // 密码需要重新获取明文
    values_reg["U_password"] = document.getElementById("U_password").value;
    values_reg["U_password_r"] = document.getElementById("U_password_r").value;
    // 验证格式正确性
    var ErrorInfo = "";
    var check = true;
    if(values_reg["U_name"] == "" || values_reg["U_id"] == "" || values_reg["U_info"] == "" || values_reg["U_password"] == "" || values_reg["U_password_r"] == "") {
        ErrorInfo += "输入不能为空。\n";
        check = false;
    }
    else {
        if(!UidCheck(values_reg["U_id"])) {
            ErrorInfo += "QQ号只能为数字。\n";
            check = false;
        }
        if(values_reg["U_password"] != values_reg["U_password_r"]) {
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
            data: " "+values_reg_post,
            dataType: "text",
            success:function(responseTxt) {
                // responseTxt = responseTxt.substring(0, responseTxt.indexOf('}')+1);
                if (responseTxt == "false") {
                    alert(values_reg["ErrorInfo"]);
                }
                else {
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


    var values_log = { "op": "Login_auth" };
    for(x in params) {
        values_log[params[x].name] = params[x].value;
    }
    values_log["U_password"] = document.getElementById("U_password").value;


    $.ajax({
            url: url,
            type: "POST",
            data: " "+JSON.stringify(values_log),
            dataType: "text",
            success:function(responseTxt) {
                responseTxt = responseTxt.substring(0, responseTxt.indexOf('}')+1);
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
            success: function (responseTxt) {
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
    // 获取表单中内容
    var params = $("#wgedit").serializeArray();

    var values_wg = { "op": "WG_publish" };
    for(x in params) {
        values_wg[params[x].name] = params[x].value;
    }
    values_wg["U_id"] = getCookie(1)["U_id"];
    values_wg = JSON.stringify(values_wg);
    console.log(values_wg)
    $.ajax({
        url: url,
        data:" " + values_wg,
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
    reader.onload = function(e){
        $('#showImg').attr('src', src);
    }
}

// 提交响应
function SG_respond(resInfo) {
    var values_sgres = {"op": "SG_response"};
    resInfo = resInfo.split(" ");
    var SG_id = resInfo[0];
    var U_id = resInfo[1];
    values_sgres[SG_id] = SG_id;
    values_sgres[U_id] = U_id;
    values_sgres = JSON.stringify(values_sgres);
    $.ajax({
        url: url,
        data: " " + values_sgres,
        dataType: "text",
        method: "POST",
        success: function (responseTxt) {
            var btn = document.getElementById("Response");
            btn.onclick = null;
            btn.innerHTML = "已响应";
        }
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


// check more item info

function showInfo() {
    var query_item = {};
    query_item["op"] = "query_SG_by_G_id";
    query_item["SG_id"] = ConcreteItemID;
    console.log(query_item, ConcreteItemID);
    query_item = " " + JSON.stringify(query_item);
    $.ajax({
        url: url,
        data: query_item,
        dataType: "text",
        method: "POST",
        success: function (responseTxt) {
            ConcreteItemInfo = responseTxt;
            console.log(responseTxt);
            responseTxt = responseTxt.substring(responseTxt.indexOf('{'), responseTxt.lastIndexOf('}')+1);
            var Item = JSON.parse(responseTxt);
            document.getElementById("#Name").innerHTML = Item["SG_name"];
            document.getElementById("#Image").src = Item["image"];
            document.getElementById("#Price").innerHTML = Item["SG_price"];
            var Type = document.getElementById("#Type");
            switch (Item["SG_type"]) {
                case "1": {
                    Type.innerHTML = "食品饮品";
                    break;
                }
                case "2": {
                    Type.innerHTML = "书籍";
                    break;
                }
                case "3": {
                    Type.innerHTML = "电子产品";
                    break;
                }
                case "4": {
                    Type.innerHTML = "服饰";
                    break;
                }
                case "5": {
                    Type.innerHTML = "化妆品";
                    break;
                }
                case "6": {
                    Type.innerHTML = "运动器材";
                    break;
                }
                case "7": {
                    Type.innerHTML = "日用品";
                    break;
                }
                case "8": {
                    Type.innerHTML = "账号";
                    break;
                }
                case "9": {
                    Type.innerHTML = "其他";
                    break;
                }
                default:
                    Type.innerHTML = "其他";
            }
            document.getElementById("#Info").innerHTML = Item["SG_info"];
            var cookieInfo = getCookie(1);
            document.getElementById("#Response").value = Item["SG_id"] + " " + cookieInfo["U_id"];
        }
    })
}




// index.html requesting sg from server

function showSG(amount, responseTxt) {
    for(i=0;i<responseTxt.length; i++) {
        var addedItem = JSON.parse(responseTxt[i]);
        var cookieInfo = getCookie(1);
        var addedTab = "        <tr>\n" +
            "            <td>" + addedItem["SG_name"] + "</td>\n" +
            "            <td>" + addedItem["SG_type"] + "</td>\n" +
            "            <td>" + addedItem["SG_info"] + "</td>\n" +
            "            <td>" + addedItem["U_id"] + "</td>\n" +
            "            <td><a href='sg_info.html' class=\"btn btn-primary\"" + "id=SG_" + addedItem["SG_id"] +  ">查看详情</a></td>\n" +
            "        </tr>";
        $(addedTab).appendTo("#sghead");
        $("#SG_"+addedItem["SG_id"]).on("click",function () {
            ConcreteItemID = addedItem["SG_id"];
        });
    }
}
function query_SG() {

    var query_SG = {};
    query_SG["op"] = "query_SG";
    $.ajax({
        method: 'POST',
        url: url,
        data: " " + JSON.stringify(query_SG),
        dataType: "text",
        success: function (responseTxt) {
            // 去掉结尾乱码，拆分为数量和商品信息
            // console.log(responseTxt);
            responseTxt = responseTxt.substring(0, responseTxt.lastIndexOf('}')+1);
            var amount = responseTxt.substring(0, responseTxt.indexOf('}')+1);
            responseTxt = responseTxt.replace(amount, "");
            responseTxt = responseTxt.substring(1, responseTxt.length-1) + "}";
            responseTxt = responseTxt.split("\n");
            amount = JSON.parse(amount);
            amount = amount["count"];
            showSG(amount, responseTxt);
        },
    });
}

// needs.html requesting wg from server
function showWG(responseTxt) {
    for(i=0;i<responseTxt.length; i++) {
        var addedItem = JSON.parse(responseTxt[i]);
        var cookieInfo = getCookie(1);
        var addedTab = "        <tr>\n" +
            "            <td>" + addedItem["WG_name"] + "</td>\n" +
            "            <td>" + addedItem["WG_type"] + "</td>\n" +
            "            <td>" + addedItem["WG_info"] + "</td>\n" +
            "            <td>" + addedItem["U_id"] + "</td>\n" +
            "            <td><btn class=\"btn btn-primary\"" + "id=WG_" + addedItem["WG_id"] +  ">申请交易</btn></td>\n" +
            "        </tr>";
        $(addedTab).appendTo("#wghead");
        $("#WG_"+addedItem["WG_id"]).on("click",function () {
            WG_respond(addedItem["WG_id"], cookieInfo["U_id"]);
            this.innerHTML = "已响应";
        })
    }
}
function query_WG() {
    var query_WG = {};
    query_WG["op"] = "query_WG";
    $.ajax({
        url: url,
        method: "POST",
        data: " " + JSON.stringify(query_WG),
        success: function (responseTxt) {
            // 去掉结尾乱码，拆分为商品信息
            responseTxt = responseTxt.substring(0, responseTxt.lastIndexOf('}')+1);
            var amount = responseTxt.substring(0, responseTxt.indexOf('}')+1);
            responseTxt = responseTxt.replace(amount, "");
            responseTxt = responseTxt.substring(1, responseTxt.length-1) + "}";
            responseTxt = responseTxt.split("\n");
            amount = JSON.parse(amount);
            amount = amount["count"];

            showWG(responseTxt);
        },
        dataType: "text"
    });
}
