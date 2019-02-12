// ==UserScript==
// @name         BZOJ Helper
// @namespace    bzoj
// @version      1.5.1
// @description  BZOJ助手
// @author       ranwen
// @match        https://lydsy.com/*
// @match        https://www.lydsy.com/*
// @license      MIT
// ==/UserScript==

(function () {
    String.prototype.trim = function () {
        return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    function savedata(name, val) {
        localStorage.setItem(name, JSON.stringify(val));
    }
    function readdata(name) {
        return JSON.parse(localStorage.getItem(name))
    }
    function getradioval(name) {
        for (i of document.getElementsByName(name)) {
            if (i.checked) {
                return i.value;
            }
        }
    }
    var poly_star = "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 20px;height: 20px;\">\
    <polygon points=\"19.510565162951536,6.9098300562505255 12.351141009169893,6.76393202250021 10,0 7.648858990830108,6.76393202250021 0.48943483704846535,6.9098300562505255 6.195773934819385,11.236067977499792 4.122147477075267,18.090169943749473 10,14 15.87785252292473,18.090169943749476 13.804226065180615,11.23606797749979\" style=\"fill:#FFFF00;\"></polygon>\
</svg>";
    var logined = 0
    var username = "";
    var mydb = Array();
    var markedp = Array();
    var fixurl = location.href;
    var havenotice = 0;
    if(document.getElementsByTagName("center")[1].innerText.indexOf("Notice")!=-1)  havenotice=1;
    if (fixurl.indexOf("www.lydsy.com") != -1) {
        fixurl = fixurl.replace("www.lydsy.com", "lydsy.com");
        location.href = fixurl;
    }
    function getmyusername() {
        for (i of document.getElementsByTagName("table")[0].childNodes[1].childNodes[0].childNodes)
            if (typeof (i.innerText) != "undefined" && i.innerText.indexOf("ModifyUser") != -1) {
                username = i.innerText.substr(12);
                username = username.trim();
                return;
            }
        logined = -1;
    }
    //页面判断
    function isprob() {
        if (fixurl.indexOf("https://lydsy.com/JudgeOnline/problem.php?id=") == -1) {
            return -1;
        }
        return fixurl.substr(45);
    }
    function isstatus() {
        if (fixurl.indexOf("https://lydsy.com/JudgeOnline/status.php") == -1) {
            return -1;
        }
        return 0;
    }
    function islist() {
        if (fixurl.indexOf("https://lydsy.com/JudgeOnline/problemset.php") == -1) {
            return -1;
        }
        return 0;
    }
    function isconfig() {
        if (fixurl.indexOf("https://lydsy.com/JudgeOnline/modifypage.php") == -1) {
            return -1;
        }
        return 0;
    }
    function isdiscusspage() {
        if (fixurl.indexOf("https://lydsy.com/JudgeOnline/wttl/thread.php") == -1) {
            return -1;
        }
        return 0;
    }
    function isuserinfo() {
        if (fixurl.indexOf("https://lydsy.com/JudgeOnline/userinfo.php?user=") == -1) {
            return -1;
        }
        return 0;

    }
    //更新db
    function updateprobinfobypage(pid) {
        sb = {};
        for (i of document.getElementsByTagName("h2")[0].childNodes)
            if (i.nodeName == "#text") {
                sb["title"] = i.data.substr(6)
                break
            }
        sb["submit"] = document.getElementsByTagName("center")[1+havenotice].getElementsByClassName("green")[2].nextSibling.data;
        sb["submit"] = sb["submit"].slice(0, -2);
        sb["solved"] = document.getElementsByTagName("center")[1+havenotice].getElementsByClassName("green")[3].nextSibling.data;
        sb["source"] = document.getElementsByTagName("h2")[7].nextElementSibling.childNodes[0].innerText;
        savedata("problem_" + pid, sb)
    }
    function updateprobinfobylist() {
        for (i of document.getElementById("problemset").getElementsByTagName("tbody")[0].childNodes) {
            sb = {}
            prob = i.childNodes[1].innerText.trim();
            sb["title"] = i.childNodes[2].innerText.trim();
            sb["source"] = i.childNodes[3].innerText.trim();
            sb["solved"] = i.childNodes[4].innerText.trim();
            sb["submit"] = i.childNodes[5].innerText.trim();
            if (i.childNodes[0].innerText.trim() == "Y") {
                if (mydb.indexOf(prob) == -1)
                    mydb.push(prob)
            }
            savedata("problem_" + prob, sb)
        }
        savedata("userlist_" + username, mydb)
    }
    function updateuserdb(def = document, nm = fixurl.substr(48)) {
        var list = def.getElementsByTagName("script")[2].innerHTML.match(/p\([1-9][0-9]{3}\)/g);
        var rl = Array();
        for (var i of list) {
            rl.push(i.substr(2, 4))
        }
        savedata("userlist_" + nm, rl)
    }
    function getmydb() {
        ret = readdata("userlist_" + username);
        if (ret == null) {
            xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://lydsy.com/JudgeOnline/userinfo.php?user=' + username, false);
            xhr.send(null);
            parser = new DOMParser();
            gg = parser.parseFromString(xhr.responseText, "text/html")
            updateuserdb(gg, username)
            ret = readdata("userlist_" + username)
        }
        return ret
    }
    function setdefaultconfig() {
        def = { "unmarkalert": "0", "autoext": "1", "statusny": "1" };
        for (i in def) {
            if (typeof (config[i]) == "undefined")
                config[i] = def[i];
        }
        savedata("config", config);
    }
    getmyusername()
    if (logined == -1) {
        return;
    }
    markedp = readdata("marked");
    if (markedp == null) {
        savedata("marked", Array());
        markedp = Array();
    }
    config = readdata("config");
    if (config == null) {
        savedata("config", {});
        config = {};
    }
    setdefaultconfig();
    //page
    if (isuserinfo() != -1) {
        updateuserdb();
        document.getElementsByTagName("table")[1].getElementsByTagName("tr")[0].getElementsByTagName("td")[2].innerHTML+=" <a href=\"javascript:;\" id=\"diffme\">Diff with me</a>"
        document.getElementById("diffme").onclick = function () {
            nm=fixurl.substr(48)
            txt=""
            usdb=readdata("userlist_"+nm)
            for(i=1000;i<=9999;i++)
            {
                hs1=(mydb.indexOf(""+i)!=-1)
                hs2=(usdb.indexOf(""+i)!=-1)
                if(hs1 && hs2)
                    txt+="<a href=\"problem.php?id="+i+"\">"+i+"</a>\n"
                if(hs1 && (!hs2))
                    txt+="<a href=\"problem.php?id="+i+"\" style=\"color:#00FF00\">"+i+"</a>\n"
                if((!hs1) && hs2)
                    txt+="<a href=\"problem.php?id="+i+"\" style=\"color:#FF0000\">"+i+"</a>\n"
            }
            document.getElementsByTagName("table")[1].getElementsByTagName("tr")[1].getElementsByTagName("td")[2].innerHTML=txt
        }
    }

    mydb = getmydb();
    if (islist() != -1) {
        updateprobinfobylist();
        for (i of document.getElementById("problemset").getElementsByTagName("tbody")[0].childNodes) {
            prob = i.childNodes[1].innerText.trim();
            if (markedp.indexOf(prob) != -1) i.childNodes[2].innerHTML = i.childNodes[2].innerHTML + poly_star;
        }
        document.getElementById("problemset").getElementsByTagName("thead")[0].childNodes[1].childNodes[0].childNodes[0].innerHTML = document.getElementById("problemset").getElementsByTagName("thead")[0].childNodes[1].childNodes[0].childNodes[0].innerHTML +
            "<a href=\"javascript:;\" id=\"showmarkedlist\">Marked Problem</a>";
        document.getElementById("showmarkedlist").onclick = function () {
            txt = ""
            for (i = 0; i < markedp.length; i++) {
                o = markedp[i]
                info = readdata("problem_" + o);
                nr = ""
                nr += "<tr class=\"" + ((i & 1) == 0 ? "evenrow" : "oddrow") + "\">";
                nr += "<td>";
                if (mydb.indexOf(o) != -1) nr += "<span class=\"yes\">Y</span>";
                nr += "</td>";
                nr += "<td align=\"center\">";
                nr += o;
                nr += "</td>";
                nr += "<td align=\"left\">";
                nr += "<a href=\"problem.php?id=" + o + "\">" + info['title'] + "</a>" + poly_star;
                nr += "</td>"
                nr += "<td align=\"center\">";
                nr += info['source']
                nr += "</td>";
                nr += "<td align=\"center\">";
                nr += "<a href=\"status.php?problem_id=" + o + "&amp;jresult=4\">" + info['solved'] + "</a>";
                nr += "</td>";
                nr += "<td align=\"center\">";
                nr += "<a href=\"status.php?problem_id=" + o + "\">" + info['submit'] + "</a>";
                nr += "</td>";
                nr += "</tr>";
                txt += nr;
            }
            document.getElementById("problemset").getElementsByTagName("tbody")[0].innerHTML = txt;
        }
    }

    var prob = isprob();
    if (prob != -1) {
        updateprobinfobypage(prob)
        if (mydb.indexOf(prob) != -1) {
            var rdt = document.getElementsByTagName("center")[1+havenotice].getElementsByTagName("h2")[0].innerHTML;
            var tdb = "<span style=\"color:#00FF00\">Y</span>" + rdt;
            document.getElementsByTagName("center")[1+havenotice].getElementsByTagName("h2")[0].innerHTML = tdb;
        }
        var ttt = document.getElementsByTagName("center")[1+havenotice].innerHTML;
        var fff = ttt + "[<a href=\"https://lydsy.com/JudgeOnline/status.php?problem_id=" + prob + "&user_id=" + username + "\">My Status</a>]";
        document.getElementsByTagName("center")[1+havenotice].innerHTML = fff;
        var rdt = document.getElementsByTagName("center")[1+havenotice].getElementsByTagName("h2")[0].innerHTML;
        col = "#cccccc"
        if (markedp.indexOf(prob) != -1) col = "#FFFF00";
        var tdb = rdt +
            "<a href=\"javascript:;\" id=\"chmr\"><svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" style=\"width: 20px;height: 20px;\">\
                <polygon points=\"19.510565162951536,6.9098300562505255 12.351141009169893,6.76393202250021 10,0 7.648858990830108,6.76393202250021 0.48943483704846535,6.9098300562505255 6.195773934819385,11.236067977499792 4.122147477075267,18.090169943749473 10,14 15.87785252292473,18.090169943749476 13.804226065180615,11.23606797749979\" style=\"fill:"+ col + ";\"></polygon>\
            </svg></a>";
        document.getElementsByTagName("center")[1+havenotice].getElementsByTagName("h2")[0].innerHTML = tdb;

        document.getElementById("chmr").onclick = function () {
            if (markedp.indexOf(prob) != -1) {
                if (config["unmarkalert"] == "1" && !window.confirm("确定鸽掉它?")) return; //取消标记提示
                markedp.splice(markedp.indexOf(prob), 1)
                document.getElementsByTagName("center")[1+havenotice].getElementsByTagName("h2")[0].getElementsByTagName("a")[0].childNodes[0].childNodes[1].style.fill = "#cccccc"
            }
            else {
                markedp.push(prob)
                document.getElementsByTagName("center")[1+havenotice].getElementsByTagName("h2")[0].getElementsByTagName("a")[0].childNodes[0].childNodes[1].style.fill = "#FFFF00"
            }
            markedp.sort()
            savedata("marked", markedp)
        }
    }

    if (isstatus() != -1) {
        for (var i of document.getElementsByTagName("center")[0].getElementsByTagName("table")[2].getElementsByTagName("tbody")[0].childNodes) {
            if (i.className != "evenrow" && i.className != "oddrow") continue;
            prob = i.childNodes[2].childNodes[0].innerText.trim();
            user = i.childNodes[1].childNodes[0].innerText.trim();
            stat = i.childNodes[3].childNodes[0].innerText.trim();
            if (stat == "Accepted" && readdata("userlist_" + user) != null) {
                udb = readdata("userlist_" + user)
                if (udb.indexOf(prob) == -1)
                    udb.push(prob)
                savedata("userlist_" + user, udb)
                if (user == username)
                    mydb.push(prob)
            }
            mkd = ""
            if (markedp.indexOf(prob) != -1)
                mkd = poly_star;
            if (mydb.indexOf(prob) != -1) {
                fky = "<span style=\"color:#00FF00\">Y</span>";
            }
            else {
                fky = "<span style=\"color:#FF0000\">N</span>";
            }

            if (config['statusny'] == "0") fky = ""
            i.childNodes[2].childNodes[0].innerHTML = fky + i.childNodes[2].childNodes[0].innerHTML + mkd;
        }
    }

    if (isconfig() != -1) {
        var usco =
        {
            "unmarkalert":
            {
                "name": "取消标记时弹窗确认",
                "0": "关闭",
                "1": "开启"
            },
            "autoext":
            {
                "name": "自动续命",
                "0": "关闭",
                "1": "开启"
            },
            "statusny":
            {
                "name": "Status页面显示是否AC",
                "0": "关闭",
                "1": "开启"
            }
        };
        tmpid = 0
        txt = "<h3>BZOJ Helper设置</h3>"
        document.getElementsByTagName("center")[1+havenotice].innerHTML += txt;
        for (i in usco) {
            txt = "<p>"
            txt += usco[i]["name"] + ":"
            chid = -1
            for (j in usco[i]) {
                if (j == "name") continue;
                txt += "<label for=\"tmprad" + tmpid + "\"><input id=\"tmprad" + tmpid + "\" type=\"radio\" value=\"" + j + "\" name=\"" + i + "\">" + usco[i][j] + "</label>"
                if (j == config[i])
                    chid = tmpid
                tmpid++
            }
            txt += "</p>"
            document.getElementsByTagName("center")[1+havenotice].innerHTML += txt;
            document.getElementById("tmprad" + chid).setAttribute("checked", true)
        }
        document.getElementsByTagName("center")[1+havenotice].innerHTML += "<p><input id=\"helpersumbit\" type=\"button\" value=\"保存\"/></p>"
        document.getElementsByTagName("center")[1+havenotice].innerHTML += "<span style=\"color:#FF0000\" id=\"savesucci\" hidden=\"true\">保存成功</span>"
        document.getElementById("helpersumbit").onclick = function () {
            for (i in usco)
                config[i] = getradioval(i)
            savedata("config", config);
            document.getElementById("savesucci").removeAttribute("hidden")
        }
    }

    if (isdiscusspage() != -1) {
        document.getElementsByTagName("center")[1+havenotice].childNodes[1].childNodes[1].innerHTML += document.getElementsByTagName("center")[1+havenotice].childNodes[1].childNodes[5].innerHTML;
    }

    //自动续命
    document.getElementsByTagName("center")[0].childNodes[1].innerHTML += "<div class=\"tmp\" style=\"height:0px;width:0px;\"><img id=\"autofre\" src=\"data:image/png;base64,\" style=\"width:0px;height:0px;\"/></div>";
    if (config["autoext"] == "1") setInterval(function () { document.getElementById("autofre").src = "https://lydsy.com/JudgeOnline/" }, 600000);
})();