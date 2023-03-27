


// const { connect } = require('http2');
const mysql = require('mysql');
// const conn = {
//     host : 'localhost',
//     port : '3306',
//     user : 'root',
//     password : '0000',
//     database : 'bodycare_db'
// };


class DbManager
{

    constructor()
    {
        this.conn ={
            host : 'localhost',
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
        console.log('cam_setting 테이블 생성 시작');
        let create_table_query = 
        `create table bodycare_db.cam_setting(
            num int not null auto_increment,
            cam_filter varchar(20) null,
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
            update_day datetime null,
            front_body longblob null,
            left_body longblob null,
            right_body longblob null,
            back_body longblob null,
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

    cam_setting_req(socket)
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
                    let brightness = results[0].brightness;
                    let contrast = results[0].contrast;
                    let scale = results[0].scale;

                    let cam_setting_arr = [{'filter':filter},{'brightness':brightness},{"contrast":contrast},{"scale":scale}];
                    socket.emit("cam_setting_res", cam_setting_arr);
                }
                catch
                {
                    console.log("cam_setting 조회 에러");
                }

            }
        });
    }




    input_result_data_save(total_result, tel_num)
    {
        let today = new Date();
        let now = today.toLocaleString();
        console.log(now+"저장 시작");
        
        console.log(total_result.front.F_normal_img);
        console.log()
        // let insert_query = `insert into bodycare_db.member_${name} values `
        let insert_query = `insert into bodycare_db.member_${tel_num} values (null,'${now}','${total_result.front.F_normal_img}','${total_result.left.left_normal_img}','${total_result.right.right_normal_img}','${total_result.back.B_normarl_img}')`;
        //,[now, total_result.front.F_normal_img,total_result.left.left_normal_img, total_result.right.right_normal_img, total_result.back.B_normarl_img ]    

        let insert_query2 = `insert into bodycare_db.member_${tel_num} (update_day, front_body, left_body, right_body, back_body) values (?,?,?,?,?)`
        this.connection.query(insert_query2,[now, total_result.front.F_normal_img, total_result.left.left_normal_img, total_result.right.right_normal_img, total_result.back.B_normal_img],function(err, results, fiedls)
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


}

// let db = new DbManager();

// db.data_base_check();

module.exports = {DbManager};