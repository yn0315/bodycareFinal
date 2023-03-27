

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

        setTimeout(function loading_close()
        {
            loading_frame.style.display = "none";
            const $album = document.getElementById('album_div');
            $album.className = "";
        }, 3000)
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
"/img/img_loading1.png"

// /img/back2.png"
let img_loading1 = `/img/img_loading1.png`;
let img_loading2 = `/img/img_loading2.png`;
let img_loading3 = `/img/img_loading3.png`;


let img_loading5 = `/img/img_loading5.png`;

let tooltip1 =
`${inner_hightlight('촬영자의 신규 정보 입력')}<br><br>
<img class="test_icon_normal" src="/img/enter_icon.png">  입력 완료<br>
<img class="test_icon_normal" src="/img/esc_icon.png">  입력 취소`;
let tooltip2 =
`${inner_hightlight('촬영자의 세부 정보 선택')}<br><br>
<img class="test_icon_arrow" src="/img/up_key.png"><img class="test_icon_arrow" src="/img/down_key.png">  이동하기<br>
<img class="test_icon_normal" src="/img/enter_icon.png">  선택하기<br>
<img class="test_icon_normal" src="/img/esc_icon.png">  다른 이름으로 검색`;
let tooltip3 =
`${inner_hightlight('촬영 중')}<br><br>
<img class="test_icon_normal" src="/img/enter_icon.png">  촬영하기<br>
<img class="test_icon_backspace" src="/img/backspace_icon.png">  방금 촬영한 사진 삭제<br>`;


let tooltip5 =
`${inner_hightlight('맨 위로 스크롤')}<br><br>
스크롤 막대가 있는 경우<br>
<img class="test_icon_top" src="/img/totop2.png">를 클릭하여 화면 맨 위로 갑니다.
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