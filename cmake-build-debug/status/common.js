
// 提交注册表单
function regedit() {


}

// 提交登录表单
function login() {
    var xhr = new XMLHttpRequest();
    var params = $("#loginedit").serializeArray();
    var url = "http://192.168.68.128:12000";
    var values = {};
    for(x in params) {
        values[params[x].name] = params[x].value;
    }
    xhr.open("POST", url,false);
    var f = JSON.stringify(values);
    xhr.send(f);
}