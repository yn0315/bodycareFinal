const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io")
const io = new Server(server);
const cv = require('opencv4nodejs');
const { COLOR_BGR2GRAY } = require('opencv4nodejs');

const net = require('net');
const serverIp = '192.168.4.1'
const serverPort = 80;

const client = new net.Socket();



app.use(express.static("public"));
// app.use(function(req, res, next)
// {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

app.get('/', function(req, res)
{
    res.set("Access-Contorl-Allow-Origin", "*");
    res.sendFile(__dirname+"/public/test_home.html");
});




io.on('connection', function(socket)
{
    console.log("user socket connected");




    client.connect(serverPort, serverIp, function () {
        console.log('Connect to server');
        client.write('hello server!');
    });

    client.on('data', function (data) {
        let msg = data.toString('utf-8');
        console.log('받은 데이터는 : ', msg);

    })

    client.on('close', function () {
        console.log('Connection closed');
    })



    
    socket.on('disconnect', function()
    {
        console.log('Arduino user Disconnected');
    });

    socket.emit('result', `${socket.id}로 연결`);
    console.log("socket.id =>",socket.id);

    socket.on('image_data', function(image_data1)
    {
        client.write("green");

        // console.log(image_data1);
        const img = cv.imdecode(Buffer.from(image_data1.split(',')[1],'base64'));
        // 받아낸 바이너리 데이터를 OpenCV 이미지로 변환
        // const grayimg = img.bgrToGray();
        // const grayimg = img.COLOR_BGR2GRAY;
        console.log(img);
        // cv.imshow("capture", image_data1);
        // cv.waitKey(0);

        const grayimg = img.cvtColor(COLOR_BGR2GRAY)
        cv.imwrite('togray.jpg', grayimg);
        const cannyimg = grayimg.canny(80,80,3,false);
        cv.imwrite('drawcanny.jpg', cannyimg);
        
        const contours = cannyimg.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE,new cv.Point2(0,0));
        //    cv.RETR_EXTERNAL : 컨투어 라인 중 가장 바깥쪽의 라인만 찾음
        //    cv.CHAIN_APPROX_SIMPLE : 컨투어 라인을 그릴 수 있는 포인트만 반환
        // contours는 윤곽선 검출
        // for(let i =0; i < contours.length;i++)
        // {

        // }
 
        const arr = [];
        for(let i = 0 ; i < contours.length ; i++)
        {
            let pt = contours[i].getPoints();
            arr.push(pt);
        }

        img.drawContours(arr,-1, new cv.Vec3(0,255,0),2);
        // console.log(drawimg);
        // 윤곽선 그리기
        cv.imwrite('drawcontours.jpg', img);

        
    });


});

server.listen(3400, function()
{
    console.log('server is listening at localhost : 3400');
});