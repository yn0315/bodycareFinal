var socket = io();
var human_info;
var next_p;

socket.emit('next_show_req', "다음화면 요청");
socket.emit("page_record", "page_record진입");
socket.emit("person_info_req", "선택했던 사람 정보 요청");
socket.emit('person_log_data_req', "선택했던 사람의 기록 보유 정보 요청");

socket.on('person_info_res', function(data)
{
    test_person = data;
    human_info = data
    set_person_info(data);
});

socket.on('person_log_data_res', function(data)
{
    test_record = data;
    create_record_list(data);
    set_keyboard_event();
});

socket.on('next_show_res', function(data)
{
    console.log("넘겨줄페이지" + data);
    if(data == 'chart')
    {
        next_p = data;
        let space_total = document.getElementById('space_total');
        let person_info = space_total.querySelectorAll('.space_info');
        person_info.forEach(function(div)
        {
            div.style.opacity = 0;
            
        });
    }
    else if(data =='log')
    {
        next_p = data;
        let space_total = document.getElementById('space_total');
        let person_info = space_total.querySelectorAll('.space_info');
        person_info.forEach(function(div)
        {
            div.style.opacity = 1;
            
        });
    }
})

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
    // 첫 로드시 기록 리스트 추가 및 이벤트 설정
    // set_person_info(test_person);
    // create_record_list(test_record);
    // set_keyboard_event();
    // 배경 웨이브 시작
    new create_wave();
});

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

// 임의 범위 내의 정수 1개 반환
function randNUM(min, max)
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 현재 요소가 viewport 밖에 있을 경우 그 요소로 스크롤
function move_scroll(element)
{
    let rect = element.getBoundingClientRect();
    if (rect.bottom > viewportHeight || rect.top < 0)
    {
        // 스크롤을 요소의 위치로 조정
        window.scrollTo({top: rect.top + window.pageYOffset, behavior : "smooth"});
    }
}


// 기록 리스트
const parent_record = document.getElementById('space_record_list');


// 상세 기록 보기
const record_data_title = document.getElementById('record_title');
const record_data = document.getElementById('space_record_data');

const slide_left = document.getElementById('slide_left');
const slide_right = document.getElementById('slide_right');


slide_left.addEventListener('mouseover', function() {document.body.style.cursor = 'pointer';});
slide_left.addEventListener('mouseout', function() {document.body.style.cursor = 'auto';});
slide_left.addEventListener('click', function(){
    if (flip_status == false)
    {
        flip_canvas('left');
        console.log('왼쪽으로 돌리기');
    }
});

slide_right.addEventListener('mouseover', function() {document.body.style.cursor = 'pointer';});
slide_right.addEventListener('mouseout', function() {document.body.style.cursor = 'auto';});
slide_right.addEventListener('click', function(){
    if (flip_status == false)
    {
        flip_canvas('right');
        console.log('오른쪽으로 돌리기');
    }
});

const slide_1 = document.getElementById('slide_1');
const slide_2 = document.getElementById('slide_2');
const slide_3 = document.getElementById('slide_3');
const title_canny = document.getElementById('title_canny');

let flip_switch = 1;
let flip_status = false;
let flip_step = 0;
let flip_step_name = ['정면', '우측', '좌측', '후면'];

function flip_canvas(direction)
{
    flip_status = true;
    if (direction == 'left')
    { 
        flip_step--;
        if (flip_step == -1){flip_step = flip_step_name.length - 1;}
        slide_1.className = 'flip';
        setTimeout(() =>{
            slide_2.className = 'flip';
        }, 120);
        setTimeout(() =>{
            slide_3.className = 'flip';
        }, 240);

        setTimeout(() =>{
            set_canvas(flip_step_name[flip_step]);
            slide_1.className = 'flip_return';
        }, 740);
        setTimeout(() =>{
            slide_2.className = 'flip_return';
        }, 860);
        setTimeout(() =>{
            slide_3.className = 'flip_return';  
            setTimeout(() =>{
                flip_status = false;
            }, 400);
        }, 940);
    }
    else if (direction == 'right')
    {
        flip_step++;
        if (flip_step == flip_step_name.length){flip_step = 0;}
        slide_3.className = 'flip';
        setTimeout(() =>{
            slide_2.className = 'flip';
        }, 120);
        setTimeout(() =>{
            slide_1.className = 'flip';
        }, 240);

        setTimeout(() =>{
            set_canvas(flip_step_name[flip_step]);
            slide_3.className = 'flip_return';
        }, 740);
        setTimeout(() =>{
            slide_2.className = 'flip_return';
        }, 860);
        setTimeout(() =>{
            slide_1.className = 'flip_return';  
            setTimeout(() =>{
                flip_status = false;
            }, 400);
        }, 940);
    }
}


function set_canvas(step)
{
    title_canny.innerText = flip_step_name[flip_step];
    let photo1 = slide_1.querySelector('.canvas_photo');
    let photo2 = slide_2.querySelector('.canvas_photo');
    let photo3 = slide_3.querySelector('.canvas_photo');
    if (step == '정면')
    {
        // 캔버스에 정면 가공 사진 부여하는 부분
        photo1.style.background = 'rgba(107, 83, 196, 0.868)';
        photo2.style.background = 'rgba(107, 83, 196, 0.868)';
        photo3.style.background = 'rgba(107, 83, 196, 0.868)';
    }
    else if (step == '우측')
    {    
        // 캔버스에 우측 가공 사진 부여하는 부분
        photo1.style.background = 'rgba(231, 60, 126, 0.845)';
        photo2.style.background = 'rgba(231, 60, 126, 0.845)';
        photo3.style.background = 'rgba(231, 60, 126, 0.845)';
    }
    else if (step == '좌측')
    {
        // 캔버스에 좌측 가공 사진 부여하는 부분
        photo1.style.background = 'rgba(186, 186, 186, 0.9)';
        photo2.style.background = 'rgba(186, 186, 186, 0.9)';
        photo3.style.background = 'rgba(186, 186, 186, 0.9)';
    }
    else if (step == '후면')
    {
        // 캔버스에 후면 가공 사진 부여하는 부분
        photo1.style.background = 'rgba(137, 89, 182, 0.874)';
        photo2.style.background = 'rgba(137, 89, 182, 0.874)';
        photo3.style.background = 'rgba(137, 89, 182, 0.874)';
    }
    info_can_draw_direction(step);
    
}



// 정면 실측정 데이터 부여할 요소
const data_front = document.getElementById('data_front');

// 측면 실측정 데이터 부여할 요소
const data_side = document.getElementById('data_side');

// 상위% 데이터 부여할 요소
const data_ratio = document.getElementById('data_ratio');

// 신체부위별 가공 데이터 부여할 요소
const data_parts = document.getElementById('parts_indicator');

// 촬영 원본 사진, 방향별 가공 사진 부여할 요소
const data_img = document.getElementById('data_img');


let viewportHeight = window.innerHeight;
window.addEventListener('resize', function() {viewportHeight = window.innerHeight;});

let mouse_event = false;
let key_event = false;
let key_index_current = 0;

let keydown_status = false;
let keydown_maintenance = false;
let keydown_repeat = false;
let keydown_maintenance_timer;

let next_frame = false;


function set_keyboard_event()
{
    const record_list = document.querySelectorAll('#space_record_list .record');
    record_list.forEach((n) => {
        set_mouse_event(n);
    });
    window.addEventListener("keyup", function(event)
    {
        if (next_frame == false)
        {
            if (keydown_status == true || keydown_maintenance == true)
            {
                keydown_status = false;
                keydown_maintenance = false;
                clearTimeout(keydown_maintenance_timer);
                if (keydown_repeat == true)
                {
                    console.log('keydown 유지 종료');
                    keydown_repeat = false;
                }
            }
        }
    });
    window.addEventListener("keydown", function(event)
    {
        const e = event.key;
        if (next_frame == false)
        {
            if (e == "ArrowUp" || e == "ArrowDown" || e == "ArrowLeft" || e == "ArrowRight")
            {
                if (keydown_maintenance == false)
                {
                    keydown_maintenance = true;
                    keydown_maintenance_timer = setTimeout(() =>
                    {
                        console.log('keydown 유지');
                        keydown_repeat = true;
                    }, 400);
                }
                event.preventDefault();
            }
            if (keydown_status == false || keydown_repeat == true)
            {
                keydown_status = true;
                let get_childs = record_list;
                if(e == 38 || e == "ArrowUp")
                {
                    event.preventDefault();
                    if (mouse_event == false && key_event == false)
                    {
                        key_event = true;
                        key_index_current = 0;
                        get_childs[key_index_current].className = 'record_over';
                    }
                    else if (mouse_event == false && key_event == true)
                    {
                        get_childs[key_index_current].className = 'record';
                        if (key_index_current == 0)
                        {
                            key_index_current = get_childs.length - 1;
                        }
                        else
                        {
                            key_index_current--;
                        }
                        get_childs[key_index_current].className = 'record_over';       
                        move_scroll(get_childs[key_index_current]);
                    }
                }
                else if(e == 40 || e == "ArrowDown")
                {
                    event.preventDefault();
                    if (mouse_event == false && key_event == false)
                    {
                        key_event = true;
                        key_index_current = 0;
                        get_childs[key_index_current].className = 'record_over';
                        move_scroll(get_childs[key_index_current]);
                    }
                    else if (mouse_event == false && key_event == true)
                    {
                        get_childs[key_index_current].className = 'record';
                        if (key_index_current == get_childs.length - 1)
                        {
                            key_index_current = 0;
                        }
                        else
                        {
                            key_index_current++;
                        }
                        get_childs[key_index_current].className = 'record_over';
                        move_scroll(get_childs[key_index_current]);
                    }
                }
                else if (e == "Enter")
                {
                    if (key_event == true)
                    {
                        if(next_p == 'chart')
                        {
                            socket.emit('chart_log_req', get_childs[key_index_current].innerText);
                            location.href = 'http://192.168.0.47:3300/page_chart';
                        }
                        else if(next_p == 'log')
                        {
                            socket.emit('detail_log_req', get_childs[key_index_current].innerText);
                        }
                        transform_frame(get_childs[key_index_current].innerText);    
                    }
                }
            }
        }
        else if (next_frame == true)
        {
            if(e == "Escape")
            {
                record_list.forEach((n) =>
                {
                    n.classList.remove('sideoutR');
                    n.classList.remove('sideoutL');                    
                });
                // key_event = false;
                next_frame = false;
                reset_data();
                record_data.style.display = 'none';
                record_data_title.innerText = '';
                parent_record.style.display = 'flex';
                console.log('기록 리스트로');  
            }
        }
    });
}

function set_mouse_event(element)
{
    const record_list = document.querySelectorAll('#space_record_list .record');
    element.addEventListener('mouseover', function()
    {
        if (next_frame == false)
        {
            let get_childs = record_list;
            if (key_event == true)
            {
                for (let i = 0; i < get_childs.length; i++)
                {
                    if (get_childs[i].className == 'record_over')
                    {
                        get_childs[i].className = 'record';
                    }
                }
                key_event = false;
            }
            mouse_event = true;
            document.body.style.cursor = "pointer";
            element.className = 'record_over';
        }
    });
    element.addEventListener('mouseout', function()
    {   
        if (next_frame == false)
        {
            if (mouse_event == true)
            {
                mouse_event = false;
            }
            document.body.style.cursor = "auto";
            element.className = 'record';
        }
    });
    element.addEventListener('click', function()
    {   
        if (next_frame == false)
        {
            let get_index = Array.prototype.indexOf.call(parent_record.children, element);
            key_index_current = get_index;
            if(next_p == 'chart')
            {        
                socket.emit('chart_log_req', element.innerText);
                location.href = 'http://192.168.0.47:3300/page_chart';
            }
            else if(next_p == 'log')
            {
                socket.emit('detail_log_req', element.innerText);
            }
            transform_frame(element.innerText);
        }
    });
}
// import { Buffer } from 'buffer'
// import {Buffer} from 'buffer';

const normal_imgs = document.getElementById('normal_imgs').querySelectorAll('.canvas_photo');
const f_can = document.getElementById('f_can');
const l_can = document.getElementById('l_can');
const r_can = document.getElementById('r_can');
const b_can = document.getElementById('b_can');
const fcon = f_can.getContext('2d');
const lcon = l_can.getContext('2d');
const rcon = r_can.getContext('2d');
const bcon = b_can.getContext('2d');

const info_can_none = document.getElementById('info_can_none');
const info_can_can = document.getElementById('info_can_can');
const info_can_con = document.getElementById('info_can_con');
const n_con = info_can_none.getContext('2d');
const a_con = info_can_can.getContext('2d');
const c_con = info_can_con.getContext('2d');



function  draw_canvas_img(data)
{
    console.log('length:');
    console.log(data.capture.f_none.length);
    // let timg = document.createElement('img');
    
    let f_img = new Image();
    let l_img = new Image();
    let r_img = new Image();
    let b_img = new Image();

    // console.log(data.capture);
    
    
    // 전, 우 , 좌 후
    f_img.onload=function()
    {
        console.log('load됨?');
        console.log("실행됨");
        fcon.drawImage(f_img, 0,0,f_can.width,f_can.height);
    }
    l_img.onload=function()
    {
        lcon.drawImage(l_img,0,0,l_can.width,l_can.height);
    }
    r_img.onload=function()
    {
        rcon.drawImage(r_img,0,0,r_can.width,r_can.height);
    }
    b_img.onload=function()
    {
        bcon.drawImage(b_img,0,0,b_can.width,b_can.height);
    }
    f_img.src = `data:image/png;base64,${data.capture.f_none}`;
    l_img.src = `data:image/png;base64,${data.capture.l_none}`;
    r_img.src = `data:image/png;base64,${data.capture.r_none}`;
    b_img.src = `data:image/png;base64,${data.capture.b_none}`;

    info_can_draw_direction('정면');

}


function info_can_draw_direction(direction)
{
    let nor;
    let can;
    let con;   

    console.log(now_data);
    if(direction == '정면')
    {
        nor = now_data.capture.f_none;
        can = now_data.capture.f_can;
        con = now_data.capture.f_con;
    }
    else if(direction == '좌측')
    {
        nor = now_data.capture.l_none;
        can = now_data.capture.l_can;
        con = now_data.capture.l_con;
    }
    else if(direction == '후면')
    {
        nor = now_data.capture.b_none;
        can = now_data.capture.b_can;
        con = now_data.capture.b_con;
    }
    else if(direction == '우측')
    {
        nor = now_data.capture.r_none;
        can = now_data.capture.r_can;
        con = now_data.capture.r_con;
    }
    let none_img = new Image();
    let can_img = new Image();
    let con_img = new Image();

    none_img.onload=function()
    {
        n_con.drawImage(none_img,0,0,info_can_none.width,info_can_none.height);
    }
    can_img.onload=function()
    {
        a_con.drawImage(can_img,0,0,info_can_can.width, info_can_can.height)
    }
    con_img.onload=function()
    {
        c_con.drawImage(con_img,0,0,info_can_con.width, info_can_con.height);
    }

    none_img.src=`data:image/png;base64,${nor}`;
    can_img.src=`data:image/png;base64,${can}`;
    con_img.src=`data:image/png;base64,${con}`;


    // 좌측 우측 정면 후면

}

var now_data;


socket.on('detail_log_res', function(data)
{
    // console.log(data);
    now_data = data;

    draw_canvas_img(data);


    let front_data = data.front;
    let side_data = data.side;

    let s_angle = Number(front_data.s_angle);
    let h_angle = Number(front_data.h_angle);
    s_angle = angle_return(s_angle).toString();
    h_angle = angle_return(h_angle).toString();

    let fdata = {
        '왼쪽 팔' : front_data.left_arm,
        '오른쪽 팔': front_data.right_arm,
        '왼쪽 다리' : front_data.left_leg,
        '오른쪽 다리' : front_data.right_leg,
        '어깨 각도' : s_angle,
        '골반 각도' : h_angle,
        '상체' : front_data.upperbody,
        '하체' : front_data.lowerbody,
        '비율' : front_data.bodyratio
    };

    now_data.s_angle = s_angle;
    now_data.h_angle = h_angle;
    // '왼쪽 팔':info.f_left_arm_len,
    // '오른쪽 팔':info.f_right_arm_len,
    // '왼쪽 다리': info.f_left_leg_len,
    // '오른쪽 다리' : info.f_right_leg_len,
    // '어깨 각도' : info.f_sholder_angle,
    // '골반 각도' : info.f_hip_angle,
    // '상체' : info.f_upper_len,
    // '하체' : info.f_lower_len,
    // '비율' : info.f_ratio

    create_front_data(fdata);
    create_side_data(side_data);


    let ages = Number(human_info.age.replace('세',''));
    console.log(ages);

    let age_s = ages_return(ages);
    

    socket.emit('age_bmi_req', age_s);

})

socket.on('ages_bmi_res', function(data)
{
    console.log(data);
    let gen = human_info.gen;
    
    let db_data = {'h':0,'w':0,'bmi':0};
    if(gen.includes('남'))
    {
        gen = 'male';
        db_data.h = Number(data.male_hei);
        db_data.w= Number(data.male_wei);
        db_data.bmi= Number(data.male_bmi);
    }
    else
    {
        gen = 'female';
        db_data.h = Number(data.female_hei);
        db_data.w = Number(data.female_wei);
        db_data.bmi = Number(data.female_bmi);
    }
    now_bmi(db_data);

})

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
function left_right_return(n)
{
    let lr = "";
    if(n > 0)
    {
        lr = "R";
    }
    else
    {
        lr = 'L';
    }

    return lr;
}
function now_bmi(db_data)
{
    human_info.age
    human_info.hei
    human_info.wei
    console.log(human_info.hei);
    console.log(human_info.wei);
    // 몸무게/(키/100*키/100)
    let h = Number(human_info.hei.replace('cm', ''));
    let w = Number(human_info.wei.replace('kg', ''));

    let h_ = h/100;

    let bmi = w/(h_*h_);
    console.log('bmi :');
    console.log(bmi);

    let result_w = ((((w-db_data.w)/db_data.w)*100)).toFixed(1).toString();
    let result_h = ((((h-db_data.h)/db_data.h)*100)).toFixed(1).toString();
    let result_bmi = ((((bmi-db_data.bmi)/db_data.bmi)*100)).toFixed(1).toString();

    let fdata = now_data.front;
    let sdata = now_data.side;
    console.log(fdata);
    let fdata_ = [];
    let sdata_ = [];

    for (const [key, value] of Object.entries(fdata))
    {
        let num = Number(value);
        fdata_.push(num);
    }
    for (const [key, value] of Object.entries(sdata))
    {
        let num = Number(value);
        sdata_.push(num);
    }
    

    let arm_dif = fdata_[1] - fdata_[0];
    let leg_dif =  fdata_[3] - fdata_[2];
    let neck = sdata_[0];
    // + 값인경우 오른쪽이 더 위에
    // - 값인 경우 왼쪽이 더 위에 위치한 상황
    
    let s_angle = angle_return(fdata_[4]);
    let h_angle = angle_return(fdata_[5]);
    let arm_d = left_right_return(arm_dif);
    let leg_d = left_right_return(leg_dif);

    arm_dif = arm_dif.toFixed(1).toString() + arm_d;
    leg_dif = leg_dif.toFixed(1).toString() + leg_d;
    s_angle = s_angle.toFixed(1).toString() + '˚';
    h_angle = h_angle.toFixed(1).toString() + '˚';
    neck = neck.toFixed(1).toString();

    let result_data = {
        'hei_ratio':result_h,
        'wei_ratio':result_w,
        'bmi_ratio':result_bmi,
        'shoulder':s_angle,
        'wrist':arm_dif,
        'hip':h_angle,
        'leg':leg_dif,
        'neck':neck
    }
    // create_ratio_parts_data(test_ratio_parts);
    create_ratio_parts_data(result_data);
}



function transform_frame(title)
{
    const record_list = document.querySelectorAll('#space_record_list .record');
    document.body.style.cursor = 'auto';
    next_frame = true;
    mouse_event = false;
    key_event = true;
    record_list.forEach((n) =>
    {
        let ran = randNUM(1, 2);
        n.className = 'record';
        if (ran == 1)
        {
            n.classList.add('sideoutR');
        }
        else
        {
            n.classList.add('sideoutL');
        }
    });
    setTimeout(() =>
    {
        // 키보드 엔터, 마우스 클릭으로 해당 날짜 기록 조회하기
        parent_record.style.display = 'none';
        record_data.style.display = 'grid';
        record_data_title.innerText = `${title}`;
    }, 900);
}


let test_record = [1, 2, 3, 4, 5];

let test_person =
{
    // name : '김AB',
    // age : '25',
    // con : '12341234',
    // hei : '175',
    // wei : '70'
}

function set_person_info(data)
{
    console.log(data);
    const info_space = document.getElementById('space_total');
    info_space.querySelector('#space_name .info_text').innerText = data.name;
    info_space.querySelector('#space_age .info_text').innerText = data.age;
    info_space.querySelector('#space_con .info_text').innerText = data.con;
    info_space.querySelector('#space_hei .info_text').innerText = data.hei;
    info_space.querySelector('#space_wei .info_text').innerText = data.wei;

    // DB에서 기록의 최근 날짜 조회 후 대입
    // info_space.querySelector('#space_recent .info_text').innerText
}


function create_record_list(data)
{
    console.log(data);
    data.forEach((n) =>
    {
        let create_row = document.createElement('div');
        create_row.className = 'record';

        // new Date() 대신 data의 기록 n마다의 날짜 대입
        // let record_dt = new Date();
        let record_dt = n;
        // let convert_dt = `${record_dt.getFullYear()} ${record_dt.getMonth()} ${record_dt.getDate()}`;
        create_row.innerText = `${record_dt}`;

        parent_record.appendChild(create_row);
    });
    const info_space = document.getElementById('space_total');

    console.log(data[0]);
    let recent = data[0].split('오')[0];

    info_space.querySelector('#space_recent .info_text').innerText = recent;

}

let test_front = {
    '왼쪽 어깨': '23.125',
    '오른쪽 어깨': '-25.125215'
}

function create_front_data(data)
{
    // key값이 문자열이 아니면 값이 따라 직접 대입

    for (const [key, value] of Object.entries(data)) {
        let front_row = document.createElement('div');
        let row_name = document.createElement('span');
        let row_value = document.createElement('span');

        front_row.className = 'data_front_row1';

        //key 값을 대입하지 않을 경우 직접 부여
        row_name.className = 'data_name';
        row_name.innerText = `${key}`;

        //key 값을 대입하지 않을 경우 직접 부여
        row_value.className = 'data_value';
        // 소수점 특정 자리수까지 자르기, tofixed로 소수점 자를 경우 0이 붙어나오므로 다시 float 변환
        row_value.innerText = `${parseFloat(parseFloat(value).toFixed(2))}`;
        
        front_row.appendChild(row_name);
        front_row.appendChild(row_value);

        data_front.appendChild(front_row);
    };
}


let test_side = {
    '목 기울기1': '33.1225',
    '목 기울기2': '-65.1252212215'
}

function create_side_data(data)
{
    // key값이 문자열이 아니면 값이 따라 직접 대입

    for (const [key, value] of Object.entries(data)) {
        let side_row = document.createElement('div');
        let row_name = document.createElement('span');
        let row_value = document.createElement('span');

        side_row.className = 'data_side_row1';

        //key 값을 대입하지 않을 경우 직접 부여
        row_name.className = 'data_name';
        row_name.innerText = `${key}`;

        //key 값을 대입하지 않을 경우 직접 부여
        row_value.className = 'data_value';
        // 소수점 특정 자리수까지 자르기, tofixed로 소수점 자를 경우 0이 붙어나오므로 다시 float 변환
        row_value.innerText = `${parseFloat(parseFloat(value).toFixed(2))}`;
        
        side_row.appendChild(row_name);
        side_row.appendChild(row_value);

        data_side.appendChild(side_row);
    };
}

let test_ratio_parts = {
    hei_ratio: '55',
    wei_ratio: '72',
    bmi_ratio: '66',
    shoulder: '53.5',
    wrist: '41.1',
    hip: '61.9',
    leg: '22.4',
    neck: '33.6'
}

function create_ratio_parts_data(data)
{
    document.getElementById('hei_value').innerText = `${data.hei_ratio}`;
    document.getElementById('wei_value').innerText = `${data.wei_ratio}`;
    document.getElementById('bmi_value').innerText = `${data.bmi_ratio}`;
    document.getElementById('part_first_value').innerText = `${data.shoulder}`;
    document.getElementById('part_second_value').innerText = `${data.wrist}`;
    document.getElementById('part_third_value').innerText = `${data.hip}`;
    document.getElementById('part_fourth_value').innerText = `${data.leg}`;
    document.getElementById('part_fifth_value').innerText = `${data.neck}`;
}

function reset_data()
{
    for (let i = data_front.children.length - 1; i >= 0; i--)
    {
        if (data_front.children[i].className == 'data_front_row1')
        {
            data_front.removeChild(data_front.children[i]);
        }
    }
    for (let i = data_side.children.length - 1; i >= 0; i--)
    {
        if (data_side.children[i].className == 'data_side_row1')
        {
            data_side.removeChild(data_side.children[i]);
        }
    }    
}

console.log("js 바닥");