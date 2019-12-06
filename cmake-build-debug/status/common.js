
var url = "./";


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
            success:function(responseTxt, statusTxt, xhr_log) {
                // responseTxt = responseTxt.substring(0, responseTxt.indexOf('}')+1);
                console.log(responseTxt);
                if (responseTxt == "false") {
                    alert(values_reg["ErrorInfo"]);
                    console.log(values_reg["password1"]);
                }
                else {
                    console.log(values_reg);
                    alert("注册成功！即将跳转至首页。");
                    var cookieinfo = "";
                    cookieinfo += "U_name=" + values_reg["U_name"] + ", ";
                    cookieinfo += "U_id=" + values_reg["U_id"] + ", ";
                    cookieinfo += "U_password=" + values_reg["U_password"] + ", ";
                    cookieinfo += "U_info=" + values_reg["U_info"] + ", ";
                    cookieinfo += "is_login=1";
                    setCookie(values_reg["is_login"], cookieinfo);
                    window.location.href = "index.html";
                    console.log(values_reg["is_login"], cookieinfo);
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

    values_log = JSON.stringify(values_log);

    $.ajax({
            url: url,
            type: "POST",
            data: " "+values_log,
            dataType: "text",
            success:function(responseTxt, statusTxt, xhr_log) {
                responseTxt = responseTxt.substring(0, responseTxt.indexOf('}')+1);
                // responseTxt = values_log;
                 console.log(responseTxt);
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
                        alert("登陆成功！即将跳转至首页。");
                        var cookieinfo = "";
                        cookieinfo += "U_id=" + values_reg["U_id"] + ", ";
                        cookieinfo += "U_password=" + values_reg["U_password"] + ", ";
                        cookieinfo += "is_login=1";
                        setCookie(1, cookieinfo);
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
    var xhr_wg = new XMLHttpRequest();
    // 获取表单中内容
    var params = $("#wgedit").serializeArray();


    var values_wg = { "op": "WG_publish" };
    for(x in params) {
        values_wg[params[x].name] = params[x].value;
    }


    values_wg = JSON.stringify(values_wg);
    xhr_wg.open("POST", url,false);
    xhr_wg.send(" "+values_wg);
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
function SG_respond(goodname) {
    var xhr_sgres = new XMLHttpRequest();
    var values_sgres = {"op": "SG_respond", "goodname": goodname};
    values_sgres = JSON.stringify(values_sgres);
    xhr_sgres.open("POST", url,true);
    xhr_sgres.send(" "+values_sgres);
}
function WG_respond(goodname) {
    var xhr_wgres = new XMLHttpRequest();
    var values_wgres = {"op": "WG_respond", "goodname": goodname};
    values_wgres = JSON.stringify(values_wgres);
    xhr_wgres.open("POST", url,true);
    xhr_wgres.send(" "+values_wgres);
}


// index.html requesting goods from server
function showItems(amount, items) {
    var x = 0;
    while (x < amount) {
        var addItem1, addItem2, addItem3, addItem4;
        if(x+3 == amount) { // 3 left to show
            addItem1 = JSON.parse(items[x]);
            addItem2 = JSON.parse(items[x+1]);
            addItem3 = JSON.parse(items[x+2]);
            addItem4 = "";
        }
        else if (x+2 == amount) {
            addItem1 = JSON.parse(items[x]);
            addItem2 = JSON.parse(items[x+1]);
            addItem3 = "";
            addItem4 = "";
        }
        else if (x+1 == amount) {
            addItem1 = JSON.parse(items[x]);
            addItem2 = "";
            addItem3 = "";
            addItem4 = "";
        }
        else  {
            addItem1 = JSON.parse(items[x]);
            addItem2 = JSON.parse(items[x+1]);
            addItem3 = JSON.parse(items[x+2]);
            addItem4 = JSON.parse(items[x+3]);
        }
        // console.log(addItem1, addItem2, addItem3, addItem4);
        x += 4;
        if (addItem1 == "") {
            var addTab1 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "    </div>";
        } else {
            var addTab1 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "        <img src=" + addItem1["image"] + " class=\"card-img-top\" alt=\"...\" height=\"180\">\n" +
                "        <div class=\"card-body\">\n" +
                "            <h5 class=\"card-title\" style=\"text-align: center\">" + addItem1["SG_name"] + "</h5>\n" +
                "            <p class=\"price\">" + addItem1["SG_price"] + "</p>\n" +
                "            <a href=\"#\" class=\"btn btn-primary\" style=\"float: right\">查看详情</a>\n" +
                "        </div>\n" +
                "    </div>\n";
        }
        if (addItem2 == "") {
            var addTab2 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "    </div>";
        } else {
            var addTab2 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "        <img src=" + addItem2["image"] + " class=\"card-img-top\" alt=\"...\" height=\"180\">\n" +
                "        <div class=\"card-body\">\n" +
                "            <h5 class=\"card-title\" style=\"text-align: center\">" + addItem2["SG_name"] + "</h5>\n" +
                "            <p class=\"price\">" + addItem2["SG_price"] + "</p>\n" +
                "            <a href=\"#\" class=\"btn btn-primary\" style=\"float: right\">查看详情</a>\n" +
                "        </div>\n" +
                "    </div>\n";
        }
        if (addItem3 == "") {
            var addTab3 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "    </div>";
        } else {
            var addTab3 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "        <img src=" + addItem3["image"] + " class=\"card-img-top\" alt=\"...\" height=\"180\">\n" +
                "        <div class=\"card-body\">\n" +
                "            <h5 class=\"card-title\" style=\"text-align: center\">" + addItem3["SG_name"] + "</h5>\n" +
                "            <p class=\"price\">" + addItem3["SG_price"] + "</p>\n" +
                "            <a href=\"#\" class=\"btn btn-primary\" style=\"float: right\">查看详情</a>\n" +
                "        </div>\n" +
                "    </div>\n";
        }
        if (addItem4 == "") {
            var addTab4 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "    </div>";
        } else {
            var addTab4 = "    <div class=\"card\" style=\"float: left;width: 24rem\">\n" +
                "        <img src=" + addItem4["image"] + " class=\"card-img-top\" alt=\"...\" height=\"180\">\n" +
                "        <div class=\"card-body\">\n" +
                "            <h5 class=\"card-title\" style=\"text-align: center\">" + addItem4["SG_name"] + "</h5>\n" +
                "            <p class=\"price\">" + addItem4["SG_price"] + "</p>\n" +
                "            <a href=\"#\" class=\"btn btn-primary\" style=\"float: right\">查看详情</a>\n" +
                "        </div>\n" +
                "    </div>";
        }
        // console.log(addTab1, addTab2, addTab3, addTab4);
        $(addTab1).appendTo("#col1");
        $(addTab2).appendTo("#col2");
        $(addTab3).appendTo("#col3");
        $(addTab4).appendTo("#col4");
    }

}
function query_SG() {
    var query_SG = {};
    query_SG["op"] = "query_SG";
    $.ajax({
        type: 'POST',
        url: url, // change to "./"
        data: " " + JSON.stringify(query_SG),
        success: function (responseTxt, statusTxt, xhr_log) {
            // test response
            // responseTxt = "{\"count\":\"3\"}\n{\"SG_id\":\"10000001\",\"SG_info\":\"magic glasses belongs to time elder.\",\"SG_name\":\"black glasses\",\"SG_price\":\"5.00\",\"SG_type\":\"1\"}\\n{\"SG_id\":\"10000001\",\"SG_info\":\"magic glasses belongs to time elder.\",\"SG_name\":\"black glasses\",\"SG_price\":\"5.00\",\"SG_type\":\"1\"}\\n{\"SG_id\":\"10000001\",\"SG_info\":\"magic glasses belongs to time elder.\",\"SG_name\":\"black glasses\",\"SG_price\":\"5.00\",\"SG_type\":\"1\"}\\n";
            // 去掉结尾乱码，拆分为数量和商品信息
            // console.log(responseTxt);
            responseTxt = responseTxt.substring(0, responseTxt.lastIndexOf('}')+1);
            var amount = responseTxt.substring(0, responseTxt.indexOf('}')+1);
            responseTxt = responseTxt.replace(amount, "");
            responseTxt = responseTxt.substring(1, responseTxt.length-1) + "}";
            responseTxt = responseTxt.split("\n");

            amount = JSON.parse(amount)
            amount = amount["count"];
            showItems(amount, responseTxt);
        },
        dataType: "text"
    });
}

function logout() {
    delCookie(1);
    var logTab = window.document.getElementById("logstatus");
    logTab.innerHTML = "登录/注册";
    logTab.src = "login.html";
}

function checkLogStatus() {
    var cookieInfo = getCookie(1);
    if(cookieInfo != 0) { // is login
        var logTab = window.document.getElementById("logstatus");
        logTab.innerHTML = cookieInfo["U_name"] + ", 登出";
        logTab.src = "index.html";
        logTab.onclick = logout;
    }
}