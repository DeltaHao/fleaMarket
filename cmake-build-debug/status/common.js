var url = "./";

// 提交注册表单
function reg() {
    // var params = $("#regedit").serializeArray();
    // var values_reg = {};
    // for(x in params){
    //     values_reg[params[x].name] = params[x].value;
    // }
    //
    // console.log(params);
    // $.post("register.html", values_reg);
    var xhr_reg = new XMLHttpRequest();
    var params = $("#regedit").serializeArray();


    var values_reg = { "op": "Register_auth" };
    for(x in params) {
        values_reg[params[x].name] = params[x].value;
    }
    xhr_reg.open("POST", url,false);
    xhr_reg.send(JSON.stringify(values_reg));
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
            data: values_log,
            dataType: "text",
            success:function(responseTxt, statusTxt, xhr_log) {
                // var ret = JSON.parse(responseTxt);
                // 接受返回数据并处理
                // var auth = ret["auth"];
                var auth = "1";
                if(auth == "1") {
                    window.location.href = "index.html?id=15";
                }
                else {
                    alert("wrong");
                }
            }
        }
    );


    // xhr_log.open("POST", url,false);
    // xhr_log.send(JSON.stringify(values_log));



}

// 提交待售物品表单
function sg_publish() {
    var xhr_sg = new XMLHttpRequest();
    // 获取表单中内容
    var params = $("#sgedit").serializeArray();
    

    var values_sg = { "op": "SG_publish" };
    for(x in params) {
        values_sg[params[x].name] = params[x].value;
    }

    // 读取图片
    var file = document.getElementById("img").files[0];
    var reader_sg = new FileReader();

    reader_sg.onload = function(e) {
        var formData = new FormData();
        formData.append("base64", e.target.result);
        for(var pair of formData.entries()) {
            values_sg[pair[0]] = pair[1];
        }
        values_sg = JSON.stringify(values_sg);
        xhr_sg.open("POST", url,false);
        xhr_sg.send(values_sg);
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

    // // 读取图片
    // var file = document.getElementById("img").files[0];
    // var reader_wg = new FileReader();

    // reader_wg.onload = function(e) {
    //     var formData = new FormData();
    //     formData.append("base64", e.target.result);
    //     for(var pair of formData.entries()) {
    //         values_wg[pair[0]] = pair[1];
    //     }

    // };
    //
    // reader_wg.readAsDataURL(file);

    values_wg = JSON.stringify(values_wg);
    xhr_wg.open("POST", url,false);
    xhr_wg.send(values_wg);
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
    xhr_sgres.send(values_sgres);
}
function WG_respond(goodname) {
    var xhr_wgres = new XMLHttpRequest();
    var values_wgres = {"op": "WG_respond", "goodname": goodname};
    values_wgres = JSON.stringify(values_wgres);
    xhr_wgres.open("POST", url,true);
    xhr_wgres.send(values_wgres);
}