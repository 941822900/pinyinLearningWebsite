var http = require('http');
var pinyin = require('pinyin');
var express = require('express');
var app = express();
var mysql = require('mysql');
var fs = require('fs');
var path = require('path');

app.listen(80, ()=>
{
    console.log('Server running at http://127.0.0.1:80/');
});
app.use('/voice', express.static('voice'));
app.use('/image', express.static('image'));
app.use('/jquery-ui-1.12.1.custom', express.static('jquery-ui-1.12.1.custom'));
app.get('/Your_mistakes.txt', (req,res)=>
{
    res.download(path.join(__dirname,'./Your_mistakes.txt'));
});
app.get('/', (req, res) =>
{
    res.writeHead(200, {'Content-Type': 'text/html'});

    // 声明文件操作系统对象
    var fs = require('fs');
    
    fs.readFile('home.html','utf-8',function(err,data){
        if(err){
            console.log("Error!");
        }
        res.end(data);
    });
});
//路由function，实现各种功能
app.get('/function', (req, res) =>
{
    res.writeHead(200, {'Content-Type': 'text/html'});

    // 声明文件操作系统对象
    var fs = require('fs');
    
    fs.readFile('function.html','utf-8',function(err,data){
        if(err){
            console.log("Error!");
        }
        res.end(data);
    });
});
//路由contact，实现友链
app.get('/contact', (req, res) =>
{
    res.writeHead(200, {'Content-Type': 'text/html'});

    // 声明文件操作系统对象
    var fs = require('fs');
    
    fs.readFile('contact.html','utf-8',function(err,data){
        if(err){
            console.log("Error!");
        }
        res.end(data);
    });
});
//路由about，实现对网站的说明
app.get('/about', (req, res) =>
{
    res.writeHead(200, {'Content-Type': 'text/html'});

    // 声明文件操作系统对象
    var fs = require('fs');
    
    fs.readFile('about.html','utf-8',function(err,data){
        if(err){
            console.log("Error!");
        }
        res.end(data);
    });
});
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS"); 
    res.header("X-Powered-By",' 3.2.1'); 
    res.header("Content-Type", "application/json;charset=utf-8"); next(); });

var questions=[ 
    { data:213, num:444, age:12 }, 
    { data:456, num:678, age:13 }
];

//路由345，存入错题
app.get('/345',function(req,res){
    var x=req.query.txt,ret="";
    if(x!=undefined)
        for(var i=0;i<x.length;i++)
            ret+=x[i]+" "+pinyin(x[i])+"\r\n";
    fs.writeFileSync('./Your_mistakes.txt',ret);
    res.send("OK");
});
//路由12,仅仅是调用pinyin
app.get('/12',function(req,res){
    //console.log(pinyin(req.query.txt));
    res.send(pinyin(req.query.txt));
});

//路由123
app.get('/123',function(req,res){
    var str=String(pinyin(req.query.txt,{style:pinyin.STYLE_TONE2}));
    var str1=String(pinyin(req.query.txt,{style:pinyin.STYLE_INITIALS}));
    var arr=str.split(",");
    var arr1=str1.split(",");
    var ret=new Array();

    //console.log(arr);
    //console.log(arr1);

    for(var i=0;i<arr.length;i++){
        var s1=arr1[i];
        if(s1==""&&(arr[i].charAt(0)=='w'||arr[i].charAt(0)=='y'))
            s1=(String)(arr[i].charAt(0));
        if(s1!="") ret.push(s1);

        var s=arr[i].slice(s1.length);
        if(exist(s)){
            ret.push(s);
        }
        else{
            if(s.charAt(0)=='u') ret.push("u");
            else ret.push("i");
            ret.push(s.slice(1));
        }
    }
    res.send(ret);
});

var character=['a', 'a1', 'a2', 'a3', 'a4', 'ai', 'ai1', 'ai2', 'ai3', 'ai4', 'an', 'an1', 'an2', 'an3', 'an4', 'ang', 'ang1', 'ang2', 'ang3', 'ang4', 'ao', 'ao1', 'ao2', 'ao3', 'ao4', 'b', 'c', 'ch', 'd', 'e', 'e1', 'e2', 'e3', 'e4', 'ei', 'ei1', 'ei2', 'ei3', 'ei4', 'en', 'en1', 'en2', 'en3', 'en4', 'eng', 'eng1', 'eng2', 'eng3', 'eng4', 'er', 'er1', 'er2', 'er3', 'er4', 'f', 'g', 'h', 'i', 'i1', 'i2', 'i3', 'i4', 'ie', 'ie1', 'ie2', 'ie3', 'ie4', 'in', 'in1', 'in2', 'in3', 'in4', 'ing', 'ing1', 'ing2', 'ing3', 'ing4', 'iu', 'iu1', 'iu2', 'iu3', 'iu4', 'j', 'k', 'l', 'm', 'n', 'o', 'o1', 'o2', 'o3', 'o4', 'ong', 'ong1', 'ong2', 'ong3', 'ong4', 'ou', 'ou1', 'ou2', 'ou3', 'ou4', 'p', 'q', 'r', 's', 'sh', 't', 'u', 'u1', 'u2', 'u3', 'u4', 'ui', 'ui1', 'ui2', 'ui3', 'ui4', 'un', 'un1', 'un2', 'un3', 'un4', 'v', 'v1', 'v2', 'v3', 'v4', 'ue', 'ue1', 'ue2', 'ue3', 'ue4', 'vn', 'vn1', 'vn2', 'vn3', 'vn4', 'w', 'x', 'y', 'z', 'zh'];
function exist(str){
    for(var i=0;i<character.length;i++)
        if(str==character[i]) return true;
    return false;
}

//与mysql数据库的连接
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'Chinese_character'
});

connection.connect();

//路由234，随一道题返回，包含一个汉字和四个选项
app.get('/234',function(req,res){
    connection.query("select * from chinese_character.table1 order by rand() limit 1",function getABCD(err,result){
        if(err) console.log("Error!");
        else{
            var x=result[0];
            x["A"]=String(pinyin(x.word));
            getapinyin()
            .then(function getB(data){
                x["B"]=data;
                //console.log("reach B");
                if(Math.random()>0.2&&Levenshtein(x["A"],x["B"])>Math.pow(Math.random()*10,2)/10)
                    return getapinyin().then(getB);
                else return getapinyin();
            })
            .then(function getC(data){
                x["C"]=data;
                //console.log("reach C");
                if(Math.random()>0.2&&Levenshtein(x["A"],x["C"])>Math.pow(Math.random()*10,2)/10)
                    return getapinyin().then(getC);
                else return getapinyin();
            })
            .then(function getD(data){
                x["D"]=data;
                //console.log("reach D");
                if(Math.random()>0.2&&Levenshtein(x["A"],x["D"])>Math.pow(Math.random()*10,2)/10)
                   getapinyin().then(getD);
            })
            .then(function(){
                if(x["A"]==x["B"]||x["A"]==x["C"]||x["A"]==x["D"]||x["B"]==x["C"]||x["B"]==x["D"]||x["C"]==x["D"])
                   getABCD(err,result);
                else{
                    var tt;
                    switch(Math.floor(Math.random()*4)){
                        case 0:tt=x["A"];x["A"]=x["B"];x["B"]=tt;break;
                        case 1:tt=x["A"];x["A"]=x["C"];x["C"]=tt;break;
                        case 2:tt=x["A"];x["A"]=x["C"];x["C"]=tt;break;
                    }
                    res.send(result[0]);
                }
            });
        }
    });
});
//此处有回调问题待解决！！！
//已用promise解决
function getapinyin(){
    var p=new Promise(function(resolve,reject){
        connection.query("select * from chinese_character.table1 order by rand() limit 1",function(err,result){
            if(err) console.log("Error!");
            else{
                resolve(String(pinyin(result[0].word)));
            }
        });
    });
    return p;
}

//检查两个字符串的相似度
function Levenshtein(str1, str2) {
    //计算两个字符串的长度
    var len1 = str1.length;
    var len2 = str2.length;
    //建立上面说的数组，比字符长度大一个空间  
    var dif = [];

    //赋初值，步骤B。  
    for (var a = 0; a <= len1; a++) {
        dif[a] = [];
        dif[a][0] = a;
    }
    for (var a = 0; a <= len2; a++) {
        dif[0][a] = a;
    }
    //计算两个字符是否一样，计算左上的值  
    var temp;
    for (var i = 1; i <= len1; i++) {
        for (var j = 1; j <= len2; j++) {
            if (str1[i - 1] == str2[j - 1]) {
                temp = 0;
            } else {
                temp = 1;
            }
            //取三个值中最小的  
            dif[i][j] = min([
                            dif[i - 1][j - 1] + temp,
                            dif[i][j - 1] + 1,
                            dif[i - 1][j] + 1
            ]);
        }
    }
    //System.out.println("字符串\""+str1+"\"与\""+str2+"\"的比较");  
    //取数组右下角的值，同样不同位置代表不同字符串的比较  
    console.log("差异步骤：" + dif[len1][len2]);

    //计算相似度 
    var similarity = 1 - dif[len1][len2] / Math.max(str1.length, str2.length);
    //System.out.println("相似度："+similarity);
    return similarity;
}
//得到最小值  
function min(ints) {
    var min = 0;
    for (var i = 0; i < ints.length; i++) {
        if (min > ints[i]) {
            min = ints[i];
        }
    }
    return min;
}