
console.log("js 파일 로드");
var socket = io();
const login = document.getElementById('login');
const img = document.getElementById('cam_img');
const btn = document.getElementById('send-image');
const canvas = document.getElementById('canvas');
const capture_1 = document.getElementById('capture_1');
const capture_2 = document.getElementById('capture_2');
const capture_3 = document.getElementById('capture_3');
const capture_4 = document.getElementById('capture_4');
const capture_btn = document.getElementById('capture_btn');
const picture = new Image();
picture.crossOrigin = 'anonymous';


const any_btn =document.getElementById('"send-image"');

const con = canvas.getContext('2d');
const con1 = capture_1.getContext('2d');
const con2 = capture_2.getContext('2d');
const con3 = capture_3.getContext('2d');
const con4 = capture_4.getContext('2d');

var capture_count = 1;
// picture.onload = function(e)
// {
//     console.log(e);
//     con1.drawImage(img, 0, 0, capture_1.width, capture_1.height);
//     const image_data1 = capture_1.toDataURL();

//     socket.emit('image_data', image_data1);
// }

function drawImg()
{
    con.drawImage(img, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(drawImg);

}
drawImg();

function load_image(src, callback)
{
    var img = new Image();
    img.onload = callback;
    img.setAttribute('crossorigin', 'anonymous');
    img.src = src
    return img

}

    //crossorigin="Anonymous"
capture_btn.addEventListener('click', function(e)
{

    // // clean_img.src = "http://192.168.4.1:81/stream";
    // clean_img.src = "http://192.168.4.1:81/capture";

    console.log("버튼이벤트");
    

    
    if(capture_count==1)
    {
        socket.emit('cpature_page', "정면");
        con1.drawImage(img, 0, 0, capture_1.width, capture_1.height);
        capture_count = 2;
    }
    else if(capture_count == 2)
    {
        socket.emit('cpature_page', "우측");
        con2.drawImage(img, 0, 0, capture_2.width, capture_2.height);
        capture_count = 3;
    }
    else if(capture_count==3)
    {
        socket.emit('cpature_page', "정면");
        con3.drawImage(img, 0, 0, capture_3.width, capture_3.height);
        capture_count = 4;
    }
    else if(capture_count==4)
    {
        socket.emit('cpature_page', "정면");
        con4.drawImage(img, 0, 0, capture_4.width, capture_4.height);
        capture_count = 1;
    }

    const image_data1 = capture_1.toDataURL();
    socket.emit('image_data', image_data1);
});


socket.on('light on', function(msg)
{
    console.log("RGB 정상작동");
})

