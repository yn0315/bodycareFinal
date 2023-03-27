let doing_anima = false;
let menu_status = 'close';
let max = 80;

window.onload = function ()
{
    show_cover();
}

const coverpage_1 = document.getElementById('coverpage_1');
const coverpage_2 = document.getElementById('coverpage_2');
const coverpage_3 = document.getElementById('coverpage_3');

const coverpage_1_content = document.getElementById("coverpage_1_content");
const coverpage_2_content = document.getElementById("coverpage_2_content");
const coverpage_3_content = document.getElementById("coverpage_3_content");

function show_cover()
{
    coverpage_1.style.width = '0%';
    coverpage_2.style.width = '0%';
    coverpage_3.style.width = '0%';

    for (let i = 1; i <= 10000; i++)
    {
        setTimeout( () =>
        {
            coverpage_3.style.width = `${i/100}%`;
            if (i >= 10000)
            {
                for (let j = 1; j <= 6666; j++)
                {   
                    setTimeout( () =>
                    {
                        coverpage_2.style.width = `${j/100}%`;
                        coverpage_3.style.width = `${i/100 - j/100}%`;
                        if (j >= 6666)
                        {
                            for (let m = 1; m <= 3333; m++)
                            {
                                setTimeout(() =>
                                {
                                    coverpage_1.style.width = `${m/100}%`;
                                    coverpage_2.style.width = `${j/100 - m/100}%`;
                                    coverpage_3.style.width = `${i/100 - j/100}%`;
                                    if (m >= 3333)
                                    {
                                        setTimeout(() =>
                                        {
                                            show_smooth(coverpage_3_content, 50, 40);
                                        }, 50);
                                        setTimeout(() =>
                                        {
                                            show_smooth(coverpage_2_content, 50, 40);
                                        }, 150);
                                        setTimeout(() =>
                                        {
                                            show_smooth(coverpage_1_content, 50, 40);
                                            coverpage_1_content.addEventListener("mousemove", function (){document.body.style.cursor = "pointer";});
                                            coverpage_1_content.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});
                                            coverpage_2_content.addEventListener("mousemove", function (){document.body.style.cursor = "pointer";});
                                            coverpage_2_content.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});
                                            coverpage_3_content.addEventListener("mousemove", function (){document.body.style.cursor = "pointer";});
                                            coverpage_3_content.addEventListener("mouseout", function (){document.body.style.cursor = "auto";});

                                            coverpage_1_content.addEventListener("click", hide_first_page);
                                            coverpage_2_content.addEventListener("click", hide_first_page);
                                            coverpage_3_content.addEventListener("click", hide_first_page);
                                        }, 250);
                                    }
                                }, Math.sqrt(m*18));
                            }
                        }
                    }, Math.sqrt(j*12));
                }
            }
        }, 400 + Math.sqrt(i*6));
    }
}

function hide_first_page(event)
{
    let parent = event.target;
    let search_count = 1;
    while (parent !== coverpage_1 && parent !== coverpage_2 && parent !== coverpage_3)
    {
        parent = parent.parentNode;
        search_count++;
        if (search_count > 5)
        {
            alert('부모요소 탐색 실패');
            return;
        }
    }
    localStorage.setItem('넘어갈화면', `${parent.id}`);

    coverpage_1_content.removeEventListener("click", hide_first_page);
    coverpage_2_content.removeEventListener("click", hide_first_page);
    coverpage_3_content.removeEventListener("click", hide_first_page);

    let hide_slide_rate1 = 50;
    setTimeout(() =>
    {
        hide_smooth(coverpage_3_content, 50, 30);
    }, hide_slide_rate1);
    setTimeout(() =>
    {
        hide_smooth(coverpage_2_content, 50, 30);
    }, hide_slide_rate1*3);
    setTimeout(() =>
    {
        hide_smooth(coverpage_1_content, 50, 30);
    }, hide_slide_rate1*5);
    let hide_slide_rate2 = 9;
    setTimeout(() =>
    {
        for (let i = 1; i <= 3333; i++)
        {
            setTimeout( () =>
            {
                coverpage_2.style.width = `${33.33 + i/100}%`;
                coverpage_1.style.width = `${33.33 - i/100}%`;
                if (i >= 3333)
                {
                    for (let j = 1; j <= 6666; j++)
                    {   
                        setTimeout( () =>
                        {
                            coverpage_3.style.width = `${33.33 + j/100}%`;
                            coverpage_2.style.width = `${66.66 - j/100}%`;
                            if (j >= 6666)
                            {
                                for (let m = 1; m <= 10000; m++)
                                {
                                    setTimeout(() =>
                                    {
                                        coverpage_3.style.width = `${100 - m/100}%`;
                                        if (m >= 10000)
                                        {
                                            //window.location.href = "http://127.0.0.1:5500/ani_test0302.html";
                                        }
                                    }, Math.sqrt(m*hide_slide_rate2));
                                }
                            }
                        }, Math.sqrt(j*hide_slide_rate2*2));
                    }
                }
            }, 150 + Math.sqrt(i*hide_slide_rate2*3));
        }
    }, 550);
    setTimeout(function()
    {
        if (parent.id == 'coverpage_1') {
            location.href = "http://localhost:3300/page_search";
            localStorage.removeItem('넘어갈화면');
            localStorage.setItem('넘어갈화면', '/page_search');
        }
        else if (parent.id == 'coverpage_2') {
    
            location.href = "http://localhost:3300/chart";
            localStorage.removeItem('넘어갈화면');
            localStorage.setItem('넘어갈화면', '/chart');
        }
        else if (parent.id == 'coverpage_3') {
            location.href = "http://localhost:3300/record";
            localStorage.removeItem('넘어갈화면');
            localStorage.setItem('넘어갈화면', '/record');
        }
        show_cover();
    }, 2000);
    

}



function hide_smooth(el, padding, rate)
{
    for (let i = 0.01; i <= 1.00; i += 0.01)
    {
        setTimeout(() =>
        {
            el.style.opacity = 1 - i;
            el.style.paddingTop = `-${1000*i*padding}px`;
        }, Math.sqrt(i*5000*rate));
    }
}

function show_smooth(el, padding, rate)
{
    el.style.paddingTop = `${padding}px`;
    for (let i = 0.01; i <= 1.00; i += 0.01)
    {
        setTimeout(() =>
        {
            el.style.opacity = i;
            el.style.paddingTop = `${padding - i*padding}px`;
        }, Math.sqrt(i*5000*rate));
    }
}