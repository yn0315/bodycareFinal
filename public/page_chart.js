var socket = io();

socket.emit('page_chart', '차트 페이지 진입');
socket.emit('chart_person_info_req', '체중 키 정보');

var person_info;
var bmi_info;
socket.on('chart_person_info_res', function(data)
{

    // let send_data = {
    //     'name': results[0].name,
    //     'age' : results[0].age,
    //     'con' : results[0].tel,
    //     'hei' : results[0].height,
    //     'wei' : results[0].weight,
    //     'gen' : results[0].gen
    // }
    console.log(data);
    person_info = data;
    let age = Number(data.age);
    let age_text = ages_return(age);

    socket.emit('chart_bmi_req', age_text);
});
socket.on('chart_bmi_res', function(data)
{
    console.log('받은 bmi데이터');
    console.log(data);
    bmi_info = data;

    // 그래프 그리기 및 resize 이벤트시 그래프 갱신
    // 첫화면 왼쪽 가로막대그래프
    //                  나(키 , 체중) 모집단(키 체중)

    let ph = Number(person_info.hei.replace('cm', ''));
    let pw = Number(person_info.wei.replace('kg', ''));

    // let pbmi = Number(person_info.)

    let person_bmi =(((pw) / (ph / 100)**2).toFixed(1));
    
    let bmi_arr = gen_result(bmi_info);
    let bh = bmi_arr[0];
    let bw = bmi_arr[1];
    let b_bmi = bmi_arr[2];

    let age_text = ages_return(person_info.age);

    compare_drawBarchart(ph, pw, bh, bw, age_text);

    // 50 기준 증감상태
    let wei_ratio = ((((pw-bw)/bw)*100)+50).toFixed(1);
    let hei_ratio = ((((ph-bh)/bh)*100)+50).toFixed(1);

    let bmi_ratio = ((((person_bmi-b_bmi)/b_bmi)*100)+50).toFixed(1);


    // 해당 값에 따라 '큰 편' '작은 편' 등의 텍스트 같이 갱신
    // 첫화면 중간 상위% 표시 및 오른쪽 정규분포그래프
    compare_drawDistchart(wei_ratio, hei_ratio, person_bmi, bmi_ratio);

    socket.emit('chart_log_data_req', '최근기록 5개 요청');
})

socket.on('chart_log_data_res', function(data)
{
    console.log('log_data 응답');


    // 2번째 화면 체중기록, BMI기록 그래프
    let wei_log = data;
    let ph = Number(person_info.hei.replace('cm', ''));
    let bmi_log = [];


    for(let i = 0 ; i < wei_log.length ; i++)
    {
        
        
        let bmi_ = Number(get_bmi(wei_log[i].value, ph).toFixed(2));
        let bmi_data = { 'date':wei_log[i].date, 'value':bmi_ };
        bmi_log.push(bmi_data);
    
    }
    



    console.log('wei_log');
    console.log(wei_log);
    console.log('bmi_log');
    console.log(bmi_log);
    variety_drawColumnchart(wei_log, bmi_log);
    


    socket.emit('chart_balance_req', '차트 5개 밸런스 요소 요청');


    // variety_drawColumnchart(wei_log, bmi_log);
});


socket.on('chart_balance_res', function(data)
{
    // let bal_record_test = {
    //     sholuder: 21.4,
    //     wrist: 79.6,
    //     hip: 46.1,
    //     leg: 57.6,
    //     neck: 49.56
    // };
    if(data == 'error')
    {
        socket.emit('chart_balance_req', '차트 밸런스 요소 재요청');
        return;
    }

    let bal_data = data;

    let arm_d = Number(bal_data.left_arm) - Number(bal_data.right_arm);
    arm_d = Math.abs(Number(arm_d.toFixed(2)));
    let leg_d = Number(bal_data.left_leg) - Number(bal_data.right_leg);
    leg_d = Math.abs(Number(leg_d.toFixed(2)));

    let sholder = Number(Number(bal_data.sholder).toFixed(2));
    let hip = Number(Number(bal_data.hip).toFixed(2));
    let neck = Number(Number(bal_data.neck_len).toFixed(2));

    let bs = angle_return(sholder);
    let bh = angle_return(hip);
    let bal_log = 
    {
        'sholuder':bs,
        'wrist':arm_d,
        'hip':bh,
        'leg':leg_d,
        'neck':neck
    }

    console.log("bal_log");
    console.log(bal_log);
    variety_drawLinechart(bal_log);

    // let halfchart_data ={
    //     leftShoulder: 99,
    //     rightShoulder: 98,
    //     leftHand: 99,
    //     rightHand: 88,
    //     leftPelvis: 99,
    //     rightPelvis: 98,
    //     leftAnkle: 97,
    //     rightAnkle: 99,
    //     neckData: 22
    // }
    let sh = get_num(bal_data.sholder);
    let hi = get_num(bal_data.hip);
    let ra = get_num(bal_data.right_arm);
    let la = get_num(bal_data.left_arm);
    let rl = get_num(bal_data.right_leg);
    let ll = get_num(bal_data.left_leg);
    let ne = get_num(bal_data.neck_len);
    let s = angle_return(sh);
    let h = angle_return(hi);

    let halfchart = 
    {
        'leftShoulder':s,
        'rightShoulder':s,

        'leftHand':la,
        'rightHand':ra,

        'leftPelvis':h,
        'rightPelvis':h,

        'leftAnkle':ll,
        'rightAnkle':rl,

        'neckData':ne

    }

    //반원 차트 생성
    create_halfchart(halfchart);

    // 화면 슬라이드 연동 및 우측 스크롤바 대체 상태바 생성
    create_scrollpoint();


    socket.emit('chart_cloud_req', '차트 구름정보 요청');


})
socket.on('chart_cloud_res',function(data)
{
    cloud_data = data;
    console.log('cloud data 받음');
});
function angle_return(angle)
{
    let result = 0;
    if(angle > 90)
    {
        result = 180 - angle;
    }
    else if(angle < -90)
    {
        result = 180 + angle;
    }
    else
    {
        result = angle;
    }


    return result;
}
function get_bmi(w,h)
{
    let bmi = w/((h/100)**2);
    // bmi = bmi.toFixed(2);
    return bmi;
}

function get_num(num_data)
{
    let num = Number(Number(num_data).toFixed(2));
    return num;
}

// let wei_record_test = [
//     {date: '2023 1 27 13:58:05', value: 120},
//     {date: 'Sat Mar 11 2023 11:28:07 GMT+0900 (한국 표준시)', value: 70},
//     {date: 'Fri Feb 24 2023 10:59:51 GMT+0900 (한국 표준시)', value: 67},
//     {date: 'Tue Mar 21 2022 15:14:48 GMT+0900 (한국 표준시)', value: 68}
// ]

// let bmi_record_test = [
//     {date: 'Fri Feb 24 2023 12:24:39 GMT+0900 (한국 표준시)', value: 19.2},
//     {date: 'Sat Mar 11 2023 11:28:07 GMT+0900 (한국 표준시)', value: 21.4},
//     {date: 'Fri Mar 17 2023 10:59:51 GMT+0900 (한국 표준시)', value: 20.0},
//     // {date: 'Tue Mar 21 2022 15:14:48 GMT+0900 (한국 표준시)', value: 21.9}
// let cloud_data = [
//     {name: '데이터1', value1: '35.1', value2: '58.7', value3: '259', value4: '198.2', value5: '프로그래밍언어'},
//     {name: '데이터2', value1: '237.1', value2: 'AAAKDKGF', value3: '29.23', value4: '982.852', value5: '자바스크립트'},
//     {name: '데이터3', value1: '348.2847', value2: '19.9882', value3: 'DKGLJS', value4: '18.2', value5: 'C# Winform'},
//     {name: '데이터4', value1: 'ASJDP', value2: 'Rand', value3: 'Pycharm', value4: 'GUI', value5: 'Python TKinter'},
//     {name: '데이터5', value1: '23.51', value2: '.NET Framework', value3: '29.23', value4: 'ㅁㄴㅇㄹ', value5: 'C++'},
//     {name: '데이터6', value1: '41.847', value2: '59.982', value3: 'DKGS', value4: '18.2', value5: '아두이노'},
//     {name: '데이터7', value1: '87.4', value2: 'AA1243KF', value3: '89.23', value4: '9.82', value5: '자바스크립트'},
//     {name: '데이터8', value1: 'sagf2ga', value2: '125.52', value3: 'D198a020', value4: '18.292', value5: 'HTML'},
//     {name: '데이터9', value1: '31.27', value2: 'MySQL', value3: 'D23gJS', value4: '2409g9', value5: 'windows'},
//     {name: '데이터10', value1: 'asdg24y6', value2: 'DATABASE', value3: '1309485S', value4: '18.292', value5: 'Linux'},
// ]

function gen_result(bmi_info)
{
    let gen = person_info.gen;

    if(gen.includes('남'))
    {
        let bh = Number(bmi_info.male_hei);
        let bw = Number(bmi_info.male_wei);
        let b_bmi = Number(bmi_info.male_bmi);
        return [bh, bw, b_bmi];
    }
    else
    {
        let bh = Number(bmi_info.female_hei);
        let bw = Number(bmi_info.female_wei);
        let b_bmi = Number(bmi_info.female_bmi);
        return [bh, bw, b_bmi];
    }
}

function ages_return(ages)
{
    let age_s = ''
    let one = ages%10
    let ten = ages-one

    if(ten < 20)
    {
        age_s = '19세';
    }
    else if(ten > 80)
    {
        age_s = '80대'
    }
    else
    {
        age_s = ten.toString();
        age_s += "대"
    }
    
    console.log('범주 : '+ age_s);
    return age_s
}

window.addEventListener('load', function ()
{
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
    let sum_height = 0;
    let bottom_margin = 0;
    let icons = document.querySelectorAll("#icon_bar .icon");
    icons.forEach((n) =>
    {
        sum_height += parseInt(window.getComputedStyle(n).height.replace('px', ''));
        sum_height += parseInt(window.getComputedStyle(n).marginTop.replace('px', ''));
        bottom_margin = parseInt(window.getComputedStyle(n).marginTop.replace('px', ''));
    });
    geticonbar.style.height = `${sum_height + bottom_margin}px`;
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바

    // 배경 웨이브 시작
    new create_wave();
    

});


// 맨 위로 버튼
// const btnTop = document.getElementById("btn_top");

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
const left_btn = document.getElementById("left_mark");
const right_btn = document.getElementById("right_mark");
const geticonbar = document.getElementById("icon_bar");

const getnav = document.querySelector('nav');
const getbody = document.querySelector('body');
const $clock_space = document.getElementById('clock_space'); 

let doing_anima = false;
let menu_status = 'close';
let max = 80;
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바

window.addEventListener('beforeunload', function ()
{
    let recv_firstframe = localStorage.getItem('넘어갈화면');
    console.log(`언로드 : ${recv_firstframe}`);
    this.localStorage.clear();
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
function clock_start()
{
    const $ampm = document.getElementById('ampm');
    const $clock = document.getElementById('clock');
    //const $day = document.getElementById('day');

    var time = new Date();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var ap = '오전';
    //var day = time.getDay();
    //var week = ['일', '월', '화', '수', '목', '금', '토'];
    if (hours > 12)
    {
      ap = '오후';
      hours %= 12;
    }
    $clock.innerText = `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}`;
    $ampm.innerText = `${ap}`;
    //$day.innerText = ` ${week[day]}`;
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 맨 위로 버튼
// window.addEventListener("scroll", hide_top_btn);
// function hide_top_btn ()
// {
//     const currentScrollPosition = window.pageYOffset;
//     if (currentScrollPosition > 50)
//     {
//         btnTop.style.display = "block";
//     }
//     else
//     {
//         btnTop.style.display = "none";
//     }
// }

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
function text_slide (element, maxwidth_value)
{
    const slide_speed = 15;

    const convert_value = parseInt(maxwidth_value.replace('px', ''));
    const get_current_maxwidth = parseInt(window.getComputedStyle(element).maxWidth.replace('px', ''));
    element.style.transform = 'translateX(-50%)';

    if (convert_value != 0)
    {
        for (let i = 0; i < convert_value; i++)
        {
            setTimeout(() =>
            {
                element.style.maxWidth = `${i}px`;
            }, slide_speed);
        }
    }
    else if (convert_value == 0)
    {
        for (let i = get_current_maxwidth; i > 0; i--)
        {
            setTimeout(() =>
            {
                element.style.maxWidth = `${i}px`;
            }, slide_speed);
        }
    }
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
left_btn.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
right_btn.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
left_btn.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});
right_btn.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});

let down_up = false;
var icons = document.querySelectorAll("#icon_bar .icon");
icons.forEach((n) =>
{
    n.addEventListener("mouseover", function (event){
        if (doing_anima == false)
        {
            //console.log('mouseover 이벤트 실행됨');
            n.className = 'icon_mouseover';
            document.body.style.cursor = "pointer";
            if (menu_status == 'open')
            {
                const icon_text = n.querySelectorAll('.icon_text_mousedown');
                if (icon_text.length > 0)
                {
                    for (let i = 0 ; i < icon_text.length ; i++)
                    {
                        icon_text.item(i).className = 'icon_text';
                    }
                    down_up = false;
                }
            }
            else if (menu_status == 'close')
            {
                const icon_img = n.querySelectorAll('.icon_img_mousedown');
                if (icon_img.length > 0)
                {
                    for (let i = 0 ; i < icon_img.length ; i++)
                    {
                        icon_img.item(i).className = 'icon_img';
                    }
                    down_up = false;
                }
            }
        }
    });
    n.addEventListener("mouseout", function (){
        if (doing_anima == false)
        {
            //console.log('mouseout 이벤트 실행됨');
            n.className = 'icon';
            document.body.style.cursor = "auto";

            if (menu_status == 'open')
            {
                const icon_text = n.querySelectorAll('.icon_text_mousedown');
                if (icon_text.length > 0)
                {
                    for (let i = 0 ; i < icon_text.length ; i++)
                    {
                        icon_text.item(i).className = 'icon_text';
                    }
                    down_up = false;
                }
            }
            else if (menu_status == 'close')
            {
                const icon_img = n.querySelectorAll('.icon_img_mousedown');
                if (icon_img.length > 0)
                {
                    for (let i = 0 ; i < icon_img.length ; i++)
                    {
                        icon_img.item(i).className = 'icon_img';
                    }
                    down_up = false;
                }
            }
        }
    });
    n.addEventListener("mousedown", function (event){
        if (doing_anima == false)
        {
            //console.log('mousedown 이벤트 실행됨');
            if (menu_status == 'open')
            {
                const icon_text = n.querySelectorAll('.icon_text');
                if (icon_text.length > 0)
                {
                    for (let i = 0 ; i < icon_text.length ; i++)
                    {
                        icon_text.item(i).className = 'icon_text_mousedown';
                    }
                    down_up = true;
                }
            }
            else if (menu_status == 'close')
            {
                const icon_img = n.querySelectorAll('.icon_img');
                if (icon_img.length > 0)
                {
                    for (let i = 0 ; i < icon_img.length ; i++)
                    {
                        icon_img.item(i).className = 'icon_img_mousedown';
                    }
                    down_up = true;
                }
            }
        }
    });
    n.addEventListener("mouseup", function (){
        if (doing_anima == false)
        {
            //console.log('mouseup 이벤트 실행됨');
            //n.className = 'icon';
            if (menu_status == 'open')
            {
                const icon_text = n.querySelectorAll('.icon_text_mousedown');
                if (icon_text.length > 0)
                {
                    for (let i = 0 ; i < icon_text.length ; i++)
                    {
                        icon_text.item(i).className = 'icon_text';
                    }
                    if (down_up == true)
                    {
                        //alert('페이지 넘어가기');
                        down_up = false;
                        iconbar_page_change(icon_text);
                    }
                }
            }
            else if (menu_status == 'close')
            {
                const icon_img = n.querySelectorAll('.icon_img_mousedown');
                if (icon_img.length > 0)
                {
                    for (let i = 0 ; i < icon_img.length ; i++)
                    {
                        icon_img.item(i).className = 'icon_img';
                    }
                    if (down_up == true)
                    {
                        //alert('페이지 넘어가기');
                        down_up = false;
                        iconbar_page_change(icon_img);
                    }
                }
            }
        }
    });
    
});



function iconbar_page_change(icon_text)
{
    console.log(icon_text.item(0).parentElement.id);
    // icon_text.item(0)
    if(icon_text.item(0).parentElement.id == 'icon1')
    {
        //192.168.0.47
        console.log("차트 보기로");
        socket.emit("left_bar_click", "chart");
        location.href = "http://192.168.0.47:3300/page_search";
    }
    else if(icon_text.item(0).parentElement.id == "icon2")
    {
        console.log("촬영 하기로");
        socket.emit("left_bar_click", "cam");
        location.href = "http://192.168.0.47:3300/page_search";
    }
    else if(icon_text.item(0).parentElement.id == "icon3")
    {
        console.log("기록 보기로");
        socket.emit("left_bar_click", "log");
        location.href = "http://192.168.0.47:3300/page_search";
    }
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
right_btn.addEventListener("click", function ()
{
    const navwidth = getnav.offsetWidth;
    const bodypadding = parseInt(window.getComputedStyle(getbody).paddingLeft.replace('px', ''));
    const rightvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const leftvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const iconbarwidth = parseInt(window.getComputedStyle(geticonbar).width.replace('px', ''));

    var icons = document.querySelectorAll("#icon_bar .icon");

    if (doing_anima == false)
    {
        doing_anima = true;
        let diff_speed = 0;

        for (let i = 0 ; i < max ; i++)
        {
            setTimeout(() => {


                getnav.style.width = `${navwidth + i}px`;
                document.body.style.paddingLeft = `${bodypadding + i}px`;
                if (i >= 60)
                {
                    diff_speed++;
                    right_btn.style.left = `${leftvalue + i + diff_speed}px`;
                    left_btn.style.left = `${rightvalue + i + diff_speed}px`;
                    geticonbar.style.width = `${iconbarwidth + i + diff_speed}px`;
                    icons.forEach((n) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) + 2}px`;
                    });
                }
                else
                {
                    right_btn.style.left = `${leftvalue + i}px`;
                    left_btn.style.left = `${rightvalue + i}px`;
                    geticonbar.style.width = `${iconbarwidth + i}px`;
                    icons.forEach((n) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) + 1}px`;
                    });
                }
                if (i >= max - 1)
                {
                    right_btn.className = "right_hide";
                    left_btn.className = "left_see";
                    
                    $clock_space.style.top = '10px';
                    $clock_space.style.left = '50%';
                    // $clock_space.className = 'displayClock';

                    text_slide($clock_space, '100px');

                    clock_start();
                    setInterval(clock_start, 1000);

                    var iconstext = document.querySelectorAll("#icon_bar .icon_text");
                    iconstext.forEach((n) =>
                    {
                        text_slide(n, '100px');
                    });
                    menu_status = 'open';
                    doing_anima = false;
                }
            }, Math.sqrt(i*3500));
        }
    }
});

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
left_btn.addEventListener("click", function ()
{
    const navwidth = getnav.offsetWidth;
    const bodypadding = parseInt(window.getComputedStyle(getbody).paddingLeft.replace('px', ''));
    const rightvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const leftvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const iconbarwidth = parseInt(window.getComputedStyle(geticonbar).width.replace('px', ''));

    var icons = document.querySelectorAll("#icon_bar .icon");

    if (doing_anima == false)
    {
        doing_anima = true;
        let diff_speed = 0;

        //$clock_space.className = 'invisible';

        text_slide($clock_space, '0px');
        
        clearInterval(clock_start);

        var iconstext = document.querySelectorAll("#icon_bar .icon_text");
        iconstext.forEach((n) =>
        {
            text_slide(n, '0px');
        });

        for (let i = 0 ; i < max ; i++)
        {
            setTimeout(() => {

                getnav.style.width = `${navwidth - i}px`;
                document.body.style.paddingLeft = `${bodypadding - i}px`;
                if (i >= 60)
                {
                    diff_speed++;
                    right_btn.style.left = `${leftvalue - i - diff_speed}px`;
                    left_btn.style.left = `${rightvalue - i - diff_speed}px`;
                    geticonbar.style.width = `${iconbarwidth - i - diff_speed}px`;
                    icons.forEach((n) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) - 2}px`;
                    });
                }
                else
                {
                    right_btn.style.left = `${leftvalue - i}px`;
                    left_btn.style.left = `${rightvalue - i}px`;
                    geticonbar.style.width = `${iconbarwidth - i}px`;
                    icons.forEach((n) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) - 1}px`;
                    });
                }
                if (i >= max - 1)
                {
                    right_btn.className = "right_see";
                    left_btn.className = "left_hide";
                    menu_status = 'close';
                    doing_anima = false;
                }
            }, 200 + Math.sqrt(i*3500));
        }
    }
});

// // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 맨 위로 버튼
// btnTop.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
// btnTop.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});

// btnTop.addEventListener("click", function ()
// {
//     //const windowHeight = window.innerHeight;
//     const scrollStep = 2;
//     const currentPosition = window.pageYOffset;
//     //window.scroll(0, 0);
    
//     /*
//     // smooth 속성을 이용해서 부드럽게 스크롤되게 하기
//     window.scrollTo(
//     {
//         top : 0,
//         behavior : "smooth"
//     }
//     );
//     */

//     // setTimeout() : 일정시간 이후 지정된 함수를 실행.
//     // 코드상 대기시간을 조절하여 함수가 거의 동시에 실행될 수 있다.
    
//     // html은 setTimeout 호출이 5번 이상 중첩되면 최소 반응시간을 4ms로 제한한다

//     if (currentPosition > 0)
//     {
//         for (let i = currentPosition; i > 0; i -= scrollStep)
//         {
//             setTimeout(() => {
//                 window.scrollTo(0, i);

//               }, (0.12) * (currentPosition - i));
//             // for문으로 setTimeout을 이용해 각 시간마다 스크롤 위치가 변경되도록 함수를 격발 대기시킨다
//         }
//     }
// });

// 임의 범위 내의 정수 1개 반환
function randNUM(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 임의 범위 내의 실수 1개 반환
function randFloat(min, max)
{
    return Math.random() * (max - min) + min;
}

// 각 요소가 겹치는지 확인하는 함수
function isOverlap(child, siblings, accept)
{
    for (let i = 0; i < siblings.length; i++)
    {
        let sibling = siblings[i];
        if (child !== sibling)
        {
            let rect1 = child.getBoundingClientRect();
            let rect2 = sibling.getBoundingClientRect();
            // console.log(rect1.right, rect1.top, '//', rect1.width, rect1.height);
            if (rect1.right > rect2.left && rect1.left < rect2.right
                && rect1.bottom > rect2.top && rect1.top < rect2.bottom) {
                return true;
            }
        }
    }
    return false;
}




// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 배경 웨이브 start

class create_wave
{
    constructor()
    {
        this.canvas = document.getElementById('wave_canvas');
        this.ctx = this.canvas.getContext('2d');

        //document.body.appendChild(this.canvas);


        this.waveGroup = new WaveGroup();


        // 브라우저 창 크기 변경시 애니메이션 초기화되는 함수. 지금은 필요없음
        //window.addEventListener('resize', this.resize.bind(this), false);
        this.resize();

        // 애니메이션 스타트
        this.animation = requestAnimationFrame(this.animate.bind(this));
    }

    resize()
    {
        this.stageWidth = document.body.clientWidth;
        this.stageHeight = this.canvas.clientHeight;

        // 사이즈 스케일링 (고해상도에서도 보이게 조정)
        this.canvas.width = this.stageWidth * 1 ;
        this.canvas.Height = this.stageHeight * 1 ;
        this.ctx.scale(1, 0.38);

        this.waveGroup.resize(this.stageWidth, this.stageHeight);
    }

    animate(t)
    {
        this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

        this.waveGroup.draw(this.ctx);

        requestAnimationFrame(this.animate.bind(this));
    }

    cancel_animate()
    {
        cancelAnimationFrame(this.animation);
    }
}

class Point
{
    constructor(index, x, y)
    {
        this.x = x;
        this.y = y;
        this.fixedY = y;

        // 웨이브 속도 : 낮을수록 느림
        this.speed = 0.01;

        this.cur = index;

        // 웨이브 진폭, 높이
        this.max = Math.random()*200 + 250;
    }

    update()
    {
        this.cur += this.speed;
        this.y = this.fixedY + (Math.sin(this.cur) * this.max);
    }
}

class Wave
{
    constructor(index, totalPoints, color)
    {
        this.index = index;
        this.totalPoints = totalPoints;
        this.color = color;
        this.points = [];
    }

    resize(stageWidth, stageHeight)
    {
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;

        this.centerX = stageWidth / 2;
        this.centerY = stageHeight;

        this.pointGap = this.stageWidth / (this.totalPoints - 1);

        this.init();
    }

    init()
    {
        this.points = [];

        for (let i = 0; i < this.totalPoints; i++)
        {
            const point = new Point
            (
                this.index + i,
                this.pointGap * i,
                this.centerY,
            );
            this.points[i] = point;
        }
    }

    draw(ctx)
    {
        ctx.beginPath();
        ctx.fillStyle = this.color;

        let prevX = this.points[0].x;
        let prevY = this.points[0].y;

        ctx.moveTo(prevX, prevY);

        for (let i = 1; i < this.totalPoints; i++)
        {
            if (i < this.totalPoints - 1)
            {
                this.points[i].update();
            }

            const cx = (prevX + this.points[i].x) / 2;
            const cy = (prevY + this.points[i].y) / 2;

            ctx.quadraticCurveTo(prevX, prevY, cx, cy);

            prevX = this.points[i].x;
            prevY = this.points[i].y;
        }

        ctx.lineTo(prevX, prevY);
        ctx.lineTo(this.stageWidth, this.stageHeight);
        ctx.lineTo(this.points[0].x, this.stageHeight)

        ctx.fill();
        ctx.closePath();
    }
}

class WaveGroup
{
    constructor()
    {
        // 웨이브 수
        this.totalWaves = 3;

        // 웨이브 중간 점 개수
        this.totalPoints = 6;

        // 색깔 팔레트
        this.color = ['rgba(123, 102, 200, 0.08)', 'rgba(240, 73, 73, 0.07)', 'rgba(201, 168, 223, 0.15)'];

        this.waves = [];

        for (let i = 0; i< this.totalWaves; i++)
        {
            const wave = new Wave
            (
                i,
                this.totalPoints,
                this.color[i],
            );
            this.waves[i] = wave;
        }
    }

    resize(stageWidth, stageHeight)
    {
        for (let i = 0; i < this.totalWaves; i++)
        {
            const wave = this.waves[i];
            wave.resize(stageWidth, stageHeight);
        }
    }

    draw(ctx)
    {
        for (let i = 0; i < this.totalWaves; i++)
        {
            const wave = this.waves[i];
            wave.draw(ctx);
        }
    }
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 배경 웨이브 end

const shifter_frame = document.getElementById('space_shifter_frame');
const shifter_first = document.getElementById('space_shifter_first');
const shifter_second = document.getElementById('space_shifter_second');

const space_list = document.querySelectorAll('#space .space_separate');
let current_view_space = 0;

window.addEventListener('wheel', function(e){
    e.preventDefault();
    // console.log(e.deltaY);
    // 아래로 휠
    if (e.deltaY > 0)
    {
        if (current_view_space != space_list.length - 1)
        {
            space_shift(current_view_space + 1);
        }
    }
    // 위로 휠
    else if (e.deltaY < 0)
    {
        if (current_view_space != 0)
        {
            space_shift(current_view_space - 1);
        }
    }
},{passive: false});


var backgroundImages = document.querySelectorAll(".space_shifter");
let shift_status = false;
let first_shift = false;
let second_shift = false;

function space_shift(destination_num)
{
    if (shift_status == true) {return;}
    // console.log(destination_num);
    // document.body.style.paddingLeft = '0';
    shift_status = true;
    // let rect = space_list[current_view_space].getBoundingClientRect();
    // let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    // let startpoint = rect.top + scrollTop;
    // console.log(startpoint);
    if (current_view_space == 2)
    {
        delete_cloud();
    }

    let reverse = 1;
    if (current_view_space > destination_num)
    {
        reverse = -1;
    }
    else if (current_view_space < destination_num)
    {
        reverse = 1;
    }
    else if (current_view_space == destination_num)
    {
        shift_status = false;
        return;
    }
    current_view_space = destination_num;

    if (current_view_space == 2)
    {
        create_cloud_test(cloud_data, 87);
    }


    shifter_first.style.zIndex = 4000 + reverse;
    shifter_second.style.zIndex = 4000 - reverse;
    shifter_first.style.top = `${reverse*100}%`;
    shifter_second.style.top = `${reverse*100}%`;
    shifter_frame.style.display = 'block';
    shifter_first.style.display = 'block';
    shifter_second.style.display = 'block';
    for (let i = 1; i <= 1000; i++)
    {
        setTimeout(() => {
            if (i <= 333)
            {
                shifter_first.style.top = `${reverse*(100 - i*(100/333))}%`;
            }
            else if (i <= 666)
            {
                shifter_first.style.top = `${reverse*(333 - i)*(100/333)}%`;
                shifter_second.style.top = `${reverse*(100 - (i-333)*(100/333))}%`;
            }
            else
            {
                shifter_second.style.top = `${reverse*(666 - i)*(100/333)}%`;
            }
            if (i == 500)
            {
                const siblings = scroll_status_bar.querySelectorAll('.scrollpoint');
                siblings.forEach((m, index) =>
                {
                    if (destination_num != index)
                    {
                        m.style.width = '8px';
                        m.style.height = '8px';
                    }
                    else if (destination_num == index)
                    {
                        siblings[destination_num].style.width = '12px';
                        siblings[destination_num].style.height = '12px';
                    }
                });
                let rect = space_list[current_view_space].getBoundingClientRect();
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                let dest = rect.top + scrollTop;
                window.scrollTo({
                    top: dest,
                    behavior: "smooth",
                }
            )
            }
            if (i == 1000)
            {
                shifter_first.style.display = 'none';
                shifter_second.style.display = 'none';
                shifter_frame.style.display = 'none';
                shift_status = false;
            }
        }, ((i - 500)**3)/250000 + i/2 + 630);
    }
}

// ((i - 500)**3)/210000 + i/5 + 700
// 27*Math.cbrt(i-500) + (i/2.3) + 300)

const scroll_status_bar = document.getElementById('scroll_status_bar');

let maintain_scroll_timer;
function create_scrollpoint()
{
    window.scrollTo({ top: 0 });
    window.addEventListener('resize', function()
    {
        let rect = space_list[current_view_space].getBoundingClientRect();
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        let dest = rect.top + scrollTop;
        window.scrollTo({ top: dest });
    })
    
    window.addEventListener('keyup', function(event)
    {
        const e = event.key;
        if (e == 40 || e == "ArrowDown")
        {
            if (current_view_space != space_list.length - 1)
            {
                space_shift(current_view_space + 1);
            }
        }
        else if(e == 38 || e == "ArrowUp")
        {
            if (current_view_space != 0)
            {
                space_shift(current_view_space - 1);
            }
        }
    })

    space_list.forEach((n, index) =>
    {
        let scrollpoint = document.createElement('div');
        scrollpoint.className = 'scrollpoint';
        scroll_status_bar.appendChild(scrollpoint);
        scrollpoint.addEventListener('mouseover', function (){document.body.style.cursor = "pointer";});
        scrollpoint.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});
        scrollpoint.addEventListener("click", function (e){
            const siblings = scroll_status_bar.querySelectorAll('.scrollpoint');
            siblings.forEach((m, index) =>
            {
                if (scrollpoint == m)
                {
                    space_shift(index);
                }
            });
        });
        if (index == current_view_space)
        {
            scrollpoint.style.width = '12px';
            scrollpoint.style.height = '12px';
        }
    });
}




const hei_rate_title = document.querySelector('#sector_hei .compare_rate .compare_rate_value .compare_rate_value_number');
const wei_rate_title = document.querySelector('#sector_wei .compare_rate .compare_rate_value .compare_rate_value_number');
const bmi_rate_title = document.querySelector('#sector_bmi .compare_rate .compare_rate_value .compare_rate_value_number');

const hei_rate_script = document.querySelector('#sector_hei .compare_rate .compare_rate_script .compare_rate_script_text');
const wei_rate_script = document.querySelector('#sector_wei .compare_rate .compare_rate_script .compare_rate_script_text');
const bmi_rate_script = document.querySelector('#sector_bmi .compare_rate .compare_rate_script .compare_rate_script_text');

const dist_hei = document.querySelector('#sector_hei .compare_dist .compare_dist_data');
const dist_wei = document.querySelector('#sector_wei .compare_dist .compare_dist_data');
const dist_bmi = document.querySelector('#sector_bmi .compare_dist .compare_dist_data');

const resize_delay = 360;
let resizeBarTimer = null;
let resizeDistTimer = null;
let resizeColumnTimer = null;
let resizeLineTimer = null;

google.charts.load('current', { 'packages': ['corechart'] });
// google.charts.setOnLoadCallback(drawChart);

const vbar_hei = document.querySelector('#sector_hei .compare_vbar .compare_vbar_data');
const vbar_wei = document.querySelector('#sector_wei .compare_vbar .compare_vbar_data');
const vbar_bmi = document.querySelector('#sector_bmi .compare_vbar .compare_vbar_data');


function compare_drawBarchart(hei, wei, hei_ref, wei_ref, age_text){
    console.log("매개변수 확인");
    console.log(hei, wei, hei_ref, wei_ref, age_text);

    // 모집단 키 대입할 것
    var hei_data = new google.visualization.arrayToDataTable([
        ['person', 'value', { role: 'style'}, { role: 'annotation'}],
        [age_text, hei_ref, 'color: rgb(123, 110, 220); opacity: 0.8;', `${hei_ref}`],
        ['나', hei, 'color: rgb(214, 96, 149); opacity: 0.8', `${hei}`]
    ]);


    // 모집단 체중 대입할 것
    var wei_data = new google.visualization.arrayToDataTable([
        ['person', 'value', { role: 'style'}, { role: 'annotation'}],
        [age_text, wei_ref, 'color: rgb(123, 110, 220); opacity: 0.8;', `${wei_ref}`],
        ['나', wei, 'color: rgb(214, 96, 149); opacity: 0.8', `${wei}`]
    ]);


    // bmi 계산 후 대입
    let bmi = parseFloat(((wei) / (hei / 100)**2).toFixed(2));
    let bmi_ref = parseFloat(((wei_ref) / (hei_ref / 100)**2).toFixed(2));
    var bmi_data = new google.visualization.arrayToDataTable([
        ['person', 'value', { role: 'style'}, { role: 'annotation'}],
        [age_text, bmi_ref, 'color: rgb(123, 110, 220); opacity: 0.8;', `${bmi_ref}`],
        ['나', bmi, 'color: rgb(214, 96, 149); opacity: 0.8', `${bmi}`]
    ]);

    var bar_options =
    {
        bar: { groupWidth : '45%'},
        backgroundColor: 'none',
        // 차트가 그려지는 영역 설정
        width: '100%',
        height: '100%',
        // 애니메이션 시간, 애니메이션 타입, 최초 구동시 애니메이션 여부
        animation:{
            duration: 550,
            easing: 'in',
            startup: true
          },
        chartArea: { // 차트 자체 크기 설정
            left: 80,
            top: 15,
            width: '85%',
            height: '90%',
        },
        hAxis: {
            // 뒤의 가로 눈금선 제거
            gridlines: {
                count: 0,
                // color: 'transparent'
            },
            // 단위 표시 양식 설정
            format: `#\ `,
            baselineColor: 'none',
            // 단위 텍스트 스타일
            textStyle: {
                fontSize: 14,
                bold: true,
                color: 'rgb(126, 122, 186)'
            },
            // 단위 표시될 것
            ticks: [0]
        },
        vAxis: {
            // 뒤의 세로 눈금선 제거
            // textPosition: 'none',
            textStyle:{color: 'rgb(123, 110, 150)', fontSize: 13, bold: true},
            gridlines: {
                color: 'transparent'
            },
            baselineColor: 'rgb(156, 140, 216)'
        },
        //범례 표시
        legend: 'none',
        // 그래프 본체 색상
        colors: ['rgb(156, 140, 216)'],
        // 마우스오버 툴팁 제거
        tooltip: { trigger: 'none' },
        // 그래프 내부 자체 탐색 이벤트 해제
        explorer: { actions: [] },
        // 그래프 마우스오버, 마우스클릭시 점 생기는것 삭제
        enableInteractivity: false,
        // annotations: {
        //     alwaysOutside: false,
        //     textStyle: {
        //         fontSize: 17,
        //         bold: true,
        //         color: 'rgb(255, 255, 255)',
        //     }
        // },
        annotations: {
            textStyle: {
              fontSize: 15,
              bold: true,
              color: '#FFFFFF',
            },
            // 주석에 걸려있는 선
            stem: {
              length: 3,
              color: 'transparent',
            },
            highContrast: true,
            boxStyle:
            {
                gradient: 'none'
            },
            alwaysOutside: false,
            outsideTextStyle: {
              fontSize: 15,
              color: 'black',
              bold: true,
            },
            x: 100,
          }
    }


    var bar1 = new google.visualization.BarChart(vbar_hei);
    var bar2 = new google.visualization.BarChart(vbar_wei);
    var bar3 = new google.visualization.BarChart(vbar_bmi);
    bar1.draw(hei_data, bar_options);
    bar2.draw(wei_data, bar_options);
    bar3.draw(bmi_data, bar_options);


    function resizeBar()
    {
        bar1.draw(hei_data, bar_options);
        bar2.draw(wei_data, bar_options);
        bar3.draw(bmi_data, bar_options);  
    }

    window.addEventListener('resize', function(){
        clearTimeout(resizeBarTimer);
        resizeBarTimer = setTimeout(function(){
            // console.log('막대차트 리사이징');
            resizeBar();
        }, resize_delay);
    });
  }

// 정규분포그래프
function compare_drawDistchart(hei_rate, wei_rate, person_bmi, bmi_rate) {
    // 데이터 설정
    var chart_data = new google.visualization.DataTable();
    chart_data.addColumn('number', 'X');
    chart_data.addColumn('number', 'Y');
    for (var x = 0; x <= 100; x += 0.1) {
        var y = Math.exp(-(Math.pow(x - 50, 2) / (2 * Math.pow(19, 2)))) / Math.sqrt(2 * Math.PI * Math.pow(11, 2));
        chart_data.addRow([x, y]);
      }
    
    // 차트 옵션 설정
    var chart_options = {
        backgroundColor: 'transparent',
        // 차트가 그려지는 영역 설정
        width: '100%',
        height: '100%',
        // 애니메이션 시간, 애니메이션 타입, 최초 구동시 애니메이션 여부
        animation:{
            duration: 450,
            easing: 'in',
            startup: true
          },
        chartArea: { // 차트 자체 크기 설정
            left: 10,
            top: 15,
            width: '90%',
            height: '80%',
        },
        series: { // 선의 굵기 설정
            0: { lineWidth: 5 }
        },
        hAxis: {
            // 뒤의 가로 눈금선 제거
            gridlines: {
                count: 0,
                color: 'transparent'
            },
            // 단위 표시 양식 설정
            format: `#\ `,
            // X축선 제거
            baselineColor: 'none',
            // 단위 텍스트 스타일
            textStyle: {
                fontSize: 25,
                bold: true,
                color: 'rgb(156, 140, 216)'
            },
            // 단위 표시될 것
            ticks: []
        },
        vAxis: {
            // 뒤의 세로 눈금선 제거
            textPosition: 'none',
            gridlines: {
                color: 'transparent'
            },
            baselineColor: 'rgb(156, 140, 216)',
        },
        //범례 표시
        legend: 'none',
        // 그래프 본체 색상
        colors: ['rgb(156, 140, 216)'],
        // 마우스오버 툴팁 제거
        tooltip: { trigger: 'none' },
        // 그래프 내부 자체 탐색 이벤트 해제
        explorer: { actions: [] },
        // 그래프 마우스오버, 마우스클릭시 점 생기는것 삭제
        enableInteractivity: false
    };

    // 상위%에 따른 코멘트 요소 변경
    // 신장이 (     작은, 비슷한, 큰      ) 편입니다.
    // 신장과 (     비상관, 상관        ) 관계인 체중을...
    // BMI는 (        평균 미달, 평균, 평균 초과        ) 수준입니다.
    if (hei_rate > 35 && hei_rate < 65){
        hei_rate_script.innerText = '비슷한';
    }
    else if (hei_rate <= 35){
        hei_rate_script.innerText = '작은';
    }
    else if (hei_rate >= 65){
        hei_rate_script.innerText = '큰';
    }

    if (wei_rate > 40 && wei_rate < 60){
        wei_rate_script.innerText = '상관';
    }
    else{
        wei_rate_script.innerText = '비상관';
    }





    if (person_bmi >= 18.5 && person_bmi <= 23){
        bmi_rate_script.innerText = '평균';
    }
    else if (person_bmi < 18.5){
        bmi_rate_script.innerText = '평균 미달';
    }
    else if (person_bmi >= 23 && person_bmi < 25){
        bmi_rate_script.innerText = '평균 이상';
    }
    else if(person_bmi >= 25)
    {
        bmi_rate_script.innerText = "평균 초과";
    }
    


    
    // 차트 그리기
    var dist1 = new google.visualization.LineChart(dist_hei);
    var dist2 = new google.visualization.LineChart(dist_wei);
    var dist3 = new google.visualization.LineChart(dist_bmi);
    dist1.draw(chart_data, chart_options);
    dist2.draw(chart_data, chart_options);
    dist3.draw(chart_data, chart_options);
    recreate_pointer();

    // 표시 점선 생성
    function recreate_pointer()
    {
        var dist_hei_pointer = document.createElement('div');
        var dist_hei_pointer_text = document.createElement('span');

        var dist_wei_pointer = document.createElement('div');
        var dist_wei_pointer_text = document.createElement('span');

        var dist_bmi_pointer = document.createElement('div');
        var dist_bmi_pointer_text = document.createElement('span');


        const locate_rate = 3; // 표시선 위치에 필요한 보정상수


        dist_hei_pointer.className = 'compare_dist_pointer';
        dist_hei_pointer_text.className = 'compare_dist_pointer_text';
        dist_hei_pointer_text.innerText = `${100 - hei_rate}%`; //매개변수 대입
        hei_rate_title.innerText = `${100 - hei_rate}`;
        dist_hei_pointer_text.style.left = `${hei_rate - locate_rate*2}%`; //매개변수 대입
        dist_hei_pointer_text.style.bottom = '0%';

        dist_wei_pointer.className = 'compare_dist_pointer';
        dist_wei_pointer_text.className = 'compare_dist_pointer_text';
        dist_wei_pointer_text.innerText = `${100 - wei_rate}%`; //매개변수 대입
        wei_rate_title.innerText = `${100 - wei_rate}`;
        dist_wei_pointer_text.style.left = `${wei_rate - locate_rate*2}%`; //매개변수 대입
        dist_wei_pointer_text.style.bottom = '0%';

        dist_bmi_pointer.className = 'compare_dist_pointer';
        dist_bmi_pointer_text.className = 'compare_dist_pointer_text';
        dist_bmi_pointer_text.innerText = `${100 - bmi_rate}%`; //매개변수 대입
        bmi_rate_title.innerText = `${100 - bmi_rate}`;
        dist_bmi_pointer_text.style.left = `${bmi_rate - locate_rate*2}%`; //매개변수 대입
        dist_bmi_pointer_text.style.bottom = '0%';

        dist_hei_pointer.style.bottom = '8.5%';
        dist_wei_pointer.style.bottom = '8.5%';
        dist_bmi_pointer.style.bottom = '8.5%';
        dist_hei_pointer.style.left = `${hei_rate - locate_rate}%`; // 매개변수에서 보정상수 감소
        dist_wei_pointer.style.left = `${wei_rate - locate_rate}%`; // 매개변수에서 보정상수 감소
        dist_bmi_pointer.style.left = `${bmi_rate - locate_rate}%`; // 매개변수에서 보정상수 감소

        dist_hei.appendChild(dist_hei_pointer);
        dist_hei.appendChild(dist_hei_pointer_text);
        dist_wei.appendChild(dist_wei_pointer);
        dist_wei.appendChild(dist_wei_pointer_text);
        dist_bmi.appendChild(dist_bmi_pointer);
        dist_bmi.appendChild(dist_bmi_pointer_text);
    }

    function delete_pointer()
    {
        let c1 = dist_hei.querySelectorAll('.compare_dist_pointer,.compare_dist_pointer_text');
        let c2 = dist_wei.querySelectorAll('.compare_dist_pointer,.compare_dist_pointer_text');
        let c3 = dist_bmi.querySelectorAll('.compare_dist_pointer,.compare_dist_pointer_text');
        if (c1.length > 0 && c2.length > 0 && c3.length > 0){
            for (let i = 0; i < 2; i++)
            {
                dist_hei.removeChild(c1[i]);
                dist_wei.removeChild(c2[i]);
                dist_bmi.removeChild(c3[i]);
            }
        }
    }

    function resizeDist()
    {
        dist1.draw(chart_data, chart_options);
        dist2.draw(chart_data, chart_options);
        dist3.draw(chart_data, chart_options);
        recreate_pointer();
        // 리사이징 이벤트에서 표시선 이동하는 함수 포함될 것
    }

    
    window.addEventListener('resize', function(){
        delete_pointer();
        clearTimeout(resizeDistTimer);
        resizeDistTimer = setTimeout(function(){
            // console.log('정규분포 리사이징');
            resizeDist();
        }, resize_delay);
    });

    // google.visualization.events.addListener(chart1, 'click', function (e) {
    //     var selectedItem = chart1.getSelection()[0]; // 선택한 데이터 점의 정보를 가져옴
    //     if (selectedItem) {
    //         var seriesIndex = selectedItem.column; // 시리즈 인덱스 값을 가져옴
    //         var rowIndex = selectedItem.row; // 데이터 행의 인덱스 값을 가져옴
    //         console.log('Selected item: seriesIndex=', seriesIndex, ', rowIndex=', rowIndex);
    //         // 실제값
    //         var va = chart_data.getValue(rowIndex, seriesIndex);
    //         console.log(va);

    //     }
    // });
}

const variety_column_wei = document.querySelector('#sector_wei_record .variety_column_data');
const variety_column_bmi = document.querySelector('#sector_bmi_record .variety_column_data');




// 체중, BMI 근황 데이터는 길이가 1~5개까지 변동
//'Fri Mar 17 2023 12:24:39 GMT+0900 (한국 표준시)'
// let wei_record_test = [
//     {date: '2023 1 27 13:58:05', value: 120},
//     {date: 'Sat Mar 11 2023 11:28:07 GMT+0900 (한국 표준시)', value: 70},
//     {date: 'Fri Feb 24 2023 10:59:51 GMT+0900 (한국 표준시)', value: 67},
//     {date: 'Tue Mar 21 2022 15:14:48 GMT+0900 (한국 표준시)', value: 68}
// ]

// let bmi_record_test = [
//     {date: 'Fri Feb 24 2023 12:24:39 GMT+0900 (한국 표준시)', value: 19.2},
//     {date: 'Sat Mar 11 2023 11:28:07 GMT+0900 (한국 표준시)', value: 21.4},
//     {date: 'Fri Mar 17 2023 10:59:51 GMT+0900 (한국 표준시)', value: 20.0},
//     // {date: 'Tue Mar 21 2022 15:14:48 GMT+0900 (한국 표준시)', value: 21.9}
// ]



function variety_drawColumnchart(wei_record, bmi_record){

    console.log(wei_record);
    console.log(bmi_record);
    var wei_data = new google.visualization.DataTable();
    wei_data.addColumn('string', 'Day');
    wei_data.addColumn('number', 'value');
    wei_data.addColumn({type: 'string', role: 'style'});
    wei_data.addColumn({type: 'string', role: 'annotation'});

    // 최댓값 데이터는 색깔을 다르게 표시하기 위해 최댓값 가져오기
    wei_record.sort(function(a, b) {return b.value - a.value;});
    const wei_max = wei_record[0].value;
    // 날짜순으로 다시 정렬
    wei_record.sort(function(a, b) {return new Date(a.date) - new Date(b.date);});
    // foreach 순회하면서 데이터행 추가


    // let date = new Date(2019, 0, 1);
    // document.write('기준일자 : ' + date + '<br>');

    // date.setMonth(date.getMonth() + 1);
    // document.write('1달 후 : ' + date + '<br>');

    // date = new Date(2019, 0, 1);
    // date.setMonth(date.getMonth() - 1);
    // document.write('1달 전 : ' + date + '<br>
    wei_record.forEach((n) =>{
        console.log("n.data");
        console.log(n.date)
        let day = new Date(n.date);
        console.log("day");
        console.log(day.getMonth()+1);
        let month = day.getMonth() +1;
        let value = n.value;
        // day.setMonth(day.getMonth()+1);
        let value_color = 'color: rgb(123, 110, 220); opacity: 0.8';
        if (value == wei_max)
        {
            value_color = 'color: rgb(214, 96, 149); opacity: 0.8';
        }
        wei_data.addRow([`${month}.${day.getDate()}`, value, value_color, `${value}`]);    
    })

    var bmi_data = new google.visualization.DataTable()
    bmi_data.addColumn('string', 'Day');
    bmi_data.addColumn('number', 'value');
    bmi_data.addColumn({type: 'string', role: 'style'});
    bmi_data.addColumn({type: 'string', role: 'annotation'});

    // 최댓값 데이터는 색깔을 다르게 표시하기 위해 최댓값 가져오기
    bmi_record.sort(function(a, b) {return b.value - a.value;});
    const bmi_max = bmi_record[0].value;
    // 날짜순으로 다시 정렬
    bmi_record.sort(function(a, b) {return new Date(a.date) - new Date(b.date);});
    // foreach 순회하면서 데이터행 추가
    bmi_record.forEach((n) =>{
        let day = new Date(n.date);
        let value = n.value;
        let month = day.getMonth() +1;

        let value_color = 'color: rgb(123, 110, 220); opacity: 0.8';
        if (value == bmi_max)
        {
            value_color = 'color: rgb(214, 96, 149); opacity: 0.8';
        }
        bmi_data.addRow([`${month}.${day.getDate()}`, value, value_color, `${value}`]);    
    })

    var column_options =
    {
        bar: { groupWidth : '55%'},
        backgroundColor: 'none',
        // 차트가 그려지는 영역 설정
        width: '90%',
        height: '90%',
        // 애니메이션 시간, 애니메이션 타입, 최초 구동시 애니메이션 여부
        animation:{
            duration: 530,
            easing: 'in',
            startup: true
          },
        chartArea: { // 차트 자체 크기 설정
            left: 50,
            top: 15,
            width: '85%',
            height: '80%',
        },
        hAxis: {
            textStyle:{color: 'rgb(123, 110, 150)', fontSize: 15, bold: true},
            // 뒤의 가로 눈금선 제거
            gridlines: {
                count: 0,
                // color: 'transparent'
            },
            // 단위 표시 양식 설정
            format: `MM/dd`,
            baselineColor: 'none',
            // 단위 텍스트 스타일
            textStyle: {
                fontSize: 12,
                bold: true,
                color: 'rgb(126, 122, 186)'
            },
            // 단위 표시될 것
            // ticks: []
        },
        vAxis: {
            
            // 뒤의 세로 눈금선 제거
            // textPosition: 'none',
            textStyle:{color: 'rgb(123, 110, 150)', fontSize: 11, bold: true},
            gridlines: {
                color: 'transparent'
            },
            baselineColor: 'rgb(156, 140, 216)'
        },
        //범례 표시
        legend: 'none',
        // 그래프 본체 색상
        colors: ['rgb(156, 140, 216)'],
        // 마우스오버 툴팁 제거
        tooltip: { trigger: 'none' },
        // 그래프 내부 자체 탐색 이벤트 해제
        explorer: { actions: [] },
        // 그래프 마우스오버, 마우스클릭시 점 생기는것 삭제
        enableInteractivity: false,
        annotations: {
            textStyle: {
              fontSize: 15,
              bold: true,
              color: '#FFFFFF',
            },
            // 주석에 걸려있는 선
            stem: {
              length: 3,
              color: 'transparent',
            },
            highContrast: true,
            boxStyle:
            {
                gradient: 'none'
            },
            alwaysOutside: true,
            outsideTextStyle: {
              fontSize: 15,
              color: 'black',
              bold: true,
            },
            x: 100,
          }
    }

    // 그릴 요소
    var column_wei = new google.visualization.ColumnChart(variety_column_wei);
    var column_bmi = new google.visualization.ColumnChart(variety_column_bmi);
    column_wei.draw(wei_data, column_options);
    column_bmi.draw(bmi_data, column_options);
    recreate_gradient();

    function resizeColumn()
    {
        column_wei.draw(wei_data, column_options);
        column_bmi.draw(bmi_data, column_options);
        recreate_gradient();
    }

    function recreate_gradient()
    {
        let column_gradient = document.createElement('div');
        column_gradient.className = 'column_gradient';

        variety_column_wei.appendChild(column_gradient);
        variety_column_bmi.appendChild(column_gradient.cloneNode(true));
        console.log('gradient 추가');
    }

    function delete_gradient()
    {
        let c1 = variety_column_wei.querySelectorAll('.variety_column_data .column_gradient');
        let c2 = variety_column_bmi.querySelectorAll('.variety_column_data .column_gradient');
        if (c1.length > 0 && c2.length > 0){
            variety_column_wei.removeChild(c1[0]);
            variety_column_bmi.removeChild(c2[0]);
        }
    }

    window.addEventListener('resize', function(){
        delete_gradient();
        clearTimeout(resizeColumnTimer);
        resizeColumnTimer = setTimeout(function(){
            console.log('세로막대차트 리사이징');
            resizeColumn();
        }, resize_delay);
    });
}


const variety_line_bal = document.querySelector('#sector_body_line .variety_line_data');

let bal_record_test = {
    sholuder: 21.4,
    wrist: 79.6,
    hip: 46.1,
    leg: 57.6,
    neck: 49.56
};

function variety_drawLinechart(bal_record){

    let sholuder_value = bal_record.sholuder;
    let wrist_value = bal_record.wrist;
    let hip_value = bal_record.hip;
    let leg_value = bal_record.leg;
    let neck_value = bal_record.neck;

    var bal_data = new google.visualization.arrayToDataTable([
        ['part', 'value', { role: 'style'}, { role: 'annotation' }],
        ['어깨', sholuder_value, 'color: rgb(123, 110, 220); opacity: 0.8;', `${sholuder_value}`],
        ['손목', wrist_value, 'color: rgb(123, 110, 220); opacity: 0.8', `${wrist_value}`],
        ['골반', hip_value, 'color: rgb(123, 110, 220); opacity: 0.8', `${hip_value}`],
        ['다리', leg_value, 'color: rgb(123, 110, 220); opacity: 0.8', `${leg_value}`],
        ['목', neck_value, 'color: rgb(123, 110, 220); opacity: 0.8', `${neck_value}`],
    ]);

    var line_options =
    {
        // bar: { groupWidth : '55%'},
        backgroundColor: 'none',
        // 차트가 그려지는 영역 설정
        width: '90%',
        height: '90%',
        // 애니메이션 시간, 애니메이션 타입, 최초 구동시 애니메이션 여부
        animation:{
            duration: 530,
            easing: 'in',
            startup: true
          },
        chartArea: { // 차트 자체 크기 설정
            left: 50,
            top: 15,
            width: '85%',
            height: '80%',
        },
        hAxis: {
            // 뒤의 가로 눈금선 제거
            gridlines: {
                count: 0,
                // color: 'transparent'
            },
            // 단위 표시 양식 설정
            format: `#\ `,
            baselineColor: 'none',
            // 단위 텍스트 스타일
            textStyle: {
                fontSize: 17,
                bold: true,
                color: 'rgb(126, 122, 186)'
            },
            // 단위 표시될 것
            ticks: []
        },
        vAxis: {
            // 뒤의 세로 눈금선 제거
            // textPosition: 'none',
            textStyle:{color: 'rgb(123, 110, 150)', fontSize: 11, bold: true},
            gridlines: {
                color: 'transparent'
            },
            baselineColor: 'rgb(156, 140, 216)'
        },
        //범례 표시
        legend: 'none',
        // 그래프 본체 색상
        colors: ['rgb(156, 140, 216)'],
        // 마우스오버 툴팁 제거
        tooltip: { trigger: 'none' },
        // 그래프 내부 자체 탐색 이벤트 해제
        explorer: { actions: [] },
        // 그래프 마우스오버, 마우스클릭시 점 생기는것 삭제
        enableInteractivity: false,
        // annotations: {
        //     alwaysOutside: false,
        //     textStyle: {
        //         fontSize: 17,
        //         bold: true,
        //         color: 'rgb(255, 255, 255)',
        //     }
        // },
        pointSize: 7,
        annotations: {
            textStyle: {
              fontSize: 15,
              bold: true,
              color: '#FFFFFF',
            },
            // 주석에 걸려있는 선
            stem: {
              length: 5,
              color: 'transparent',
            },
            highContrast: true,
            boxStyle:
            {
                gradient: 'none'
            },
            alwaysOutside: false,
            outsideTextStyle: {
              fontSize: 15,
              color: 'black',
              bold: true,
            },
            x: 100,
          }
    }

    // 그릴 요소
    var line_bal = new google.visualization.LineChart(variety_line_bal);
    line_bal.draw(bal_data, line_options);
    recreate_gradient();

    function resizeLine()
    {
        line_bal.draw(bal_data, line_options);
        recreate_gradient();
    }

    function recreate_gradient()
    {
        let column_gradient = document.createElement('div');
        column_gradient.className = 'column_gradient';

        variety_line_bal.appendChild(column_gradient);
        console.log('gradient 추가');
    }

    function delete_gradient()
    {
        let c1 = variety_line_bal.querySelectorAll('.variety_line_data .column_gradient');
        if (c1.length > 0){
            variety_line_bal.removeChild(c1[0]);
        }
    }

    window.addEventListener('resize', function(){
        delete_gradient();
        clearTimeout(resizeLineTimer);
        resizeLineTimer = setTimeout(function(){
            console.log('꺾은선차트 리사이징');
            resizeLine();
        }, resize_delay);
    });
}


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 부위 선택 및 파이 차트 start


//묶어서 반원차트 생성
//묶어서 반원차트 생성
//묶어서 반원차트 생성
//묶어서 반원차트 생성
//묶어서 반원차트 생성
//묶어서 반원차트 생성
//묶어서 반원차트 생성
//묶어서 반원차트 생성

let halfchart_data ={
    leftShoulder: 99,
    rightShoulder: 98,
    leftHand: 99,
    rightHand: 88,
    leftPelvis: 99,
    rightPelvis: 98,
    leftAnkle: 97,
    rightAnkle: 99,
    neckData: 22
}

function create_halfchart(data){
    leftShoulder = data.leftShoulder;
    rightShoulder = data.rightShoulder;
    leftHand = data.leftHand;
    rightHand = data.rightHand;
    leftPelvis = data.leftPelvis;
    rightPelvis = data.rightPelvis;
    leftAnkle = data.leftAnkle;
    rightAnkle = data.rightAnkle;
    neckData = data.neckData;

    ls = new Circle('leftShoulder');
    rs = new Circle('rightShoulder');
    lh = new Circle('leftHand');
    rh = new Circle('rightHand');
    lp = new Circle('leftPelvis');
    rp = new Circle('rightPelvis');
    la = new Circle('leftankle');
    ra = new Circle('rightankle');
    neck = new Circle('neck');
    
    let ne = document.getElementById('neck');
    ne.classList.add('invisible');

    let left_img = document.getElementById('left_img');
    let right_img = document.getElementById('right_img');
    left_img.addEventListener('click', left_once);
    right_img.addEventListener('click', right_once);

    halfChart1(leftShoulder * 1.8, leftShoulder);
}

let start_once = false;
let body_img_status = 'front';
function left_once(){
    halfGo(document.getElementById('left_img'), 0);
}
function right_once(){
    halfGo(document.getElementById('right_img'), 0);
}



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  데이터 대입하는 변수
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  데이터 대입하는 변수
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  데이터 대입하는 변수
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  데이터 대입하는 변수
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  데이터 대입하는 변수
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  데이터 대입하는 변수
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@  데이터 대입하는 변수
let leftShoulder = 50;
let rightShoulder = 50;
let leftHand = 50;
let rightHand = 50;
let leftPelvis = 50;
let rightPelvis = 50;
let leftAnkle = 50;
let rightAnkle = 50;
let neckData = 50;

function halfChartResizing(width) {
    let half = document.getElementById('chart-half');
    let human = document.getElementById('human_box');
    let halfOutBox = document.getElementById('halfchart_background');
    let halfBox = document.getElementById('halfchart_innerbackground');
    let spotName = document.getElementById('spotName');

    //1920 
    if (width >= 1920) {
        half.style.transform = "scale(0.8)";
        half.style.marginLeft = "0";
        half.style.position = "relative";
        half.style.display = "flex";
        half.style.justifyContent = "center";
        half.style.alignItems = "center";
        half.style.textContent = "center";
        half.style.transformOrigin = "45% 65%";
        human.style.display = 'inline-block';
        halfOutBox.display = 'flex';
        halfOutBox.style.width = '35vw';
        spotName.style.left = '25%';

    } else if (width < 1920 && width > 1650) {
        half.style.transform = "scale(0.7)";
        half.style.transformOrigin = "25% 50%";
        halfBox.style.width = '50%';
        human.style.display = 'inline-block';
        halfOutBox.style.width = '35vw';
        spotName.style.left = '25%';

    } else if (width <= 1650 && width >= 1550) {
        half.style.transform = "scale(0.6)";
        half.style.transformOrigin = "25% 50%";
        halfBox.style.width = '50%';
        human.style.display = 'inline-block';
        halfOutBox.style.width = '35vw';
        spotName.style.left = '25%';

        /////////////////////////////////////////////////////
    } else if (width < 1450) {
        half.style.transform = "scale(0.6)";
        half.style.transformOrigin = "25% 50%";
        half.style.textContent = 'center';
        human.style.display = 'none';
        halfOutBox.style.width = '288px';
        spotName.style.left = '45%';
        halfBox.style.width = '95%';
        half.style.display = 'inline-block';
        halfBox.style.marginTop = '80px';
        half.style.textAlign = 'center';
    }

    // console.log(width, "width!!!!!");
}

window.addEventListener('resize', function () {
    let width = window.innerWidth;
    halfChartResizing(width);

    // google.charts.setOnLoadCallback(drawBarChart);
    // google.charts.setOnLoadCallback(drawLineChart);
    // google.charts.setOnLoadCallback(drawplaceChart);
    // google.charts.setOnLoadCallback(drawBarkgChart);
    // google.charts.setOnLoadCallback(drawBarbmiChart);
});

window.onload = function () {
    localStorage.setItem('차트페이지', 'on');
    let width = window.innerWidth;
    halfChartResizing(width);
    // console.log(width, "width!!!!!");
    // google.charts.load("current", { packages: ["corechart"] });

    // google.charts.setOnLoadCallback(drawBarChart);
    // google.charts.setOnLoadCallback(drawLineChart);
    // google.charts.setOnLoadCallback(drawplaceChart);
    // google.charts.setOnLoadCallback(drawBarkgChart);
    // google.charts.setOnLoadCallback(drawBarbmiChart);

}

window.onbeforeunload = function () {
    localStorage.setItem('차트페이지', 'on');
};

class Circle {
    constructor(whereId) {
        let box = document.getElementById('human_inner_box');
        let circle_div = document.createElement('div');
        circle_div.className = 'loader';
        circle_div.id = whereId;
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'circular');
        svg.setAttribute('viewBox', '25 25 50 50');
        let one = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        one.setAttribute('class', 'path');
        one.setAttribute('cx', '50');
        one.setAttribute('cy', '50');
        one.setAttribute('r', '20');
        one.setAttribute('fill', 'none');
        one.style.opacity = 0.3;
        one.setAttribute('stroke-width', '7');
        one.setAttribute('stroke-miterlimit', '10');
        if (whereId == 'leftShoulder') {
            circle_div.style.left = '23px';
            circle_div.style.top = '30px';

        } else if (whereId == 'rightShoulder') {
            circle_div.style.left = '72px';
            circle_div.style.top = '30px';

        } else if (whereId == 'leftHand') {
            circle_div.style.left = '3px';
            circle_div.style.top = '101px';

        } else if (whereId == 'rightHand') {
            circle_div.style.left = '91px';
            circle_div.style.top = '101px';

        } else if (whereId == 'leftPelvis') {
            circle_div.style.left = '30px';
            circle_div.style.top = '90px';

        } else if (whereId == 'rightPelvis') {
            circle_div.style.left = '65px';
            circle_div.style.top = '90px';

        } else if (whereId == 'leftankle') {
            circle_div.style.left = '35px';
            circle_div.style.top = '175px';

        } else if (whereId == 'rightankle') {
            circle_div.style.left = '60px';
            circle_div.style.top = '175px';

        } else if (whereId == 'neck') {
            circle_div.style.left = '60px';
            circle_div.style.top = '20px';

        }
        one.style.zIndex = '100';
        svg.appendChild(one);
        circle_div.appendChild(svg);
        box.appendChild(circle_div);

    }
}

let p = 0;
let setTimeRun;
let ls;
let rs;
let lh;
let rh;
let lp;
let rp;
let la;
let ra;
let neck;

let isRunning = false;

//임시비활성화
// ls = new Circle('leftShoulder');
// rs = new Circle('rightShoulder');
// lh = new Circle('leftHand');
// rh = new Circle('rightHand');
// lp = new Circle('leftPelvis');
// rp = new Circle('rightPelvis');
// la = new Circle('leftankle');
// ra = new Circle('rightankle');
// neck = new Circle('neck');
// ne.classList.add('invisible');


let ne = document.getElementById('neck');

function halfChart1(num, parameter) {

    if (setTimeRun) {
        clearTimeout(setTimeRun);
        setTimeRun = null;
    }

    let number = 100 * 1.8; //가운데 기준

    if (document.getElementById('needle')) {
        document.getElementById('needle').remove();
    }

    ///////////////////////////////////////////////////

    //////////////////////////////////////////////////
    let needle_li = document.getElementById('needle_li');
    needle_li.innerHTML = `<div id="needle"></div>`;
    let box = document.querySelector('.chart-half li:nth-child(4)');


    // 반원 중앙에 표시될 숫자 @@@@@@@@@@@@@@@@@@@@
    // 반원 중앙에 표시될 숫자 @@@@@@@@@@@@@@@@@@@@

    box.innerHTML += `<p id="gageNum">${parameter}</p> `;

    // 반원 중앙에 표시될 숫자 @@@@@@@@@@@@@@@@@@@@
    // 반원 중앙에 표시될 숫자 @@@@@@@@@@@@@@@@@@@@



    let delay = 5;
    let target = parseInt(num);
    let cnt = 0;

    if (localStorage.getItem('차트페이지') === 'on') {
        setTimeout(() => {
            setTimeRun = setTimeout(function needle_move() {
                let needle = document.getElementById("needle");
                // let needle = new Needle();
                let rotateNum = -90;
                needle.style.transform = `rotate(${rotateNum + cnt}deg)`;

                if (cnt >= target / (0.9 * 1.8)) {
                    delay = 20;
                }
                else {
                    delay = 5;
                }
                cnt += 1;
                if (cnt >= target) {
                    isRunning = false;
                    localStorage.removeItem('차트페이지');
                    return;
                }
                setTimeout(needle_move, delay)
            })
        }, 1000);
    } else {
        setTimeRun = setTimeout(function needle_move() {
            let needle = document.getElementById("needle");
            // let needle = new Needle();
            let rotateNum = -90;
            needle.style.transform = `rotate(${rotateNum + cnt}deg)`;

            if (cnt >= target / (0.9 * 1.8)) {
                delay = 20;
            }
            else {
                delay = 5;
            }
            cnt += 1;
            if (cnt >= target) {
                isRunning = false;
                return;
            }
            setTimeout(needle_move, delay)
        })
    }

}


let parameter = 30;

//파라미터는 데이터에서 가져온 값을 들고와서 집어넣어야........


// 임시비활성화
// halfChart1(parameter * 1.8, parameter);

/////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

//사람 애니메이션
function showHuman(human) {
    let delay = 0;
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            human.style.opacity = i / 10;
        }, delay);
        delay += 100;
    }

}
function spotNameChange(name) {
    let spotName = document.getElementById('spotName');
    spotName.textContent = name;
}

let human = document.getElementById('human_img');
let human2 = document.getElementById('human2_img');

//클래스네임 붙여주고 이벤트 제거 및 등록하는 함수
function classNamePlus(direction) {
    const directionObject = document.getElementById(direction.id);

    let left = document.getElementById('left_img');
    let right = document.getElementById('right_img');

    console.log(directionObject);

    if (directionObject.classList !== null && directionObject.classList.contains("click")) {
        directionObject.className = "";
        console.log(directionObject);


        left.removeEventListener('click', halfGo);
        right.removeEventListener('click', halfGo);

    } else {
        directionObject.className = "click";
        left.addEventListener('click', halfGo);
        right.addEventListener('click', halfGo);
    }

}

//정면 측면에 따라 원 숨기고 켜는 기능
function hideDiv(direction) {
    let out = document.getElementById('human_inner_box');
    let leftSho = document.getElementById('leftShoulder');
    let rightSho = document.getElementById('rightShoulder');
    let leftHand = document.getElementById('leftHand');
    let rightHand = document.getElementById('rightHand');
    let leftPelvis = document.getElementById('leftPelvis');
    let rightPelvis = document.getElementById('rightPelvis');
    let leftankle = document.getElementById('leftankle');
    let rightankle = document.getElementById('rightankle');
    let neck = document.getElementById('neck');

    if (direction.id === 'right_img') {
        leftSho.classList.add("invisible");
        rightSho.classList.add("invisible");
        leftHand.classList.add("invisible");
        rightHand.classList.add("invisible");
        leftPelvis.classList.add("invisible");
        rightPelvis.classList.add("invisible");
        leftankle.classList.add("invisible");
        rightankle.classList.add("invisible");
        if (neck.classList.contains('invisible')) {
            neck.classList.remove('invisible');
        }
    } else if (direction.id === 'left_img') {
        leftSho.classList.remove("invisible");
        rightSho.classList.remove("invisible");
        leftHand.classList.remove("invisible");
        rightHand.classList.remove("invisible");
        leftPelvis.classList.remove("invisible");
        rightPelvis.classList.remove("invisible");
        leftankle.classList.remove("invisible");
        rightankle.classList.remove("invisible");
        neck.classList.add("invisible");
    }

}


function halfGo(direction, halfchartNum) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    if (isRunning) {
        return; // 함수 실행 중에는 더 이상 실행되지 않음
    }

    //정면측면에 따라 원 숨기고 켜는 기능
    hideDiv(direction);
    // const human = document.getElementById('human_img');

    isRunning = true;

    classNamePlus(direction);

    if (direction.id == "right_img") {

        human.className = "invisible";
        human2.className = "";
        
        body_img_status = 'side';
        
        showHuman(human2);
        spotNameChange('측면');

    } else {
        human.className = "";
        human2.className = "invisible";

        body_img_status = 'front';

        showHuman(human);
        spotNameChange('정면');

    }

    if (setTimeRun) {
        clearTimeout(setTimeRun);
        setTimeRun = null;
    }
    let gageNum = document.getElementById('gageNum');
    gageNum.remove();
    halfChart1(halfchartNum * 1.8, halfchartNum);
}

//////////////////////////////////
const img_front = document.querySelector('#human_img');
const img_side = document.querySelector('#human2_img');

img_front.onclick = function (event) {
    let x = event.offsetX;
    let y = event.offsetY;
    let point = { x: x, y: y };

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    clickHuman(point, img_front, leftShoulder, rightShoulder, leftHand, rightHand, leftPelvis, rightPelvis, leftAnkle, rightAnkle, neckData);
    console.log("onclick-end");
};

img_side.onclick = function (event) {
    let x = event.offsetX;
    let y = event.offsetY;
    let point = { x: x, y: y };

    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@실제 신체 밸런스 측정 데이터 대입할 부분
    clickHuman(point, img_side, leftShoulder, rightShoulder, leftHand, rightHand, leftPelvis, rightPelvis, leftAnkle, rightAnkle, neckData);
    console.log("onclick-end");
};

//사람클릭시 함수...
function clickHuman(point, element, leftShoulder, rightShoulder, leftHand, rightHand, leftPelvis, rightPelvis, leftAnkle, rightAnkle, neckData) {
    console.log(element.id);
    console.log(isRunning, "isRunning");
    if (isRunning) {
        return;
    }
    console.log(isRunning + "isRunning1");
    isRunning = true;
    console.log(isRunning + "isRunning2");
    console.log(point);
    console.log(point.y);

    let halfChartNum = 0;

    if (element.id === 'human_img') {
        if (body_img_status == 'front')
        {
            if (point.y >= 33 && point.y <= 45) {
                if (point.x >= 15 && point.x <= 45) {
                    console.log("왼쪽어깨");
                    spotNameChange('왼쪽어깨');
                    halfChartNum = leftShoulder; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);

                }
                else if (point.x >= 70 && point.x <= 100) {
                    console.log("오른쪽어깨");
                    spotNameChange('오른쪽어깨');
                    halfChartNum = rightShoulder; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else {
                    isRunning = false;
                }
            }
            else if (point.x >= 30 && point.x <= 50) {
                if (point.y >= 170) {
                    console.log("왼쪽발목");
                    spotNameChange('왼쪽발목');
                    halfChartNum = leftAnkle; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else if (point.y >= 90 && point.y <= 110) {
                    console.log("왼쪽골반");
                    spotNameChange('왼쪽골반');
                    halfChartNum = leftPelvis; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else
                {
                    isRunning = false;
                }
            }
            else if (point.x >= 55 && point.x <= 80) {
                if (point.y >= 170) {
                    console.log("오른쪽발목");
                    spotNameChange('오른쪽발목');
                    halfChartNum = rightAnkle; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else if (point.y >= 90 && point.y <= 110) {
                    console.log("오른쪽골반");
                    spotNameChange('오른쪽골반');
                    halfChartNum = rightPelvis; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else {
                    isRunning = false;
                }
            }
            else if (point.x <= 14) {
                if (point.y >= 90 && point.y <= 120) {
                    console.log("왼손");
                    spotNameChange('왼손');
                    halfChartNum = leftHand; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else {
                    isRunning = false;
                }
            }
            else if (point.x >= 90) {
                if (point.y >= 90 && point.y <= 120) {
                    console.log("오른손");
                    spotNameChange('오른손');
                    halfChartNum = rightHand; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else {
                    isRunning = false;
                }
            }
            else {
                console.log('else!!!!!!');
                isRunning = false;
            }
        }
    }
    else if (element.id == "human2_img")
    {
        console.log('측면 클릭');
        if (body_img_status == 'side'){
            if (point.x >= 22 && point.x <= 40){
                if (point.y >= 15 && point.y <= 38)
                {
                    console.log("목");
                    spotNameChange('목');
                    halfChartNum = neckData; //데이터 가져와서
                    if (setTimeRun) {
                        clearTimeout(setTimeRun);
                        setTimeRun = null;
                    }
                    halfChart1(halfChartNum * 1.8, halfChartNum);
                }
                else{
                    isRunning = false;
                }
            }
            else{
                isRunning = false;
            }
        }
        else{
            isRunning = false;
        }
    }
}
// @@@@@@@@@@@@@@@@@@@@@@@ 부위 선택 및 파이 차트 end






// 구름 띄우기 start @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

let word_return_speed = 550;
let word_escape_speed = 780;

class cloud_word
{  
    static cloud_list = [];
    static cloud_count = 0;
    constructor(HTMLe)
    {
        this.e = HTMLe;
        this.span_loc = {};
        cloud_word.cloud_list[cloud_word.cloud_count] = this;
        cloud_word.cloud_count++;
    }
}

const cloud_sky = document.getElementById('space_cloud');
const cloud_title = document.getElementById('space_cloud_title');



// 
let cloud_data = [
    // {name: '데이터1', value1: '35.1', value2: '58.7', value3: '259', value4: '198.2', value5: '프로그래밍언어'},
    // {name: '데이터2', value1: '237.1', value2: 'AAAKDKGF', value3: '29.23', value4: '982.852', value5: '자바스크립트'},
    // {name: '데이터3', value1: '348.2847', value2: '19.9882', value3: 'DKGLJS', value4: '18.2', value5: 'C# Winform'},
    // {name: '데이터4', value1: 'ASJDP', value2: 'Rand', value3: 'Pycharm', value4: 'GUI', value5: 'Python TKinter'},
    // {name: '데이터5', value1: '23.51', value2: '.NET Framework', value3: '29.23', value4: 'ㅁㄴㅇㄹ', value5: 'C++'},
    // {name: '데이터6', value1: '41.847', value2: '59.982', value3: 'DKGS', value4: '18.2', value5: '아두이노'},
    // {name: '데이터7', value1: '87.4', value2: 'AA1243KF', value3: '89.23', value4: '9.82', value5: '자바스크립트'},
    // {name: '데이터8', value1: 'sagf2ga', value2: '125.52', value3: 'D198a020', value4: '18.292', value5: 'HTML'},
    // {name: '데이터9', value1: '31.27', value2: 'MySQL', value3: 'D23gJS', value4: '2409g9', value5: 'windows'},
    // {name: '데이터10', value1: 'asdg24y6', value2: 'DATABASE', value3: '1309485S', value4: '18.292', value5: 'Linux'},
]


// data, escape_distance 매개변수로 설정
function create_cloud_test(cloud_data, distance)
{
    const cloud_sky_style = window.getComputedStyle(cloud_sky);
    const clientwidth = document.documentElement.clientWidth;
    const clientheight = document.documentElement.clientHeight;

    const sky_w = parseInt(cloud_sky_style.width.replace('px', '')) * (0.8);
    const sky_h = parseInt(cloud_sky_style.height.replace('px', '')) * (0.8);

    

    // 겹치지 않게 생성시도 500번 하고 전부 실패시 강제 생성 종료
    let search_empty_count = 500;

    for (let i = 0; i < cloud_data.length; i++)
    {   
        let div = document.createElement('div');
        cloud_sky.appendChild(div);
        div.className = 'cloud';
        div.style.position = 'absolute';

        // let ran_x = randNUM(0, sky_w);
        // let ran_y = randNUM(0, sky_h);

        let ran_x = (randNUM(0, sky_w) / clientwidth) * 100;
        let ran_y = (randNUM(0, sky_h) / clientheight) * 100;

        div.style.left = `${ran_x}vw`;
        div.style.top = `${ran_y}vh`;
        // console.log(`생성위치 x : ${ran_x.toFixed(3)} // y : ${ran_y.toFixed(3)}`);
        // 랜덤 위치의 정보를 가져와서 겹치는지 검사
        let rect1 = div.getBoundingClientRect();
        // 생성할 화면에 다른 요소가 배치돼있을 경우 그 요소와도 겹치는지 검사
        let rect2 = cloud_title.getBoundingClientRect();

        if (isOverlap(div, cloud_sky.querySelectorAll('.cloud'), 1))
        {
            i--;
            search_empty_count--;
            if (search_empty_count <= 0)
            {
                console.log("생성 불가");
                div.remove();
                return;
            }
            console.log('겹치는 구름 삭제1');
            div.remove();
            continue;
        }
        else
        {
            if (rect1.right > rect2.left && rect1.left < rect2.right && rect1.bottom > rect2.top && rect1.top < rect2.bottom)
            {
                i--;
                console.log('겹치는 구름 삭제2');
                div.remove();
                continue;
            }
            else
            {
                let cloud = new cloud_word(div);
                create_cloud(cloud, Object.values(cloud_data[i]));



                div.addEventListener('mousemove', function(event)
                {
                    escape_from_mouse(event, cloud, distance);
                });
                div.addEventListener('mouseout', function ()
                {
                    return_to_cloud(cloud);
                });
                div.style.display = 'none';
                cloud_show_smooth(div, 100, 100);
                setTimeout(() =>
                {
                    let float_prop = randNUM(0, float_list.length - 1);
                    div.classList.add(`${float_list[float_prop]}`);
                }, randNUM(1, 492));
            }
        }
    }
}

cloud_sky.addEventListener('mousemove', function()
{
    cloud_word.cloud_list.forEach((n) =>
    {
        let elements = n.e.getElementsByTagName("span");
        for (let i = 0; i < elements.length; i++)
        {
            if (n.span_loc[elements[i].className][2] == false)
            {
                n.span_loc[elements[i].className][2] = true;
                const text_style = window.getComputedStyle(elements[i]);
                const text_x = parseInt(text_style.left.replace('px', ''));
                const text_y = parseInt(text_style.top.replace('px', ''));
                const origin_x = parseInt(n.span_loc[elements[i].className][0].replace('px', ''));
                const origin_y = parseInt(n.span_loc[elements[i].className][1].replace('px', ''));
                word_animation(n, elements[i], text_x, text_y, origin_x, origin_y, word_return_speed);
            };
        };
    });   
});


// 떠다니는 구름 속성 배열
var float_list = ['float1', 'float2', 'float3', 'float4', 'float5', 'float6', 'float7'];

// 색깔 배열
var span_color = ["rgba(225, 146, 183, 0.9)", "rgba(156, 140, 216, 0.9)"];

function create_cloud(cloud, cloud_data)
{
    let div = document.createElement('div');
    div.className = "cloud_inside";

    //div.style.backgroundColor = 'rgb(123, 123, 123)';
    cloud.e.appendChild(div);


    // 문자열을 추가할 자식 요소 생성
    for (let i = 0; i < cloud_data.length; i++)
    {
        let span = document.createElement('span');
        span.innerHTML = cloud_data[i];
        span.className = `span${i}`;

        span.style.animation = '';

        span.style.fontSize = `${randFloat(0.8, 1.9)}vw`;
        span.style.color = span_color[randNUM(0, span_color.length - 1)];
        span.style.textShadow = '0px 0px 1px rgba(25, 25, 25, 0.5)';

        span.style.whiteSpace = 'nowrap';
        span.style.fontWeight = 'bold';
        span.style.borderRadius = '3px';

        div.appendChild(span);
    }

    const get_location = window.getComputedStyle(div);

    let cloud_inside = cloud.e.querySelector('.cloud_inside');
    const get_cloud_inside = window.getComputedStyle(cloud_inside);
    const get_cloud = window.getComputedStyle(cloud.e);

    // 구름과 안쪽 구름의 차이만큼 상대위치 설정
    const move_w = Math.abs(parseInt(get_cloud_inside.width.replace('px', '')) - parseInt(get_cloud.width.replace('px', ''))) / 8;
    const move_h = Math.abs(parseInt(get_cloud_inside.height.replace('px', '')) - parseInt(get_cloud.height.replace('px', ''))) / 4;

    let spans = cloud.e.querySelector('.cloud_inside').getElementsByTagName('span');

    let search_empty_count = 50;
    for (let i = 0; i < spans.length; i++)
    {
        let span = spans[i];
        let ran_x = randNUM(0, parseInt(get_location.width.replace('px', '')));
        let ran_y = randNUM(0, parseInt(get_location.height.replace('px', '')));
        span.style.position = 'absolute';
        span.style.left = `${ran_x + move_w}px`;
        span.style.top = `${ran_y + move_h}px`;
        if (isOverlap(span, cloud.e.querySelectorAll('span'), 1))
        {
            i--;
            search_empty_count--;
            if (search_empty_count <= 0)
            {
                console.log("구름 영역 확장됨");
                div.style.width = `${parseInt(get_location.width.replace('px', '')) + 6}px`;
                div.style.height = `${parseInt(get_location.height.replace('px', '')) + 4}px`;
                search_empty_count += 50;
            }
            continue;
        }
        else
        {
            const span_style = window.getComputedStyle(span);
            cloud.span_loc[span.className] = [span_style.left, span_style.top, false];
        }
        //const span_style = window.getComputedStyle(span);
    }
}

function return_to_cloud(cloud)
{
    let elements = cloud.e.getElementsByTagName("span");
    for (let i = 0; i < elements.length; i++)
    {
        if (cloud.span_loc[elements[i].className][2] == false)
        {
            cloud.span_loc[elements[i].className][2] = true;
            const text_style = window.getComputedStyle(elements[i]);
            const text_x = parseInt(text_style.left.replace('px', ''));
            const text_y = parseInt(text_style.top.replace('px', ''));
            const origin_x = parseInt(cloud.span_loc[elements[i].className][0].replace('px', ''));
            const origin_y = parseInt(cloud.span_loc[elements[i].className][1].replace('px', ''));
            word_animation(cloud, elements[i], text_x, text_y, origin_x, origin_y, word_return_speed);
        }
    }
}

function escape_from_mouse(event, cloud, distance)
{
    const distance_limit = distance;

    const viewport = cloud.e.getBoundingClientRect();
    let get_mouseX = event.clientX;
    let get_mouseY = event.clientY;

    const mouseX = get_mouseX - viewport.left;
    const mouseY = get_mouseY - viewport.top;

    let elements = cloud.e.getElementsByTagName("span");
    for (let i = 0; i < elements.length; i++)
    {
        const text_style = window.getComputedStyle(elements[i]);
        const text_x = parseInt(text_style.left.replace('px', ''));
        const text_y = parseInt(text_style.top.replace('px', ''));

        const below = text_x - mouseX;
        const high = text_y - mouseY;
        const distance = Math.sqrt((below)**2 + (high)**2);

        if (distance < distance_limit)
        {
            const g1_x = mouseX + distance_limit*(below/distance);
            const g1_y = mouseY + distance_limit*(high/distance);
            
            const g2_x = mouseX - distance_limit*(below/distance);
            const g2_y = mouseY - distance_limit*(high/distance);

            const distance_g1 = Math.sqrt(Math.abs(g1_x - text_x)**2 + Math.abs(g1_y - text_y)**2);
            const distance_g2 = Math.sqrt(Math.abs(g2_x - text_x)**2 + Math.abs(g2_y - text_y)**2);

            if (distance_g1 > distance_g2)
            {  
                // 가까운 좌표2로 이동
                if (cloud.span_loc[elements[i].className][2] == false)
                {
                    cloud.span_loc[elements[i].className][2] = true;
                    //console.log('가까운 좌표2로 가기');
                    word_animation(cloud, elements[i], text_x, text_y, g2_x, g2_y, word_escape_speed);
                }
                //elements[i].style.left = `${g2_x}px`; 
                //elements[i].style.top = `${g2_y}px`;
            }
            else if (distance_g1 < distance_g2)
            {
                // 가까운 좌표1로 이동
                if (cloud.span_loc[elements[i].className][2] == false)
                {
                    cloud.span_loc[elements[i].className][2] = true;
                    //console.log('가까운 좌표1로 가기');
                    word_animation(cloud, elements[i], text_x, text_y, g1_x, g1_y, word_escape_speed);
                }
                // elements[i].style.left = `${g1_x}px`; 
                // elements[i].style.top = `${g1_y}px`;
            }
        }
        else if (distance > distance_limit)
        {
            // 원래 좌표로
            //elements[i].style.left = cloud_el.span_loc[elements[i].className][0];
            //elements[i].style.top = cloud_el.span_loc[elements[i].className][1];
            if (cloud.span_loc[elements[i].className][2] == false)
            {
                cloud.span_loc[elements[i].className][2] = true;
                const origin_x = parseInt(cloud.span_loc[elements[i].className][0].replace('px', ''));
                const origin_y = parseInt(cloud.span_loc[elements[i].className][1].replace('px', ''));
                //console.log('원래 좌표로 가기');
                //console.log(elements[i].innerText, text_x, text_y, origin_x, origin_y);
                word_animation(cloud, elements[i], text_x, text_y, origin_x, origin_y, word_return_speed);
            }
        }
    }
}

function word_animation(parent, child_word, start_x, start_y, end_x, end_y, time) 
{
    let reverse_x = 1;
    let reverse_y = 1;
    if (start_x > end_x)
    {
        reverse_x = -1;
    }
    if (start_y > end_y)
    {
        reverse_y = -1;
    }

    let slope111 = 1;
    const rate111 = 1;

    if (Math.abs(start_x - end_x) > 0)
    {
        //console.log("for문 진입1");
        slope111 = (Math.abs(start_y - end_y)) / (Math.abs(start_x - end_x));
        for (let i = 0; i < Math.abs(start_x - end_x); i += 0.1)
        {
            setTimeout(() =>
            {   
                //start.style.left = `${start_left + (i*rate)*reverse_x}px`;
                //start.style.top = `${start_top - ((i*rate)*slope)*reverse_y}px`;

                child_word.style.left = `${start_x + (i*rate111)*reverse_x}px`;
                child_word.style.top = `${start_y + (i*rate111)*slope111*reverse_y}px`;

                if (i >= Math.abs(start_x - end_x) - 0.1)
                {
                    //console.log("for문1 종료");
                    parent.span_loc[child_word.className][2] = false;
                }
            }, Math.sqrt(i*time));
            //Math.sqrt(i*time).toFixed(4)
        }
    }
    else
    {
        //console.log("for문 진입2");
        if (Math.abs(start_y - end_y) == 0)
        {
            parent.span_loc[child_word.className][2] = false;
        }
        else
        {
            for (let j = 0; j < Math.abs(start_y - end_y); j += 0.1)
            {
                setTimeout(() =>
                {   
                    child_word.style.left = `${start_x}px`;
                    child_word.style.top = `${start_y + (j*rate111)*reverse_y}px`;
    
                    if (j >= Math.abs(start_y - end_y) - 0.1)
                    {
                        //console.log("for문2 종료");
                        parent.span_loc[child_word.className][2] = false;
                    }
                }, Math.sqrt(j*time));
            }
        }
    }
}

function cloud_show_smooth(el, padding, rate)
{
    el.style.display = 'flex';
    el.style.opacity = '0';
    // const get_inside = el.querySelector('.cloud_inside');
    // const get_inside_word = get_inside.getElementsByTagName('span');
    // get_inside_word.forEach((n) =>
    // {
    //     let get_top = parseInt(window.getComputedStyle(n).top.replace('px', ''));
    //     n.top = `${get_top + padding}px`;
    // });
    //const get_inside_style = window.getComputedStyle(get_inside);
    //get_inside.style.top = `${padding}px`;
    for (let i = 0.01; i <= 1.00; i += 0.01)
    {
        setTimeout(() =>
        {
            el.style.opacity = i;
            //get_inside.style.top = `${padding - i*padding}px`;
        }, Math.sqrt(i*5000*rate));
    }
}

function delete_cloud()
{
    let childcloud = cloud_sky.querySelectorAll('.cloud');
    childcloud.forEach((n) =>
    {
        cloud_sky.removeChild(n);
    });
}
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 구름띄우기 end