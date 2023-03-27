window.addEventListener('load', function()
{
    // 첫 시작 화면
    slide_img(img_loading1, tooltip1);
    new create_wave();

    this.setTimeout(() =>
    {
        // 슬라이드 시작 및 프로그레스바 목표치 랜덤 추가 // 프로그레스바 애니메이션 진행 시작
        random_event = setInterval(random_progress_event, 440);
        play_progress = setInterval(update_progress, 10);
        slide_interval = setInterval(slide_function, 1600);
    }, 345);
});


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
        this.max = Math.random()*100 + 350;
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


let random_event;
let play_progress;
const progress_bar = document.querySelector('#page_progress_bar .progress-bar');
const progress_texts = document.querySelectorAll('#page_progress_bar .progress-text');

const loading_slide = document.getElementById('loading_slide');
const loading_img = document.getElementById('loading_img');
const tooltip = document.getElementById('tooltip');

function random_progress_event()
{
    // console.log('랜덤 증가 함수 호출');
    let v1 = randNUM(0, 5);
    let v2 = randNUM(0, 50)/25;
    let v3 = randNUM(0, 100)/55;
    let randvalue = parseFloat((v1 + v2 + v3).toFixed(5));
    if (purpose_progress + randvalue >= 100)
    {
        purpose_progress = 100;
        console.log('목표진행률 100%까지 증가');

        clearInterval(random_event);
        console.log('random_event 인터벌 종료');
    }
    else
    {
        purpose_progress += randvalue;
        // console.log(`진행률 증가 : ${typeof purpose_progress}`);
        // console.log(`진행률 증가2 : ${typeof current_progress}`);
    }
}

function inner_hightlight(text)
{
    return `<span style="font-size: 28px; color: rgba(214, 96, 149, 0.9);">${text}</span>`;
}

let img_loading1 = `img_loading1.png`;
let img_loading2 = `img_loading2.png`;
let img_loading3 = `img_loading3.png`;


let img_loading5 = `img_loading5.png`;

let tooltip1 =
`${inner_hightlight('촬영자의 신규 정보 입력')}<br><br>
<img class="test_icon_normal" src="enter_icon.png">  입력 완료<br>
<img class="test_icon_normal" src="esc_icon.png">  입력 취소`;
let tooltip2 =
`${inner_hightlight('촬영자의 세부 정보 선택')}<br><br>
<img class="test_icon_arrow" src="up_key.png"><img class="test_icon_arrow" src="down_key.png">  이동하기<br>
<img class="test_icon_normal" src="enter_icon.png">  선택하기<br>
<img class="test_icon_normal" src="esc_icon.png">  다른 이름으로 검색`;
let tooltip3 =
`${inner_hightlight('촬영 중')}<br><br>
<img class="test_icon_normal" src="enter_icon.png">  촬영하기<br>
<img class="test_icon_backspace" src="backspace_icon.png">  방금 촬영한 사진 삭제<br>`;


let tooltip5 =
`${inner_hightlight('맨 위로 스크롤')}<br><br>
스크롤 막대가 있는 경우<br>
<img class="test_icon_top" src="totop2.png">를 클릭하여 화면 맨 위로 갑니다.
`;

let slide_data = [
    {img : img_loading1, text : tooltip1},
    {img : img_loading2, text : tooltip2},
    {img : img_loading3, text : tooltip3},
    {img : img_loading5, text : tooltip5}
]

let slide_step = 0;
let slide_interval;

function slide_function()
{
    console.log('interval 실행');
    console.log(slide_step);
    slide_img(slide_data[slide_step].img, slide_data[slide_step].text);
}


function slide_img(img, text)
{
    // let loading_slide_style = window.getComputedStyle(loading_slide);
    for (let i = 1; i <= 100; i++)
    {
        // let left = parseInt(loading_slide_style.left.replace('px', ''));
        setTimeout(() => {
            if (i == 50)
            {
                loading_img.style.backgroundImage = `url(${img})`;
                tooltip.innerHTML = text;
                // loading_slide.style.left = `${left + 4*i}px`;
            }

            if (i <= 50)
            {
                loading_slide.style.opacity = `${1 - (i/100)}`;
                // loading_slide.style.left = `${left - 2}px`;
            }
            else if (i >= 51)
            {
                loading_slide.style.opacity = `${0.5 + (i-50)/100}`;
                // loading_slide.style.left = `${left - 2}px`;
            }
            if (i == 100)
            {
                slide_step++;
                if (slide_step == slide_data.length)
                {
                    slide_step = 0;
                }
            }
        }, i*8.8);
    }
}

// const progress_bar = document.querySelector('#page_progress_bar .progress-bar');
// const get_progress = parseFloat(window.getComputedStyle(progress_bar).width.replace('%', ''));
let animation_status = false;
let stop_animation = false;

let current_progress = 0;
let purpose_progress = 0;
function update_progress()
{
    const speed = 0.09;
    //const get_progress = parseFloat(window.getComputedStyle(progress_bar).width.replace('%', ''));
    if (purpose_progress < current_progress + speed)
    {
        current_progress = purpose_progress;
        progress_bar.style.width = `${purpose_progress}%`;
        if (current_progress >= 100)
        {
            clearInterval(play_progress);
            console.log('play_progress 인터벌 종료');
            console.log(current_progress);
            console.log(purpose_progress);
            for (let i = 0; i < progress_texts.length; i++)
            {
                progress_texts[i].innerText = '분석이 완료되었습니다.';
                progress_texts[i].className = 'progress-text-glitch';
            }
            
            clearInterval(slide_interval);
            let rotate_square = document.querySelector('#loading_frame .loader');
            rotate_square.className = '';
        }
    }
    else
    {
        if (purpose_progress - current_progress > 2*speed)
        {
            // console.log('로딩바속도up');
            current_progress += 2*speed;    
        }
        else
        {
            current_progress += speed;
        }
        progress_bar.style.width = `${current_progress}%`;
    }
}