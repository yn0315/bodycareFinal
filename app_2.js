// 필요한 모듈을 가져옵니다.
const net = require('net');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const fs = require('fs');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const cors = require("cors");

const cv = require('opencv4nodejs');
const { COLOR_BGR2GRAY } = require('opencv4nodejs');
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');
const {ImageAnalyze} = require('./image_analyze');
const {DbManager} = require('./database_management');

const analyze = new ImageAnalyze();
const db = new DbManager();

db.data_base_check();
// db 및 테이블 생성 확인

class BackUP
{
    constructor()
    {
        this.que = [];
        // 전 우 좌 후
        this.front_backup = [];
        this.left_backup = [];
        this.right_backup = [];
        this.back_backup = [];
        this.stack = 0;
    }

    put(data)
    {
        this.que.push(data);
    }

    get()
    {
        let data = this.que.shift();
        // console.log(data);


        // this.que.push(data);
        return data;
    }

    reset()
    {
        console.log(`que의 초기화 전 길이 -> ${this.que.length}`);

        for(let i = 0 ; i < 10; i ++)
        {
            this.que.pop();
        }
        
        console.log(`que의 초기화 후 길이 -> ${this.que.length}`);
    }

    backup_save(data)
    {
        console.log(capture_page + "의 backup 자료 저장");

        if(capture_page == "front")
        {
            this.front_backup.push(data);
        }
        else if(capture_page == 'right')
        {
            this.right_backup.push(data);
        }
        else if(capture_page == 'back')
        {
            this.back_backup.push(data);
        }
        else if(capture_page == 'left')
        {
            this.left_backup.push(data);
        }
    }

    backup_get(data)
    {
        console.log("backup_get 복구 시작 = "+data)
        let data_arr = [];

        if(data == 'front')
        {
            for(let i = 0; i < 10; i++)
            {
                let mat_data = this.front_backup.pop();
                if(mat_data == undefined)
                {
                    continue;
                }
                else
                {
                    data_arr.push(mat_data);
                }
                
            }
            return data_arr;
        }
        else if(data == 'right')
        {
            for(let i = 0; i < 10; i++)
            {
                let mat_data = this.right_backup.pop();
                if(mat_data == undefined)
                {
                    continue;
                }
                else
                {
                    data_arr.push(mat_data);
                }
                
            }
            return data_arr;

        }
        else if(data == 'back')
        {
            for(let i = 0; i < 10; i++)
            {
                let mat_data = this.back_backup.pop();
                if(mat_data == undefined)
                {
                    continue;
                }
                else
                {
                    data_arr.push(mat_data);
                }
                
            }
            return data_arr;

        }
        else if(data == 'left')
        {
            for(let i = 0; i < 10; i++)
            {
                let mat_data = this.left_backup.pop();
                if(mat_data == undefined)
                {
                    continue;
                }
                else
                {
                    data_arr.push(mat_data);
                }
            }
            return data_arr;

        }
        else if(data == undefined)
        {
            return data;
        }

    }

    backup_reset()
    {
        console.log("백업 자료 소멸");
        this.reset();
        for(let i = 0 ; i<10 ; i++)
        {
            this.front_backup.pop();
        }
        for(let i = 0; i <10; i++)
        {
            this.right_backup.pop();
        }
        for(let i = 0; i < 10; i++)
        {
            this.back_backup.pop();
        }
        for(let i = 0; i < 10; i++)
        {
            this.left_backup.pop();
        }
        console.log(`front lenght ${this.front_backup.length}`);
        console.log(`right lenght ${this.right_backup.length}`);
        console.log(`back lenght ${this.back_backup.length}`);
        console.log(`left lenght ${this.left_backup.length}`);


    }


}

const backup = new BackUP();


class Capture
{
    constructor(page)
    {
        this.page = page;
        this.capture_arr = [];
    }

    push(data)
    {
        this.capture_arr.push(data);
    }

    pop()
    {
        return this.capture_arr.shift();
    }

    reset()
    {
        console.log(this.page+" 배열 초기화 시작");
        while(this.capture_arr.length != 0)
        {
            this.capture_arr.pop();
        }
        console.log(this.page+"초기화 완료");
        
    }

    poseget_start()
    {
        for(let i = 0; i < this.capture_arr.length ; i++)
        {
            console.log("input_data 시작");
            let img_mat = this.capture_arr[i];

            let data = this.img_rotate(img_mat);
            analyze.input_data(data);
            
        }
    }

    img_rotate(img_mat = new cv.Mat())
    {
        // console.log(img_mat.sizes);
        // console.log(img_mat.cols, img_mat.rows);
        // 640 480으로 바꿔보자

        img_mat = img_mat.resize(480,640);
        let center = new cv.Point2((img_mat.cols/2)-80, (img_mat.rows/2)); // +30
        let angle = -90;
        let scale = 1;
        let resulte_rotation = cv.getRotationMatrix2D(center, angle, scale);
        // 회전 변환 객체 
        let img_size = new cv.Size(img_mat.rows, img_mat.cols);

        let rotate_rect = new cv.RotatedRect(center,img_size,270 );        
        let rotate_resize = new cv.Size(rotate_rect.size.width, rotate_rect.size.height);

        let newimg = new cv.Mat(rotate_resize.height, rotate_resize.width, img_mat.type);
        let resize = new cv.Size(newimg.cols, newimg.rows);
        
        let result = img_mat.warpAffine(resulte_rotation,resize);
        // 
        
        return result;
    }

}


class Person_pose
{
    
    constructor(name)
    {
        console.log("person_pose 생성");
        this.name = name;
        this.front = new Capture("Front");
        this.left = new Capture("Left");
        this.right = new Capture("Right");
        this.back = new Capture("Back");
    }


    data_push(data)
    {
        // console.log(capture_page+" data_push");

        if(capture_page == "front")
        {
            console.log("front push");
            // console.log(data);
            this.front.push(data);
        }
        else if(capture_page == "left")
        {
            console.log("left push");
            this.left.push(data);
        }
        else if(capture_page == 'right')
        {
            console.log("right push");
            this.right.push(data);
        }
        else if(capture_page == 'back')
        {
            console.log("back push");
            this.back.push(data);
        }
        
    }

    data_pop()
    {
        let position_arr = [];
        
        position_arr.push(this.front.pop());
        position_arr.push(this.right.pop());
        position_arr.push(this.back.pop());
        position_arr.push(this.left.pop());
        console.log(`position_arr = ${position_arr}`);
        return position_arr;

    }

    data_reset(data)
    {
        if(data == 'front')
        {
            this.front.reset();
        }
        else if(data == 'left')
        {
            this.left.reset();
        }
        else if(data == 'right')
        {
            this.right.reset();
        }
        else if(data == 'back')
        {
            this.back.reset();
        }


    }

    front_data_get()
    {
        console.log("front 처리 시작");
        this.front.poseget_start();
    }

    left_data_get()
    {
        console.log("left 처리 시작");
        this.left.poseget_start();
    }
    right_data_get()
    {
        console.log("right 처리 시작");
        this.right.poseget_start();
    }

    back_data_get()
    {
        console.log("back 처리 시작");
        this.back.poseget_start();
    }


//////// run trust에서 input data를 순차적으로 하나씩 밀어넣고 10개 다음 10개 다음 10개 다음 순서로 신호 주고받기해야함


}

var save_capture = [];

var humanData = {};

var frame = undefined;

// const mysql = require('mysql');
// const conn = {
//     host : 'localhost',
//     port : '3306',
//     user : 'root',
//     password : '0000',
//     database : 'bodycare_db'
// };


// var connection = mysql.createConnection(conn); // DB 커넥션 생성
// connection.connect();   // DB 접속


// function name_filter(results)
// {
//     //    {name : '김OO', gen : "남자", age : "20세", con : "12436341"},

//     let filter_arr = [];
//     for(let i = 0 ; i < results.length; i++)
//     {
//         let people_dict = {};        
//         people_dict['name'] = results[i].name;
//         people_dict['gen'] = results[i].gen;
//         people_dict['age'] = results[i].age;
//         people_dict['con'] = results[i].tel;
//         filter_arr.push(people_dict);
//     }

//     return filter_arr;

// }

// 웹 서버를 생성합니다.
const app = express();
const server = http.createServer(app);
const io = socketIO(server);


app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cors({
    origin: '*', // 모든 도메인 허용
    methods: '*', // 모든 메서드 허용
    allowedHeaders: '*' // 모든 헤더 허용
}));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header('Access-control-Allow-Headers', 'Origin, X-Requested-With,Content-Type,Accept');
    next();
});

app.get('/', function(req, res)
{
    fs.readFile('public/start_page.html', function(error, data)
    {
        if(error)
        {
            console.log('app.get(/)err');
            console.log(error);
        }
        else
        {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    });
});

app.get('/page_search', function(req, res)
{
    fs.readFile('public/page_search.html', function(err, data)
    {
        if(err)
        {
            console.log('app.get(/page_sarch)err');
            console.log(err);
        }
        else
        {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    })
})

app.get("/new_info", function(req, res)
{
    fs.readFile('public/page_newinfo.html', function(err, data)
    {
        if(err)
        {
            console.log('get /newinfo 에러');
            console.log(err);
        }
        else
        {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        }
    });
})

app.get('/camera', function(req,res)
{
    // const selectQuery = 'select * from bodycare_db.users';
    // connection.query(selectQuery, function(err,results, fields)
    // {
    //     if(err)
    //     {
    //         console.log('/camera db에러');
    //         console.log(err);
    //     }
    //     console.log(results);
    //     // res.render('camera', {users:results});
    // });
    fs.readFile('public/page_newinfo.html', function(err, data)
    {
        if(err)
        {
            console.log('newinfo err');
            console.log(err);
        }
        else
        {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        }
    })

});

app.get('/shoot', function(req, res)
{
    res.render('shoot', {users: humanData});
});

app.get('/search',(req,res) => {

    // const selectQuery = "SELECT * FROM bodycare_db.users";

    // connection.query(selectQuery, function (err, results, fields) { // testQuery 실행
    //     if (err) {
    //         console.log(err);
    //     }
    //     console.log(results);
    //     res.render('search', { users: results });
    //     console.log('서치!!');
    // });
})


app.get('/chart', function(req,res)
{
    console.log(humanData);


    if(Object.keys(humanData).length === 0)
    {
        console.log(humanData, "humanData");
        res.redirect('/search');
    }
    else
    {
        fs.readFile('views/chart.ejs', function(error, data)
        {
            if(error)
            {
                console.log('/chart에러');
                console.log(error);
            }
            else
            {
                res.writeHead(200, {'Content-Type':'text/html'});
                res.end(data);
            }
    
        });
    }



});

app.get('/record', function(req, res)
{
    res.render('record', {data:humanData});
});


app.get('/record', function(req,res)
{
    const data = req.body;
    console.log(data);
    console.log('/recored');
    if(req.query.data === null || req.query.data === 'undefined')
    {
        fs.readFile('views/record.ejs', function(error,data)
        {
            if(error)
            {
                console.log(error);
            }
            else
            {
                res.writeHead(200, {'Content-Type':'text/html'});
                res.end(data);
            }
        });
    }
    else
    {
        let data = req.query.data;
        res.render('record', {data:data});
    }
});

app.post('/startshoot', function(req, res)
{
    let data = req.body;
    console.log(data);

    humanData = data;
    res.send('200');
    console.log("촬영시작페이지");

});

app.post('/searchRec', (req,res) => {
    humanData ={
        name : req.body.name
    };
    console.log(humanData);
    res.send('200');
    // }
})


/* const esp = net.connect({host:'19.168.4.1', port:81}, function()
// {
//     console.log("connect to ESP32_stream-cam");
//     esp.write('GET /stream HTTP/1.1\r\n\r\n');
// });

// const url_stream = fs.createWriteStream('stream.jpg');
// esp.on('data', function(data)
// {
//     const index = data.indexOf(Buffer.from('\xff\xd8'));
//     if(index != 1)
//     {
//         const imgdata = data.slice(index);
//         console.log(imgdata);
//     }
// });
// esp.on('error', function(err)
// {
//     console.log(err);
//     console.log("esp 연결 에러");
//     setTimeout(function()
//     {
//         console.log("재연결 시도");
//         esp.connect({host:'19.168.4.1', port:81},function()
//         {
//             console.log("connect to ESP32_stream-cam");
//             esp.write('GET /stream HTTP/1.1\r\n\r\n');
//         })
//     });

// });
*/

// const Host = "192.168.4.1";
// const Port = 80;
// /////////////////////////////////////////////////////net.Socket();

// const client = new net.Socket();
// client.connect(Port, Host, function()
// {

//     console.log('Connected to ESP32-CAM');
//     client.write("hello server!");
//     // client.write('GET /stream HTTP/1.1\r\n');
//     // client.write(`Host: 192.168.4.1:81\r\n`);
//     // client.write('Connection: keep-alive\r\n');
//     // client.write('Cache-Control: no-cache\r\n');
//     // client.write('User-Agent: Mozilla/5.0\r\n');
//     // client.write('Accept: */*\r\n\r\n');
  
// });

// client.on('error', function(err)
// {
//     if(err.code === 'ECONNRESET')
//     {
//         console.log("연결 에러 재시도 ");
//         io.emit("esp_err", "err");
//         setTimeout(function()
//         {
//             client.connect(Port, Host, function()
//             {
//                 console.log('ESP32CAM 재연결 성공');
//                 client.write("hello server!");
//             })
//         })
//     }
// });

// // ESP32-CAM에서 데이터를 수신합니다.

// client.on('data', function (data)
// {
    
//     let msg = data.toString('utf-8');
//     console.log(msg);
//     // data_buf = Buffer.concat([data_buf, data]);
//     // const marker = Buffer.from('\r\n--frame\r\n');
//     // const markerIndex = data_buf.indexOf(marker);
//     // if(markerIndex != -1)
//     // {
//     //     const img_buf = data_buf.slice(0, markerIndex);
//     //     const imgdata = img_buf.toString('base64');
//     //     frame = imgdata;
//     //     console.log(frame);
//     //     const decode_buf = Buffer.from(imgdata, 'base64');



//     //     data_buf = data_buf.slice(markerIndex + marker.length);
//     // }
//     if(msg == "green")
//     {
//         console.log('받은 데이터는 : ', msg);
//         let ok = "light on";
//         io.emit("light_on", ok);
//     }
//     if(msg.includes('hello'))
//     {
//         io.emit("hello_server", "esp_connect");
//     }


// });


// client.on('close', function(err)
// {
//     console.log("Close ESP32-CAM");
//     console.log(err);
    
//     console.log('재연결 시도');
//     io.emit("esp_err", "close");

//     setTimeout(function ()
//     {
//         client.connect(Port, Host, function ()
//         {
//             console.log('ESP32CAM 재연결 성공');
//             client.write("hello server!");
//             // client.write('GET /stream HTTP/1.1\r\n');
//             // client.write(`Host: 192.168.4.1:81\r\n`);
//             // client.write('Connection: keep-alive\r\n');
//             // client.write('Cache-Control: no-cache\r\n');
//             // client.write('User-Agent: Mozilla/5.0\r\n');
//             // client.write('Accept: */*\r\n\r\n');
//         })
//     })
    
// });
////////////////////////////////////////net.Socket();

var capture_count = 0;
var capture_page = "";
var person = Object();

var new_name = "";
// Socket.io를 통해 클라이언트에서 받은 메시지를 ESP32-CAM에 전송합니다.


var now_page = "";
var now_cam_slide_value = [];
var now_cam_filter_value = "";
var cam_setting_save_count = 0;
// io.listen(3100,"localhost" ,function()
// {
//     console.log("io listen");
// })

// io.listen()

io.on('connection', function(socket)
{
    console.log("socket CONNECTION !");
    console.log('Client connected');
    
    cam_setting_save_count = 0;
    // 필터 저장 카운트 초기화


    // var person = new Person_pose("name");
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 새로촬영- 검색페이지
    socket.on('page_name_search', function(data)
    {
        // 새로촬영 - 이름 검색 페이지 진입
        console.log(data);
        now_page = "page_search";
    });

    socket.on("name_saerch_req", function(data)
    {
        new_name = data;
        
        db.name_search_req(data, socket);
        // 이름 검색 후 엔터
        // console.log("이름검색요청");
        // console.log(data);
        
        // // const selectQuery = `select * from bodycare_db.users where name like '%${data}%'`;

        // const selectQuery = `select name, gen, age, tel from bodycare_db.users where name='${data}'`;
        // //    {name : '김OO', gen : "남자", age : "20세", con : "12436341"},
        // connection.query(selectQuery, function(err,results, fields)
        // {
        //     if(err)
        //     {
        //         console.log('이름검색 db에러');
        //         console.log(err);
        //     }
            
        //     // console.log("결과");
        //     // console.log(results);  
        //     let name_data = name_filter(results);
        //     socket.emit("search_result", name_data);
        // });
    });


    socket.on("page_search_select_info", function(data)
    {
        console.log("page_search, 선택 정보");
        console.log(data);
    });

    // socket.on("new_info_name_value", function(data)
    // {
    //     console.log("등록할 이름");
    //     console.log(data);
    //     new_name = data;
    // });

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 새로촬영- 검색페이지

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 신규 등록 페이지



    socket.on("new_info_page", function(data)
    {
        console.log(data);
        now_page = "new_info_page";
    })


    socket.on("new_name_req", function(data)
    {
        console.log(data);
        socket.emit("new_name_res", new_name);
    }); 

    socket.on("new_input_req", function(data)
    {
        console.log("등록 요청");
        console.log(data);
        
        // let tel_num = data.con;
        db.new_input_req(data, socket);


        // const selectQuery = `select tel from bodycare_db.users where tel='${tel_num}'`;
        // //    {name : '김OO', gen : "남자", age : "20세", con : "12436341"},
        // connection.query(selectQuery, function(err,results, fields)
        // {
        //     if(err)
        //     {
        //         console.log('신규등록 번호 중복 확인 db에러');
        //         console.log(err);
        //     }
            
        //     console.log(results);
            
        //     if(results.length == 0)
        //     {
        //         //등록가능
        //         // tel  name  age   gen   height   weight
        //         let update_query = `insert into bodycare_db.users values ('${data.con}','${data.name}','${data.age}', '${data.gen}', '${data.hei}', '${data.wei}')`;
        //         connection.query(update_query, function(err, results, fields)
        //         {
        //             if(err)
        //             {
        //                 console.log("신규등록 db에러");
        //                 console.log(err);
        //             }
        //             else
        //             {
        //                 console.log(results);

        //                 socket.emit("new_input_res", "success_input")
        //             }
        //         });
        //     }
        //     else
        //     {
        //         socket.emit("new_input_res", "fail_input");
        //     }
            
        // });


    })

    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 신규 등록 페이지




    



    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
    //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 촬영진행페이지

    socket.on('shoot_page', function(data)
    {
        now_person = true;
        person = new Person_pose("name");

        console.log(data);
    });

    socket.on("cam_setting_value_send", function(data)
    {
        // console.log(data);

        // 아래처럼 꺼내면 됨
        
        // console.log(data[0].filter);
        // console.log(data[1].slider_value);
        now_cam_filter_value = data[0].filter;
        now_cam_slide_value = data[1].slider_value;
    });
    socket.on("cam_setting_req", function(data)
    {

        db.cam_setting_req(socket);



        // let call_set_query = `select * from bodycare_db.cam_setting`;
        // connection.query(call_set_query,function(err, results, fields)
        // {
        //     if(err)
        //     {
        //         console.log(err);
        //         console.log("cam_setting select 에러");
        //     }
        //     else
        //     {
        //         try
        //         {
        //             let filter = results[0].cam_filter;
        //             let brightness = results[0].brightness;
        //             let contrast = results[0].contrast;
        //             let scale = results[0].scale;

        //             let cam_setting_arr = [{'filter':filter},{'brightness':brightness},{"contrast":contrast},{"scale":scale}];
        //             socket.emit("cam_setting_res", cam_setting_arr);
        //         }   
        //         catch
        //         {
        //             console.log("cam_setting 조회 에러");
        //         }
                
        //     }
        // })
        // console.log(data);

        // 카메라 세팅 요청
    })


    let backup_cnt = 0;
    let c_page = ['front', 'right', 'back', 'left'];
    socket.on("backup_req", function(data)
    {
        console.log("backup_req 요청");
        console.log(data);
        let backup_data = backup.get()
        // console.log(backup_data);

        if(backup_data != undefined && backup_data != null)
        {
            socket.emit("backup_res", backup_data);
            capture_page = c_page[backup_cnt];
            console.log(c_page[backup_cnt]+"저장 정보 전달");
        
            let data_arr = backup.backup_get(capture_page);
            if(data_arr == undefined)
            {
                socket.emit("backup_end", "데이터 전달 종료");
                backup.reset();    
                return;
            }
            
            const img = cv.imdecode(Buffer.from(backup_data.split(',')[1],'base64'));
            // mat객체 변환 img , 원본 이미지
            
            for(let i = 0 ; i< data_arr.length ; i++)
            {
                person.data_push(img);
            }
            backup_cnt += 1;
        }
        else
        {
            backup_cnt = 0;
            socket.emit("backup_end", "데이터 전달 종료");
            backup.reset();
        }
        
    });


    socket.on('image_data', function(image_data1)
    {

        const img = cv.imdecode(Buffer.from(image_data1.split(',')[1],'base64'));
        // cv.imshowWait("ok", img);
        // console.log(img.sizes);

        if(capture_count >= 10)
        {
            socket.emit('input_data_complite', "수집완료");
            console.log("input_data_complite 10장 수집완료");
            capture_count = 0;
            client.write('green');

        }
        else
        {
            console.log("data_push call");
            person.data_push(img);
            backup.backup_save(img);

            if(capture_count == 3)
            {
                console.log("back up 저장됨");
                backup.put(image_data1);
            }
            // analyze.input_data(img);
            socket.emit('next_img', "next");
            capture_count += 1;
        }

    // const test_img = cv.imread("C:\\Users\\202-14\\Desktop\\final_project\\front.jpg")

    // console.log(test_img);

    // //   let c_img = img.copy();
    //   // cv.imshow("capture", image_data1);
    //   // cv.waitKey(0);
    // //   analyze.opencv_sup(c_img);

    // analyze.tensor_front(test_img);
    // const left_img = cv.imread("C:\\Users\\202-14\\Desktop\\final_project\\left.jpg")
    // analyze.tensor_left(left_img);

    });

    socket.on("back_capture", function(data)
    {
        console.log(data + " back_capture");

        person.data_reset(data);

    });
    var total_result = {
        'front':undefined,
        'left':undefined,
        'right':undefined,
        'back':undefined};

    socket.on("run_captureinfo",function(data)
    {
        console.log(data);
        if(data == "front")
        {
            console.log("front analyze 호출");
            let front_result = analyze.front_analyze();
            // console.log("정면 return 결과");
            console.log(front_result);
            total_result.front = front_result;            
            analyze.pose_data_arr = [];
            socket.emit("complite_data", 'front');
        }
        else if(data == "left")
        {
            console.log("left analyze 호출");
            let left_result = analyze.left_analyze();
            total_result.left = left_result;
            
            analyze.pose_data_arr = [];
            socket.emit("complite_data", 'left');
        }
        else if(data == "right")
        {
            console.log("right analyze 호출");

            let right_result = analyze.right_analyze();
            total_result.right = right_result;
            
            analyze.pose_data_arr = [];
            socket.emit("complite_data", 'right');
        }
        else if(data == "back")
        {
            console.log("back analyze 호출");

            let back_result = analyze.back_analyze();
            analyze.pose_data_arr = [];
            total_result.back = back_result;
            
            socket.emit("complite_data", 'back');

            db.input_result_data_save(total_result,'11111111');

            backup.backup_reset();
        }
    
    });



    socket.on("data_get_req", function(data)
    {
        console.log('data_get_req');
        console.log(data);
    

        if(data == 'front')
        {
            person.front_data_get();
        }
        else if(data == 'left')
        {
            person.left_data_get();
        }
        else if(data == 'right')
        {
            person.right_data_get();
        }
        else if(data == 'back')
        {
            person.back_data_get();
        }

        time_check(socket, data);



    });



    socket.on("cpature_page", function(data)
    {

        if(data == "정면")
        {
            console.log(data+": 촬영 시작");
            capture_page = "front";
        }
        else if(data == "우측")
        {
            console.log(data+": 촬영 시작");
            capture_page = "right";
        }
        else if(data == "후면")
        {
            console.log(data+": 촬영 시작");
            capture_page = "back";
        }
        else if(data == "좌측")
        {
            console.log(data+": 촬영 시작");
            capture_page = "left"
        }
    });

        //@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ 촬영 진행페이지

  
});


function time_check(socket, page)
{
    setTimeout(function data_check(){
        console.log("pose_data_arr.length 확인실행됨");
        console.log(analyze.pose_data_arr.length);
        data_count = analyze.pose_data_arr.length;

        if(data_count == 10)
        {
            console.log("setTimeout 종료");
            socket.emit("data_complite", page);
            return;
        }
        setTimeout(data_check, 500);
    }, 500);


}
// 서버를 시작합니다.
const port = 3300;
server.listen(port, function() {
  console.log(`Server is running on port ${port}`);
});
