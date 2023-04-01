


// const { connect } = require('http2');

const mysql = require('mysql');

// const cv = require('opencv4nodejs');
// const conn = {
//     host : 'localhost',
//     port : '3306',
//     user : 'root',
//     password : '0000',
//     database : 'bodycare_db'
// };

var last_now;
class DbManager
{

    constructor()
    {
        this.conn ={
            host : '127.0.0.1',
            port : '3306',
            user : 'root',
            password : '0000',
            // database : 'bodycare_db'
        };

        this.connection = mysql.createConnection(this.conn); // DB 커넥션 생성
        this.connection.connect();   // DB 접속
        console.log("database connect");
                
        
    }

    data_base_check()
    {
        
        let data_base_check_query = `select 1 from information_schema.SCHEMATA where schema_name = "bodycare_db"`;
        const self = this;
        this.connection.query(data_base_check_query, function db_check(err, results, fields)
        {
            
            if(err)
            {
                console.log(err);
                console.log("db 유무 확인 에러");
            }
            else
            {
                if(results.length > 0)
                {
                    console.log("db 존재 확인");
                    // 테이블 확인 시작
                    self.users_table_check();
                    self.cam_setting_table_check();
                    self.age_bmi_table_check();
                    self.bmi_ratio_table_check();
                }
                else
                {
                    console.log("db 없음 생성시작");
                    // this.data_base_create_bodycare_db();
                    // data_base_create_bodycare_db();
                    self.data_base_create_bodycare_db();
                }
            }
        });

        
    }


    users_table_check()
    {
        console.log("users_table유무확인");
        
        let table_check_query = `select 1 from information_schema.tables where table_schema = "bodycare_db" and table_name = "users"`;
        const self = this;
        this.connection.query(table_check_query, function(err, results, fields)
        {
            if(err)
            {
                console.log("users table 확인 db에러");
            }
            else
            {
                // console.log(results);
                //[ RowDataPacket { '1': 1 } ]
                if(results.length > 0 )
                {
                    // 존재
                    // console.log(results.length);
                }
                else
                {
                    // 없음
                    console.log("users 테이블 없음");
                    self.table_create_users();
                    
                }
            }
        })
    }

    age_bmi_table_check()
    {
        console.log("bmi 테이블 유무 확인");
        const self = this;
        let table_check_query = `select 1 from information_schema.tables where table_schema = "bodycare_db" and table_name = "ages_bmi"`;
        this.connection.query(table_check_query, function(err, results, fields)
        {
            if(err)
            {
                console.log('bmi 테이블 확인 에러')
            }
            else
            {
                if(results.length>0)
                {
                    //존재
                }
                else
                {
                    self.table_create_bmi();
                }
            }
        })
    }
    bmi_ratio_table_check()
    {
        console.log('bmi_ratio 유무확인')
        const self = this;
        let table_check_query = `select 1 from information_schema.tables where table_schema = "bodycare_db" and table_name = "bmi_ratio"`;
        this.connection.query(table_check_query, function(err, results, fields)
        {
            if(err)
            {
                console.log("bmi ratio 테이블 확인에러")
            }
            else
            {
                if(results.length > 0)
                {

                }
                else
                {
                    self.table_create_bmi_ratio();
                }
            }
        })
        
    }
    
    cam_setting_table_check()
    {
        console.log("cam_setting_table유무확인");
        const self = this;
        let table_check_query = `select 1 from information_schema.tables where table_schema = "bodycare_db" and table_name = "cam_setting"`;
        this.connection.query(table_check_query, function(err, results, fields)
        {
            if(err)
            {
                console.log("cam_setting 확인 에러");
                console.log(err);
            }
            else
            {
                if(results.length  > 0)
                {
                    //존재
                }
                else
                {
                    // 없음
                    self.table_create_cam_setting();

                }
            }
        })

    }

    data_base_create_bodycare_db()
    {
        let create_db_query = `create database bodycare_db`;
        const self = this;
        this.connection.query(create_db_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("db 생성시 에러");
            }
            else
            {
                console.log(results);
                console.log("db 생성 완료");
                self.table_create_users();
                self.table_create_cam_setting();
                self.table_create_bmi();
                self.table_create_bmi_ratio();
            }
        })
    }


    table_create_bmi()
    {
        console.log("연령대 bmi 테이블 생성시작");
        const self = this;
        let create_table_query = 
        `create table bodycare_db.ages_bmi(
            age varchar(45) not null,
            male_hei varchar(45) null,
            male_wei varchar(45) null,
            male_bmi varchar(45) null,
            female_hei varchar(45) null,
            female_wei varchar(45) null,
            female_bmi varchar(45) null,
            primary key(age)
        )`

        this.connection.query(create_table_query, function(err, results, fiedls)
        {
            if(err)
            {
                console.log(err);
                console.log("bmi 테이블 생성 에러");
            }
            else
            {
                console.log("bmi테이블 생성 성공");
                self.bmi_insert_data();
            }
        })
    }

    table_create_bmi_ratio()
    {
        console.log('연령대 bmi 지표 테이블 생성시작')
        const self = this;

        let create_query = 
        `create table bodycare_db.bmi_ratio(
            age varchar(45) not null,
            _18 varchar(45) null,
            18_25 varchar(45) null,
            25_30 varchar(45) null,
            30_40 varchar(45) null,
            40_ varchar(45) null,
            number_ varchar(45) null,
            primary key(age)
            )`

        this.connection.query(create_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("bmi지표 생성 에러");
            }
            else
            {
                self.bmi_ratio_insert_data();
            }
            
        })
    }

    bmi_ratio_insert_data()
    {
        let insert_arr = [
            ['19세이하', '8.98', '57.84', '22.19', '10.39', '0.6', '11580'],
            ['20_24세', '10.55', '62.99', '18.82', '7.21', '0.42', '658753'],
            ['25_29세', '6.75', '60.86', '23.9', '8.09', '0.41', '1226431'],
            ['30_34세', '4.94', '55.8', '28.81', '10', '0.46', '1442628'],
            ['35_39세', '3.56', '52.8', '32.87', '10.41', '0.36', '1350874'],
            ['40_44세', '3.26', '55.17', '32.57', '8.77', '0.23', '2006127'],
            ['45_49세', '2.56', '56.73', '33.46', '7.11', '0.13', '1738378'],
            ['50_54세', '2.18', '58.13', '33.78', '5.83', '0.08', '2168867'],
            ['55_59세', '1.87', '58.85', '34.42', '4.8', '0.05', '1658155'],
            ['60_64세', '1.82', '58.73', '34.92', '4.49', '0.04', '1903517'],
            ['65_69세', '1.77', '56.89', '36.59', '4.72', '0.04', '1098322'],
            ['70_74세', '2', '56.14', '37.03', '4.79', '0.04', '889346'],
            ['75_79세', '2.64', '56.69', '35.97', '4.67', '0.03', '403223'],
            ['80_84세', '3.99', '58.89', '32.94', '4.15', '0.03', '305627'],
            ['85세_', '9.24', '62.97', '24.94', '2.83', '0.02', '85356']
        ]

        let insert_query = 
        `insert into bodycare_db.bmi_ratio(age,_18,18_25,25_30,30_40,40_,number_) values ?`;
        this.connection.query(insert_query, [insert_arr], function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log('bmi ratio insert 에러')
            }
            else
            {
                console.log('insert 성공')
            }
        })
    }

    bmi_insert_data()
    {
        let insert_bmi_arr = [
            ['전체', '171.38', '74.1', '25.228878', '158.17', '58.66', '23.44735'],
            ['19세', '174.01', '73.79','24.369639','161.5','59.87','22.95431'],
            ['20대','174.35','76.2','25.067503','161.77','57.98','22.15553'],
            ['30대','174.65','79.19','25.961702','161.77','59.53','22.74783'],
            ['40대','173.29','76.95','25.624867','160.39','59.65','23.1876'],
            ['50대','170.47','72.78','25.044717','157.69','58.93','23.6989'],
            ['60대','167.82','69.37','24.631126','155.15','58.35','24.24026'],
            ['70대','165.47','66.46','23.570469','152.34','57.28','24.6817'],
            ['80대','163.54','63.04','23.570469','148.8','53.26','24.05444'],];

        
        let insert_query = `insert into bodycare_db.ages_bmi(age, male_hei, male_wei, male_bmi, female_hei, female_wei, female_bmi) values ?`

        this.connection.query(insert_query, [insert_bmi_arr], function(err, results, fields)
        {
            if(err)
            {
                console.log('ages bmi insert 에러');
                console.log(err);
            }
            else
            {
                console.log('ages bmi insert 성공');
            }
        })


    }

    table_create_users()
    {
        console.log('users 테이블 생성 시작');
        let create_table_query = 
        `create table bodycare_db.users(
            tel varchar(10) not null,
            name varchar(10) null,
            age varchar(10) null,
            gen varchar(10) null,
            height varchar(10) null,
            weight varchar(10) null,
            primary key(tel)
        )`
        this.connection.query(create_table_query, function(err, results,fields)
        {
            if(err)
            {
                console.log('users table 생성 에러');
            }
            else
            {
                console.log("users 테이블 생성 성공");
            }
        })
    }

    table_create_cam_setting()
    {
        const self = this;
        console.log('cam_setting 테이블 생성 시작');
        let create_table_query = 
        `create table bodycare_db.cam_setting(
            num int not null auto_increment,
            cam_filter varchar(150) null,
            brightness varchar(20) null,
            contrast varchar(20) null,
            scale varchar(20) null,
            primary key(num)
        )`
        this.connection.query(create_table_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("cam_setting 생성에러")
            }
            else
            {
                console.log("cam_setting 생성 완료");
                self.default_cam_setting_insert();
            }
        })
    }

    default_cam_setting_insert()
    {
        let insert_query = `insert into bodycare_db.cam_setting (cam_filter, brightness, contrast, scale) values
         ('brightness(100%) contrast(100%)', '0', '0', '1')`;
        
         this.connection.query(insert_query, function(err, results, fields)
         {
            if(err)
            {
                console.log(err);
                console.log("cam_setting 초기값 insert 에러");
            }
            else
            {
                console.log("cam_setting insert 성공");
            }
         })
    }


    name_filter(results)
    {
        let filter_arr = [];
        for(let i = 0 ; i < results.length; i++)
        {
            let people_dict = {};        
            people_dict['name'] = results[i].name;
            people_dict['gen'] = results[i].gen;
            people_dict['age'] = results[i].age;
            people_dict['con'] = results[i].tel;
            filter_arr.push(people_dict);
        }
        return filter_arr;
    }

    name_search_req(data, socket)
    {
        console.log("이름검색요청");

        let search_query = `select name, gen, age, tel from bodycare_db.users where name='${data}'`;
        const self = this;
        this.connection.query(search_query, function(err, results, fiedls)
        {
            if(err)
            {
                console.log("이름 검색 db에러");
                console.log(err);
            }
            else
            {
                let name_data = self.name_filter(results);
                socket.emit("search_result", name_data);

            }
        })
    }

    new_memeber_table(tel_num)
    {
        console.log("멤버 테이블 생성");
        let create_member_table_query = 
        `create table bodycare_db.member_${tel_num}(
            num int not null auto_increment,
            update_day varchar(45) null,

            f_left_arm_len varchar(45) null,
            f_right_arm_len varchar(45) null,
            f_left_leg_len varchar(45) null,
            f_right_leg_len varchar(45) null,
            f_sholder_angle varchar(45) null,
            f_hip_angle varchar(45) null,
            f_upper_len varchar(45) null,
            f_lower_len varchar(45) null,
            f_ratio varchar(45) null,

            l_es_tf varchar(45) null,
            l_es_len varchar(45) null,

            r_es_tf varchar(45) null,
            r_es_len varchar(45) null,

            b_left_arm_len varchar(45) null,
            b_right_arm_len varchar(45) null,
            b_left_leg_len varchar(45) null,
            b_right_leg_len varchar(45) null,
            b_sholder_angle varchar(45) null,
            b_hip_angle varchar(45) null,
            b_upper_len varchar(45) null,
            b_lower_len varchar(45) null,
            b_ratio varchar(45) null,

            front_body_normal longtext null,
            front_body_canny longtext null,
            front_body_con longtext null,

            left_body_normal longtext null,
            left_body_canny longtext null,
            left_body_con longtext null,
            
            right_body_normal longtext null,
            right_body_canny longtext null,
            right_body_con longtext null,
            
            back_body_normal longtext null,
            back_body_canny longtext null,
            back_body_con longtext null,

            now_wei varchar(45) null,
            
            primary key(num)
        )`   


        this.connection.query(create_member_table_query, function(err, results,fiedls)
        {
            if(err)
            {
                console.log("멤버 테이블 생성 에러");
                console.log(err);
            }
            else
            {
                console.log("테이블 생성 성공");
            }
        })
    }

    new_input_req(data, socket)
    {
        const self = this;
        let tel_num = data.con;

        const select_query = `select tel from bodycare_db.users where tel='${tel_num}'`;
        this.connection.query(select_query, function(err, results, fields)
        {
            if(err)
            {
                console.log('신규등록 번호 중복 확인 db에러');
                console.log(err);
            }
            if(results.length == 0)
            {
                //등록가능
                // tel  name  age   gen   height   weight
                
                let update_query = `insert into bodycare_db.users values ('${data.con}','${data.name}','${data.age}', '${data.gen}', '${data.hei}', '${data.wei}')`;
                self.connection.query(update_query, function(err, results, fields)
                {
                    if(err)
                    {
                        console.log("신규등록 db에러");
                        console.log(err);
                        socket.emit("new_input_res", "fail_input");
                    }
                    else
                    {
                        console.log(results);
                        self.new_memeber_table(data.con);
                        socket.emit("new_input_res", "success_input")
                    }
                });
            }
            else
            {
                socket.emit("new_input_res", "fail_input");
            }
        });
    }

    

    cam_setting_req()
    {
        let call_set_query = `select * from bodycare_db.cam_setting`;
        this.connection.query(call_set_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("cam_setting select 에러");
            }
            else
            {
                try
                {
                    let filter = results[0].cam_filter;
                    let brightness = Number(results[0].brightness);
                    let contrast = Number(results[0].contrast);
                    let scale = Number(results[0].scale);

                    let cam_setting_arr = {'filter':filter,'slider':[brightness,contrast,scale]};
                    return cam_setting_arr;
                }
                catch
                {
                    console.log("cam_setting 조회 에러");
                }
            }
        });
    }

    cam_setting_save(data)
    {
        
        let brightness = data.slider_value[0];
        let constrast = data.slider_value[1];
        let scale = data.slider_value[2];
        let save_query = `update bodycare_db.cam_setting set cam_filter=?, brightness=?, contrast=?, scale=?`;

        this.connection.query(save_query, [data.filter,`${brightness}`, `${constrast}`,`${scale}`], function(err, results, fields)
        {
            if(err)
            {
                console.log("cam_setting 저장 에러");
            }
            else
            {
                console.log("cam_setting 저장 완료");
            }
        })


    }

    input_result_data_save(total_result, tel_num, wei)
    {
        let today = new Date();
        let now = today.toLocaleString();
        const self = this;
        last_now = now;
        console.log('테이블번호 ' + tel_num);
        console.log(now+"저장 시작");
        
        // console.log(total_result.front.F_normal_img);
        console.log('wei' + wei);

        if(wei == undefined || wei == null || wei.length == 0)
        {
            console.log("몸무게 정보 없음");
            console.log(`${tel_num}번호를 이용한 몸무게 정보 획득 시작`);

            let weight_select_query = `select weight from bodycare_db.users where tel = '${tel_num}' `;
            this.connection.query(weight_select_query, function(err, results, fields)
            {
                if(err)
                {
                    console.log("몸무게 조회 에러");
                }
                else
                {
                    wei = results[0].weight
                    self.capture_result_save(total_result, tel_num, wei);
                }
            })
        }
        else
        {
            self.capture_result_save(total_result, tel_num, wei);
        }
        // let insert_query = `insert into bodycare_db.member_${name} values `
        // let insert_query = `insert into bodycare_db.member_${tel_num} values (null,'${now}','${total_result.front.F_normal_img}','${total_result.left.left_normal_img}','${total_result.right.right_normal_img}','${total_result.back.B_normarl_img}')`;
        //,[now, total_result.front.F_normal_img,total_result.left.left_normal_img, total_result.right.right_normal_img, total_result.back.B_normarl_img ]    
        // let insert_query3 = `insert into bodycare_db.member_${tel_num} (update_day, front_body, left_body, right_body, back_body) values (?,?,?,?,?)`
       
    }

    capture_result_save(total_result, tel_num, wei)
    {
        let today = new Date();
        let now = today.toLocaleString();
        const self = this;
        last_now = now;

        let insert_query2 = `insert into bodycare_db.member_${tel_num} values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
        let insert_arr = [
            null,
            now ,

            total_result.front.F_left_arm,
            total_result.front.F_right_arm,
            total_result.front.F_left_leg,
            total_result.front.F_right_leg,
            total_result.front.F_sholder_angle ,
            total_result.front.F_hip_angle ,
            total_result.front.F_upperbody ,
            total_result.front.F_lowerbody ,
            total_result.front.F_body_ratio ,

            total_result.left.ear_to_sholder ,
            total_result.left.ear_to_sholder_length,

            total_result.right.ear_to_sholder,
            total_result.right.ear_to_sholder_length,

            total_result.back.B_left_arm,
            total_result.back.B_right_arm,
            total_result.back.B_left_leg ,
            total_result.back.B_right_leg,
            total_result.back.B_sholder_angle,
            total_result.back.B_hip_angle,
            total_result.back.B_upperbody,
            total_result.back.B_lowerbody,
            total_result.back.B_body_ratio,

            total_result.front.F_normal_img,
            total_result.front.F_canny_img,
            total_result.front.F_con_img,
            
            total_result.left.left_normal_img,
            total_result.left.left_canny_img,
            total_result.left.left_con_img,
            
            total_result.right.right_normal_img,
            total_result.right.right_canny_img,
            total_result.right.right_con_img,
            
            total_result.back.B_normal_img,
            total_result.back.B_canny_img,
            total_result.back.B_con_img,

            wei
        ]
        console.log(insert_arr.length + "개의 컬럼");
        this.connection.query(insert_query2,insert_arr,function(err, results, fiedls)
        {
            if(err)
            {
                console.log(err);
                console.log('member테이블 개인 기록 저장 에러');
            }
            else
            {
                console.log(results);
            }
        })
    }

    member_wei_change(tel_num, wei, socket)
    {
        // 여기
        let self = this;
    
        console.log(tel_num, wei);
        let save_query = `update bodycare_db.member_${tel_num} set now_wei=? where update_day='${last_now}'`;

        this.connection.query(save_query, [wei], function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("몸무게 변경 에러");
            }
            else
            {
                self.member_info_chage(tel_num,wei,socket);
                // socket.emit('kg_change_res', '변경 성공');
                console.log("개인 테이블 변경 성공");
            }
        })


    }

    member_info_chage(tel_num, wei, socket)
    {
        let change_query = `update bodycare_db.users set weight=? where tel='${tel_num}'`;
        this.connection.query(change_query,[wei], function(err, results, fields)
        {
            if(err)
            {
                console.log(err)
                console.log("유저 정보 변경에러");
            }
            else
            {
                console.log("유저 테이블 변경 성공");
                socket.emit('kg_change_res', '변경 성공');
            }
        })
    }


    person_info_req(tel_num, socket)
    {
        console.log(tel_num);
        console.log("정보 조회")
        let search_info_query = `select * from bodycare_db.users where tel='${tel_num}'`;
        this.connection.query(search_info_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("기록조회를 위한 users 조회 에러");
            }
            else
            {
                console.log(results[0]);
                try
                {
                    let send_data = {
                        'name': results[0].name,
                        'age' : results[0].age,
                        'con' : results[0].tel,
                        'hei' : results[0].height,
                        'wei' : results[0].weight,
                        'gen' : results[0].gen
                    }
                    socket.emit('person_info_res', send_data);
                }
                catch
                {
                    console.log(" users 기록조회 이후 에러");
                }
                
                
            }
        })
    }

    person_date_info_req(tel_num, socket)
    {
        let date_search_info_query = `select update_day from bodycare_db.member_${tel_num} order by num desc`;
        this.connection.query(date_search_info_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err)
                console.log("member테이블 날짜 조회 에러");
            }
            else
            {
                let date_arr = [];
                console.log(results);
                for(let i =0; i<results.length;i++)
                {
                    // results[i].update_day
                    date_arr.push(results[i].update_day)
                }
                socket.emit('person_log_data_res', date_arr);
            }
        })
    }

    log_table_search(tel_num, date, socket)
    {
        let search_table_query = `select * from bodycare_db.member_${tel_num} where update_day='${date}'`;

        this.connection.query(search_table_query, function(err, results, fiedls)
        {
            if(err)
            {
                console.log(err)
                console.log("memeber 테이블 조회 에러");
            }
            else
            {
                let info = results[0];
                console.log(info);
                let result_data = {
                    'front':
                    {
                        'left_arm':info.f_left_arm_len,
                        'right_arm':info.f_right_arm_len,
                        'left_leg': info.f_left_leg_len,
                        'right_leg' : info.f_right_leg_len,
                        's_angle' : info.f_sholder_angle,
                        'h_angle' : info.f_hip_angle,
                        'upperbody' : info.f_upper_len,
                        'lowerbody' : info.f_lower_len,
                        'bodyratio' : info.f_ratio
                    },
                    'side':
                    {
                        '목 위치':info.l_es_len,
                    },
                    'capture':
                    {
                        'f_none':info.front_body_normal,
                        'f_can' :info.front_body_canny,
                        'f_con' : info.front_body_con,

                        'l_none':info.left_body_normal,
                        'l_can':info.left_body_canny,
                        'l_con':info.left_body_con,

                        'r_none':info.right_body_normal,
                        'r_can':info.right_body_canny,
                        'r_con':info.right_body_con,

                        'b_none':info.back_body_normal,
                        'b_can':info.back_body_canny,
                        'b_con':info.back_body_con
                        // 'f_con' : 
                        // 'f_can':
                        // ''
                    }
                }
                // console.log(info);
                // console.log("결과");
                // console.log(result_data.capture.f_none);
                socket.emit('detail_log_res', result_data);

            }
        })
    }


    age_bmi_select_req(ages, socket)
    {
        let select_query = `select * from bodycare_db.ages_bmi where age= '${ages}'`;
        this.connection.query(select_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log('ages bmi 조회 에러')
            }
            else
            {
                try
                {
                    let r = results[0];
                    socket.emit('ages_bmi_res', r);

                }
                catch
                {
                    console.log('ages bmi 정상조회 이후 에러');
                }
            }
        })
    }


    chart_person_info_req(tel_num, socket)
    {
        console.log(tel_num + '차트 사람 조회');
        let search_info_query = `select * from bodycare_db.users where tel='${tel_num}'`;
        this.connection.query(search_info_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("차트조회를 위한 users 조회 에러");
            }
            else
            {
                console.log(results[0]);
                try
                {
                    let send_data = {
                        'name': results[0].name,
                        'age' : results[0].age,
                        'con' : results[0].tel,
                        'hei' : results[0].height,
                        'wei' : results[0].weight,
                        'gen' : results[0].gen
                    }
                    socket.emit('chart_person_info_res', send_data);
                }
                catch
                {
                    console.log(" users 기록조회 이후 에러");
                }
            }
        })
    }

    chart_bmi_req(age_text, socket)
    {
        let select_query = `select * from bodycare_db.ages_bmi where age= '${age_text}'`;
        this.connection.query(select_query, function(err, results, fields)
        {
            if(err)
            {
                console.log('chart bmi 조회 에러');
                console.log(err);
            }
            else
            {

                try
                {
                    console.log('조회 결과');
                    console.log(results[0]);
                    let r = results[0];

                    socket.emit('chart_bmi_res', r);

                }
                catch
                {
                    console.log('ages bmi 정상조회 이후 에러');
                }



            }
        });
        
    }


    chart_log_req_five(tel_num, socket)
    {
        let log_search_info_query = `select update_day, now_wei from bodycare_db.member_${tel_num} order by num desc limit 5`;

        const self = this;
        this.connection.query(log_search_info_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log("최근기록 5개 조회 에러");
            }
            else
            {

                console.log(results);


                let send_wei = [];
                for(let i = 0; i < results.length; i ++)
                {
                    let date_arr = self.date_return(results[i].update_day);
                    let num_wei = self.get_wei_num(results[i].now_wei);
                    let re = {'date':date_arr[0], 'value':num_wei}
                    send_wei.push(re);
                }
                console.log(send_wei);
                socket.emit('chart_log_data_res', send_wei);
            }
        })
        
    }

    get_wei_num(wei)
    {
        let ww = wei.replace('kg', '')
        ww = Number(ww);
        console.log(ww);
        return ww;
    }

    chart_cloud_req(now_human, select_date, socket)
    {
        let tel_num = now_human.tel;
        console.log("매개변수 확인");
        if(select_date.length == 0)
        {
            console.log('선택한 날짜 없음. newinfo에서 넘어옴');
            select_date = last_now;
        }
        console.log(tel_num, select_date)
        console.log("now_human");
        console.log(now_human);
        
        const self = this;

        console.log('now_human 정보 획득 시작');

        let human_info_query = `select * from bodycare_db.users where tel = '${tel_num}'`
        this.connection.query(human_info_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log('구름 정보 유저 정보 조회 에러');
            }
            else
            {
                now_human = results[0];
                self.cloud_info_get(now_human, select_date, socket);
            }
        })
    }


    cloud_info_get(now_human, select_date, socket)
    {
        let tel_num = now_human.tel;
        const self = this;
        let log_query = `select * from bodycare_db.member_${tel_num} where update_day = '${select_date}'`;
        this.connection.query(log_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err);
                console.log('구름 기록 선택 조회 에러')
            }
            else
            {
                try
                {
                    
                    console.log(results[0]);
                    let info = results[0];

                    let date_arr = self.date_return(info.update_day);
                    let fsa = self.angle_return(Number(info.f_sholder_angle)).toFixed(2).toString();
                    let fha = self.angle_return(Number(info.f_hip_angle)).toFixed(2).toString();
                    let bsa = self.angle_return(Number(info.b_sholder_angle)).toFixed(2).toString();
                    let bha = self.angle_return(Number(info.b_hip_angle)).toFixed(2).toString();
                    console.log("여기")
                    console.log(date_arr);
                    // value 한 5개 정도
                    let send_data = [
                        {'name':'촬영일', 'value':date_arr[0], 'value2':date_arr[1], 'value3':date_arr[2]},
                        {'name':`${now_human.name}님`, 'value':now_human.age, 'value2':now_human.height,'value3':now_human.weight, 'value4':now_human.tel, 'value5':now_human.gen}, 
                        {'name':'팔 길이','value11':'오른쪽','value':self.fix_str(info.f_right_arm_len),'value4':self.fix_str(info.b_right_arm_len),'value5':'왼쪽','value2':self.fix_str(info.f_left_arm_len),'value3':self.fix_str(info.b_left_arm_len)},
                        {'name':'다리 길이', 'value':'오른쪽', 'value':self.fix_str(info.f_right_leg_len), 'value1':self.fix_str(info.b_right_leg_len), 'value2':'왼쪽','value3': self.fix_str(info.b_left_leg_len), 'value4':self.fix_str(info.b_right_leg_len)},
                        {'name':'목 정보', 'value0':'좌측','value':self.fix_str(info.l_es_len), 'value02':'우측','value2':self.fix_str(info.r_es_len)},
                        {'name':'어깨 각도', 'value0':'정면','value':fsa,'value02':'후면','value2':bsa },
                        {'name':'골반 각도', 'value0':'정면','value':fha,'value02':'후면','value2':bha },
                        {'name':'상하체','value0':'상체', 'value1':self.fix_str(info.f_upper_len), 'value2':self.fix_str(info.b_upper_len) , 'value3':'하체', 'value4':self.fix_str(info.f_lower_len), 'value5':self.fix_str(info.b_lower_len)},
                    ]
                    console.log("여기2");

                    socket.emit('chart_cloud_res', send_data);


                }
                catch(err)
                {
                    console.log(err);
                    console.log('구름 기록 선택 정상 조회 후 에러');
                }
                
            }
        });
    }

    date_return(update_day)
    {
        let date_arr = [];
        let ymd = update_day.split('오')[0];
        
        date_arr.push(ymd);
        if(update_day.includes('오후'))
        {
            let apm = "오후";
            date_arr.push(apm);
            let date_time = update_day.split('오후')[1];
            date_arr.push(date_time);
        }
        else
        {
            let apm = "오전";
            date_arr.push(apm);
            let date_time = update_day.split('오전')[1];
            date_arr.push(date_time);
        }
        console.log(date_arr);
        
        return date_arr;
    }

    angle_return(angle)
    {
        let result = 0;
        if(angle > 90)
        {
            result = 180 - angle;
        }
        else if(angle < -90)
        {
            result = 180 + angle;
        }
        else
        {
            result = angle;
        }
    
    
        return result;
    }

    fix_str(len_info)
    {

        let n = Number(len_info).toFixed(2).toString();
        return n;

    }

    chart_valance_req(tel_num, date_log, socket)
    {
        if(date_log.length == 0)
        {
            console.log('선택한 날짜 없음. newinfo에서 넘어옴');
            date_log = last_now;
        }

        console.log("차트 밸런스 들어가는 매개변수");
        console.log(tel_num, date_log);
        const self = this;
        let log_query = `select * from bodycare_db.member_${tel_num} where update_day = '${date_log}'`;

        this.connection.query(log_query, function(err, results, fields)
        {

            if(err)
            {
                console.log(err);
                console.log("차트 밸런스 지표 조회 에러");
            }
            else
            {
                console.log("차트 밸런스 지표");
                console.log(results);
                try
                {
                    let info = results[0];

                    let sholder_angle = info.f_sholder_angle;
                    let hip_angle = info.f_hip_angle;
                    let left_arm = info.f_left_arm_len;
                    let right_arm = info.f_right_arm_len;
                    let left_leg = info.f_left_leg_len;
                    let right_leg = info.f_right_leg_len;
                    let neck_len = info.l_es_len;

                    let bal_log = {
                        'sholder': sholder_angle,
                        'hip':hip_angle,
                        'left_arm' : left_arm,
                        'right_arm' : right_arm,
                        'left_leg' : left_leg,
                        'right_leg' : right_leg,
                        'neck_len' : neck_len
                    };
                    socket.emit('chart_balance_res', bal_log);
                }
                catch(err)
                {
                    socket.emit('chart_balance_res', 'error');
                }
                
            }


        })
    }


    log_confirm_req(tel_num, socket)
    {
        let select_query = `select num from bodycare_db.member_${tel_num};`
        this.connection.query(select_query, function(err, results, fields)
        {
            if(err)
            {
                console.log(err)
                console.log("기록 존재 유무 조회 에러");
            }
            else
            {
                if(results.length > 0)
                {
                    socket.emit('log_confirm_res', "true");
                }
                else
                {
                    socket.emit('log_confirm_res', 'none');
                }
            }
        })

    }




}
// let db = new DbManager();
// db.data_base_check();
module.exports = {DbManager};