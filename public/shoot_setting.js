

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   좌측 아이콘 바  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
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

    const setting_btn = document.getElementById('setting_btn');
    
    setting_btn.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
    setting_btn.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});

    // 배경 웨이브 시작
    new create_wave();
});

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


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
left_btn.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
right_btn.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
left_btn.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});
right_btn.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});

let down_up = false;
let icons = document.querySelectorAll("#icon_bar .icon");
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
        // location.href = "http://localhost:3300";
    }
}


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
right_btn.addEventListener("click", function ()
{
    console.log('@@@@@@@@@@@right_btn click');
    const navwidth = getnav.offsetWidth;
    const bodypadding = parseInt(window.getComputedStyle(getbody).paddingLeft.replace('px', ''));
    const rightvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const leftvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const iconbarwidth = parseInt(window.getComputedStyle(geticonbar).width.replace('px', ''));

    let icons = document.querySelectorAll("#icon_bar .icon");

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
                    icons.forEach((n, index) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) + 2}px`;
                        console.log(parseInt(window.getComputedStyle(n).width.replace('px', '')) + 2);
                    });
                }
                else
                {
                    right_btn.style.left = `${leftvalue + i}px`;
                    left_btn.style.left = `${rightvalue + i}px`;
                    geticonbar.style.width = `${iconbarwidth + i}px`;
                    icons.forEach((n, index) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) + 1}px`;
                        console.log(parseInt(window.getComputedStyle(n).width.replace('px', '')) + 1);
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

                    let iconstext = document.querySelectorAll("#icon_bar .icon_text");
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


// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바
left_btn.addEventListener("click", function ()
{
    console.log('@@@@@@@@@@@left_btn click');
    const navwidth = getnav.offsetWidth;
    const bodypadding = parseInt(window.getComputedStyle(getbody).paddingLeft.replace('px', ''));
    const rightvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const leftvalue = parseInt(window.getComputedStyle(right_btn).left.replace('px', ''));
    const iconbarwidth = parseInt(window.getComputedStyle(geticonbar).width.replace('px', ''));

    let icons = document.querySelectorAll("#icon_bar .icon");

    if (doing_anima == false)
    {
        doing_anima = true;
        let diff_speed = 0;

        //$clock_space.className = 'invisible';

        text_slide($clock_space, '0px');
        
        clearInterval(clock_start);

        let iconstext = document.querySelectorAll("#icon_bar .icon_text");
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
                    icons.forEach((n, index) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) - 2}px`;
                        console.log(parseInt(window.getComputedStyle(n).width.replace('px', '')) - 2);
                    });
                }
                else
                {
                    right_btn.style.left = `${leftvalue - i}px`;
                    left_btn.style.left = `${rightvalue - i}px`;
                    geticonbar.style.width = `${iconbarwidth - i}px`;
                    icons.forEach((n, index) =>
                    {
                        n.style.width = `${parseInt(window.getComputedStyle(n).width.replace('px', '')) - 1}px`;
                        console.log(parseInt(window.getComputedStyle(n).width.replace('px', '')) - 1);
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
// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 좌측 아이콘 바



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

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   좌측 아이콘 바  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@




//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   배경 웨이브  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

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



//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   배경 웨이브  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    이미지 위치 교환하기  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function switching_title(element, text)
{
    const top_crt = parseFloat(window.getComputedStyle(element).top.replace('px', ''));
    for (let i = 0.01; i <= 1; i = Number((i + 0.01).toFixed(2)))
    {
        setTimeout(() =>
        {
            if (i < 0.5)
            {
                element.style.top = `${top_crt + i*15}px`;
                element.style.opacity = `${1 - i}`;
            }
            else if (i == 0.5)
            {
                element.innerText = text;
            }
            if (i >= 0.5)
            {
                element.style.top = `${top_crt + 15*(1 - i)}px`;
                element.style.opacity = `${i}`;
            }
        }, Math.sqrt(i*75000));
    }
}

function switching(start, endi)
{
    const startIndex = arr.indexOf(start);
    const end = arr[endi];
    /*
    const get_start_x = start.offsetLeft;
    const get_start_y = start.offsetTop;
    const get_end_x = end.offsetLeft;
    const get_end_y = end.offsetTop;
    */
    const start_style = window.getComputedStyle(start);
    const start_left = parseInt(start_style.left.replace('px', ''));
    const start_top = parseInt(start_style.top.replace('px', ''));
    
    const end_style = window.getComputedStyle(end);
    const end_left = parseInt(end_style.left.replace('px', ''));
    const end_top = parseInt(end_style.top.replace('px', ''));

    const rate = 15;
    const t_rate = 15000;
    //alert(`start x : ${start_left}, y : ${start_top}`);
    //alert(`end x : ${end_left}, y : ${end_top}`);

    let reverse_x = 1;
    let reverse_y = 1;

    if (start_left > end_left)
    {
        reverse_x = -1;
    }
    if (start_top < end_top)
    {
        reverse_y = -1;
    }

    if (startIndex != 2 && switching_status == false)
    {
        switching_status = true;

        for (let i = 0.00; i <= 1.00; i += 0.01)
        {
            /*
            const get_test_fade = document.getElementById('img_test_fade');
            const get_test_fade_style = window.getComputedStyle(get_test_fade);
            const test_fade_left = parseInt(get_test_fade_style.left.replace('px', ''));
            const test_fade_top = parseInt(get_test_fade_style.top.replace('px', ''));

            const get_test_fade2 = document.getElementById('img_test_fade2');
            const get_test_fade2_style = window.getComputedStyle(get_test_fade2);
            const test_fade2_left = parseInt(get_test_fade2_style.left.replace('px', ''));
            const test_fade2_top = parseInt(get_test_fade2_style.top.replace('px', ''));
            */

            const slope = Math.abs(start_top - end_top) / Math.abs(start_left - end_left);

            setTimeout(() =>
            {   
                if (i == 0)
                {
                    const tmp = arr_title[2];
                    arr_title[2] = arr_title[arr.indexOf(start)];
                    arr_title[arr.indexOf(start)] = tmp;
                    const img_titles = document.querySelectorAll('#setting_frame_filter .img_title');
                    for (let n = 0; n < img_titles.length; n++)
                    {
                        if (img_titles[n].innerText != `${arr_title[n]}`)
                        {
                            //img_titles[n].innerText = `${arr_title[n]}`;
                            switching_title(img_titles[n], arr_title[n]);
                        }
                    }

                    arr[arr.indexOf(start)] = end;
                    arr[2] = start;

                    arr[0].style.zIndex = 1;
                    arr[4].style.zIndex = 1;
                    arr[0].style.transform = `rotate(6deg)`;
                    arr[4].style.transform = `rotate(-6deg)`;

                    arr[1].style.zIndex = 2;
                    arr[3].style.zIndex = 2;
                    arr[1].style.transform = `rotate(3deg)`;
                    arr[3].style.transform = `rotate(-3deg)`;

                    arr[2].style.zIndex = 3;
                    arr[2].style.transform = `rotate(0deg)`;
                }
                start.style.left = `${start_left + (i*rate)*reverse_x}px`;
                start.style.top = `${start_top - ((i*rate)*slope)*reverse_y}px`;
                start.style.opacity = 1-i;

                end.style.left = `${end_left - (i*rate)*reverse_x}px`;
                end.style.top = `${end_top + ((i*rate)*slope)*reverse_y}px`;
                end.style.opacity = 1-i;

                if (i >= 0.99)
                {
                    start.style.left = `${end_left-(i*rate)*reverse_x}px`;
                    start.style.top = `${end_top+((i*rate)*slope)*reverse_y}px`;

                    end.style.left = `${start_left+(i*rate)*reverse_x}px`;
                    end.style.top = `${start_top-((i*rate)*slope)*reverse_y}px`;
                    for (let j = 0.00; j <= 1.00; j += 0.01)
                    {
                        setTimeout(() =>
                        {   
                            start.style.left = `${end_left - (i*rate)*reverse_x + (j*rate)*reverse_x}px`;
                            start.style.top = `${end_top + (i*rate)*slope*reverse_y - (j*rate)*slope*reverse_y}px`;

                            end.style.left = `${start_left + (i*rate)*reverse_x - (j*rate)*reverse_x}px`;
                            end.style.top = `${start_top - (i*rate)*slope*reverse_y + (j*rate)*slope*reverse_y}px`;

                            start.style.opacity = j;
                            end.style.opacity = j;
                            if (j >= 0.99)
                            {
                                switching_status = false;
                            }
                        }, Math.sqrt(j*t_rate).toFixed(4));
                    }
                }
            }, Math.sqrt(i*t_rate).toFixed(4));
        }
    }

    setTimeout(function result()
    {
        // console.log(arr[2].style.filter);

        let change_filter = arr[2].style.filter; // 선택한 필터
        // console.log(typeof(change_filter));
        cam_canvas.style.filter = change_filter;
        select_filter = arr[2].style.filter;
        console.log("select_filter : " +select_filter);
        // 여기 필터함수 로 들어가야할듯

        // cam_canvas.style.height = "300px";
    }, 300)
}
var select_filter = "none";
const imgs = document.querySelectorAll('#setting_frame_filter .switching_img');
const test = document.querySelector('#setting_frame_filter .switching_img');
    // 따듯한 톤
    // 채도
    // 원본
    // 어둡게
    // 차가운
let switching_status = false;
var arr = [imgs[0], imgs[1], imgs[2], imgs[3], imgs[4]];
var arr_title = ['따듯한 톤', '채도', '원본', '어둡게', '차가운'];

imgs.forEach((n) =>
{
    n.addEventListener('mouseover', function ()
    {
        const myIndex = arr.indexOf(n);
        if (myIndex != 2)
        {
            document.body.style.cursor = "pointer";
        }
    });
    n.addEventListener('mouseout', function (){document.body.style.cursor = "auto";});
    n.addEventListener("click", function()
    {
        switching(n, 2);
    });
});




//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    이미지 위치 교환하기  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    우측 카메라설정 화면 튀어나오기  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



const album = document.getElementById('shoot_div');
const cam = document.getElementById("cam_div");
const backframe = document.getElementById('setting_space_backframe');
const settingframe = document.getElementById('setting_space');

let status_setting_open = false;
let open_animation = false


const switching_img1 = document.getElementById("switching_img1"); // 따듯한
const s_img1 = switching_img1.getContext('2d');
const switching_img2 = document.getElementById("switching_img2"); // 채도
const s_img2 = switching_img2.getContext('2d');
const switching_img3 = document.getElementById("switching_img3"); // 원본
const s_img3 = switching_img3.getContext('2d');
const switching_img4 = document.getElementById("switching_img4"); // 어둡게
const s_img4 = switching_img4.getContext('2d');
const switching_img5 = document.getElementById("switching_img5"); // 차가운
const s_img5 = switching_img5.getContext('2d');


function draw_filter_cam(img_ctx,img_can, filter = 'none')
{
    try
    {
        img_ctx.drawImage(cam_img, 0, 0, switching_img1.width, switching_img1.height);
        if(filter == 'none')
        {
            img_can.style.filter = `none`;    
        }
        else
        {
            img_can.style.filter = `${filter}`;
        }
        //"blur(10px)"; 블러
        //saturate() ;  채도
        // requestAnimationFrame(draw_filter_cam(img_ctx,img_can, filter, level));
    }
    catch
    {
        setTimeout(function recovery()
        {
            draw_filter_cam(img_ctx,img_can, filter, level);
        }, 500);
    }
}


function switching_imgs_on()
{
    // 따듯한 톤
    // 채도
    // 원본
    // 어둡게
    // 차가운 settingValue
    draw_filter_cam(s_img1, switching_img1, `sepia(50%) brightness(${100+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); // 따뜻한?
    draw_filter_cam(s_img2, switching_img2,`saturate(200%) brightness(${120+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); //채도 올림
    draw_filter_cam(s_img3, switching_img3, `brightness(${100+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); //원본
    draw_filter_cam(s_img4, switching_img4, `brightness(${50+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); //밝기 (어둡게)
    draw_filter_cam(s_img5, switching_img5, `saturate(50%) brightness(${100+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); // 차가운 채도 내림
}



function open_setting()
{
    status_setting_open = true;
    open_animation = true;
    const max = 1000;
    const album_width = parseFloat(window.getComputedStyle(album).width.replace('px', ''));
    const backframe_width = parseFloat(window.getComputedStyle(backframe).width.replace('px', ''));
    const settingframe_right = parseFloat(window.getComputedStyle(settingframe).right.replace('px', ''));

    // const front_width = parseFloat(window.getComputedStyle(front_capture).height.replace('px', ''));
    
    // ul 내부 캔버스 현재 width: 320px;

    for (let i = 1; i <= max; i++)
    {
        setTimeout(() =>
        {
            album.style.width = `${album_width - 0.65*i}px`;
            cam.style.marginLeft = `${album_width - 0.65*i}px`;
            album.style.opacity = `${1 - i/max}`;
            backframe.style.width = `${backframe_width + 800*i/max}px`;
            settingframe.style.right = `${settingframe_right + 0.8*i}px`;

            // front_capture.style.height = `${front_width -0.65*i}px`;
            // left_capture.style.height = `${front_width -0.65*i}px`;
            // right_capture.style.height =`${front_width -0.65*i}px`;
            // back_capture.style.height = `${front_width -0.65*i}px`;
            
            if (i >= max)
            {           
                open_animation = false;
                album.style.opacity = '0';
                album.style.width = '1px';
                backframe.style.width = '800px';
                settingframe.style.right = `${settingframe_right + 0.8*Math.ceil(i)}px`;
                setting_btn.innerText = '닫 기';
            }
        }, Math.sqrt(i*250));
    }

    switching_imgs_on();
}

function close_setting()
{
    console.log('닫기');
    status_setting_open = false;
    open_animation = true;
    const album_width = parseFloat(window.getComputedStyle(album).width.replace('px', ''));
    const backframe_width = parseFloat(window.getComputedStyle(backframe).width.replace('px', ''));
    const settingframe_right = parseFloat(window.getComputedStyle(settingframe).right.replace('px', ''));

    const max = 1000;
    for (let i = 1000; i >= 1; i--)
    {
        setTimeout(() =>
        {
            album.style.width = `${album_width + 0.65*(max - i)}vw`;
            // console.log(i);
            cam.style.marginLeft = `${album_width + 0.65*(max - i)}px`;

            album.style.opacity = `${(1 - i/max)}`;

            backframe.style.width = `${backframe_width - 800*(max - i)/max}px`;

            settingframe.style.right = `${settingframe_right - 0.8*(max - i)}px`;
            
            if (i <= 1)
            {           
                open_animation = false;
                album.style.opacity = '1';
                album.style.width = '35vw';
                cam.style.marginLeft = "40vw";
            
                backframe.style.width = '1px';
                settingframe.style.right = `${settingframe_right - 0.8*Math.ceil(max - i)}px`;
                setting_btn.innerText = '카메라';
            }
        }, Math.sqrt((max - i)*250));
    }
}

setting_btn.addEventListener('click', function()
{
    if (open_animation == false)
    {
        if (status_setting_open == false)
        {
            open_setting();
        }
        else if (status_setting_open == true)
        {
            close_setting();
        }
    }
});


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    우측 카메라설정 화면 튀어나오기  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@







//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   필터 설정 슬라이더  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



const bright_bar = document.getElementById("bright_bar");
const color_contrast_bar = document.getElementById("color_contrast_bar");
const zoom_bar = document.getElementById("zoom_bar");

const bright_circle = document.getElementById("circle_one");
const contrast_circle = document.getElementById("circle_two");
const zoom_circle = document.getElementById("circle_three");

let slide_check = false;


  ///////////////////////////////////////////////////////////
////슬라이드바 클릭시/////
// const bright_bar = document.getElementById('bright_bar');
// const color_contrast_bar = document.getElementById('color_contrast_bar');
// const zoom_bar = document.getElementById('zoom_bar');
// const seek_bar = document.querySelectorAll('.seek-bar');

bright_bar.addEventListener("click", function (event)
{
    let ex = event.clientX;
    let y = event.offsetY;

    let bl = bright_bar.getBoundingClientRect().x;
    let target_x = ex - bl;
    let x = target_x;
    
    barClick(x, y, bright_bar);
})

color_contrast_bar.addEventListener('click', function (event)
{
    let ex = event.clientX;
    let y = event.offsetY;

    let bl = color_contrast_bar.getBoundingClientRect().x;
    let target_x = ex - bl;
    let x = target_x;

    barClick(x, y, color_contrast_bar);

})

zoom_bar.addEventListener('click', function(event)
{
    const ex = event.clientX;
    const y = event.offsetY;

    let bl = zoom_bar.getBoundingClientRect().x;
    let target_x = ex - bl;
    let x = target_x;
    barClick(x,y,zoom_bar);

})


function barClick(x, y, barName) {
    
    let bar_x = x;
    let bar_y = y;
    // console.log(bar_x);
    if(bar_x < 0)
    {
        return;
    }
    // console.log(x, y);
    // console.log(barName.id);
    const one = document.getElementById('circle_one');
    const two = document.getElementById('circle_two');
    const three = document.getElementById('circle_three');
    let thisBar = document.getElementById(barName.id);
    let oneStyle = window.getComputedStyle(thisBar);
    let width = oneStyle.width.replace("px", "");
    // let one_parent = one.parentNode;
    
    if (barName.id == 'bright_bar') {
        // console.log(one_parent);

        one.style.left = bar_x + 'px';
        // console.log(oneStyle.width);
        one.querySelector('span').innerText = Math.round((bar_x / width) * 100);
        settingValue[0] = Math.round((bar_x / width) * 100);
        bright_bar.style.background = `repeating-linear-gradient(to right, #663366 0, #663366 ${bar_x}px, white ${bar_x}px, white 250px)`;
    
    } else if (barName.id == 'color_contrast_bar') {
        two.style.left = bar_x + 'px';
        two.querySelector('span').innerText = Math.round((bar_x / width) * 100);
        settingValue[1] = Math.round((bar_x / width) * 100);
        color_contrast_bar.style.background = `repeating-linear-gradient(to right, #663366 0, #663366 ${bar_x}px, white ${bar_x}px, white 250px)`;
    
    } else if (barName.id == 'zoom_bar') {

        three.querySelector('span').innerText = 1 + parseFloat((bar_x / width).toFixed(1));
        
        settingValue[2] = 1 + parseFloat((bar_x / width).toFixed(1));
        three.style.left =  bar_x + "px";

        //////막대색상변경
        zoom_bar.style.background = `repeating-linear-gradient(to right, #663366 0, #663366 ${bar_x}px, white ${bar_x}px, white 250px)`;
    }

    switching_imgs_on();
    slider_setting();
    scale = settingValue[2];

}


var settingValue = [0,0,1];

function dragElement(elmnt) 
{
    

    let clientX_gab = 0
    let clientX = 0;
    elmnt.onmousedown = dragMouseDown;
    elmnt.addEventListener('touchstart', dragMouseDown);

    function dragMouseDown(e)
    {
        
        e.preventDefault();
        if (e.changedTouches)
        {
            e.clientX = e.changedTouches[0].clientX
        }
        
        clientX = e.clientX;
        // console.log(e.clientX); //1107
        document.onmousemove = elementDrag;

        document.onmouseup = closeDragElement;
        document.addEventListener('touchend', closeDragElement);
        document.addEventListener('touchmove', elementDrag);
    }

    function elementDrag(e)
    {
        
        e.preventDefault();
        
        if (e.changedTouches)
        {
            e.clientX = e.changedTouches[0].clientX
        }

        // console.log("e.clientX"+e.clientX);
        clientX_gab = e.clientX - clientX; // 이동 방향
        clientX = e.clientX;
        let leftVal = 0;
        let parentElmnt = elmnt.parentNode;
        // cam_canvas.parentElement.className
        
        // console.log(`parent offset left${parentElmnt.offsetLeft} 는 cn`);
        // 부모가 seek-bar네
        // console.log(`if 조건 ${clientX_gab}`);

        // console.log(`if 조건 ${elmnt.offsetLeft}`);
        
        // console.log(elmnt.offsetLeft); // 서클 Left값
        // console.log(clientX); // 마우스 X좌표
        // console.log(clientX_gab); // 마우스 무빙량
        // console.log("p of L");
        


        let px = parentElmnt.getBoundingClientRect().x; // 슬라이더의 보여지는 x위치
        

        if((elmnt.offsetLeft + clientX_gab) < 0 || clientX < px)
        {

            leftVal = 0;
        } 
        else if (clientX > px + parentElmnt.clientWidth)
        {
            //이전 조건값
            //(elmnt.offsetLeft + clientX_gab) > parentElmnt.clientWidth ||clientX > px + elmnt.clientWidth

            // console.log("else if");
            // console.log(parentElmnt.clientWidth);
            // console.log("마우스값");
            // console.log(clientX); // 약 550 정도?
            // console.log(parentElmnt.offsetLeft + parentElmnt.clientWidth +650);

            leftVal = parentElmnt.clientWidth;
            // 250
        }
        else
        {
            leftVal = (elmnt.offsetLeft + clientX_gab);
        }


        // console.log(settingValue);


        elmnt.querySelector('span').innerText = Math.round((leftVal / parentElmnt.clientWidth) * 100);
        if(elmnt.id === 'circle_one')
        {
            settingValue[0] = Math.round((leftVal / parentElmnt.clientWidth) * 100);
        }
        else if(elmnt.id === 'circle_two')
        {
            settingValue[1] = Math.round((leftVal / parentElmnt.clientWidth) * 100);
        }
        else if(elmnt.id === 'circle_three')
        {
            settingValue[2] = Math.round((leftVal / parentElmnt.clientWidth) * 100);
        }

        switching_imgs_on();
        slider_setting();
        elmnt.style.left = leftVal + "px";
        
        //////막대색상변경
        parentElmnt.style.background = `repeating-linear-gradient(to right, #663366 0, #663366 ${leftVal}px, white ${leftVal}px, white 250px)`;
    }

    function closeDragElement()
    {
        document.onmouseup = null;
        document.removeEventListener('touchend', closeDragElement);
        document.onmousemove = null;
        document.removeEventListener('touchmove', elementDrag);
        // console.log(settingValue);
        //여기서 바로 값 넘겨줘야......
    }
}



/////////////////////////////배율//////////////////////////////////////////////
function dragElementX(elmnt)
{
    let clientX_gab = 0, clientX = 0;
    elmnt.onmousedown = dragMouseDown;
    elmnt.addEventListener('touchstart', dragMouseDown)
    function dragMouseDown(e)
    {
        e.preventDefault();
        if (e.changedTouches)
        {
            e.clientX = e.changedTouches[0].clientX
        }
        clientX = e.clientX;
        document.onmouseup = closeDragElement;
        document.addEventListener('touchend', closeDragElement);
        document.onmousemove = elementDrag;
        document.addEventListener('touchmove', elementDrag);
    }

    function elementDrag(e)
    {
        e.preventDefault();
        let parentElmnt = elmnt.parentNode;

        let px = parentElmnt.getBoundingClientRect().x; // 슬라이더의 보여지는 x위치
        clientX_gab = e.clientX - clientX;
        clientX = e.clientX;
        let leftVal = 1;

        
        if (e.changedTouches)
        {
            e.clientX = e.changedTouches[0].clientX
        }
        if ((elmnt.offsetLeft + clientX_gab) < 0 ||clientX < px)
        {
            leftVal = 1;
        }
        else if (clientX > (px + parentElmnt.clientWidth))
        {
            //(elmnt.offsetLeft + clientX_gab) > parentElmnt.clientWidth ||clientX > (parentElmnt.offsetLeft + parentElmnt.clientWidth)
            leftVal = parentElmnt.clientWidth;
        }
        else
        {
            leftVal = (elmnt.offsetLeft + clientX_gab);
        }
    //    elmnt.querySelector('span').innerText = Math.round((leftVal / parentElmnt.clientWidth) * 100);
    
        elmnt.querySelector('span').innerText =1 + parseFloat((leftVal / parentElmnt.clientWidth).toFixed(1));
        // console.log(elmnt.id,"id값");


        settingValue[2] = 1 + parseFloat((leftVal / parentElmnt.clientWidth).toFixed(1));
        elmnt.style.left = leftVal + "px";
        scale = settingValue[2];
        //////막대색상변경
        parentElmnt.style.background = `repeating-linear-gradient(to right, #663366 0, #663366 ${leftVal}px, white ${leftVal}px, white 250px)`;
    }

    function closeDragElement()
    {
        document.onmouseup = null;
        document.removeEventListener('touchend', closeDragElement);
        document.onmousemove = null;
        document.removeEventListener('touchmove', elementDrag);
        // console.log(settingValue);
        //여기서 바로 값 넘겨줘야......
    }
}


dragElement(document.getElementById('circle_one'));
dragElement(document.getElementById('circle_two'));
dragElementX(document.getElementById('circle_three'));


    //기본값으로 초기화할 때 필요한 변수
        

let offset = { x: 0, y: 0 };
let isDragging = false;
let circle = document.querySelectorAll('.circle');
////////////////////값 초기화///////////////////////
function settingDefault()
{
    
    const one = document.getElementById('circle_one');
    const two = document.getElementById('circle_two');
    const three = document.getElementById('circle_three');

    circle.forEach(function (c)
    {
        c.style.left = 0;
        let parent = c.parentNode;
        parent.style.background = 'white';
        // c.querySelector('span').innerText = 0;
        one.querySelector('span').innerText = 0;
        two.querySelector('span').innerText = 0;
        three.querySelector('span').innerText = 1;
    })

    settingValue = [0,0,1];
    // console.log(settingValue);
}


// draw_filter_cam(s_img1, switching_img1, `sepia(50%) brightness(${100+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); // 따뜻한?
// draw_filter_cam(s_img2, switching_img2,`saturate(200%) brightness(${120+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); //채도 올림
// draw_filter_cam(s_img3, switching_img3, `none brightness(${100+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); //원본
// draw_filter_cam(s_img4, switching_img4, `brightness(${50+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); //밝기 (어둡게)
// draw_filter_cam(s_img5, switching_img5, `saturate(50%) brightness(${100+settingValue[0]}%) contrast(${100+settingValue[1]}%)`); // 차가운 채도 내림
function slider_setting()
{
    cam_canvas.style.filter = arr[2].style.filter;
}


//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@   필터 설정 슬라이더  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@




//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@    필터 정보 전송      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

setTimeout(function send_setting()
{
    //                                  밝기, 대비, 비율 순서
    let now_cam_filter = cam_canvas.style.filter
    let set_save = {"filter":now_cam_filter, "slider_value":settingValue}
    socket.emit("cam_setting_value_send", set_save);
    setTimeout(send_setting, 3000);
}, 3000);


socket.on("cam_setting_res", function(data)
{
    console.log("카메라 설정 응답");
    console.log(data);

    data.filter;
    data.slider
    
    settingValue = data.slider;
    cam_canvas.style.filter = data.filter;
    // slider_setting();
    // let set_values = [data.brightness, data.contrast, data.scale];
    scale = data.slider[2];
    // settingValue = set_values;

    slider_control(bright_bar, bright_circle, data.slider[0]);
    slider_control(color_contrast_bar, contrast_circle, data.slider[1]);
    slider_control_zoom(data.slider[2]);
    // slider_control(zoom_bar, zoom_circle, data.slider[2]);
});

function slider_control(bar = bright_bar, circle = bright_circle ,res_value)
{
    let w = Number(getComputedStyle(bar).width.replace('px',''));
    circle.querySelector('span').innerText = res_value;
    
    
    
    let target_left = (w/100) * res_value;

    circle.style.left = `${target_left}px`;
    bar.style.background = `repeating-linear-gradient(to right, #663366 0, #663366 ${target_left}px, white ${target_left}px, white 250px)`;
}
function slider_control_zoom(res_value)
{
    let w = Number(getComputedStyle(zoom_bar).width.replace('px', ''));
    let target = (res_value - 1) * (w);    
    zoom_circle.querySelector('span').innerText = res_value;
    zoom_circle.style.left = `${target}px`
    zoom_bar.style.background = `repeating-linear-gradient(to right, #663366 0, #663366 ${target}px, white ${target}px, white 250px)`;

}


// 체중 변화 멘트
const inform_input_frame = document.getElementById('inform_input_frame');
const inform_space = document.getElementById('inform_space');

let show_input_once = false;

inform_space.addEventListener('mouseover', function()
{
    inform_input_frame.className = 'showme';
});


