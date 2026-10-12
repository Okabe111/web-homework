var STORAGE_KEY = "site_messages";

function getMessages(){
    try{
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }catch(e){
        return [];
    }
}

function saveMessages(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderMessages(){
    var box = document.getElementById("msgList");
    if(!box) return;
    var list = getMessages();
    if(list.length === 0){
        box.innerHTML = '<div class="empty">暂无留言，快来写下第一条留言吧</div>';
        return;
    }
    box.innerHTML = list.map(function(m){
        return '<li>'
            + '<div class="meta"><b>' + m.name + '</b><span>' + m.time + '</span></div>'
            + '<div class="text">' + m.content + '</div>'
            + '</li>';
    }).join("");
}

function showToast(msg){
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.className = "toast show";
    setTimeout(function(){
        t.className = "toast";
    }, 2200);
}

function escapeHtml(str){
    return str.replace(/[&<>"']/g, function(c){
        return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
}

function submitMsg(){
    var nameInput = document.getElementById("username");
    var contentInput = document.getElementById("msgContent");
    var name = nameInput.value.trim();
    var content = contentInput.value.trim();

    if(!name){
        alert("请填写昵称");
        nameInput.focus();
        return;
    }
    if(!content){
        alert("请填写留言内容");
        contentInput.focus();
        return;
    }

    var now = new Date();
    var time = now.getFullYear() + "-"
        + String(now.getMonth() + 1).padStart(2, "0") + "-"
        + String(now.getDate()).padStart(2, "0") + " "
        + String(now.getHours()).padStart(2, "0") + ":"
        + String(now.getMinutes()).padStart(2, "0");

    var list = getMessages();
    list.unshift({
        name: escapeHtml(name),
        content: escapeHtml(content),
        time: time
    });
    saveMessages(list);
    renderMessages();
    document.getElementById("msgForm").reset();
    showToast("留言提交成功（后端接口预留，当前保存在浏览器本地）");
}

document.addEventListener("DOMContentLoaded", function(){
    renderMessages();
    var btn = document.getElementById("submitBtn");
    if(btn){
        btn.addEventListener("click", submitMsg);
    }
});
