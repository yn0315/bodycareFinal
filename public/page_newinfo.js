


window.addEventListener('load', function ()
{
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
    // let sum_height = 0;
    // let bottom_margin = 0;
    // let icons = document.querySelectorAll("#icon_bar .icon");
    // icons.forEach((n) =>
    // {
    //     sum_height += parseInt(window.getComputedStyle(n).height.replace('px', ''));
    //     sum_height += parseInt(window.getComputedStyle(n).marginTop.replace('px', ''));
    //     bottom_margin = parseInt(window.getComputedStyle(n).marginTop.replace('px', ''));
    // });
    // console.log(sum_height + bottom_margin);
    // geticonbar.style.height = `${sum_height + bottom_margin}px`;
    // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바

    // 배경 웨이브 시작
    new create_wave();

});
let info_name = document.getElementById("info_name");

var socket = io();
socket.emit("new_info_page", "등록페이지 진입");
socket.emit("new_name_req", "등록하는이름 요청");
socket.on("new_name_res", function(res_data)
{
    console.log(res_data);
    if(res_data == "")
    {
        console.log("빈이름이 도착함");
    }
    info_name.innerText = res_data;
});

socket.on("new_input_res", function(data)
{
    if(data == 'success_input')
    {
        location.href = "http://192.168.0.47:3300/shoot";
    }
    else if(data == 'fail_input')
    {
        console.log("등록 실패");
        fail_return_number_check();
    }
});


function fail_return_number_check()
{
    event_back();
    backstep_animation(progress_bar, border_con, icon_con, progress_location[5], progress_location[4]);
    info_con.innerText = '';
    change_text(info_text, '연락처를 확인해주세요.');
    info_input.placeholder = '- 없이 8자리';
    info_input.maxLength = 8;
}



// 맨 위로 버튼
const btnTop = document.getElementById("btn_top");

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
window.addEventListener("scroll", hide_top_btn);
function hide_top_btn ()
{
    const currentScrollPosition = window.pageYOffset;
    if (currentScrollPosition > 50)
    {
        btnTop.style.display = "block";
    }
    else
    {
        btnTop.style.display = "none";
    }
}

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
        // 192.168.0.47
        console.log("차트 보기로");
        socket.emit("left_bar_click", "chart");

        location.href = "http://192.168.0.47:3300/page_search";
    }
    else if(icon_text.item(0).parentElement.id == "icon2")
    {
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

// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 맨 위로 버튼
btnTop.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
btnTop.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});

btnTop.addEventListener("click", function ()
{
    //const windowHeight = window.innerHeight;
    const scrollStep = 2;
    const currentPosition = window.pageYOffset;
    //window.scroll(0, 0);
    
    /*
    // smooth 속성을 이용해서 부드럽게 스크롤되게 하기
    window.scrollTo(
    {
        top : 0,
        behavior : "smooth"
    }
    );
    */

    // setTimeout() : 일정시간 이후 지정된 함수를 실행.
    // 코드상 대기시간을 조절하여 함수가 거의 동시에 실행될 수 있다.
    
    // html은 setTimeout 호출이 5번 이상 중첩되면 최소 반응시간을 4ms로 제한한다

    if (currentPosition > 0)
    {
        for (let i = currentPosition; i > 0; i -= scrollStep)
        {
            setTimeout(() => {
                window.scrollTo(0, i);

              }, (0.12) * (currentPosition - i));
            // for문으로 setTimeout을 이용해 각 시간마다 스크롤 위치가 변경되도록 함수를 격발 대기시킨다
        }
    }
});



// 임의 범위 내의 정수 1개 반환
function randNUM(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 각 요소가 겹치는지 확인하는 함수
function isOverlap(child, siblings)
{
    for (let i = 0; i < siblings.length; i++)
    {
        let sibling = siblings[i];
        if (child !== sibling)
        {
            let rect1 = child.getBoundingClientRect();
            let rect2 = sibling.getBoundingClientRect();
            if (rect1.right > rect2.left && rect1.left < rect2.right && rect1.bottom > rect2.top && rect1.top < rect2.bottom) {
                return true;
            }
        }
    }
    return false;
}



// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 배경 웨이브

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
        this.ctx.scale(1, 0.4);

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
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 배경 웨이브

const info_input = document.getElementById('info_input');
const warn_message = document.getElementById('warn_message');
info_input.focus();
info_input.addEventListener('keydown', function(e)
{
    // step1 성별 입력
    if (step == 1)
    {
        const value = e.target.value;
        const newValue = value.replace(/[^ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
        if (value.length == newValue.length)
        {
            warn_message.style.display = 'none';
        }
        else
        {
            console.log('키입력 막기1');
            warn_display('한글을 입력해주세요.');
            e.target.value = newValue;
        }
    }
    // step2 나이, step3 신장, step4 체중, step5 연락처
    else if (step == 2 || step == 3 || step == 4 || step == 5)
    {
        const value = e.target.value;
        const newValue = value.replace(/[^0-9]/g, ''); // 숫자 아닌 것 삭제
        if (value.length == newValue.length)
        {
            warn_message.style.display = 'none';
        }
        else
        {
            console.log('키입력 막기2');
            warn_display('숫자를 입력해주세요.');
            e.target.value = newValue;
        }
    }
});

let info_data =
{
    name : '',
    gen : '',
    age : '',
    hei : '',
    wei : '',
    con : ''
};

let play_once = false;
let step = 1;
const progress_location = [0, 9.4, 28.4, 46.2, 64.5, 84];

//          번호, 이름, 나이, 성별, 키, 몸무게
window.addEventListener('keyup', function(event)
{
    if (event.key === 'Enter' && info_input.value)
    {
        const text = info_input.value;
        if (play_once == false)
        {
            play_once = true;
            // step1 성별
            if (step == 1)
            {
                if(text.includes('남') || text.includes('여'))
                {                
                    step_animation(progress_bar, border_gen, icon_gen, progress_location[0], progress_location[1]);
                    info_input.value = '';
                    info_gen.innerText = text;
                    change_text(info_text, '나이를 입력해주세요.');
                    info_input.placeholder = '나이(세)';
                    info_input.maxLength = 2;
                }
                else
                {
                    warn_display('남자 혹은 여자로 성별에 맞게 입력해주세요.');
                    play_once = false;
                    info_input.value = '';
                }
                
            }
            // step2 나이
            else if (step == 2)
            {
                
               
                // age_dict['age'] = info_input.value;
                step_animation(progress_bar, border_age, icon_age, progress_location[1], progress_location[2]);
                info_input.value = '';
                info_age.innerText = `${text}세`;
                change_text(info_text, '키(신장)을 입력해주세요.');
    
                info_input.placeholder = 'cm';
                info_input.maxLength = 3;
                
            }
            // step3 신장
            else if (step == 3)
            {   
                let hei = Number(text);

                if (text.length == 3 && hei <= 250)
                {
                    // hei_dict['hei'] = info_input.value;
                    step_animation(progress_bar, border_hei, icon_hei, progress_location[2], progress_location[3]);
                    info_input.value = '';
                    info_hei.innerText = `${text}cm`;
                    change_text(info_text, '체중을 입력해주세요.');
                    info_input.placeholder = 'kg';
                    info_input.maxLength = 3;
                }
                else
                {
                    console.log('신장 자리수 부족');
                    warn_display('신장 자리수에 맞게 입력해주세요.');
                    play_once = false;
                    info_input.value = '';

                }
            }
            // step4 체중
            else if (step == 4)
            {
                let wei = Number(text);

                if (text.length == 2 || text.length == 3)
                {
                    if(wei < 220)
                    {
// wei_dict['wei'] = info_input.value;
                        step_animation(progress_bar, border_wei, icon_wei, progress_location[3], progress_location[4]);
                        info_input.value = '';
                        info_wei.innerText = `${text}kg`;
                        change_text(info_text, '연락처를 입력해주세요.');
                        info_input.placeholder = '- 없이 8자리';
                        info_input.maxLength = 8;
                    }
                    else
                    {
                        warn_display('체중을 다시 확인해 주세요');
                        play_once = false;
                        info_input.value = '';
                    }
                    
                }
                else
                {
                    console.log('체중 자리수 부족');
                    warn_display('체중 자리수에 맞게 입력해주세요.');
                    play_once = false;
                }
            }
            // step5 연락처
            else if (step == 5)
            {
                if (text.length == 8)
                {
                    // tel_dict['tel'] = info_age
                    info_input.value = '';
                    step_animation(progress_bar, border_con, icon_con, progress_location[4], progress_location[5]);
                    info_con.innerText = text;
                    change_text(info_text, '입력이 완료되었습니다.');
                    info_input.placeholder = '';
                    input_result_event();
                    // this.document.getElementById("info_input_frame").style.display = "none";
                }
                else 
                {
                    console.log('연락처 자리수 부족');
                    warn_display('연락처 자리수는 8자리입니다.');
                    play_once = false;
                }
            }
        }
    }
    else if(step ==6 && event.key == 'Enter')
    {
        console.log("다음으로 이동 가능");
        // console.log(info_con.innerText)
        // console.log(info_name.innerText)
        // console.log(info_age.innerText)
        // console.log(info_gen.innerText)
        // console.log(info_hei.innerText)
        // console.log(info_wei.innerText);

        info_data.name = info_name.innerText;
        info_data.con = info_con.innerText;
        info_data.age = info_age.innerText.replace("세", "");
        info_data.gen = info_gen.innerText;
        info_data.hei = info_hei.innerText;
        info_data.wei = info_wei.innerText;

        socket.emit("new_input_req", info_data);
    }
    else if (event.key === 'Escape')
    {      
        if (play_once == false)
        {  
            play_once = true;
            info_input.value = '';
            if (step == 2)
            {
                backstep_animation(progress_bar, border_gen, icon_gen, progress_location[1], progress_location[0]);
                info_gen.innerText = '';
                change_text(info_text, '성별을 입력해주세요.');
    
                info_input.placeholder = '성별 입력';
                info_input.maxLength = 2;
            }
            else if (step == 3)
            {
                backstep_animation(progress_bar, border_age, icon_age, progress_location[2], progress_location[1]);
                info_age.innerText = '';
                change_text(info_text, '나이를 입력해주세요.');

                info_input.placeholder = '나이(세)';
                info_input.maxLength = 2;
            }
            else if (step == 4)
            {
                backstep_animation(progress_bar, border_hei, icon_hei, progress_location[3], progress_location[2]);
                info_hei.innerText = '';
                change_text(info_text, '키(신장)을 입력해주세요.');

                info_input.placeholder = 'cm';
                info_input.maxLength = 3;
            }
            else if (step == 5)
            {
                backstep_animation(progress_bar, border_wei, icon_wei, progress_location[4], progress_location[3]);
                info_wei.innerText = '';
                change_text(info_text, '체중을 입력해주세요.');

                info_input.placeholder = 'kg';
                info_input.maxLength = 3;
            }
            else if (step == 6)
            {
                event_back();

                backstep_animation(progress_bar, border_con, icon_con, progress_location[5], progress_location[4]);
                info_con.innerText = '';
                change_text(info_text, '연락처를 입력해주세요.');

                info_input.placeholder = '- 없이 8자리';
                info_input.maxLength = 8;
            }
            else if (step == 1)
            {
                console.log('신규정보입력 취소');
                play_once = false;
            }
        }
    }
});




var underline;

function input_result_event()
{
                        // this.document.getElementById("info_input_frame").style.display = "none";

    let input_frame = document.getElementById("info_input_frame"); // 입력창
    let info_display = document.getElementById("info_display_frame"); // 이름, 정보
    let info_progress = document.getElementById("info_progress_frame"); // 진행바
    let info_text = document.getElementById("info_text") // 제목? 
    let info_space = document.getElementById("info_space"); 
    let info_name = document.getElementById("info_name"); //이름
    let count = 0;
    let spd = 2;
    let c = 100;

    underline = document.createElement("div");

    underline.style.position = "absolute";
    underline.style.width = "0px";
    underline.style.height = "0px";
    underline.style.background = "#d66095";
    underline.style.borderRadius = "50%";
    underline.style.marginTop = "-19%";
    info_space.appendChild(underline);


    // underline.style.width = "75px;"
    underline.style.height = "5px";

    console.log(info_name.style.fontSize);
    setTimeout(function confirm()
    {
        input_frame.style.opacity = (1-(1/c)*count*2);
        info_text.style.top = `${(count*2)-91}px`;
        info_text.style.opacity = (1-(1/c)*count*2);
        info_space.style.marginTop = `-${(7/c)*count}vh`;
        info_name.style.fontSize = `${50+(count/2)}px`;
        info_name.style.marginTop = `-${(5/c)*count}vh`;

        underline.style.width = `${(260/c)*count}px`;

        count ++;
        if(count > c)
        {
            underline.style.animation = "text_blink 2s infinite";
            // info_name.style.animation = "text_blink 2s infinite";
            
            return;
        }
        setTimeout(confirm, spd);
    }, 1500)

    
    let blink_count = 0;
}

//            document.getElementById('section').removeChild(ani_canvas);

function event_back()
{
    let input_frame = document.getElementById("info_input_frame"); // 입력창
    let info_display = document.getElementById("info_display_frame"); // 이름, 정보
    let info_progress = document.getElementById("info_progress_frame"); // 진행바
    let info_text = document.getElementById("info_text") // 제목? 
    let info_space = document.getElementById("info_space"); 
    let info_name = document.getElementById("info_name"); //이름

    let count = 0;
    let spd = 2;
    let c = 100;
    
    // 260 - 100x = 0
    // 260 / 100

    underline.style.animation = "";
    setTimeout(function confirm()
    {
        input_frame.style.opacity = (1/c)*count*2;
        info_text.style.top = `${111-(count*2)}px`;
        info_text.style.opacity = (1/c)*count*2;
        info_space.style.marginTop = `${count*(7/count)-7}vh`;
        info_name.style.fontSize = `${100-(count*(0.5))}px`;
        info_name.style.marginTop = `${count*(5/count)-5}vh`;
        underline.style.width = `${260 - (count*(2.6))}px`;
        

        count ++;
        if(count > c)
        {
            try
            {
                info_space.removeChild(underline);
            }
            catch
            {

            }
            // info_name.style.animation = "text_blink 2s infinite";
            return;
        }
        setTimeout(confirm, spd);
    }, )








}





const info_text = document.getElementById('info_text');

const progress_bar = document.getElementById('progress_line_show');



//new_input_name

const info_gen = document.getElementById('info_gen');
const info_age = document.getElementById('info_age');
const info_hei = document.getElementById('info_hei');
const info_wei = document.getElementById('info_wei');
const info_con = document.getElementById('info_con');

const icon_gen = document.getElementById('icon_square_gen');
const icon_age = document.getElementById('icon_square_age');
const icon_hei = document.getElementById('icon_square_hei');
const icon_wei = document.getElementById('icon_square_wei');
const icon_con = document.getElementById('icon_square_con');

const border_gen = document.getElementById('border_gen');
const border_age = document.getElementById('border_age');
const border_hei = document.getElementById('border_hei');
const border_wei = document.getElementById('border_wei');
const border_con = document.getElementById('border_con');

function step_animation(line, circle, icon, start, end)
{
    step++;
    for (let i = 1; i <= 100; i++)
    {
        setTimeout(() =>
        {
            line.style.width = `${start + i*(end - start)/100}%`;

            if (i >= 99)
            {
                for (let j = 1; j <= 100; j++)
                {
                    setTimeout(() =>
                    {
                        icon.style.maxWidth = `${j*70/100}px`;
                        circle.style.maxWidth = `${j*70/100}px`;
                        if (j >= 100)
                        {
                            play_once = false;
                        }   
                    }, (j/4)**1.6);
                }
            }
        }, Math.sqrt(i*2500));
    }
}

function backstep_animation(line, circle, icon, start, end)
{
    step--;
    for (let m = 1; m <= 100; m++)
    {
        setTimeout(() =>
        {
            circle.style.maxWidth = `${70 - m*70/100}px`;
            icon.style.maxWidth = `${70 - m*70/100}px`;
            if (m >= 99)
            {
                for (let n = 1; n <= 100; n++)
                {
                    setTimeout(() =>
                    {
                        line.style.width = `${start - n*(start - end)/100}%`;
                        if (n >= 100)
                        {
                            play_once = false;
                        }
                    }, (n/4)**1.6);
                }
            }
        }, Math.sqrt(m*2500));
    }
}

function change_text(target, text)
{
    for (let m = 1; m <= 100; m++)
    {
        setTimeout(() =>
        {
            let target_top = parseInt(window.getComputedStyle(target).top.replace('px', ''));
            if (m < 50)
            {
                target.style.top = `${target_top - 1}px`;
                target.style.opacity = `${1 - m/50}`;
            }
            else if (m == 50)
            {
                target.innerText = text;
            }
            else if (m > 50)
            {
                target.style.top = `${target_top + 1}px`;
                target.style.opacity = `${m/50 - 1}`;
            }
        }, Math.sqrt(m*7500));
    }
}

function warn_display(message)
{
    warn_message.style.display = 'flex';
    warn_message.querySelector('.warn_text').innerText = message;
}