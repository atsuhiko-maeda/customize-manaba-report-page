const SEAT_LIST =('E-02 F-02 G-02 H-02 L-02 M-02 N-02 O-02 ' +
        'B-04 C-04 D-04 E-04 F-04 G-04 H-04 L-04 M-04 N-04 O-04 ' +
        'B-07 C-07 D-07 E-07 F-07 G-07 H-07 L-07 M-07 N-07 O-07 ' +
        'B-08 C-08 D-08 E-08 F-08 G-08 H-08 L-08 M-08 N-08 O-08 ' +
        'B-11 C-11 D-11 E-11 F-11 G-11 H-11 L-11 M-11 N-11 O-11 ' +
        'D-12 E-12 F-12 G-12 H-12 L-12 M-12 N-12').split(' ');            

const course_str = location.href.match(/.*course_\d+_/g);
const SETTING = JSON.parse(localStorage.getItem(course_str+"_SETTING"))??  {
    'SEAT_LIST':SEAT_LIST
    ,'SEAT_SHOW': false
    ,'PASSING_MARK':2
    ,'FIRST_NUM': "*105"
    ,'LAST_NUM': "*156"
};

let replaceAllFlag=true;

setTimeout(init,0);

function init(){

    const _style = document.createElement("style");
    _style.innerHTML = `
        iframe.hidden_iframe {
            width:100%;
            height:100%;
            position:absolute;
            top:0px;
            left:0px;
            visibility: hidden;
        }
        .body_border {
            border: 4px #32CD32 solid; 
        }`;
    document.head.appendChild(_style);

    document.body.classList.add('body_border');

    const iframe = document.createElement('iframe');
    iframe.classList.add('hidden_iframe');
    iframe.src = location.href;
    document.body.appendChild(iframe);

    createUI();

    document.querySelector("iframe.hidden_iframe").addEventListener(
        'load',function(){customizePage();
    });
}

function customizePage(){
    console.log("hidden frame was loaded.");
    console.log("customizePage()");

    const hfd = document.querySelector("iframe.hidden_iframe").contentDocument;
    const hfd_table = hfd.querySelector(".stdlist.sorttable");
    const hfd_list = hfd.getElementsByClassName("listcollection_td_left");
    const ID_DIGIT =  hfd_list[0].innerText.length;

    const vfd = document;
    const vfd_table = vfd.querySelector(".stdlist.sorttable");
    const vfd_list = vfd.getElementsByClassName("listcollection_td_left");

    const extractNumber = (pattern,mode) => {
        const str_num = pattern.replace('*', '');
        if (str_num === '')
            return [null, ID_DIGIT+1];
        else if (pattern.startsWith('*')){
            const digitCount = str_num.length;
            return [parseInt(str_num, 10), Math.pow(10, digitCount)];
        }
        else if (pattern.endsWith('*')){
            if (mode==='E'){
                const num = parseInt(str_num, 10)+1;
                const digitCount = ID_DIGIT-str_num.length;
                return [num*Math.pow(10, digitCount)-1, Math.pow(10, ID_DIGIT)];
            }
            else{
                const num = parseInt(str_num, 10);
                const digitCount = ID_DIGIT-str_num.length;
                return [num*Math.pow(10, digitCount), Math.pow(10, ID_DIGIT)];
            }
        }
        else
            return [parseInt(str_num, 10), Math.pow(10, ID_DIGIT)];
    };
    
    const [startNum, digitCountS] = extractNumber(SETTING['FIRST_NUM']);
    const [endNum, digitCountE] = extractNumber(SETTING['LAST_NUM'],'E');

    for (let i=hfd_list.length-1 ; i>=0 ; i--){
        const inner = hfd_list[i].innerText;
        const id = parseInt(inner, 10);
        const idS = id % digitCountS;
        const idE = id % digitCountE;
        // console.log(startNum,idS,idE,endNum);
        if ((startNum === null || startNum <= idS) && (endNum === null || idE <= endNum)){
            ;
        }
        else {
            hfd_list[i].parentNode.remove();
        }
    }

    if (SETTING['SEAT_SHOW']){
        for (let i=0 ; i<hfd_list.length && i<SEAT_LIST.length ; i++)
            hfd_list[i].innerText=hfd_list[i].innerText+" ("+SETTING['SEAT_LIST'][i]+")";
    }




    let submitted_unscored=0;
    let resubmitted=0;
    for(const e of hfd_list){
        let score = e.nextElementSibling.innerText;
        const submitted =
            (e.nextElementSibling.nextElementSibling.innerText.indexOf('未提出')===-1)?
            true:false;

        if (score.indexOf('-')>=0 && submitted)
            submitted_unscored+=1;
        if (score.indexOf('点')>=0 && parseInt(score.replace("点",""))<SETTING['PASSING_MARK'] && submitted)
            resubmitted+=1;
    }

    const count = ( hfd_table.innerText.match( /未提出/g ) || [] ).length ;
    const progress = Math.round((1-(count/hfd_list.length))*100);
    vfd.querySelector("#progress").innerHTML= progress;
    vfd.querySelector("#unscored").innerHTML= submitted_unscored;
    vfd.querySelector("#resubmit").innerHTML= resubmitted;
    document.title = "提出率:"+progress+"% 未採点:"+submitted_unscored+" 再提出:" +resubmitted;

    console.log("未提出:"+count+" "+"全員:"+hfd_list.length);




    if (replaceAllFlag){
        vfd_table.replaceWith(hfd_table);
        replaceAllFlag=false;
    }
    else {
        const id_tr_dict={};
        for(const e of hfd_list)
            id_tr_dict[e.innerText] = e.parentNode;

        for(const e of vfd_list){
            if (e.innerText in id_tr_dict){
                e.parentNode.replaceWith(id_tr_dict[e.innerText]);
            }
        }
    }




    setTimeout(function(){
        hfd.location.reload(true);
    },500);
    // hfd.location.reload(true);
}

function createUI(){
    console.log("createUI()");

    const customized_div = document.createElement('div');
    customized_div.innerHTML     = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                                    "CUSTOMIZED"+
                                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    customized_div.style.cssText = `position:fixed;
                                    top:10px;left:-15px;
                                    z-index:1;
                                    transform: rotate(-25deg);
                                    background-color: #32CD32;
                                    color:white`;
                                    document.body.appendChild(customized_div);

    const div3 = document.createElement('div');
    div3.style.cssText = `position:fixed;z-index:1;
                          top:60px;left:5px;`;   
                          document.body.appendChild(div3);
    div3.innerHTML  =`<div>
                        <label for="number">学籍番号の範囲</label>
                        <input type="text" id="first_num" for="number" size="5" />〜
                        <input type="text" id="last_num" for="number" size="5" />
                    </div>
                    <div>
                    <label for="number2">合格点</label>
                    <input type="text" id="passing_mark" for="number2" size="5" />
                    </div>                    
                    <fieldset>
                        <legend>座席番号</legend>
                        <div>
                            <input type="checkbox" id="seat_show" name="seat_show"/>
                            <label for="seat_show">表示</label>
                        </div>
                        <div>
                            <label for="seat_list">配列: </label>
                            <textarea id="seat_list" name="seat_list" type="text" row="1" cols="20" style="background-color: white;"/></textarea>
                        <div>
                    </fieldset>
                    <div style="font-size:8vw;opacity:80%;color:#32CD32;">
                        <span id="progress"></span><span style="font-size:2vw">%提出</span>
                    </div>                                        
                    <div style="font-size:8vw;;opacity:80%;color:#32CD32;">
                        <span id="unscored"></span><span style="font-size:2vw">未採点</span>
                    </div>
                    <div style="font-size:8vw;;opacity:80%;color:#32CD32;">
                        <span id="resubmit"></span><span style="font-size:2vw">再提出</span>
                    </div>
                    `;

                    document.querySelector("#first_num").value=SETTING['FIRST_NUM'];
                    document.querySelector("#last_num").value=SETTING['LAST_NUM'];
                    document.querySelector("#seat_list").value=SETTING['SEAT_LIST'];
                    document.querySelector("#seat_show").checked=SETTING['SEAT_SHOW'];
                    document.querySelector("#passing_mark").value=SETTING['PASSING_MARK'];
                    document.querySelector("#progress").innerHTML="";

    const inputs = document.querySelectorAll("#first_num, #last_num, #seat_show, #seat_list, #passing_mark");
    for(const item of inputs){
        item.addEventListener("input", input_handler);
    }
}

function input_handler(e){
    console.log("input_handler()");

    SETTING['FIRST_NUM']=document.querySelector("#first_num").value;
    SETTING['LAST_NUM']=document.querySelector("#last_num").value;
    SETTING['SEAT_LIST']=document.querySelector("#seat_list").value.split(",");
    SETTING['SEAT_SHOW']=document.querySelector("#seat_show").checked;
    SETTING['PASSING_MARK']=document.querySelector("#passing_mark").value;

    localStorage.setItem(course_str+"_SETTING",JSON.stringify(SETTING));

    replaceAllFlag=true;
}
