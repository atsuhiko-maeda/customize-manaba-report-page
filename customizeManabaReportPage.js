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

    document.write(
        '<iframe class="inner" src="'+location.href+'"></iframe>'+
        '<iframe class="inner hidden" src="'+location.href+'"></iframe>'
    );
    document.close();

    const style = document.createElement("style");
    style.innerHTML = `
        iframe.inner {
            width:100%;
            height:100%;
            position:absolute;
            top:0;
            left:0;
            border: 4px #32CD32 solid; 

            visibility: visible;
        }
        .inner.hidden {
            visibility: hidden;
        }`;
    document.head.appendChild(style);

    document.querySelector("iframe.inner:not(.hidden)").addEventListener(
        'load',function(){createUI();
    });

    document.querySelector("iframe.inner.hidden").addEventListener(
        'load',function(){customizePage();
    });
}

function customizePage(){
    console.log("hidden frame was loaded.");
    console.log("customizePage()");
    const hfd = document.querySelector("iframe.inner.hidden").contentDocument;
    const list = hfd.getElementsByClassName("listcollection_td_left");
   
    const ID_DIGIT =  list[0].innerText.length;

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

    const id_tr_dict={};
    for (let i=list.length-1 ; i>=0 ; i--){
        const inner = list[i].innerText;
        const id = parseInt(inner, 10);
        const idS = id % digitCountS;
        const idE = id % digitCountE;
        // console.log(startNum,idS,idE,endNum);
        if ((startNum === null || startNum <= idS) && (endNum === null || idE <= endNum)){
            id_tr_dict[inner]=list[i];
        }
        else {
            list[i].parentNode.remove();
        }
    }

    if (SETTING['SEAT_SHOW']){
        for (let i=0 ; i<list.length && i<SEAT_LIST.length ; i++){
               list[i].innerText=list[i].innerText+" ("+SETTING['SEAT_LIST'][i]+")";
        }  
    }

    let submitted_unscored=0;
    let resubmitted=0;
    for (let i=0 ; i<list.length ; i++){
        let score = list[i].nextElementSibling.innerText;
        const submitted =
            (list[i].nextElementSibling.nextElementSibling.innerText.indexOf('未提出')===-1)?
            true:false;

        if (score.indexOf('-')>=0 && submitted)
            submitted_unscored+=1;
        if (score.indexOf('点')>=0 && parseInt(score.replace("点",""))<SETTING['PASSING_MARK'] && submitted)
            resubmitted+=1;
    }

    // console.log('submitted_unscored=',submitted_unscored);
    // console.log('resubmitted=',resubmitted);

    const hidden_table = hfd.querySelector(".stdlist.sorttable");
    const body_text = hidden_table.innerText;
    const count = ( body_text.match( /未提出/g ) || [] ).length ;
    console.log("未提出:"+count+" "+"全員:"+list.length);
    const progress = Math.round((1-(count/list.length))*100);

    const vfd = document.querySelector("iframe.inner:not(.hidden)").contentDocument;
    if (replaceAllFlag){
        const visible_table = vfd.querySelector(".stdlist.sorttable");
        visible_table.replaceWith(hidden_table);
        replaceAllFlag=false;
    }
    else {
        const vfd_list = vfd.getElementsByClassName("listcollection_td_left");
        for (let i=0 ; i<vfd_list.length ; i++){
            if (vfd_list[i].innerText in id_tr_dict)
            vfd_list[i].replaceWith(id_tr_dict[vfd_list[i].innerText]);
        }    
    }

    vfd.querySelectorAll("a").forEach(e=>e.setAttribute("target","_top"));

    const progress_elem = vfd.querySelector("#progress");
    if (progress_elem){
        progress_elem.innerHTML= progress;
    }
    const unscored_elem = vfd.querySelector("#unscored");
    if (unscored_elem){
        unscored_elem.innerHTML= submitted_unscored;
    }
    const resubmit_elem = vfd.querySelector("#resubmit");
    if (resubmit_elem){
        resubmit_elem.innerHTML= resubmitted;
    }

    if (progress_elem && unscored_elem && resubmit_elem){
        document.title = "提出率:"+progress+"% 未採点:"+submitted_unscored+" 再提出:" +resubmitted;
    }

    setTimeout(function(){
        hfd.location.reload(true);
    },500);
    // hfd.location.reload(true);
}

function createUI(){
    console.log("createUI()");
    const vfd = document.querySelector("iframe.inner:not(.hidden)").contentDocument;

    const customized_div = document.createElement('div');
    customized_div.innerHTML     = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                                    "CUSTOMIZED"+
                                    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    customized_div.style.cssText = `position:fixed;
                                    top:10;left:-15;
                                    transform: rotate(-25deg);
                                    background-color: #32CD32;
                                    color:white`;
    vfd.body.appendChild(customized_div);

    const div3 = document.createElement('div');
    div3.style.cssText = `position:fixed;
                          top:60;left:0;`;   
    vfd.body.appendChild(div3);
    div3.innerHTML  =`<div>
                        <label for="number">学籍番号の範囲(例:*12) </label>
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
                    <div style="font-size:10vw;opacity:80%;color:#32CD32;">
                        <span id="progress"></span><span style="font-size:2vw">%提出</span>
                    </div>                                        
                    <div style="font-size:10vw;;opacity:80%;color:#32CD32;">
                        <span id="unscored"></span><span style="font-size:2vw">未採点</span>
                    </div>
                    <div style="font-size:10vw;;opacity:80%;color:#32CD32;">
                        <span id="resubmit"></span><span style="font-size:2vw">再提出</span>
                    </div>

                    `;

    vfd.querySelector("#first_num").value=SETTING['FIRST_NUM'];
    vfd.querySelector("#last_num").value=SETTING['LAST_NUM'];
    vfd.querySelector("#seat_list").value=SETTING['SEAT_LIST'];
    vfd.querySelector("#seat_show").checked=SETTING['SEAT_SHOW'];
    vfd.querySelector("#passing_mark").value=SETTING['PASSING_MARK'];
    vfd.querySelector("#progress").innerHTML="";

    const inputs = vfd.querySelectorAll("#first_num, #last_num, #seat_show, #seat_list, #passing_mark");
    for(const item of inputs){
        item.addEventListener("input", input_handler);
    }
}

function input_handler(e){
    console.log("input_handler()");

    const vfd = document.querySelector("iframe.inner:not(.hidden)").contentDocument;    

    SETTING['FIRST_NUM']=vfd.querySelector("#first_num").value;
    SETTING['LAST_NUM']=vfd.querySelector("#last_num").value;
    SETTING['SEAT_LIST']=vfd.querySelector("#seat_list").value.split(",");
    SETTING['SEAT_SHOW']=vfd.querySelector("#seat_show").checked;
    SETTING['PASSING_MARK']=vfd.querySelector("#passing_mark").value;

    localStorage.setItem(course_str+"_SETTING",JSON.stringify(SETTING));

    replaceAllFlag=true;
}
