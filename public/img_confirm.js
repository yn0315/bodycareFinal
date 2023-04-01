
console.log("img confirm.js 로드");
const get_img_confirm = document.getElementById("img_confirm_border");
get_img_confirm.addEventListener("mouseover", function (){
    document.body.style.cursor = "pointer";
    get_img_confirm.className = "img_confirm_border_over";
});
get_img_confirm.addEventListener("mouseout", function (){
    document.body.style.cursor = "auto";
    get_img_confirm.className = "img_confirm_border";
});
get_img_confirm.addEventListener("click", function ()
{
    // alert("확인 버튼 클릭");
    
    socket.emit("kg_change_req", kg_change.value)

    // location.href = 'http://192.168.0.47:3300/page_chart';
});

let kg_change = document.getElementById('inform_input');


kg_change.addEventListener('keyup', function(e)
{
    console.log(e)
    

    let newvalue = kg_change.value.replace(/[^0-9]/g, ''); // 숫자 아닌 것 삭제

    kg_change.value = newvalue;
    if(e.key == 'Enter')
    {
        socket.emit('kg_change_req', kg_change.value)
    }
})
socket.on('wei_is_number', function(data)
{
    kg_change.value = "";
})
socket.on('kg_change_res', function(data)
{
    location.href = 'http://192.168.0.47:3300/page_chart';
})











const img_group = document.querySelectorAll('#img_group .frame_class .img_class');
const text_group = document.querySelectorAll('#img_group .frame_class .text_class');
const frame_group = document.querySelectorAll('#img_group .frame_class');

let current_zoom = false;
img_group.forEach((n) =>
{
    n.addEventListener("mouseover", function (){document.body.style.cursor = "pointer";});
    n.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});


    n.addEventListener('click', function (){
        if (current_zoom == false)
        {
            const siblings_text = Array.from(text_group);
            const textSiblings = siblings_text.filter(el => el !== n && el.classList.contains('text_class'));
            const siblings = Array.from(img_group);
            const imgSiblings = siblings.filter(el => el !== n && el.classList.contains('img_class'));
            const siblings_frame = Array.from(frame_group);
            const frameSiblings = siblings_frame.filter(el => el !== n.parentElement && el.classList.contains('frame_class'));

            const default_width = 320;
            const default_height = 240;
            const default_far = 240;

            const zoom_width = 520;
            const zoom_height = 420;

            //const zoom_width = 500;
            // const zoom_height = 720;
            const zoom_far = 560;
            
            const zoom_speed = 0.1;
            const zoom_mul = 1.4;

            const img_zoom_time = 900;

            const get_select_style = window.getComputedStyle(n);
            const get_select_width = parseInt(get_select_style.width.replace('px', ''));
            const get_select_height = parseInt(get_select_style.height.replace('px', ''));

            const get_parent_style = window.getComputedStyle(n.parentElement);
            const get_select_far = parseInt(get_parent_style.width.replace('px', ''));
        
            if (get_select_width != zoom_width && get_select_height != zoom_height && get_select_far != zoom_far)
            {
                current_zoom = true;
                // 선택된 이미지 제외한 나머지 이미지 크기 및 여백 기본으로
                
                // 제목
                textSiblings.forEach((m) =>
                {
                    const get_text = m.innerText;
                    if (get_text == '정면')
                    {
                        m.innerText = "앞";
                    }
                    else if (get_text == '좌측')
                    {
                        m.innerText = "좌";
                    }
                    else if (get_text == '우측')
                    {
                        m.innerText = "우";
                    }
                    else if (get_text == '뒤쪽')
                    {
                        m.innerText = "뒤";
                    }
                });

                // 이미지
                imgSiblings.forEach((m) =>
                {
                    const get_style = window.getComputedStyle(m);
                    const get_width = parseInt(get_style.width.replace('px', ''));
                    const get_height = parseInt(get_style.height.replace('px', ''));
                    
                    if (get_width == zoom_width && get_height == zoom_height)
                    {
                        // console.log("여기");
                        for (let i = 0; i <= zoom_width-default_width; i++)
                        {
                            setTimeout(() =>
                            {
                                m.style.width = `${get_width - i}px`;
                            }, img_zoom_time / Math.sqrt((zoom_width-default_width -i+10).toFixed(5)));
                        }
                        for (let i = 0; i <= zoom_height-default_height; i++)
                        {
                            setTimeout(() =>
                            {
                                m.style.height = `${get_height - i}px`;
                            }, img_zoom_time / Math.sqrt((zoom_height-default_height -i+10).toFixed(5)));
                        }
                    }
                });

                // 여백
                frameSiblings.forEach((m) =>
                {
                    const get_style = window.getComputedStyle(m);
                    const get_far = parseInt(get_style.width.replace('px', ''));
                    if (get_far == zoom_far)
                    {
                        for (let i = 0; i <= zoom_far-default_far; i++)
                        {  
                            setTimeout(() =>
                            {
                                m.style.width = `${get_far - i}px`;
                            }, zoom_speed * (i**zoom_mul));
                        }
                    }
                });

                // 선택된 이미지 및 여백 확대시키기
                let select_wzoom_status = false;
                let select_hzoom_status = false;
                let far_zoom_status = false;

                const get_text_title = n.parentElement.querySelector('.text_class');
                // 제목
                if (get_text_title.innerText == '앞')
                {
                    setTimeout( () =>
                    {
                        get_text_title.innerText = '정면';
                    }, 250);
                }
                else if (get_text_title.innerText == '좌')
                {
                    setTimeout( () =>
                    {
                        get_text_title.innerText = '좌측';
                    }, 250);
                }
                else if (get_text_title.innerText == '우')
                {
                    setTimeout( () =>
                    {
                        get_text_title.innerText = '우측';
                    }, 250);
                }
                else if (get_text_title.innerText == '뒤')
                {
                    setTimeout( () =>
                    {
                        get_text_title.innerText = '뒤쪽';
                    }, 250);
                }

                // 이미지
                for (let i = 0; i <= zoom_width-default_width; i++)
                {
                    setTimeout(() =>
                        {
                            n.style.width = `${get_select_width + i}px`;
                            if (i >= zoom_width-default_width)
                            {
                                select_wzoom_status = true;
                                if (select_hzoom_status && select_wzoom_status && far_zoom_status)
                                {
                                    current_zoom = false;
                                }
                            }
                            
                            
                        }, 200+ (img_zoom_time / Math.sqrt(zoom_width-default_width -i+10).toFixed(5)));
                }
                for (let i = 0; i <= zoom_height-default_height; i++)
                {
                    setTimeout(() =>
                        {
                            n.style.height = `${get_select_height + i}px`;
                            if (i >= zoom_height-default_height)
                            {
                                select_hzoom_status = true;
                                if (select_hzoom_status && select_wzoom_status && far_zoom_status)
                                {
                                    current_zoom = false;
                                }
                            }
                        }, 200+ (img_zoom_time / Math.sqrt(zoom_height-default_height -i+10).toFixed(5)));
                }

                // 여백
                for (let i = 0; i <= zoom_far-default_far; i++)
                {
                    setTimeout(() =>
                    {
                        n.parentElement.style.width = `${get_select_far + i}px`;
                        if (i >= zoom_far-default_far)
                        {
                            far_zoom_status = true;
                            if (select_hzoom_status && select_wzoom_status && far_zoom_status)
                            {
                                current_zoom = false;
                            }
                        }
                    }, 200+ (zoom_speed * (i**zoom_mul)));
                }
            }
        }
    });
});









// 메뉴 펼치기
function open_menu_event() {
    const $menu_open = document.getElementById('menu_open');
    const $close = document.getElementById('menu');
    const $menu_icon = document.querySelectorAll('#menu_icon');
    const $arrow = document.getElementById('open');

    const $place = document.getElementById('place');
    const $chartSection = document.getElementsByClassName('chart_section');
    


    $close.className = 'menu_open';
   
    $close.style.width = '10vw';
    $arrow.className = 'invisible';

    for (let i = 0; i < $menu_icon.length; i++) {

        $menu_icon.item(i).className = '';
    }

}

//메뉴 닫기
function close_menu_event() {
    const $menu_open = document.getElementById('menu_open');
    const $close = document.getElementById('menu');
    const $menu_icon = document.querySelectorAll('#menu_icon');
    const $arrow = document.getElementById('open');
    const $place = document.getElementById('place');
    const $chartSection = document.getElementsByClassName('chart_section');


    $close.className = 'menu_close';
    $close.style.width = '7vw';
    
    $arrow.className = '';

    for (let i = 0; i < $menu_icon.length; i++) {

        $menu_icon.item(i).className = 'invisible';
    }

}