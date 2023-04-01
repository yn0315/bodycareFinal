
var socket = io();
        
const ani_canvas_arr = [];
const border = document.getElementById("botate")

var key_check = true;
const shoot_div = document.getElementById("shoot_div");
const cam_canvas = document.getElementById('cam_canvas');

const cam_img = document.getElementById('shoot_img');

const front_capture = document.getElementById('front_capture');
const right_capture = document.getElementById('right_capture');
const left_capture = document.getElementById('left_capture');
const back_capture = document.getElementById('back_capture');

const album_front = document.getElementById('album_front');
const album_left = document.getElementById('album_left');
const album_right = document.getElementById('album_right');
const album_back = document.getElementById('album_back');

const front_con = front_capture.getContext('2d');
const right_con = right_capture.getContext('2d');
const left_con = left_capture.getContext('2d');
const back_con = back_capture.getContext('2d');

// const cam_bodercon = cam_border.getContext('2d');

const cam_con = cam_canvas.getContext('2d');


const fcap_style = getComputedStyle(front_capture);
const rcap_style = getComputedStyle(right_capture);
const lcap_style = getComputedStyle(left_capture);
const bcap_style = getComputedStyle(back_capture);

const album_fcon = album_front.getContext('2d');
const album_lcon = album_left.getContext('2d');
const album_rcon = album_right.getContext('2d');
const album_bcon = album_back.getContext('2d');

// const left_arrow = document.getElementById("left_arrow");
// const arrow = getComputedStyle(left_arrow);
const p_tag = document.getElementsByClassName("direction_text");

document.body.style.overflow = "hidden";

// p_tag[0].style.borderTop = "3px solid rgb(134, 101, 183)";
class RotationCircle
{
    constructor(number)
    {
        this.circle = document.createElement("p");
        
        this.circle.style.position = "absolute";
        this.circle.style.background = "transparent";
        // this.circle.style.borderRadius = "50%";
        this.circle.style.width = "50px";
        this.circle.style.height = "50px";
        this.circle.style.marginTop = "110px";
        this.circle.style.marginLeft = "140px";
        
        shoot_div.appendChild(this.circle);
        // p_tag[number].appendChild(this.circle);
        // front_capture.appendChild(this.circle);
        this.circle.style.zIndex = "10";
        // front_capture.appendChild(this.circle);


    }

    add_class()
    {
        this.circle.id = "spin_circle";
        // this.circle.className = "spin_circle";
    }

    remove_class()
    {
        this.circle.className = "invisible";
    }

}
// let rc = new RotationCircle(0);
// rc.add_class();


const wave = document.getElementById("wave");
const wave2 = document.getElementById("wave2");

const rec = document.getElementById("now_rec");

console.log("스크립트 실행");

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@



const frame = document.getElementById("shutter_frame");

const cam_div = document.getElementById("cam_div");
class Corner
{

    standard_raidus = 20;
    extra_radius = 5;
    border_width = 10;
    constructor(ml, mt, border_arr)
    {
        this.div = document.createElement("div");
        this.div.style.position = "absolute" ;
        this.div.style.width = "5vw";
        this.div.style.height = "10vh";
        this.div.style.marginLeft = `${ml}%`;
        this.div.style.marginTop = `${mt}%`;
        // this.div.style.borderRadius = "20%";
        
        // this.div.style.border = "10px solid black";
        
        this.border_arr = border_arr;
        
        this.border_trans = [];

        this.border_trans_result();
        cam_div.appendChild(this.div);
    }

    border_trans_result()
    {
        // t r b l
        for(let i = 0 ; i < this.border_arr.length ; i++)
        {
            if(this.border_arr[i] == 0)
            {
                this.border_trans.push("transparent");
            }
            else if(this.border_arr[i]==1)
            {
                this.border_trans.push(`${this.border_width}px solid black`);
            }
        }


        this.div.style.borderTop = this.border_trans[0];
        this.div.style.borderRight = this.border_trans[1];
        this.div.style.borderBottom = this.border_trans[2];
        this.div.style.borderLeft = this.border_trans[3];
        
    }

    top_left_radius()
    {
        this.div.style.borderTopLeftRadius = `${this.standard_raidus}%`;
        this.div.style.borderBottomLeftRadius = `${this.extra_radius}%`;
        this.div.style.borderTopRightRadius =  `${this.extra_radius}%`;
    }
    top_right_radius()
    {
        this.div.style.borderTopRightRadius =  `${this.standard_raidus}%`;
        this.div.style.borderTopLeftRadius =  `${this.extra_radius}%`;
        this.div.style.borderBottomRightRadius =  `${this.extra_radius}%`;
    }
    bot_left_radius()
    {
        this.div.style.borderBottomLeftRadius =  `${this.standard_raidus}%`;
        this.div.style.borderTopLeftRadius =  `${this.extra_radius}%`;
        this.div.style.borderBottomRightRadius =  `${this.extra_radius}%`;
    }
    bot_right_radius()
    {
        this.div.style.borderBottomRightRadius = `${this.standard_raidus}%`;
        this.div.style.borderBottomLeftRadius =  `${this.extra_radius}%`;
        this.div.style.borderTopRightRadius = `${this.extra_radius}%`;
    }

    hidden_div()
    {
        this.div.className = "invisible";
    }
}

                // t r b l
let corner_left = 1;    
let corner_right = corner_left+77;
let corner_top = 0; 
let corner_bot = corner_top + 103;


// let cam_x = cam_canvas.getBoundingClientRect().x;

let tl = new Corner(corner_left, corner_top, [1,0,0,1]);
tl.top_left_radius();
let tr = new Corner(corner_right, corner_top, [1,1,0,0]);
tr.top_right_radius();
let bl = new Corner(corner_left, corner_bot, [0,0,1,1]);
bl.bot_left_radius();
let br = new Corner(corner_right, corner_bot, [0,1,1,0]);
br.bot_right_radius();



let corner_arr = [tl, tr, bl, br];

class Shutter
{
    constructor()    
    {
        this.div = document.createElement("div");
        
        



        this.div.style.position = "absolute";
        this.div.style.width = "1650px";
        this.div.style.height = "700px";


        // this.div.style.width = "100vw";
        // this.div.style.height = "75vh";
        this.div.style.overflow = "hidden";


        

        
        this.div.style.borderBottomLeftRadius = "100%";

        // this.div.style.borderRadius = "50%";
        this.div.style.background = "linear-gradient(black 5%, #696969 100%)";
        // this.div.style.background = "black";
        // this.div.style.backgroundImage = "linear-gradient(black, gray)";
        
        frame.appendChild(this.div);
        // this.createIncircle();
        
    }

}

const pi = Math.PI;
function toRad(deg)
{
    return deg*(pi/180);
}


async function draw_shutter()
{
    let angle = 0;
    let w = -590;
    let h = -40;
    // let w= 10;
    // let h = 10;
    let c = 10;
    let rad = 830;
    // let rad = 110;
    const ang = 80;
    const spd = 15;
    //16
    let circle_arr = [];
    for(let i = 0; i < c; i++)
    {
        let div = new Shutter();
        div.div.style.marginLeft = `${w+rad*Math.cos(toRad(angle))}px`;
        div.div.style.marginTop = `${h+rad*Math.sin(toRad(angle))}px`;
        if(i == 0)
        {
            div.div.style.zIndex = -c;
        }
        else
        {
            div.div.style.zIndex = `${c-i}`;
        }
        
        div.div.style.transform=`rotate(${angle-ang}deg)`;
        circle_arr.push(div.div);
        angle += (360/c);
    }

    let ac = ang;
    
    
    await setTimeout(function close()
    {
        let a = 0;   
        for(let i = 0 ; i<circle_arr.length; i++)
        {
            circle_arr[i].style.transform = `rotate(${a-ac}deg)`;
            a += (360/c);
        }
        ac -= 8
        if(ac <= 8)
        {
            console.log(ac);
            return;
        }
        
        setTimeout(close,spd);
    })

    
    

    let ao =4;
    await setTimeout(function open()
    {
        let a = 0;   
        
        
        for(let i = 0 ; i<circle_arr.length; i++)
        {
            circle_arr[i].style.transform = `rotate(${a-ao}deg)`;
            a += (360/c);
        }
        ao += 10
        if(ao >= ang)
        {
            console.log("draw shutter끝");
            return;
        }
        setTimeout(open,spd);
    },400)


    return new Promise(function(resolve, reject)
    {
        let state = "capture_effect";
        resolve(state);
        console.log(state);
    });

}


class Ptag
{
    constructor(parent, text, mt, ml)
    {
        this.p =  document.createElement("p");
        this.p.style.position = "absolute";
        this.p.style.fontFamily = "Malgun Gothic" 
        this.p.style.fontSize = "15px";
        this.p.style.fontWeight = "bold";
        this.p.textContent = text;
        this.p.style.marginTop = `${mt}px`;
        this.p.style.marginLeft = `${ml}px`;
        parent.appendChild(this.p);   
    }
}

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
let now_border = "5px solid rgb(107, 66, 202)";
let extra_border = "5px solid rgb(166, 149, 207)";
front_capture.style.border = now_border;



left_capture.style.border = extra_border;
right_capture.style.border = extra_border;
back_capture.style.border = extra_border;


async function draw_wave(wave1, interval, ml, mt)
{
    //점점 커지면서 투명해지면서 모서리 둥글게
    //<div id="wave" style=" position:absolute; opacity: 0;"></div>
    let wave = document.createElement("div");
    
    wave.style.position = "absolute";
    // wave.style.opacity = 0;
    let margin_l = ml;
    let margin_t = mt;
    // width: 16.5vw;
    // height: 12vw;
    // let w = 220;
    // let h = 320;
    let w = 12;
    let h = 16.5;
   // = "linear-gradient(gray,black)";

    let color = "radial-gradient(rgb(164, 152, 211), Lavender)";
    let color1 = "rgb(164, 152, 211)";

    wave.style.width = `${w}vw`;
    wave.style.height = `${h}vw`;
    wave.style.marginLeft = `${margin_l}%`;
    wave.style.marginTop = `${margin_t}%`;
    // wave.style.borderColor=color;
    wave.style.background = color;
    wave.style.opacity ="0.8";

    document.getElementById("shoot_div").appendChild(wave);


    let spd = 20;

    let transper = 1;
    let rad_ratio = "";
    let target_w = "150px";
    let target_h = "250px";
    let count = 0;


    let tran = 0.1

    // let w = 16.5;
    // let h = 12;

    setTimeout(function runwave()
    {
        wave.style.width = `${w+count*0.2}vw`;
        wave.style.height = `${h+count*0.2}vw`;


        wave.style.borderRadius =`${count}%`
        wave.style.opacity = `${transper-((tran*count)/2)}`;
        wave.style.marginLeft = `${margin_l-count*0.17}%`;
        wave.style.marginTop = `${margin_t-count*0.15}%`;
        count ++;
        if(count >= 30)
        {
            return;
        }
        setTimeout(runwave, spd)
    },interval);
}

function clear_canvas(del_keyword)
{
    if(del_keyword == 'front')
    {
        front_con.clearRect(0,0,front_capture.width,front_capture.height);
        album_fcon.clearRect(0,0,album_front.width,album_front.height);
    }
    else if(del_keyword == 'left')
    {
        left_con.clearRect(0,0,left_capture.width,left_capture.height);
        album_lcon.clearRect(0,0,album_left.width,album_left.height);
    }
    else if(del_keyword == 'right')
    {
        right_con.clearRect(0,0,right_capture.width,right_capture.height);
        album_rcon.clearRect(0,0,album_right.width,album_right.height);
    }
    else if(del_keyword == 'back')
    {
        back_con.clearRect(0,0,back_capture.width,back_capture.height);
        album_bcon.clearRect(0,0,album_back.width,album_back.height);
    }

}

var scale = 1;

function img_position(size)
{
    if(scale == 1)
    {
        return 0;
    }
    else
    {
        let position = - (((scale+1)/2)-1) * size;
        return position;
    }
}

function drawImg()
{
    try
    {   
        cam_con.drawImage(cam_img,img_position(cam_canvas.width) ,img_position(cam_canvas.height), cam_canvas.width*scale, cam_canvas.height*scale);
        cam_draw_id = requestAnimationFrame(drawImg);
    }
    catch
    {
        console.log("drawImg err 발생?");
        let text_arr = 
        [
        "일시적인 오류!",
        "카메라 연결이 끊어졌습니다.",
        "재연결 시도중 입니다."
        ]
        document.getElementById("running_border").style.display = "block";
        // display: block;
        esp_msg(text_arr);
        requestAnimationFrame(drawImg);
    }
}
cam_canvas.style.filter = "brightness(100%) contrast(100%)";
drawImg();


var now_scroll_bot = 0;
var now_scroll_w = 0;

function esp_msg(text_arr)
{
    let back_color = "#EFD9FC";

    let err_popup = document.createElement("div");
    // err_popup.style.display="scroll;"
    err_popup.style.position ="fixed";
        //Lavender
        //rgb(166, 149, 207)
    err_popup.style.background = back_color;
    err_popup.style.width = "200px";
    err_popup.style.height = "80px";
    err_popup.style.bottom = "30px";
    err_popup.style.right = "30px";
    err_popup.style.borderRadius = "5%";
    err_popup.style.opacity = 0;


    let title = new Ptag(err_popup, text_arr[0], 10, 50);
    let info = new Ptag(err_popup, text_arr[1], 35, 5);
    let talk = new Ptag(err_popup, text_arr[2], 55, 5);
    
    
    // err_popup.appendChild(msg);
    
    let tail = document.createElement("div");
    tail.style.position = "absolute";
    tail.style.marginLeft = "85%";
    tail.style.marginTop = "35%";
    tail.style.background = "transparent";
    tail.style.border = `30px solid ${back_color}`;
    // tail.style.borderTop = "20px solid black";
    tail.style.borderLeft = "30px solid transparent";
    tail.style.borderRight = "0px solid transparent";
    tail.style.borderBottom = "30px solid transparent";
    
    tail.style.width = "0px";
    tail.style.height = "0px";

    err_popup.appendChild(tail);
    document.body.appendChild(err_popup);

    let cnt = 0;
    setTimeout(function visible()
    {
        err_popup.style.opacity = cnt;
        cnt += 0.1;
        if(cnt >= 1)
        {

            setTimeout(function invisible()
            {
                err_popup.style.opacity = cnt;
                cnt -= 0.1;
                if(cnt <=0)
                {
                    return;
                }
                setTimeout(invisible, 50);
            },3000);
            return;
        }

        setTimeout(visible, 50);
    })            
}


esp_msg(["연결 성공",
        "카메라와의 연결이",
        "복구 되었습니다."]);



// window.addEventListener('scroll', function()
// {
//     let location = document.documentElement.scrollTop; // 세로 최고점 위치
//     let end = document.documentElement.scrollHeight; // 세로 길이
//     let w_location = document.documentElement.scrollWidth; //가로 전체 넓이 추정
//     let any_lo = document.documentElement.scrollLeft; //가로 좌측 위치
    

//     console.log(`any_lo ${any_lo}`);
//     console.log(`w_loca${w_location}`);
//     console.log(location);
//     console.log(end);
//     now_scroll_bot = location + end;
//     now_scroll_w = w_location
// })
socket.emit("shoot_page", "촬영페이지 진입");
socket.emit("backup_req", "백업데이터 요청");


// [{'filter':filter},{'brightness':brightness},{"contrast":contrast},{"scale":scale}];



socket.on("next_img", function(data)
{
    console.log(data);
    
    let image_data = cam_canvas.toDataURL();
    socket.emit('image_data', image_data);

});

socket.on("light_on", function(data)
{
    console.log(data);
    
    rec.style.background = "linear-gradient(45deg, LawnGreen 50%, white)";
    setTimeout(function light_red()
    {
        rec.style.background = "linear-gradient(45deg, Firebrick 50%, white)";
    }, 800);
});

let backup_count = 0;
socket.on("backup_res", function(data)
{
    // console.log(data);
    let image_data = document.createElement("img");
    image_data.src = data;

    // document.body.appendChild(image_data);
    let data_img = new Image(100,100);
    data_img.src = data;
    

    if(backup_count == 0)
    {
        console.log('front backup 확인');
        
        if(data != undefined && data != null)
        {
            data_img.onload = function()
            {
                front_con.drawImage(image_data, 0, 0, front_capture.width, front_capture.height);
                position_obj('front');
            };
        }
        backup_count += 1;
        capture_count += 1;
    }

    else if(backup_count == 1)
    {
        console.log('right backup 확인');
        
        if(data != undefined &&  data != null)
        {
            data_img.onload = function()
            {
                right_con.drawImage(data_img, 0, 0), right_capture.width, right_capture.height;
                position_obj('right');
            };
            
        }
        backup_count += 1;
        capture_count += 1;
    }
    else if(backup_count == 2)
    {
        console.log('back backup 확인');
        
        if(data != undefined && data != null)
        {
            data_img.onload = function()
            {
                back_con.drawImage(data_img, 0, 0, back_capture.width, back_capture.height);
                position_obj('back');
            }
        }
        backup_count += 1;
        capture_count += 1;
    }
    else if(backup_count == 3)
    {
        console.log('left backup 확인');
        
        if(data != undefined && data != null)
        {
            data_img.onload = function()
            {
                left_con.drawImage(data_img, 0, 0, left_capture.width, left_capture.height);
                position_obj('left');
            }
            
        }
        backup_count += 1;
        capture_count += 1;
    }

    socket.emit("backup_req", "다음 이미지 요청");
    
});

socket.on("backup_end", function(data)
{
    console.log(data);
    socket.emit("cam_setting_req", "카메라 세팅요청");

})

socket.on("esp_err", function(data)
{
    console.log(data);
    let text_arr = 
    [
        "일시적인 오류!",
        "카메라 연결이 끊어졌습니다.",
        "재연결 시도중 입니다."
    ]
    document.getElementById("running_border").style.display = "block";

    esp_msg(text_arr);

});

// let title = new Ptag(err_popup, "일시적인 오류!", 10, 50);
// let info = new Ptag(err_popup, "카메라 연결이 끊어졌습니다.", 35, 5);
// let talk = new Ptag(err_popup, "재접속 시도중입니다.", 55, 5);
socket.on("hello_server", function(data)
{
    console.log(data);
    let text_arr = 
    [
        "연결 성공",
        "카메라와의 연결이",
        "복구 되었습니다."
    ]
    document.getElementById("running_border").style.display = "none";
    esp_msg(text_arr);
});


socket.on("input_data_complite", function(data)
{
    console.log("1개 포즈 수집 완료");
});

socket.on("trust_complite", function(data)
{
    socket.emit("run_captureinfo", "계산 시작");
});

socket.on("data_complite", function(data)
{
    console.log(data+"검사 완료");
    if(data == 'front')
    {
        socket.emit('run_captureinfo', 'front');
    }
    else if(data == 'left')
    {
        socket.emit('run_captureinfo', 'left');
    }
    else if(data == 'right')
    {
        socket.emit('run_captureinfo', 'right');
    }
    else if(data == 'back')
    {
        socket.emit('run_captureinfo', 'back');
    }
    

});
socket.on("complite_data", function(data)
{
    console.log(data+"완전 처리 완료");
    if(data == 'front')
    {
        socket.emit("data_get_req", "left");
    }
    else if(data == 'left')
    {
        socket.emit("data_get_req", "right");
    }
    else if(data == 'right')
    {
        socket.emit("data_get_req", "back");
    }
    
    else if(data == 'back')
    {
        //모든 분석 종료시점
        console.log("모든 분석 종료");
    }


});

const $shootButton = document.getElementById('real_shoot_button');
let capture_count = 1;

// position: absolute;
//     width: 640px;
//     height: 480px;
//     /* height: 540px; */
//     margin-top: 0;
//     box-sizing: border-box;
//     margin-left: 15%;
//     margin-top: 50px;
//     border: 3px solid black;
//     padding: 2px;
    

let arrow_max_top = "350px";
let arrow_min_top = "20px";
let arrow_max_left = "780px";
let arrow_min_left = "350px";

function position_obj(position)
{
    if(position == 'front')
    {
        // botate.style.marginLeft = "340px";
        // botate.style.marginTop = "80px";

        // right_capture.style.border = "none";
        // key_check = true;
        p_tag[0].style.opacity = 0;
        draw_wave(wave,0, 3.7, 1.3);
        right_capture.style.border = now_border;
    }
    else if(position == 'right')
    {
        // botate.style.marginTop = "440px";
        // back_capture.style.border = "none";
        // key_check = true;
        p_tag[1].style.opacity = 0;
        draw_wave(wave,0, 25, 1.3);
        // target=29, target_t=16.7
        left_capture.style.border = now_border;
    }
    else if(position == 'back')
    {
        // left_capture.style.border = "none";
        // botate.style.marginLeft = "10px";
        // botate.style.marginTop = "440px";

        // key_check = true;
        p_tag[2].style.opacity = 0;
        draw_wave(wave,0, 3.7, 24.5);
        // target_l=12.2, target_t=53
        back_capture.style.border = now_border;
    }
    else if(position == 'left')
    {
        // left_capture.style.border = "none";
        // botate.style.marginLeft = "10px";
        // botate.style.marginTop = "440px";
        // key_check = true;
        p_tag[3].style.opacity = 0;
        draw_wave(wave,0, 25, 24.5);
        // target_l=29, target_t=53
    }
    key_check = true;

}
// window.addEventListener('mousemove', function(e)
// {
//     let x= e.clientX;;
//     let y = e.clientY;
//     console.log(`x : ${x}`);
//     console.log(`y : ${y}`);
// })

async function create_ani_canvas(page)
{

    await draw_shutter();
    
    console.log('ani_canvas 실행');

    key_check = false;
    let can_spd = 2;

    let ani_canvas = document.createElement('canvas');
    ani_canvas.style.position = "absolute";

    let cam_canvas_css = getComputedStyle(cam_canvas);
    let cam_canvas_xy = cam_canvas.getBoundingClientRect();
    let now_cam_w = cam_canvas_css.width;
    let now_cam_h = cam_canvas_css.height;
    let now_cam_x = cam_canvas_xy.x;
    let now_cam_y = cam_canvas_xy.y;
    // console.log(fcap_style.marginLeft);
    // console.log(fcap_style.marginTop);
    console.log(now_cam_x);
    console.log(now_cam_y);
    // console.log(cam_canvas.offsetLeft);

    // let a_w = Number(now_cam_w.replace("px", ""));
    // let a_h = Number(now_cam_h.replace("px", ""));
    // width: 33.3vw;
    // height: 25vw;
    a_w = 33.3;
    a_h  = 25
    ani_canvas.style.width = now_cam_w;
    ani_canvas.style.height = now_cam_h;
    
    // console.log(getComputedStyle(cam_canvas));
    let marginL = 48;
    let marginT = 21;



    // 돌리면서 발생하는 width의 차이
    let nw = Number(now_cam_w.replace('px', ''));
    let nh = Number(now_cam_h.replace('px', ''));


    let w_dif = nw-nh;
    let h_dif = nh-nw;

    ani_canvas.style.marginLeft = `47.8%`;
    ani_canvas.style.marginTop =  `10.3%`;

    ani_canvas.style.boxSizing="borer-box";
    ani_canvas.style.border = "3px solid black";
    let cam_filter = cam_canvas.style.filter;
    ani_canvas.style.filter = cam_filter;
    ani_canvas.style.transform = "rotate(90deg)";

    

    let ani_con = ani_canvas.getContext('2d');
    ani_con.drawImage(cam_img,img_position(ani_canvas.width), img_position(ani_canvas.height), ani_canvas.width*scale, ani_canvas.height*scale);
    //section

    

    // document.body.appendChild(ani_canvas)
    // document.getElementById("cam_div").appendChild(ani_canvas);
    document.body.appendChild(ani_canvas);


    // section.appendChild(ani_canvas);
    // document.body.appendChild(ani_canvas);
    ani_canvas_arr.push(ani_canvas);
    
    let now_fcap = front_capture.getBoundingClientRect();

    let now_fcap_w = Number(fcap_style.width.replace("px", ""));
    let now_fcap_h = Number(fcap_style.height.replace("px", ""));
    // px
    let now_fcap_x = now_fcap.x;
    let now_fcap_y = now_fcap.y;
    // number

    let w = 16.5;
    let h = 12;

    let mov = 0;
    
    if(page == 'front')
    {
        console.log('front move');
    
        setTimeout(function move(target=11.3, target_t=16)
        {    
            ani_canvas.style.marginLeft = `${marginL-((mov*((marginL-target)/30)))}vw`;
            ani_canvas.style.marginTop = `${marginT-((mov*((marginT-target_t)/30)))}vh`;

            ani_canvas.style.width = `${a_w - ((mov)*((a_w-w)/30))}vw`;
            ani_canvas.style.height = `${a_h - ((mov)*((a_h-h)/30))}vw`;
            ani_canvas.style.borderRadius = `${0.3*mov}%`;

            if(mov == 30)
            {
                ani_canvas.style.border = now_border;
                // console.log(a_w);
                // console.log(a_h);
                // console.log(w, h);
                // console.log(ani_canvas.style.width);
                // console.log(ani_canvas.style.height);
                position_obj('front');
                return;
            }
            mov ++;
            setTimeout(move,can_spd);
        }, 500)
    }

    else if(page == 'right')
    {
        console.log('right move');
        setTimeout(function rightmove(target=28.5, target_t=16)
        {
            ani_canvas.style.marginLeft = `${marginL-((mov*((marginL-target)/30)))}vw`;
            ani_canvas.style.marginTop = `${marginT-((mov*((marginT-target_t)/30)))}vh`;

            ani_canvas.style.width = `${a_w - (mov*((a_w-w)/30))}vw`;
            ani_canvas.style.height = `${a_h - (mov*((a_h-h)/30))}vw`;

            ani_canvas.style.borderRadius = `${0.3*mov}%`;

            if(mov == 30)
            {
                ani_canvas.style.border = now_border;
                position_obj('right');

                return;
            }
            mov ++;
            setTimeout(rightmove,can_spd);
        }, 500)
    }
    else if(page == 'back')
    {
        setTimeout(function backmove(target_l=11.3, target_t=52.8)
        {
            ani_canvas.style.marginLeft = `${marginL-((mov*((marginL-target_l)/30)))}vw`;
            ani_canvas.style.marginTop = `${marginT-((mov*((marginT-target_t)/30)))}vh`;

            ani_canvas.style.width = `${a_w - (mov*((a_w-w)/30))}vw`;
            ani_canvas.style.height = `${a_h - (mov*((a_h-h)/30))}vw`;

            ani_canvas.style.borderRadius = `${0.3*mov}%`;


            if(mov == 30)
            {
                ani_canvas.style.border = now_border;
                position_obj('back');
                return;
            }
            mov ++;
            setTimeout(backmove,can_spd);
        }, 500)
    }
    else if(page == 'left')
    {
        setTimeout(function backmove(target_l=28.5, target_t=52.8)
        {
            ani_canvas.style.marginLeft = `${marginL-((mov*((marginL-target_l)/30)))}vw`;
            ani_canvas.style.marginTop = `${marginT-((mov*((marginT-target_t)/30)))}vh`;

            ani_canvas.style.width = `${a_w - (mov*((a_w-w)/30))}vw`;
            ani_canvas.style.height = `${a_h - (mov*((a_h-h)/30))}vw`;

            ani_canvas.style.borderRadius = `${0.3*mov}%`;

            if(mov == 30)
            {
                ani_canvas.style.border = now_border;
                position_obj('left');
                return;
            }
            mov ++;
            setTimeout(backmove,can_spd);
        }, 500)

    }
}



function del_ani_canvas(ani_canvas)
{

    
    let spd = 20;
    let blur_point = 0
    let opacity_point = 1;
    if(ani_canvas == undefined)
    {
        console.log("생성된 canvas는 없음");
        return;
    }
    setTimeout(function smoke()
    {
        ani_canvas.style.filter = `blur(${blur_point}px)`;
        ani_canvas.style.opacity = opacity_point;

        blur_point ++;
        opacity_point -= 0.1;
        if(blur_point >= 100)
        {
            document.getElementById('section').removeChild(ani_canvas);
            return;
        }

        setTimeout(smoke, spd);
    })
    
}



document.body.addEventListener('keyup', function cap(e)
{
    console.log(e);
    // if(e.key == 'F5')
    // {
    //     alert("새로고침시 현재 정보가 초기화 됩니다.");
    //     return;
    // }

        //botate 기본 위치
    // left: 175px;
    // top:140px;
    // height: 227px;
    // width: 125px;

    // left border  margin-top:360px; margin-left:50px;
    // right border margin-top:30px; margin-let:465px;

    if(e.key == 'Enter')
    {

        console.log("엔터 누름");

        if(!key_check)
        {
            alert("잠시만 기다려 주세요");
            return;
        }

        if(capture_count==1)
        {
            create_ani_canvas('front');

            socket.emit('cpature_page', "정면");
            // front_con.drawImage(cam_img, 0, 0, front_capture.width, front_capture.height);
            album_fcon.drawImage(cam_img, 0, 0, front_capture.width, front_capture.height);
            capture_count = 2;
            let image_data1 = front_capture.toDataURL();
            
            socket.emit('image_data', image_data1);
        }
        else if(capture_count == 2)
        {
            create_ani_canvas('right');

            socket.emit('cpature_page', "우측");
            // right_con.drawImage(cam_img, 0, 0, right_capture.width, right_capture.height);
            album_rcon.drawImage(cam_img, 0, 0, right_capture.width, right_capture.height);
            let image_data1 = front_capture.toDataURL();
            socket.emit('image_data', image_data1);

            capture_count = 3;
        }
        else if(capture_count==3)
        {
            create_ani_canvas('back');

            socket.emit('cpature_page', "후면");
            // back_con.drawImage(cam_img, 0, 0, back_capture.width, back_capture.height);
            album_bcon.drawImage(cam_img, 0, 0, back_capture.width, back_capture.height);
            capture_count = 4;
            let image_data1 = front_capture.toDataURL();
            socket.emit('image_data', image_data1);
        }
        else if(capture_count==4)
        {
            create_ani_canvas('left');
            // left_capture.style.border = "none";

            socket.emit('cpature_page', "좌측");
            // left_con.drawImage(cam_img, 0, 0, left_capture.width, left_capture.height);
            album_lcon.drawImage(cam_img, 0, 0, left_capture.width, left_capture.height);
            capture_count = 5;
            let image_data1 = front_capture.toDataURL();

            socket.emit('image_data', image_data1);
            key_check = false;
            setTimeout(function()
            {
                if(capture_count == 5)
                {
                    capture_count = 1;
                    const $shoot_div = document.getElementById('shoot_div');
                    const $img = document.getElementById('shoot_img');
                    const setting_space = document.getElementById("setting_space");
                    
                    setting_space.style.display = "none";
                    $shoot_div.style.display = "none";
    
                    cam_canvas.className = "invisible"
                    
                    $img.className = "invisible";
                    rec.className = "invisible";
                    frame.className = "invisible";
                                    
                    for(let i = 0; i < corner_arr.length; i++)
                    {
                        corner_arr[i].hidden_div();
                    }
                    for(let i = 0 ; i < ani_canvas_arr.length; i++)
                    {
                        ani_canvas_arr[i].className = "invisible";
                    }

                    document.body.removeEventListener('keyup', cap);
    
                    loading_run();
    
                    socket.emit("data_get_req", "front");
                }
            }, 3000);
        }


        
    }
    else if(e.key == 'Escape')
    {
        console.log("Escape 누름");
        console.log(capture_count);
        
        let del_frame = "";
        if(capture_count == 2 || capture_count == 1)
        {
            //border위치
            try
            {
                let ani = ani_canvas_arr.pop();
                del_ani_canvas(ani);
                // document.getElementById('section').removeChild(ani);
            }
            catch
            {
                console.log("생성된 anicanvas는 없음");
            }
            

            // border.style.marginLeft="10px";
            // border.style.marginTop="80px";
            p_tag[0].style.opacity = 1;
            right_capture.style.border = extra_border;
            left_capture.style.border = extra_border;
            back_capture.style.border = extra_border;

            // left_arrow.style.left = arrow_min_left;
            // left_arrow.style.top = arrow_min_top;

            del_frame = 'front';
            capture_count = 1;
            clear_canvas('front');
        }
        else if(capture_count == 3)
        {
            try
            {
                let ani = ani_canvas_arr.pop();
                del_ani_canvas(ani);
            }
            catch
            {
                console.log("없음");
            }

            // border.style.marginTop = "80px";
            // border.style.marginLeft = "340px";
            p_tag[1].style.opacity = 1;
            left_capture.style.border = extra_border;
            back_capture.style.border = extra_border;

            // left_arrow.style.left = arrow_max_left;
            // left_arrow.style.top = arrow_min_top;

            del_frame = 'right';
            capture_count = 2;
            clear_canvas('right');
        }
        else if(capture_count == 4)
        {
            try
            {
                let ani = ani_canvas_arr.pop();
                del_ani_canvas(ani);
            }
            catch
            {
                console.log("없음");
            }

            // border.style.marginTop = "440px";
            // border.style.marginLeft = "340px";

            p_tag[2].style.opacity = 1;
            left_capture.style.border = extra_border;
            // left_arrow.style.left = arrow_max_left;
            // left_arrow.style.top = arrow_max_top;

            del_frame = 'back';
            capture_count = 3;
            clear_canvas('back');
        }
        else if(capture_count == 5)
        {
            try
            {
                let ani = ani_canvas_arr[3];
                del_ani_canvas(ani);
            }
            catch
            {
                console.log("없음");
            }
            border.style.marginTop = "440px";
            border.style.marginLeft = "10px";

            // left_arrow.style.left = arrow_min_left;
            // left_arrow.style.top = arrow_max_top;

            del_frame = 'left';
            capture_count = 3;
            clear_canvas('left');
        }
        else
        {
            del_frame = "";
        }
        
        socket.emit('back_capture', del_frame);
    }

});
const loading_frame = document.getElementById("loading_frame");

loading_frame.style.display = "none";

function loading_run()
{
    loading_frame.style.display = "flex";
    slide_img(img_loading1, tooltip1);
    setTimeout(function running_loading()
    {
        random_event = setInterval(random_progress_event, 440);
        play_progress = setInterval(update_progress, 10);
        slide_interval = setInterval(slide_function, 1600);
    },345)

}



 console.log("스크립트 읽힘");




