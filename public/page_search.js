var socket = io();


socket.emit("page_name_search", "page_search진입");
socket.emit("next_page_info_req", "다음 페이지 요청");
socket.on('next_page_info_res', function(data)
{
    console.log("다음으로 넘겨줄 페이지는");
    console.log(data);
    next_location(data);
})
socket.on('log_confirm_res', function(data)
{
    if(data == 'true')
    {
        location.href = next_page_location;
    }
    else if(data == 'none')
    {
        console.log('이름 검색으로 돌아가기');
        let get_results = search_results.querySelectorAll('.test_result, .test_result_over');
        spread_below(get_results, true);
        return_search_name();
        search_input.focus();
    }
    
})
//192.168.0.47:3300
var next_page_location="http://192.168.0.47:3300";
var title_inner_text = "";
function next_location(data)
{
    if(data == 'cam')
    {
        search_text.innerText = '촬영될 사람의 이름을 입력해주세요.';
        title_inner_text ='촬영될 사람의 이름을 입력해주세요.';
        next_page_location = "http://192.168.0.47:3300/shoot"
    }
    else if(data == 'chart')
    {
        search_text.innerText = '차트를 확인할 사람의 이름을 입력해주세요.';
        title_inner_text ='차트를 확인할 사람의 이름을 입력해주세요.';
        next_page_location = "http://192.168.0.47:3300/record"
    }
    else if(data == 'log')
    {
        search_text.innerText = '기록을 확인할 사람의 이름을 입력해주세요.';
        title_inner_text ='기록을 확인할 사람의 이름을 입력해주세요.';
        next_page_location = "http://192.168.0.47:3300/record"
    }
    

}

// 뒤로가기 감지 초기화
window.onpageshow = function(event)
{
    if ( event.persisted || (window.performance && window.performance.navigation.type == 2)) {
        // Back Forward Cache로 브라우저가 로딩될 경우 혹은 브라우저 뒤로가기 했을 경우
        // 이벤트 추가하는 곳
        location.reload();
        console.log('back button event');
    }
}


window.addEventListener('load', function ()
{
    let recv_firstframe = localStorage.getItem('넘어갈화면');
    if (recv_firstframe === null)
    {
        console.log("첫화면에서 넘어오지 않음");
    }
    else
    {
        console.log(`로드 : ${recv_firstframe}`);
    }

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


    //create_cloud_test(5);

    set_mouse_event(add_new_info);
    set_keyboard_event();
    search_input.focus();

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
    console.log(currentScrollPosition);
    if (currentScrollPosition > 5)
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
            console.log('mouseup 이벤트 실행됨');
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

                        
                        // console.log(icon_text.item(0));
                        //alert('페이지 넘어가기');
                        down_up = false;
                        iconbar_page_change(icon_text);
                    }
                }
            }
            else if (menu_status == 'close')
            {
                const icon_img = n.querySelectorAll('.icon_img_mousedown');
                icon_img.item(0).parentElement.id
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
        console.log("차트 보기로");
        socket.emit("left_bar_click", "chart");
        location.href = "http://192.168.0.47:3300/page_search";
        // location.href = "http://localhost:3300";
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
btnTop.addEventListener("mouseover", function ()
{
    document.body.style.cursor = "pointer";
});
btnTop.addEventListener("mouseout", function ()
{
    document.body.style.cursor = "auto";
});

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

let viewportHeight = window.innerHeight;
window.addEventListener('resize', function() {viewportHeight = window.innerHeight;});

const search_space = document.getElementById('search_space');
const search_text = document.getElementById('search_text');
const search_icon = document.getElementById('search_icon');
const search_input = document.getElementById('search_input');
const search_input_frame = document.getElementById('search_input_frame');
const search_result_frame = document.getElementById('search_result_frame');
const search_results = document.getElementById('search_results');
const warn_text = document.getElementById('search_warn_text');
const add_new_info = document.getElementById('add_new_info');

search_icon.addEventListener('mouseover', function(){document.body.style.cursor = "pointer";});
search_icon.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});

var not_name = "";
var input_name = "";
// 검색 데이터 할당될 변수
let data =
[
    // {name : '김OO', gen : "남자", age : "20세", con : "12436341"},
    // {name : '김OO', gen : "여자", age : "21세", con : "75352359"},
    // {name : '김OO', gen : "여자", age : "20세", con : "29680244"},
    // {name : '김OO', gen : "여자", age : "23세", con : "45143978"},
    // {name : '김OO', gen : "남자", age : "24세", con : "49713135"},
    // {name : '김OO', gen : "여자", age : "32세", con : "56785678"},
    // {name : '김OO', gen : "남자", age : "27세", con : "12121212"},
    // {name : '김OO', gen : "남자", age : "31세", con : "45454545"},
    // {name : '김OO', gen : "여자", age : "28세", con : "67676767"},
    // {name : '김OO', gen : "남자", age : "29세", con : "77277577"},
    // {name : '김OO', gen : "여자", age : "25세", con : "17277747"},
    // {name : '김OO', gen : "여자", age : "27세", con : "73777377"},
    // {name : '김OO', gen : "남자", age : "26세", con : "77577732"},
    // {name : '김OO', gen : "여자", age : "28세", con : "71767371"},
    // {name : '김OO', gen : "남자", age : "20세", con : "15201234"},
    // {name : '김OO', gen : "여자", age : "28세", con : "22222222"},
    // {name : '김OO', gen : "여자", age : "22세", con : "33333333"},
    // {name : '김OO', gen : "여자", age : "28세", con : "42447555"},
    // {name : '김OO', gen : "남자", age : "24세", con : "43214321"},
    // {name : '김OO', gen : "여자", age : "31세", con : "56785678"},
    // {name : '김OO', gen : "남자", age : "26세", con : "15121912"},
    // {name : '김OO', gen : "남자", age : "30세", con : "45454545"},
    // {name : '김OO', gen : "여자", age : "31세", con : "67676767"},
    // {name : '김OO', gen : "남자", age : "33세", con : "17277577"},
    // {name : '김OO', gen : "여자", age : "32세", con : "17787747"}
];
socket.on("search_result", function(search_data)
{
    console.log("검색결과 :"+search_data);
    console.log(search_data);
    data = search_data;
    play_search();
})

search_icon.addEventListener("click", function(event){
    
    
    if(frame_status == 'search_name' || frame_status == "cannot_search_name")
    {
        console.log("이름검색");
        input_name = search_input.value;
        socket.emit("name_saerch_req", search_input.value);
        
    }
    else
    {
        play_search();
    }
    // 서버에 이름 검색 요청해서 data에 검색된 데이터 할당
    // play_search();

    console.log("input_name"+input_name);
});


search_input.addEventListener('keyup', function(event)
{
    if (event.key === 'Enter')
    {
        // 서버에 이름 검색 요청해서 data에 검색된 데이터 할당
        if(frame_status == 'search_name' || frame_status == "cannot_search_name")
        {
            console.log("이름검색");
            input_name = search_input.value;
            socket.emit("name_saerch_req", search_input.value);
        }
        else
        {
            play_search();
        }
        
        
        console.log("input_name"+input_name);
        // play_search();


    }
});

let update_animate = false;
function update_check(data)
{
    if (update_animate == false)
    {
        if (search_input.value)
        {   
            let search_gen = [];
            let search_age = [];
            let search_con = [];
            data.forEach((n) =>
            {
                if (n.gen.includes(search_input.value)){search_gen.push(n);} 
                if (n.age.includes(search_input.value)){search_age.push(n);}
                if (n.con.includes(search_input.value)){search_con.push(n);}
            });
            
            let set_abc = new Set([...search_gen, ...search_age, ...search_con]);
            let sum_abc = Array.from(set_abc).sort((a, b) => parseInt(a.age.match(/[0-9]+/g).join('')) - parseInt(b.age.match(/[0-9]+/g).join(''))
                    || parseInt(a.con.match(/[0-9]+/g).join('')) - parseInt(b.con.match(/[0-9]+/g).join('')));
            return sum_abc;
            // let sort_search = [search_gen, search_age, search_con];
            // sort_search.sort((a, b) => b.length - a.length);
            // return sort_search[0];
        }
        else if (search_input.value.length == 0)
        {
            return data;
        }
    }
}

function cannot_search_data()
{
    frame_status = 'cannot_search_name';
    const search_text_style = window.getComputedStyle(search_text);
    const search_text_fontsize = parseInt(search_text_style.fontSize.replace('px', ''));
    search_result_frame.style.height = `${150}px`;
    //search_results.style.height = `${100}px`;
    // console.log(search_input.value);
    let cannot_name = search_input.value;
    not_name = cannot_name;
    for (let i = 1; i <= 100; i++)
    {
        setTimeout(() => 
        {
            search_result_frame.style.opacity = `${i/100}`;
            search_results.style.opacity = `${i/100}`;
            add_new_info.style.opacity = `${i/100}`;
            if (i < 50)
            {
                search_text.style.fontSize = `${search_text_fontsize - i/10}px`;
                search_text.style.opacity = `${1 - i/50}`; 
            }
            else if (i == 50)
            {
                search_text.innerText = `${cannot_name}님 의 데이터가 존재하지 않습니다.`;
                search_input.value = '';
            }
            else if (i > 50)
            {
                search_text.style.fontSize = `${search_text_fontsize - 5 + (i-50)/10}px`;
                search_text.style.opacity = `${i/50 - 1}`;
            }
            if (i >= 100)
            {
                search_input.focus();
            }
        }, Math.sqrt(2500*i));
    }
}

function return_search_name()
{ 
    frame_status = 'search_name';
    document.body.style.cursor = "auto";
    key_index_length = 0;
    key_index_current = 0;
    const search_text_style = window.getComputedStyle(search_text);
    const search_text_fontsize = parseInt(search_text_style.fontSize.replace('px', ''));
    for (let i = 1; i <= 100; i++)
    {
        setTimeout(() => 
        {
            search_text.style.fontSize = `${search_text_fontsize - i/10}px`;
            search_result_frame.style.opacity = `${1 - i/100}`;
            search_results.style.opacity = `${1 - i/100}`;
            add_new_info.style.opacity = `${1 - i/100}`; 
            if (i < 50)
            {
                search_text.style.opacity = `${1 - i/50}`; 
            }
            else if (i == 50)
            {
                search_text.innerText = title_inner_text;
                search_input.value = '';
                search_input.placeholder = '이름 검색';
            }
            else if (i > 50)
            {
                search_text.style.opacity = `${i/50 - 1}`;
            }
        }, Math.sqrt(2500*i));
    }
}

function play_search()
{
    function search_detail(data)
    {
        frame_status = 'search_detail';
        const search_text_style = window.getComputedStyle(search_text);    
        const search_text_fontsize = parseInt(search_text_style.fontSize.replace('px', ''));
        for (let i = 1; i <= 100; i++)
        {
            setTimeout(() => 
            {
                search_result_frame.style.opacity = `${i/100}`;
                search_results.style.opacity = `${i/100}`;
                add_new_info.style.opacity = `${i/100}`;
                search_text.style.fontSize = `${search_text_fontsize + i/10}px`;
                if (i < 50)
                {
                    search_text.style.opacity = `${1 - i/50}`; 
                }
                else if (i == 50)
                {
                    search_text.innerText = search_input.value;
                    search_input.value = '';
                }
                else if (i > 50)
                {
                    search_text.style.opacity = `${i/50 - 1}`;
                }
                if (i >= 100)
                {
                    setTimeout(() =>
                    {
                        create_search_result(data);
                        let get_results = search_results.querySelectorAll('.test_result, .test_result_over');
                        spread_below(get_results, false);
                        key_index_length = data.length;
                        search_input.placeholder = '결과 내 검색';
                    }, 300);
                }
            }, Math.sqrt(2500*i));
        }
    }

    key_event = false;
    if (frame_status == 'search_name' && search_input.value)
    {
        if (data.length > 0)
        {
            search_detail(data);
        }
        else if (data.length == 0)
        {
            cannot_search_data();
            console.log(frame_status);
        }
    }
    else if (frame_status == 'search_detail')
    {
        const update_data = update_check(data);
        if (update_animate == false)
        {
            if (update_data.length > 0)
            {
                warn_text.style.display = 'none';
                update_animate = true;
                let get_results = search_results.querySelectorAll('.test_result, .test_result_over');
                spread_below(get_results, true, update_data);
            }
            else if (update_data.length == 0)
            {
                warn_text.style.display = 'inline-block';
            }
        }
    }
    else if (frame_status == 'cannot_search_name' && search_input.value)
    {
        if (data.length > 0)
        {
            search_detail(data);
        }
        else if(data.length == 0)
        {
            cannot_search_data();
        }
    }
}

let mouse_event = false;
let key_event = false;

let key_index_length = 0;
let key_index_current = 0;


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

let frame_status = 'search_name';
let keydown_status = false;
let keydown_maintenance = false;

let keydown_repeat = false;

let keydown_maintenance_timer;

function set_keyboard_event()
{
    window.addEventListener("keyup", function(event)
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
    });
    window.addEventListener("keydown", function(event)
    {
        const e = event.key;
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
            warn_text.style.display = 'none';
            if (frame_status == 'search_detail' || frame_status == 'cannot_search_name')
            {
                let get_childs = search_results.children;
                if(e == 38 || e == "ArrowUp")
                {
                    search_input.blur();
                    // event.preventDefault();
                    if (mouse_event == false && key_event == false)
                    {
                        key_event = true;
                        key_index_current = 0;
                        add_new_info.className = 'test_result_over';
                    }
                    else if (mouse_event == false && key_event == true)
                    {
                        if (data.length > 0)
                        {
                            if (key_index_current == 0)
                            {
                                add_new_info.className = 'test_result';
                                key_index_current = get_childs.length - 1;
                                get_childs[key_index_current].className = 'test_result_over';
                                move_scroll(get_childs[key_index_current]);
                            }
                            else
                            {
                                get_childs[key_index_current].className = 'test_result';
                                key_index_current--;
                                if (key_index_current == 0)
                                {
                                    add_new_info.className = 'test_result_over';
                                    move_scroll(add_new_info);
                                }
                                else
                                {
                                    get_childs[key_index_current].className = 'test_result_over';
                                    move_scroll(get_childs[key_index_current]);
                                }                    
                            }
                        }
                        else if (data.length <= 0)
                        {
                            // 새 촬영자 정보 입력만 포커스 가능한 상태
                        }
                    }
                }
                else if(e == 40 || e == "ArrowDown")
                {
                    search_input.blur();
                    // event.preventDefault();
                    if (mouse_event == false && key_event == false)
                    {
                        key_event = true;
                        key_index_current = 0;
                        add_new_info.className = 'test_result_over';
                        move_scroll(add_new_info);
                    }
                    else if (mouse_event == false && key_event == true)
                    {
                        if (data.length > 0)
                        {
                            if (key_index_current == get_childs.length - 1)
                            {
                                get_childs[key_index_current].className = 'test_result';
                                key_index_current = 0;
                                add_new_info.className = 'test_result_over';
                                move_scroll(add_new_info);
                            }
                            else
                            {
                                if (key_index_current == 0)
                                {
                                    add_new_info.className = 'test_result';
                                }
                                else
                                {
                                    get_childs[key_index_current].className = 'test_result';
                                }
                                key_index_current++;
                                get_childs[key_index_current].className = 'test_result_over';
                                move_scroll(get_childs[key_index_current]);
                            }
                        }
                        else if (data.length <= 0)
                        {
                            // 새 촬영자 정보 입력만 포커스 가능한 상태
                        }
                    }
                }
                else if (e == "Enter")
                {
                    if (frame_status == 'search_detail' || frame_status == 'cannot_search_name')
                    {
                        if (key_event == true)
                        {
                            if (key_index_current == 0)
                            {
                                let add = add_new_info.querySelector('.item_add').innerText;
                                console.log("새 정보 입력으로");
                                console.log(add);
                                location.href = "http://192.168.0.47:3300/new_info";
                                                                
                                // "http://localhost:3300/page_search"
                            }
                            else
                            {
                                const get_values = get_childs[key_index_current];

                                let now_name = document.getElementById("search_text").innerText;
                                let gen = get_values.querySelector('.item_gen').innerText;
                                let age = get_values.querySelector('.item_age').innerText;
                                let con = get_values.querySelector('.item_con').innerText;
                                console.log('선택한 정보 갖고 넘어가기');
                                console.log(`이름: ${now_name}성별 : ${gen}, 나이 : ${age}, 연락처 : ${con}`);
                                let select_arr = {"name": now_name , "gen":gen,"age":age,"tel":con};
                                socket.emit("page_search_select_info", select_arr);
                                
                                socket.emit('log_confirm_req', '기록 존재 유무 확인');

                            }
                        }
                    }
                }
                else if(e == "Escape")
                {
                    key_event = false;
                    if (frame_status == 'search_detail')
                    {
                        // 이름 검색으로 돌아가기
                        console.log('이름 검색으로 돌아가기');
                        let get_results = search_results.querySelectorAll('.test_result, .test_result_over');
                        spread_below(get_results, true);
                        return_search_name();
                        search_input.focus();
                    }
                    else if (frame_status == 'search_name')
                    {
                        // 이름 검색 중에 esc : 이전 화면이 존재하면 그 화면으로
                        console.log('이름 검색 중 esc');
                    }
                    else if (frame_status == 'cannot_search_name')
                    {
                        // 이름 검색 데이터 없음에서 esc
                        add_new_info.className = 'test_result';
                        search_input.focus();
                    }
                }
            }
        }
    });
}

function set_mouse_event(element)
{
    element.addEventListener('mouseover', function()
    {
        if (frame_status == 'search_detail' || frame_status == 'cannot_search_name')
        {
            warn_text.style.display = 'none';
            let get_childs = search_results.children;
            if (key_event == true)
            {
                add_new_info.className = 'test_result';
                for (let i = 0; i < get_childs.length; i++)
                {
                    if (get_childs[i].className == 'test_result_over')
                    {
                        get_childs[i].className = 'test_result';
                    }
                }
                key_event = false;
            }
            mouse_event = true;
            document.body.style.cursor = "pointer";
            element.className = 'test_result_over';
        }
    });
    element.addEventListener('mouseout', function()
    {   
        warn_text.style.display = 'none';
        if (frame_status == 'search_detail' || frame_status == 'cannot_search_name')
        {
            if (mouse_event == true)
            {
                mouse_event = false;
            }
            document.body.style.cursor = "auto";
            element.className = 'test_result';
        }
    });
    element.addEventListener('click', function()
    {   
        warn_text.style.display = 'none';
        if (frame_status == 'search_detail' || frame_status == 'cannot_search_name')
        {
            if (element.id == 'add_new_info')
            {
                let add = element.querySelector('.item_add').innerText;

                console.log('새 정보 입력으로');

                location.href = "http://192.168.0.47:3300/new_info";
            }
            else
            {
                let now_name = document.getElementById("search_text").innerText;
                let gen = element.querySelector('.item_gen').innerText;
                let age = element.querySelector('.item_age').innerText;
                let con = element.querySelector('.item_con').innerText;
                console.log('선택한 정보 갖고 넘어가기');
                console.log(`이름: ${now_name}성별 : ${gen}, 나이 : ${age}, 연락처 : ${con}`);
                let select_arr = {"name": now_name , "gen":gen,"age":age,"tel":con};
                socket.emit("page_search_select_info", select_arr);

                socket.emit('log_confirm_req', '기록 존재 유무 확인');
                
            }
        }
    });
}

function delete_search()
{
    for (let i = search_results.children.length - 1; i >= 1; i--)
    {
        search_results.removeChild(search_results.children[i]);
    }
}

function spread_below(results, reverse, update_to_data=undefined)
{
    let reverse_rate = 1;
    let reverse_speed1 = 1;
    let reverse_speed2 = 1;
    let reverse_speed3 = 1;
    let update_once = false;
    if (reverse == false)
    {
        add_new_info.style.display = 'flex';
        search_result_frame.style.height = `${80}px`;
    }
    else if (reverse == true)
    {
        reverse_rate = -1;
        reverse_speed1 = 0.35;
        reverse_speed2 = 0.45;
        reverse_speed3 = 0.55;
    }
    const bounding_value = 300;
    const bounding_rate = 30;
    const move_distance = 580;
    setTimeout(() =>
    {
        for (let i = 0; i < results.length; i++)
        {
            const current_top = parseInt(window.getComputedStyle(results[i]).top.replace('px', ''));
            for (let j = 1; j < bounding_value; j += 0.5)
            {
                setTimeout(() =>
                {
                    // 진행 방향의 반대방향으로 살짝 튕기기
                    results[i].style.top = `${current_top - reverse_rate*j/bounding_rate}px`;
                    if (j >= bounding_value - 1)
                    {
                        const current_top2 = current_top - reverse_rate*j/bounding_rate;
                        for (let r = 1; r < bounding_value; r += 0.5)
                        {
                            setTimeout(() =>
                            {
                                // 반대방향으로 간만큼 돌아오기
                                results[i].style.top = `${current_top2 + reverse_rate*r/bounding_rate}px`;
                                if (r >= bounding_value - 1)
                                {
                                    const current_top3 = current_top2 + reverse_rate*r/bounding_rate;
                                    //console.log(`실행체크5 ${i}`);
                                    
                                    if (i != 0)
                                    {
                                        for (let m = 0; m < i*move_distance; m += i)
                                        {
                                            setTimeout(() =>
                                            {
                                                // 진행방향으로 펼쳐지기
                                                results[i].style.top = `${current_top3 + reverse_rate*(m/10)}px`;
                                                if (i >= results.length -1)
                                                {
                                                    search_result_frame.style.height = `${65 + current_top3 + reverse_rate*(m/10)}px`;
                                                    if (m >= i*move_distance - i - 1)
                                                    {
                                                        // 접는 애니메이션인 경우에는 초기화 및 데이터 갱신 후 펼치기
                                                        if (reverse == true && update_once == false)
                                                        {
                                                            //console.log('실행체크1');
                                                            update_once = true;
                                                            delete_search();
                                                            if (update_to_data != undefined)
                                                            {
                                                                //console.log('실행체크2');

                                                                create_search_result(update_to_data);
                                                                spread_below(search_results.querySelectorAll('.test_result, .test_result_over'), false);
                                                                key_index_length = update_to_data.length;
                                                                setTimeout(()=>
                                                                {
                                                                    update_animate = false;
                                                                }, 500);
                                                            }
                                                        }
                                                    }
                                                }
                                            }, Math.sqrt(m*reverse_speed3*22).toFixed(5));
                                        }
                                    }
                                    else if (i == 0)
                                    {
                                        let m = 1;
                                        setTimeout(() =>
                                        {
                                            results[i].style.top = `${current_top3 + reverse_rate*(m/10)}px`;
                                            if (i >= results.length -1)
                                            {
                                                search_result_frame.style.height = `${65 + current_top3 + reverse_rate*(m/10)}px`;
                                                if (m >= i*move_distance - i - 1)
                                                {
                                                    if (reverse == true && update_once == false)
                                                    {
                                                        //console.log('실행체크1');
                                                        update_once = true;
                                                        delete_search();
                                                        if (update_to_data != undefined)
                                                        {
                                                            //console.log('실행체크2');
                                                            
                                                            create_search_result(update_to_data);
                                                            spread_below(search_results.querySelectorAll('.test_result, .test_result_over'), false);
                                                            key_index_length = update_to_data.length;
                                                            setTimeout(()=>
                                                            {
                                                                update_animate = false;
                                                            }, 500);
                                                        }
                                                    }
                                                }
                                            }
                                        }, Math.sqrt(m*reverse_speed3*22).toFixed(5));
                                    }
                                }
                            }, Math.sqrt(r*reverse_speed2*28).toFixed(5));
                        }
                    }
                }, Math.sqrt(j*reverse_speed1*32).toFixed(5));
            }
        }
    }, 123);
}

function create_search_result(data)
{
    data.forEach((n) =>
    {
        let result = document.createElement('div');
        result.className = 'test_result';

        let item_gen = document.createElement('span');
        item_gen.className = 'item_gen';
        item_gen.innerText = `${n.gen}`;
        result.appendChild(item_gen);

        let item_age = document.createElement('span');
        item_age.className = 'item_age';
        item_age.innerText = `${n.age}`;
        result.appendChild(item_age);

        let item_con = document.createElement('span');
        item_con.className = 'item_con';
        item_con.innerText = `${n.con}`;
        result.appendChild(item_con);

        set_mouse_event(result);
        search_results.appendChild(result);
    });
}
