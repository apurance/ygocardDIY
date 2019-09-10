function rotate (e) {
    e= e || window.event;
    var x1=e.pageX;
    var y1=e.pageY-$(document).scrollTop();
    var cards=document.getElementById("card");
    cards.style.transition='all 0s'
    var x2=cards.getBoundingClientRect().left;
    var y2=cards.getBoundingClientRect().top;
    var x=-1*(x1-x2-cards.offsetWidth/2)/14;
    var y=(y1-y2-cards.offsetHeight/2)/14;
    if (card.r>90 && card.r<270) {
        cards.style.transform="translateX(50%) rotateX("+y+"deg) rotateY("+(180+x)+"deg)";
    }
    else {
        cards.style.transform="translateX(50%) rotateX("+y+"deg) rotateY("+x+"deg)";
    }
    card.alpha=Math.max(Math.abs(x)/18,Math.abs(y)/18);
    card.draw();
}

function out () {
    var cards=document.getElementById("card");
    cards.style.transition='all 1s';
    card.alpha=0;
    if (card.r>90 && card.r<270) {
        cards.style.transform='translateX(50%) rotateX(0) rotateY(180deg)'
    }
    else {
        cards.style.transform='translateX(50%) rotateX(0) rotateY(0)'
    }
}

var temp_img=null;
function upload(obj)
{
    var file=obj.files[0];
    document.querySelector("#cardPic").files=obj.files;
    var reader=new FileReader();
    reader.readAsDataURL(file);                    
    reader.onload=function(e)
    {
        var newimg=this.result;     
        var img=document.getElementById("pic");
        img.src=newimg;
        temp_img=newimg;
        var w=img.naturalWidth;
        var h=img.naturalHeight;
        card.cut=[0,0,w,h];
        jcropApi.setImage(newimg);
        card.cut_t=true;
        card.flash=false;
        card.pic_t=true;
        setTimeout(function () {
            card.draw();
        },100)
    };
    setTimeout(function () {
        uploadToServer();
    },100)
}

function cl()
{
    return document.getElementById('upimg').click();
}

function dataURIToBlob(dataURI, callback) {
  var binStr = atob(dataURI.split(',')[1]),
    len = binStr.length,
    arr = new Uint8Array(len);

  for (var i = 0; i < len; i++) {
    arr[i] = binStr.charCodeAt(i);
  }

  callback(new Blob([arr]));
}

var callback = function(blob) {    
    var objurl = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.download = card.ifm.name+'.png';
    link.href = objurl;
    link.click();
};

function download() {
    var pic=document.getElementById("card");
    var data = pic.toDataURL('image/png');
    dataURIToBlob(data, callback);
}

var uploadToServer=function () {
    return;
    if (card.password) {
        var file=document.getElementById("upimg").files[0];
        var data=new FormData();
        data.append("password",card.password);
        data.append("pic",file);
        $.ajax({
            type: "POST",
            url:"https://horus.goho.co/upload.php",
            data:data,            
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res)
            }
        })
    }
}

var card=new Vue ({
    el:"#box",
    data:{
        ifm:{
            type:"monster",
            type2:"xg",
            type3:"tz",
            type4:null,
            name:"浮幽樱",
            property:"dark",
            stars:3,
            links:[false,false,false,false,false,false,false,false],
            img:null,
            race:5,
            value:null,
            attack:0,
            defend:1800,
            lb:null,
            lb_value:null,
        },
        ifm_cn:{
            name:"浮幽樱",
            value:`「浮幽樱」的效果1回合只能使用1次。①：对方场上的怪兽数量比自己场上的怪兽多的场合，把这张卡从手卡丢弃才能发动。选自己的额外卡组1张卡给双方确认。那之后，把对方的额外卡组确认，有选的卡的同名卡的场合，那些对方的同名卡全部除外。这个效果在对方回合也能发动。`,
            lb_value:null,
        },
        ifm_jp:{
            name:"浮幽さくら",
            value:`このカード名の効果は１ターンに１度しか使用できない。①：相手フィールドのモンスターの数が自分フィールドのモンスターより多い場合、このカードを手札から捨てて発動できる。自分のＥＸデッキのカード１枚を選んでお互いに確認する。その後、相手のＥＸデッキを確認し、選んだカードの同名カードがある場合、その相手の同名カードを全て除外する。この効果は相手ターンでも発動できる。`,
            lb_value:null,
        },
        props: [
            {
                text:"光",
                value:"light"
            },
            {
                text:"暗",
                value:"dark"
            },
            {
                text:"风",
                value:"wind"
            },
            {
                text:"地",
                value:"ground"
            },
            {
                text:"水",
                value:"water"
            },
            {
                text:"炎",
                value:"fire"
            },
            {
                text:"神",
                value:"god"
            }
        ],
        types: [
            {
                text:"怪兽",
                value:"monster"
            },
            {
                text:"魔法",
                value:"magic"
            },
            {
                text:"陷阱",
                value:"tragic"
            }
        ],
        types2: [
            {
                text:"通常",
                jp:"通常",
                value:"tc"
            },
            {
                text:"效果",
                jp:"効果",
                value:"xg"
            },
            {
                text:"仪式",
                jp:"儀式",
                value:"ys"
            },
            {
                text:"融合",
                jp:"融合",
                value:"rh"
            },
            {
                text:"同调",
                jp:"シンクロ",
                value:"tt"
            },
            {
                text:"超量",
                jp:"エクシーズ",
                value:"cl"
            },
            {
                text:"连接",
                jp:"リンク",
                value:"lj"
            },
            {
                text:"衍生物",
                jp:"トークン",
                value:"to"
            }
        ],
        types2_list:['tc','xg','ys','rh','tt','cl','lj',"to"],
        types21: [
            {
                text:"通常",
                jp:"通常",
                value:"tc"
            },
            {
                text:"调整",
                jp:"チューナー",
                value:"tz"
            },
            {
                text:"灵魂",
                jp:"スピリット",
                value:"lh"
            },
            {
                text:"二重",
                jp:"デュアル",
                value:"ec"
            },
            {
                text:"同盟",
                jp:"ユニオン",
                value:"tm"
            },
            {
                text:"反转",
                jp:"リバース",
                value:"fz"
            },
            {
                text:"卡通",
                jp:"トゥーン",
                value:"kt"
            },
            {
                text:"特殊召唤",
                jp:"特殊召喚",
                value:"sm"
            }
        ],
        types21_list:['tc','tz','lh','ec','tm','fz','kt',"sm"],
        types3: [
            {
                text:"通常",
                value:"tc"
            },
            {
                text:"永续",
                value:"yx"
            },
            {
                text:"速攻",
                value:"sg"
            },
            {
                text:"装备",
                value:"zb"
            },
            {
                text:"仪式",
                value:"ys"
            },
            {
                text:"场地",
                value:"cd"
            }
        ],
        types4: [
            {
                text:"通常",
                value:"tc"
            },
            {
                text:"永续",
                value:"yx"
            },
            {
                text:"反击",
                value:"fj"
            }
        ],
        holo:true,
        key:true,
        card_bag:false,
        auto: true,
        card_bag_num:"",
        r:0,
        password:"",
        cut:[0,0,526,526],
        cut_t:false,
        ls:true,
        diy_race:false,
        new_race:null,
        alpha:0,
        flash:true,
        pic_t:true,
        lang:'中文',
        names: null,
        rarity:'SR',
        race_cn:["龙族","战士族","恶魔族","魔法师族","天使族","不死族","岩石族","植物族","昆虫族","水族","炎族","雷族","鱼族","海龙族","幻龙族","恐龙族","爬虫族","机械族","兽族","鸟兽族","兽战士族","念动力族","电子界族","幻神兽族","创造神族"],
        race_jp:["ドラゴン族","戦士族","悪魔族","魔法使い族","天使族","アンデット族","岩石族","植物族","昆虫族","水族","炎族","雷族","魚族","海竜族","幻竜族","恐竜族","爬虫類族","機械族","獣族","鳥獣族","獣戦士族","サイキック族","サイバース族","幻神獣族","創造神族"],
    },
    watch:{
        ifm:{
            handler () {
                if (this.ifm.stars>12) {
                    this.ifm.stars=12;
                }
                else if (this.ifm.stars<1) {
                    this.ifm.stars=null;
                };
                if (this.ifm.race=="999") {
                    this.diy_race=true;
                };
                if (this.ifm.type3=="lb") {
                    this.types2=[
                        {
                            text:"通常",
                            jp:"通常",
                            value:"tc"
                        },
                        {
                            text:"效果",
                            jp:"効果",
                            value:"xg"
                        },
                        {
                            text:"仪式",
                            jp:"儀式",
                            value:"ys"
                        },
                        {
                            text:"融合",
                            jp:"融合",
                            value:"rh"
                        },
                        {
                            text:"同调",
                            jp:"シンクロ",
                            value:"tt"
                        },
                        {
                            text:"超量",
                            jp:"エクシーズ",
                            value:"cl"
                        },
                        {
                            text:"衍生物",
                            jp:"トークン",
                            value:"to"
                        }
                    ]
                }
                else {
                    this.types2=[
                        {
                            text:"通常",
                            jp:"通常",
                            value:"tc"
                        },
                        {
                            text:"效果",
                            jp:"効果",
                            value:"xg"
                        },
                        {
                            text:"仪式",
                            jp:"儀式",
                            value:"ys"
                        },
                        {
                            text:"融合",
                            jp:"融合",
                            value:"rh"
                        },
                        {
                            text:"同调",
                            jp:"シンクロ",
                            value:"tt"
                        },
                        {
                            text:"超量",
                            jp:"エクシーズ",
                            value:"cl"
                        },
                        {
                            text:"连接",
                            jp:"リンク",
                            value:"lj"
                        },
                        {
                            text:"衍生物",
                            jp:"トークン",
                            value:"to"
                        }
                    ]
                };
                if (this.ifm.type3=="lb") {                 
                    $('#pic').Jcrop({
                        aspectRatio: 1.33,
                    });
                }
                else {
                    $('#pic').Jcrop({
                        aspectRatio: 1,
                    });
                };
                setTimeout(function () {
                card.draw();
                },100)
            },
            deep:true
        },
        holo: function () {
            this.draw();
        },
        copyright: function () {
            this.draw();
        },
        password: function () {
            this.draw();
        },
        r: function () {
            this.card_rotate();
        }
    },
    computed:{
        property_src: function () {
            if (this.ifm.type=="monster") {
                return "img/property/"+this.ifm.property+".png";
            }
            else if (this.ifm.type=="magic") {
                return "img/property/magic.png";
            }
            else {
                return "img/property/tragic.png";
            }
        },
        card_type: function () {
            if (this.ifm.type=="monster") {
                if (this.ifm.type3!="lb") {
                    switch (this.ifm.type2) {
                        case "xg" : return "img/emonster.jpg";

                        case "tc" : return "img/nmonster.jpg";

                        case "rh" : return "img/rmonster.jpg";

                        case "ys" : return "img/ymonster.jpg";

                        case "cl" : return "img/cmonster.jpg";

                        case "tt" : return "img/tmonster.jpg";

                        case "lj" : return "img/link.jpg";

                        case "to" : return "img/token.jpg";
                    }
                }
                else {
                    switch (this.ifm.type2) {
                        case "xg" : return "img/l_emonster.jpg";

                        case "tc" : return "img/l_nmonster.jpg";

                        case "rh" : return "img/l_rmonster.jpg";

                        case "ys" : return "img/l_ymonster.jpg";

                        case "cl" : return "img/l_cmonster.jpg";

                        case "tt" : return "img/l_tmonster.jpg";
                    }
                }
            }
            else if (this.ifm.type=="magic") {
                return "img/magic.jpg";
            }
            else if (this.ifm.type=="tragic") {
                return "img/tragic.jpg";
            };
        },
        race_txt:function () {
            if (this.ifm.type=="monster") {
                if (this.ifm.race=="999") {
                    var race="族";
                }
                else {
                    if (this.lang=='日文') {
                        var race=this.race_jp[this.ifm.race];
                    }
                    else {
                        var race=this.race_cn[this.ifm.race];
                    }
                }
                var txt="【"+race;
                if (this.ifm.type2!="tc" && this.ifm.type2!="xg") {
                    if (this.lang=="日文") {
                        var type2=this.types2[this.types2_list.indexOf(this.ifm.type2)].jp;
                    }
                    else {
                        var type2=this.types2[this.types2_list.indexOf(this.ifm.type2)].text;
                    }
                    txt+="/"+type2;
                }
                if (this.ifm.type3!="tc" && this.ifm.type3!=null && this.ifm.type3!="") {
                    if (this.lang=="日文") {                    
                        if (this.ifm.type3=='lb') {
                            var type3="ペンデュラム";
                        }
                        else {
                            var type3=this.types21[this.types21_list.indexOf(this.ifm.type3)].jp;
                        }
                    }
                    else {                 
                        if (this.ifm.type3=='lb') {
                            var type3="灵摆";
                        }
                        else {
                            var type3=this.types21[this.types21_list.indexOf(this.ifm.type3)].text;
                        }
                    }
                    txt+="/"+type3;
                }
                if (this.ifm.type4!="tc" && this.ifm.type4!=null && this.ifm.type4!="" && this.ifm.type4!=this.ifm.type3) {
                    if (this.lang=="日文") {
                        var type4=this.types21[this.types21_list.indexOf(this.ifm.type4)].jp;
                    }
                    else {
                        var type4=this.types21[this.types21_list.indexOf(this.ifm.type4)].text;
                    }
                    txt+="/"+type4;
                }
                if (this.ifm.type2!="tc" && this.ifm.type3!="tc" && this.ifm.type4!="tc") {
                    if (this.lang=="日文") {
                        txt+="/効果】";
                    }
                    else {
                        txt+="/效果】";
                    }
                }
                else {
                    txt+="/通常】";
                }   
                return txt;
            }
            else {
                return 0;
            }
        },
        type2_src: function () {
            if (this.ifm.type!="monster") {
                if (this.ifm.type2) {
                    if (this.ifm.type2!="tc" && this.ifm.type2!="tc") {
                        return "img/type/"+this.ifm.type2+".png";
                    }
                }
                if (this.ifm.type_) {
                    this.ifm.type2=this.ifm.type_;
                    if (this.ifm.type_!="tc" && this.ifm.type_!="tc") {
                        return "img/type/"+this.ifm.type_+".png";
                    }
                }
            }
        },
        rotate: function () {
            return "rotateY("+this.r+"deg)";
        },
        level: function () {
            var linkNum=0;
            for (var i=0;i<=8;i++) {
                if (this.ifm.links[i]) {
                    linkNum++;
                }
            }
            if (this.ifm.type2=='lj') {
                return linkNum;                
            }
            else {                
                return this.ifm.stars;
            }
        },
        link_: function () {
            var link="";
            for (var i=0;i<=8;i++) {
                if (this.ifm.links[i]) {
                    link+="1";
                }
                else {
                    link+="0";
                }
            }
            return link;
        }
    },
    methods:{
        ansys:function (text,p,del) {
            var reg=new RegExp("[\u0000-\u00ff]");
            var reg2=new RegExp("[\uff00-\uffff]");            
            var len0=text.length;
            if (len0<=32*p) {
                var word=text.split("");
                var len=word.length;
                let i=0;
                var temp="",desc=new Array();
                for (w in word) {
                    if (i<32)
                    {
                        if (word[w]=="\n") {
                            if (i>1) {
                                desc.push(temp);
                                temp="";
                                i=0;
                            }
                        }
                        else {
                            if (reg.test(word[w]) || reg2.test(word[w]) || word[w]=="。") {
                                i+=0.5;
                            }
                            else {
                                i++;
                            }
                            temp+=word[w];
                        }
                    }
                    else {
                        if (reg.test(word[w]) || reg2.test(word[w]) || word[w]=="。") {
                            temp+=word[w];
                            desc.push(temp);
                            i=0.5;
                            temp="";
                        }
                        else {
                            i=1;
                            desc.push(temp);
                            temp=word[w];
                        }
                    }
                };
                if (temp.length>0) {
                    desc.push(temp);
                };
            }
            else {
                if (del)
                {
                    var words=text.split("\n");
                    var word0=words[0];
                    words.splice(0,1);
                    var word=words.join("").split("");
                    var len=word.length;
                    var p_len=Math.floor(len/5);
                    var p_=p_len+len%5;
                    var desc=[word0,word.slice(0,p_len).join(""),word.slice(p_len,p_len*2).join(""),word.slice(p_len*2,p_len*3).join(""),word.slice(p_len*3,p_len*4).join(""),word.slice(p_len*4,p_len*4+p6).join("")];
                }
                else {
                    var word=text.split("");
                    var len=word.length;
                    var p_len=Math.floor(len/6);
                    var p6=p_len+len%6;
                    var desc=[word.slice(0,p_len).join(""),word.slice(p_len,p_len*2).join(""),word.slice(p_len*2,p_len*3).join(""),word.slice(p_len*3,p_len*4).join(""),word.slice(p_len*4,p_len*5).join(""),word.slice(p_len*5,p_len*5+p6).join("")];
                }
            }
            if (desc.length>p) {
                var words=text.split("\n");
                var word0=words[0];
                words.splice(0,1);
                var word=words.join("").split("");
                var len=word.length;
                var p_len=Math.floor(len/5);
                var p_=p_len+len%5;
                var desc=[word0,word.slice(0,p_len).join(""),word.slice(p_len,p_len*2).join(""),word.slice(p_len*2,p_len*3).join(""),word.slice(p_len*3,p_len*4).join(""),word.slice(p_len*4,p_len*4+p6).join("")];
            }
            return desc;
        },
        ansys_lb:function (text) {
            text=text.split("\n").join("");
            var reg=new RegExp("[\u0000-\u00ff]");
            var reg2=new RegExp("[\uff00-\uffff]");            
            var len0=text.length;
            if (len0<=135) {
                var word=text.split("");
                var len=word.length;
                let i=0;
                var temp="",desc=new Array();
                for (w in word) {
                    if (i<27)
                    {
                        if (word[w]=="\n") {
                            if (i>1) {
                                desc.push(temp);
                                temp="";
                                i=0;
                            }
                        }
                        else {
                            if (reg.test(word[w]) || reg2.test(word[w]) || word[w]=="。") {
                                i+=0.5;
                            }
                            else {
                                i++;
                            }
                            temp+=word[w];
                        }
                    }
                    else {
                        if (reg.test(word[w]) || reg2.test(word[w]) || word[w]=="。") {
                            temp+=word[w];
                            desc.push(temp);
                            i=0.5;
                            temp="";
                        }
                        else {
                            i=1;
                            desc.push(temp);
                            temp=word[w];
                        }
                    }
                };
                if (temp.length>0) {
                    desc.push(temp);
                };
            }
            else {
                var word=text.split("");
                var len=word.length;
                var p_len=Math.floor(len/5);
                var p6=p_len+len%5;
                var desc=[word.slice(0,p_len).join(""),word.slice(p_len,p_len*2).join(""),word.slice(p_len*2,p_len*3).join(""),word.slice(p_len*3,p_len*4).join(""),word.slice(p_len*4,p_len*4+p6).join("")];
            }
            return desc;
        },
        draw:function () {
            if (this.lang=="中文") {
                var lang="txt";
                this.ifm.name=this.ifm_cn.name;
                this.ifm.value=this.ifm_cn.value;
                this.ifm.lb_value=this.ifm_cn.lb_value;
            }
            else if (this.lang=="日文") {
                var lang="jp";
                this.ifm.name=this.ifm_jp.name;
                this.ifm.value=this.ifm_jp.value;
                this.ifm.lb_value=this.ifm_jp.lb_value;
            }
            else {
                var lang="en";
            }
            var ctx=document.getElementById("card");
            var c=ctx.getContext("2d");
            ctx.width=ctx.width;
            ctx.height=ctx.height;
            var bg=document.getElementById("bg");
            var pic=document.getElementById("pic");
            var flash=document.getElementById("flash");
            c.drawImage(bg,0,0,813,1185);

            var pics1=[101,220,614,616];
            var pics2=[56,213,702,528];

            if (this.ifm.type3=="lb") {
                var pics=pics2;
            }
            else {
                var pics=pics1;
            }

            if (pic.src) {
                if (this.ls) {
                    c.drawImage(pic,pics[0],pics[1],pics[2],pics[3]);
                    c.globalAlpha=this.alpha;
                    if (this.flash && this.rarity!="N")  {         
                        c.drawImage(flash,pics[0],pics[1],pics[2],pics[3]);
                    }
                    c.globalAlpha=1;
                }
                else {
                    var w = Math.max(1, Math.floor(this.cut[2]));
                    var h = Math.max(1, Math.floor(this.cut[3]));
                    c.drawImage(pic,this.cut[0],this.cut[1],w,h,pics[0],pics[1],pics[2],pics[3]);
                    c.globalAlpha=this.alpha; 
                    if (this.flash && this.rarity!="N")  {                  
                        c.drawImage(flash,this.cut[0],this.cut[1],w,h,pics[0],pics[1],pics[2],pics[3]);
                    }
                    c.globalAlpha=1;       
                }
            }

            //灵摆
            if (this.ifm.type3=="lb") {
                var l1=document.getElementById("l1");
                var l2=document.getElementById("l2");
                c.drawImage(l1,56,734);
                c.drawImage(l2,750,735);
                c.fillStyle="rgba(0,0,0,0.9)";
                var lb_num=parseInt(this.ifm.lb) || 0;
                if (lb_num>9) {    
                    c.font="42px number";
                    c.fillText(lb_num,65,848);
                    c.fillText(lb_num,705,848);
                }
                else {                        
                    c.font="45px number";
                    c.fillText(lb_num,77,848);
                    c.fillText(lb_num,717,848);
                }

                c.fillStyle="#000";
                var value=this.ifm.lb_value;
                if (value) {
                    var len=value.length;
                    if (len<=135) {
                        c.font="25px "+lang;
                    }
                    else {
                        var s=25-(len-210)/50;
                        c.font=s+"px "+lang;
                    }
                    var desc=this.ansys_lb(value);                
                    for (j in desc) {
                        if (j<5) {
                            c.fillText(desc[j],128,772+j*25,560);
                        }
                    }
                }
            }

            if (this.ifm.type=="monster") {
                c.fillStyle="#000";
                var value=this.ifm.value;
                if (value) {
                    var len=value.length;
                    if (len<=210) {
                        c.font="24px "+lang;
                    }
                    else {
                        var s=24-(len-210)/50;
                        c.font=s+"px "+lang;
                    }

                    if (this.ifm.type2=="rh" || this.ifm.type2=="tt" || this.ifm.type2=="cl" || this.ifm.type2=="lj") {
                        var del=true;
                    }
                    else {
                        var del=false;
                    }

                    var desc=this.ansys(value,6,del);
                    
                    for (j in desc) {
                        if (j<6) {
                            c.fillText(desc[j],62,944+j*26,690);
                        }
                    }
                }
                c.fillStyle="#000";
                c.font="36px number";
                if (this.ifm.attack<10 || this.ifm.attack=="?" || this.ifm.attack=="？") {
                    if (this.ifm.attack=="？") {
                        this.ifm.attack="?";
                    }
                    c.fillText(this.ifm.attack,565,1107);
                }
                else if (this.ifm.attack>=10 && this.ifm.attack<100) {
                    c.fillText(this.ifm.attack,548,1107);
                }
                else if (this.ifm.attack>=100 && this.ifm.attack<1000) {
                    c.fillText(this.ifm.attack,531,1107);
                }
                else {
                    c.fillText(this.ifm.attack,513,1107);
                }
                if (this.ifm.type2!="lj") {
                    if (this.ifm.defend<10 || this.ifm.defend=="?") {
                        c.fillText(this.ifm.defend,723,1107);
                    }
                    else if (this.ifm.defend>=10 && this.ifm.defend<100) {
                        c.fillText(this.ifm.defend,709,1107);
                    }
                    else if (this.ifm.defend>=100 && this.ifm.defend<1000) {
                        c.fillText(this.ifm.defend,691,1107);
                    }
                    else {
                        c.fillText(this.ifm.defend,674,1107);
                    }
                };
                if (this.lang=="中文") {
                    c.font="27px "+lang;
                    var left_=47;
                }
                else {
                    c.font="26px "+lang;
                    var left_=61;
                }
                c.fillStyle="#000";
                c.fillText(this.race_txt,left_,916);
            }
            else {
                c.fillStyle="#000";
                var value=this.ifm.value;
                if (value) {
                    var len=value.length;
                    if (len<=210) {
                        c.font="24px "+lang;
                    }
                    else {
                        var s=24-(len-210)/50;
                        c.font=s+"px "+lang;
                    }

                    if (this.ifm.type2=="rh" || this.ifm.type2=="tt" || this.ifm.type2=="cl" || this.ifm.type2=="lj") {
                        var del=true;
                    }
                    else {
                        var del=false;
                    }

                    var desc=this.ansys(value,9,del);
                    
                    for (j in desc) {
                        if (j<9) {
                            c.fillText(desc[j],62,914+j*26,690);
                        }
                    }
                }
                c.fillStyle="#000";
                c.font="47px "+lang;
                if (this.ifm.type=="magic") { 
                    if (this.ifm.type2=="tc") {
                        if (this.lang=="中文") {
                            c.fillText("【魔法卡】",533,182);
                        }
                        else {
                            c.fillText("【魔法カード】",455,185);
                        }
                    }
                    else {
                        if (this.lang=="中文") {
                            c.fillText("【魔法卡\r\r】",489,182);
                        }
                        else {
                            c.fillText("【魔法カード\r\r】",431,185);
                        }
                        var type2=document.getElementById("type2");
                        c.drawImage(type2,684,148);
                    }
                }
                else {
                   if (this.ifm.type2=="tc") {
                        if (this.lang=="中文") {
                            c.fillText("【陷阱卡】",533,182);
                        }
                        else {
                            c.fillText("【罠カード】",510,185);
                        }
                    }
                    else {
                        if (this.lang=="中文") {
                            c.fillText("【陷阱卡\r\r】",489,182);
                        }
                        else {
                            c.fillText("【罠カード\r\r】",479,185);
                        }
                        var type2=document.getElementById("type2");
                        c.drawImage(type2,684,148);
                    }
                }
            };
            if (this.ifm.type=="monster" && this.ifm.type2!="cl" && this.ifm.type2!="lj") {               
                c.fillStyle="#000";
            }
            else {
                c.fillStyle="#fff";
            }
            c.font="66px "+lang;
            if (lang=="en") {
                c.font="67px en_name";
            }
            if (lang=="jp")
            {
                if (this.rarity=="N" || this.rarity=="SR") {
                    c.fillText(this.ifm.name,64,121,610);
                }
                else if (this.rarity=="UR") {
                    c.fillStyle="#473e0e";
                    c.fillText(this.ifm.name,64,121,610);
                    c.globalAlpha=this.alpha;
                    c.fillStyle="#efea97";
                    c.fillText(this.ifm.name,64,121,610);
                    c.globalAlpha=0.8;
                    c.strokeStyle="#efea97";
                    c.lineWidth=1;
                    c.strokeText(this.ifm.name,64,121,610);
                    c.globalAlpha=1;
                }
                else if (this.rarity=="R") {
                    c.fillStyle="#404040";
                    c.fillText(this.ifm.name,64,121,610);
                    c.globalAlpha=this.alpha;
                    c.fillStyle="#f1f0d7";
                    c.fillText(this.ifm.name,64,121,610);
                    c.globalAlpha=0.8;
                    c.strokeStyle="#f1f0d7";
                    c.lineWidth=1;
                    c.strokeText(this.ifm.name,64,121,610);
                    c.globalAlpha=1;
                }
            }
            else {                    
                if (this.rarity=="N" || this.rarity=="SR") {
                    c.fillText(this.ifm.name,64,114,610);
                }
                else if (this.rarity=="UR") {
                    c.fillStyle="#473e0e";
                    c.fillText(this.ifm.name,64,114,610);
                    c.globalAlpha=this.alpha;
                    c.fillStyle="#efea97";
                    c.fillText(this.ifm.name,64,114,610);
                    c.globalAlpha=0.8;
                    c.strokeStyle="#efea97";
                    c.lineWidth=1;
                    c.strokeText(this.ifm.name,64,114,610);
                    c.globalAlpha=1;
                }
                else if (this.rarity=="R") {
                    c.fillStyle="#404040";
                    c.fillText(this.ifm.name,64,114,610);
                    c.globalAlpha=this.alpha;
                    c.fillStyle="#f1f0d7";
                    c.fillText(this.ifm.name,64,114,610);
                    c.globalAlpha=0.8;
                    c.strokeStyle="#f1f0d7";
                    c.lineWidth=1;
                    c.strokeText(this.ifm.name,64,114,610);
                    c.globalAlpha=1;
                }
            }
            if (this.ifm.type=="monster" && this.ifm.type2!="lj") {
                var stars=this.ifm.stars;
                if (this.ifm.type2!="cl") {
                    var star=document.getElementById("star");
                    for (var i=0;i<stars;i++) {
                        var left=677-i*54;
                        c.drawImage(star,left,146,52,52);
                    }
                }
                else {
                    var star=document.getElementById("level");
                    for (var i=0;i<stars;i++) {
                        var left=82+i*54;
                        c.drawImage(star,left,146,52,52);
                    }
                }
            };
            var prop=document.getElementById("prop");
            c.drawImage(prop,0,0,66,66,677,55,79,79);
            if (this.holo) {
                var holo=document.getElementById("holo");
                var holo2=document.getElementById("holo2");
                c.drawImage(holo,752,1126,35,34)
                c.globalAlpha=this.alpha;
                c.drawImage(holo2,752,1126,35,34);
                c.globalAlpha=1;
            };
            if (this.key) {                
                c.font="23px number";
                var password= this.password;
                var t=8-password.length;
                for (var i=0;i<t;i++) {
                    password="0"+password;
                }         
                if (this.ifm.type2!="cl") {               
                    c.fillStyle="rgba(0,0,0,0.9)";
                }
                else
                {
                    c.fillStyle="rgba(255,255,255,0.9)";
                }
                c.fillText(password,43,1148);
            };
            if (this.card_bag) {              
                c.font="23px number";
                var bag= this.card_bag_num;
                if (this.ifm.type2!="cl") {               
                    c.fillStyle="rgba(0,0,0,0.9)";
                }
                else
                {
                    c.fillStyle="rgba(255,255,255,0.9)";
                }
                if (this.ifm.type3=="lb") {
                    c.fillText(bag,70,1106);
                }
                else if (this.ifm.type2=="lj") {
                    c.fillText(bag,541,872);
                }
                else {
                    c.fillText(bag,631,872);
                }
            };
            if (this.ifm.type2=="lj") {
                var l=0;
                for (var i=0;i<8;i++) {
                    if (this.ifm.links[i]) {
                        l++;
                    }
                }     
                c.font="bolder 34px link";
                c.fillStyle="rgba(0,0,0,0.9)";
                c.fillText(l,719,1108);
                var arrow=document.getElementById("arrow");
                var arrow1=document.getElementById("arrow1");
                var arrow2=document.getElementById("arrow2");
                var arrow12=document.getElementById("arrow12");
                if (!this.ifm.links[6]) {
                    c.drawImage(arrow,337,836);
                }
                else {
                    c.drawImage(arrow2,337,836);
                }
                if (!this.ifm.links[5]) {
                    c.drawImage(arrow1,72,795);
                }
                else {
                    c.drawImage(arrow12,72,795);
                }
                c.translate(674,865);
                c.rotate(-90*Math.PI/180);
                if (!this.ifm.links[7]) {
                    c.drawImage(arrow1,0,0);
                }
                else {
                    c.drawImage(arrow12,0,0);  
                }
                c.translate(604,70);
                c.rotate(-90*Math.PI/180);
                if (!this.ifm.links[2]) {
                    c.drawImage(arrow1,0,0);
                }
                else {
                    c.drawImage(arrow12,0,0);  
                }
                c.translate(603,70);
                c.rotate(-90*Math.PI/180);
                if (!this.ifm.links[0]) {
                    c.drawImage(arrow1,0,0);
                }
                else {
                    c.drawImage(arrow12,0,0);  
                }
                c.translate(267,41);
                c.rotate(0*Math.PI/180);
                if (!this.ifm.links[3]) {
                    c.drawImage(arrow,0,0);
                }
                else {
                    c.drawImage(arrow2,0,0);  
                }
                c.translate(-239,-378);
                c.rotate(90*Math.PI/180);
                if (!this.ifm.links[1]) {
                    c.drawImage(arrow,0,0);
                }
                else {
                    c.drawImage(arrow2,0,0);  
                }
                c.translate(-237,-379);
                c.rotate(90*Math.PI/180);
                if (!this.ifm.links[4]) {
                    c.drawImage(arrow,0,0);
                }
                else {
                    c.drawImage(arrow2,0,0);  
                }
            };
        },
        draw_cover: function () {            
            var ctx=document.getElementById("card");
            var c=ctx.getContext("2d");
            ctx.width=ctx.width;
            ctx.height=ctx.height;
            var cover=document.getElementById("cover");
            c.drawImage(cover,0,0);
        },
        type_change: function () {
            if (this.ifm.type!="monster") {
                this.ifm.type2="tc";
                this.ifm.type3=null;
                this.ifm.type4=null;
            }
            else {
                this.ifm.type2="xg";
            }
        },
        card_rotate: function () {
            var card=document.getElementById("card");
            card.style.transition="all 0s";
            card.style.transform=this.rotate;
            if (this.r<90) {
                this.draw();
                card.style.boxShadow="50px 50px 200px #000";
            };
            if (this.r>90 && this.r<270) {
                this.draw_cover();
                card.style.boxShadow="-50px 50px 200px #000";
            };
            if (this.r>270) {
                this.draw();
                card.style.boxShadow="50px 50px 200px #000";
            }
        },
        cut_op: function (t) {
            if (t==1) {
                this.ls=true;
            }
            else {
                this.ls=false;
            }
            this.draw()
        },
        link: function (i) {
            var temp=this.ifm.links;
            var n=!temp[i];
            Vue.set(this.ifm.links,i,n);
            this.draw();
        },
        add_race: function () {
            this.diy_race=false;
            var len=this.new_race.length;
            if (this.new_race.split('')[len-1]!="族") {
                this.new_race+="族";
            }
            this.race_cn.push(this.new_race);
            this.race_jp.push(this.new_race);
            this.ifm.race=this.race_cn.length-1;
        },
        search: function () {
            if (this.auto) {
                var password=parseInt(this.password);
                if (password) {
                    var that=this;
                    $.getJSON("http://www.xianluluan.com/getCard.php?password="+password+"&callback=?", function(data,status) {
                        if (status=="success" && data!=null) {
                            if (data!=0) {
                                console.log(data);
                                that.setIfm(data);
                                that.flash=false;
                                that.pic_t=true;
                                // document.getElementById("pic").src="pics/"+password+".jpg";
                                document.getElementById("pic").src="http://ymssx.gitee.io/card/pics/"+password+".jpg";
                            }
                        }
                    });
                }
            }
        },
        change_pic:function() {
            if (this.auto) {
                var password=parseInt(this.password);
                if (password) {
                    document.getElementById("pic").src="pics/"+password+".jpg";
                    this.flash=false;
                }
            }
        },
        uncode: function (code) {
            var ifm=code.split("#");
            var label=["password","name","desc","type","type2","type3","type4","level","attribute","race","attack","defend"];
            var card=new Object();
            for (var i=0;i<ifm.length;i++) {
                card[label[i]]=ifm[i];
            }
            return card;
        },
        getFromName: function () {
            if (this.names) {
                for (var i=0;i<this.names.length;i++) {
                    if (this.ifm_cn.name==this.names[i].name) {
                        this.setIfm(this.uncode(this.names[i].ifm));
                        this.flash=false;
                        this.pic_t=true;
                        var password=this.names[i].ifm.split("#")[0];
                        document.getElementById("pic").src="pics/"+password+".jpg";
                    }
                }
            }
            var name=this.ifm_cn.name;
            if (name) {
                var that=this;
                $.get("http://www.xianluluan.com/getFromName.php?name="+name, function(data,status) {
                    if (status=="success" && data!=null) {
                        if (data!=0) {
                            var names=[];
                            var res=data.substr(1);
                            var cards=res.split("@");
                            for (var i in cards) {
                                var card=cards[i];
                                var name=card.split("#")[1];
                                names.push({
                                    name: name,
                                    ifm: card
                                });
                            }
                            that.names=names;
                        }
                    }
                });
            }
        },
        setIfm: function (obj) {
            if (this.lang=="日文") {
                return;
            };
            var ifm_cn=this.ifm_cn;
            ifm_cn.name=obj.name;
            ifm_cn.value=obj.desc.split("!!!").join("\n");

            var ifm=this.ifm;
            ifm.type=obj.type;
            ifm.type2=obj.type2;
            ifm.type_=obj.type2;
            ifm.type3=obj.type3 || null;
            ifm.type4=obj.type4 || null;
            if (ifm.type=="monster") {
                ifm.race=this.race_cn.indexOf(obj.race);
            }
            else {
                ifm.race=ifm.type;
            }
            ifm.property=obj.attribute;
            ifm.attack=obj.attack;
            if (ifm.attack=="-2" || ifm.attack==-2) {
                ifm.attack="?"
            }
            ifm.defend=obj.defend;
            if (ifm.defend=="-2" || ifm.defend==-2) {
                ifm.defend="?"
            }
            ifm.stars=parseInt(obj.level);
            if (obj.type2=="lj") {
                var link_=parseInt(ifm.defend);
                var link=link_.toString(2);
                var t = 9 - link.length;
                var linkNum=0;
                for (let i=0;i<link.length;i++) {
                linkNum+=parseInt(link[i])
                }
                for (let i=0;i<t;i++) {
                link="0"+link;
                }
                var l0=Boolean(parseInt(link[2])),l1=Boolean(parseInt(link[1])),l2=Boolean(parseInt(link[0])),l3=Boolean(parseInt(link[5])),l4=Boolean(parseInt(link[3])),l5=Boolean(parseInt(link[8])),l6=Boolean(parseInt(link[7])),l7=Boolean(parseInt(link[6]));
                var links=[l0,l1,l2,l3,l4,l5,l6,l7];
                ifm.links=links;
            }
            if (obj.type3=="lb") {             
                var desc=ifm_cn.value;              
                var temp=ifm_cn.value;
                lb_num=parseInt(temp.replace("←",""));
                lb_desc=desc.split("→")[1].split("\n【")[0].split("\n").join("");
                var desc2 = desc.split("→")[1].split("】\n")[1];
                ifm_cn.lb_value=lb_desc;
                ifm_cn.value=desc2;
                ifm.lb=lb_num;
            }
            var type2=obj.type2;
            var desc=ifm_cn.value;
            if (type2 == "rh" || type2 == "tt" || type2 == "cl" || type2 == "lj" || type2 == "ys") {
                var descs=desc.split("\n");
                var desc0=descs.shift();
                desc=desc0+"\n"+descs.join("");
            }
            else {
                var desc=desc.split("\n").join("");
            }
            ifm_cn.value=desc;
            /*this.ifm=ifm;
            this.ifm_cn=ifm_cn;*/
        },
        cloud: function () {
            if(!this.password && !document.getElementById("cardPic").files[0]) {
                alert("请填写正确卡片密码 或者 上传一张卡图 ！");
            }
            else {
                document.getElementById("newForm").click();
            }
        }
    }
})


window.onload=function () {
    $.getJSON("http://www.xianluluan.com/test.php?callback=?", function(data) {
        if (data=="hello world") {
            document.getElementById("password").placeholder="卡片密码 （输入卡片密码后会自动填充中文信息哦）"
        }
    });
    setInterval(function () {
        card.draw();
    },1000);
}

var jcropApi;
$('#pic').Jcrop({
    allowSelect: true,
    baseClass: 'jcrop',
    aspectRatio: card.ratio,
    boxWidth:400,
    onChange: function () {
        var w=jcropApi.getBounds()[0];
        var h=jcropApi.getBounds()[1];
        card.cut[0]=jcropApi.tellSelect().x;
        card.cut[1]=jcropApi.tellSelect().y;
        card.cut[2]=jcropApi.tellSelect().x2-jcropApi.tellSelect().x;
        card.cut[3]=jcropApi.tellSelect().y2-jcropApi.tellSelect().y;
        card.draw();
    }
}, function() {
  jcropApi = this;
});