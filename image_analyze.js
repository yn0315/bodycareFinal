const cv = require('opencv4nodejs');
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');
const { COLOR_BGR2GRAY, imwrite } = require('opencv4nodejs');
const { scalar, all } = require('@tensorflow/tfjs-node');



// cv.getRotationMatrix2D(center, angle, scale)


// 신뢰도가 가장높은 사람의 부위 객체 저장 클래스
class HumanPose
{
    constructor()
    {
        this.human_pose = [];
    }

    push_pose(pose)
    {
        this.human_pose.push(pose);
    }

    pop_pose()
    {
        this.human_pose.pop()
    }
    
    reset_pose()
    {
        this.human_pose = [];
    }
}


// 한부위에 대한 객체 저장 클래스
class PoseData
{
    constructor(score, part, position)
    {
        this.score = score;
        this.part = part;
        this.position = position;
    }
}



class ImageAnalyze
{

    data_count = 1;
    human_pose = undefined;
    normal_img = new cv.Mat();

    constructor()
    {
        this.length_dict = {};
        this.angle_dict = {};
        this.ratio_dict = {};

        this.front_pose = undefined;
        this.left_pose = undefined;
        this.right_pose = undefined;
        this.back_pose = undefined;
        this.pose_data_arr = [];

        this.length_count = -1;
    }
   
    opencv_sup(man_img)
    {
        // var man_img = cv.imread("C:\\Users\\202-14\\Desktop\\final_project\\big_front_body.png");

        var man_img_2 = man_img.copy();
        var man_img_3 = man_img.copy();

        const grayimg = man_img.cvtColor(COLOR_BGR2GRAY);
        cv.imwrite('togray.jpg', grayimg);
        const can_img = grayimg.canny(80,80,3,false);
        cv.imwrite('drawcanny.jpg', can_img);

        // var can_img = man_img.canny(100, 150);

        const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));
        let count = 0;
        let del_arr = [];
        contours.filter(function (contour) {

            if (contour.isConvex) {
                // console.log(count);
                // console.log(contour);

                del_arr.push(count);
                count += 1;
                return false;
            }
            else {
                count += 1;
                return true;
            }
        });
        // console.log(del_arr);

        for (let i = 0; i < del_arr.length; i++) {
            contours.splice(del_arr[i], 1);

        }

        const arr = [];
        var man_top = man_img.sizes[1];
        var man_bottom = 0;
        for (let i = 0; i < contours.length; i++) {
            if (contours[i].isConvex) {
                // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
            }
            else {
                let pt = contours[i].getPoints();
                arr.push(pt);
                let ys = pt.map(point => point.y);
                let max_y = Math.max(...ys);
                let min_y = Math.min(...ys);
                /// ... 은 스프레드 연산자 iterableObj를 깔끔하게 펼쳐줌
                if (man_top > min_y) {
                    man_top = min_y;
                }
                if (max_y > man_bottom) {
                    man_bottom = max_y;
                }
            }
        }

        let top_line_s = new cv.Point2(0, man_top);
        let top_line_f = new cv.Point2(man_img.sizes[0], man_top);
        let bottom_line_s = new cv.Point2(0, man_bottom);
        let bottom_line_f = new cv.Point2(man_img.sizes[1], man_bottom);
        // 고점 높이 라인
        man_img.drawLine(top_line_s, top_line_f, new cv.Vec(255, 0, 0), 2);
        // 저점 높이 라인
        man_img.drawLine(bottom_line_s, bottom_line_f, new cv.Vec(255, 0, 0), 2);

        let center_x = man_img.sizes[1] / 2;
        let center_s = new cv.Point2(center_x, man_top);
        let center_f = new cv.Point2(center_x, man_bottom);
        man_img.drawLine(center_s, center_f, new cv.Vec(255, 0, 0), 2);


        for (let i = 0; i < contours.length; i++) {
            let place = contours[i].getPoints();
            // console.log(place[0].x);
            // console.log(Math.round(man_img.sizes[1]/2));
            if (place[0].x == Math.round(man_img.sizes[1] / 2)) {
                console.log("있긴있음");
            }

        }


        console.log(`man_top ==>${man_top}`);
        console.log(`man_bottom ==>${man_bottom}`);
        //##################################################################


        man_img_2.drawContours(arr, -1, new cv.Vec3(0, 255, 0), 1);
        

        const classifier = new cv.CascadeClassifier(cv.HAAR_UPPERBODY);
        const upperbody = classifier.detectMultiScale(man_img_3);
        let max_rect = 0;

        upperbody.objects.forEach(function (rect, num) {

            let w = rect.width;
            let h = rect.height;

            let rect_size = w * h;

            if (rect_size > max_rect) {
                max_rect = rect_size;

                // 상체 사각형

                let upper_harf_s = new cv.Point2(rect.x, (rect.height / 2) + man_top);
                let upper_harf_f = new cv.Point2(rect.x + rect.width, (rect.height / 2) + man_top);
                man_img.drawLine(upper_harf_s, upper_harf_f,
                    new cv.Vec(255, 0, 0), 2);

                man_img.drawRectangle(new cv.Point(rect.x, rect.y + man_top),
                    new cv.Point(rect.x + rect.width, rect.y + rect.height + man_top),
                    new cv.Vec(0, 255, 0), 2);


                //하체 사각형
                man_img.drawRectangle(new cv.Point(rect.x, rect.y + rect.height + man_top),
                    new cv.Point(rect.x + rect.width, man_bottom),
                    new cv.Vec(0, 0, 255), 2);


                let upper_y = rect.height;
                let lower_y = man_bottom - rect.y + rect.height + man_top;
                console.log(`화면 비율에 인한 키 = ${upper_y + lower_y}`);
                console.log(`upper_y 상체길이 = ${upper_y}`);
                console.log(`lower_y 하체길이= ${lower_y}`);
                //각 길이는 실제 촬영 배경 사이즈 기준 환산 필요
            }
        });
    }


    async input_data(img_1)
    {
        // while(true)
        // {
        //     console.log("이전 작업 대기")
        //     if(this.pose_data_arr.length>this.length_count)
        //     {
        //         this.length_count = this.pose_data_arr.length;
        //         console.log("카운트 증가");
        //         break;
        //     }
        // }
        const loadAndDetectPose = async function(img){
            console.log("비동기 시작됨");
            const net = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: 640, height: 480 },
                multiplier: 0.75,
                quantBytes: 2,
                minPartConfidence: 0.2
            });
            console.log("await posenet.load 다음");
            const imgResized = img.resize(new cv.Size(640, 480));
            const input = cv.imencode('.jpg', imgResized).toString('base64');
            const tensor = tf.node.decodeImage(Buffer.from(input, 'base64'));

            const pose = await net.estimateSinglePose(tensor, {
                flipHorizontal: false
            });

            let size_ratio_x = img.cols / 640;
            let size_raito_y = img.rows / 480;

            console.log(`pose score 확인 ${pose.score}`);
            
            return pose;
        };
        
        
        let data = await loadAndDetectPose(img_1)
        
        this.pose_data_arr.push(data);
        this.normal_img = img_1;
        console.log("normal_img 데이터 들어감");
        if(this.pose_data_arr.length == 10)
        {
            console.log("10개");
            console.log("신뢰도 검사 시작");
            this.trust_check();
        }
        else
        {
            console.log(this.pose_data_arr.length);
        }
    }


    trust_check()
    {
        let max_score = 0;
        let max_nose =0;
        let max_l_eye = 0;
        let max_r_eye = 0;
        let max_l_ear = 0;
        let max_r_ear = 0;
        let max_l_shoulder = 0;
        let max_r_shoulder = 0;
        let max_l_elbow = 0;
        let max_r_elbow = 0;
        let max_l_wrist = 0;
        let max_r_wrist = 0;
        let max_l_hip = 0;
        let max_r_hip = 0;
        let max_l_knee = 0;
        let max_r_knee = 0;
        let max_l_ankle = 0;
        let max_r_ankle =0;

        let nose;
        let l_eye;
        let r_eye;
        let l_ear;
        let r_ear;
        let l_shoulder;
        let r_shoulder;
        let l_elbow;
        let r_elbow;
        let l_wrist;
        let r_wrist;
        let l_hip;
        let r_hip;
        let l_knee;
        let r_knee;
        let l_ankle;
        let r_ankle;
        
 
        this.pose_data_arr.forEach(function(pose)
        {
            pose.score

            if(pose.score>max_score)
            {
                max_score = pose.score;
            }
            /*코 , 왼눈, 오른눈, 왼귀, 오른귀
             왼어깨, 오른어깨, 왼팔꿈치, 오른팔꿈치, 왼손목, 오른손목
             왼골반, 오른골반, 왼무릎, 오른무릎, 왼발목, 오른발목*/
            pose.keypoints.forEach(function(keypoint)
            {
                if(keypoint.part == 'nose')
                {
                    if(keypoint.score > max_nose)
                    {
                        max_nose = keypoint.score;
                        nose = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }
                }
                else if(keypoint.part == 'leftEye')
                {
                    if(keypoint.score > max_l_eye)
                    {
                        max_l_eye = keypoint.score;
                        l_eye = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'rightEye')
                {
                    if(keypoint.score > max_r_eye)
                    {
                        max_r_eye = keypoint.score;
                        r_eye = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'leftEar')
                {
                    if(keypoint.score > max_l_ear)
                    {
                        max_l_ear = keypoint.score;
                        l_ear = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'rightEar')
                {
                    if(keypoint.score > max_r_ear)
                    {
                        max_r_ear = keypoint.score;
                        r_ear = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }
                    
                }
                else if(keypoint.part == 'leftShoulder')
                {
                    if(keypoint.score > max_l_shoulder)
                    {
                        max_l_shoulder = keypoint.score;
                        l_shoulder = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }
                }
                else if(keypoint.part == 'rightShoulder')
                {
                    if(keypoint.score > max_r_shoulder)
                    {
                        max_r_shoulder = keypoint.score;
                        r_shoulder = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'leftElbow')
                {
                    if(keypoint.score > max_l_elbow)
                    {
                        max_l_elbow = keypoint.score;
                        l_elbow = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'rightElbow')
                {
                    if(keypoint.score > max_r_elbow)
                    {
                        max_r_elbow = keypoint.score;
                        r_elbow = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'leftWrist')
                {
                    if(keypoint.score > max_l_wrist)
                    {
                        max_l_wrist = keypoint.score;
                        l_wrist = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }
                }
                else if(keypoint.part == 'rightWrist')
                {
                    if(keypoint.score > max_r_wrist)
                    {
                        max_r_wrist = keypoint.score;
                        r_wrist = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }
                }
                else if(keypoint.part == 'leftHip')
                {
                    if(keypoint.score > max_l_hip)
                    {
                        max_l_hip = keypoint.score;
                        l_hip = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'rightHip')
                {
                    if(keypoint.score > max_r_hip)
                    {
                        max_r_hip = keypoint.score;
                        r_hip = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'leftKnee')
                {
                    if(keypoint.score > max_l_knee)
                    {
                        max_l_knee = keypoint.score;
                        l_knee = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'rightKnee')
                {
                    if(keypoint.score > max_r_knee)
                    {
                        max_r_knee = keypoint.score;
                        r_knee = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
                else if(keypoint.part == 'leftAnkle')
                {
                    if(keypoint.score > max_l_ankle)
                    {
                        max_l_ankle = keypoint.score;
                        l_ankle = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }
                }
                else if(keypoint.part == 'rightAnkle')
                {
                    if(keypoint.score > max_r_ankle)
                    {
                        max_r_ankle = keypoint.score;
                        r_ankle = new PoseData(keypoint.score, keypoint.part, keypoint.position);
                    }

                }
            
            });
        });
        
        console.log(`1개중 평균 최대 pose.score : ${max_score}`);

        //신뢰도가 최대치인 각 파츠별 객체 수집
        this.humanpose = new HumanPose();
        

        this.humanpose.push_pose(nose);
        this.humanpose.push_pose(l_eye);
        this.humanpose.push_pose(r_eye);
        this.humanpose.push_pose(l_ear);
        this.humanpose.push_pose(r_ear);
        this.humanpose.push_pose(l_shoulder);
        this.humanpose.push_pose(r_shoulder);
        this.humanpose.push_pose(l_elbow);
        this.humanpose.push_pose(r_elbow);
        this.humanpose.push_pose(l_wrist);
        this.humanpose.push_pose(r_wrist);
        this.humanpose.push_pose(l_hip);
        this.humanpose.push_pose(r_hip);
        this.humanpose.push_pose(l_knee);
        this.humanpose.push_pose(r_knee);
        this.humanpose.push_pose(l_ankle);
        this.humanpose.push_pose(r_ankle);

        console.log('신뢰도가 가장높은 파츠별 객체 수집완료');
    }






    front_analyze()
    {
        console.log("정면 분석 시작");

        const img = this.normal_img.copy();
        const normal_img = this.normal_img.copy();
        cv.imwrite('front_normal.jpg', img);
        const grayimg = this.normal_img.cvtColor(COLOR_BGR2GRAY);
        cv.imwrite('front_togray.jpg', grayimg);
        const can_img = grayimg.canny(80,80,3,false);
        cv.imwrite('front_drawcanny.jpg', can_img);
        const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));
        let arr = [];
        for (let i = 0; i < contours.length; i++)
        {
            if (contours[i].isConvex) {
                // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
            }
            else 
            {
                let pt = contours[i].getPoints();
                arr.push(pt);
            }
        }
        let zero_img = new cv.Mat(img.rows, img.cols, cv.CV_8UC3,[0,0,0]);

        img.drawContours(arr, -1, new cv.Vec3(0,225,0),1);
        cv.imwrite('front_draw_con.jpg', img); // 원본에 컨투어
        zero_img.drawContours(arr, -1, new cv.Vec3(153, 0, 255), 1);
        cv.imwrite('front_drawcontours.jpg', zero_img); // 빈공간에 컨투어

        let size_ratio_x = img.cols / 640;
        let size_ratio_y = img.rows / 480;
        
        this.humanpose.human_pose.forEach(function(pose)
        {
            console.log(pose);
            const { x, y } = pose.position;
            let px = x * size_ratio_x;
            let py = y * size_ratio_y;
            img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 0, 255), 1);
            zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 204, 51), 1);
        });


        console.log("원그리기 완료");

        cv.imwrite('front_result_img.jpg', zero_img);

        let ls = new cv.Point2(0,0); // 왼쪽 어깨
        let rs = new cv.Point2(0,0); // 오른쪽 어깨
        let lw = new cv.Point2(0,0); // 왼쪽 손목
        let rw = new cv.Point2(0,0); // 오른쪽 손목
        let lh = new cv.Point2(0,0); // 왼쪽 골반
        let rh = new cv.Point2(0,0); // 오른쪽 골반
        let la = new cv.Point2(0,0); // 왼쪽 발목
        let ra = new cv.Point2(0,0); // 오른쪽 발목
        
        this.humanpose.human_pose.forEach(function(keypoint)
        {
            const { x, y } = keypoint.position;
            let px = x * size_ratio_x;
            let py = y * size_ratio_y;
            if(keypoint.part == 'leftShoulder')
            {
                console.log('왼쪽어깨');
                ls = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'rightShoulder')
            {
                console.log('오른쪽어깨');
                rs = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'leftWrist')
            {
                console.log('왼쪽손목');
                lw = new cv.Point2(px,py);
            }
            else if(keypoint.part == 'rightWrist')
            {
                console.log('오른쪽손목');
                rw = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'leftHip')
            {
                console.log('왼쪽 골반');
                lh = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'rightHip')
            {
                console.log('오른쪽 골반');
                rh = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'leftAnkle')
            {
                console.log('왼족 발목');
                la = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'rightAnkle')
            {
                console.log('오른쪽 발목');
                ra = new cv.Point2(px, py);
            }
        });
        

        let left_arm_length = this.length_p(ls, lw);
        console.log(`왼쪽 팔 길이: ${left_arm_length}`);
        let right_arm_length = this.length_p(rw, rs);
        console.log(`오른쪽 팔 길이: ${right_arm_length}`);
        let left_leg_length = this.length_p(lh, la);
        console.log(`왼쪽 다리 길이: ${left_leg_length}`);
        let right_leg_length = this.length_p(rh, rs);
        console.log(`오른쪽 다리 길이: ${right_leg_length}`);

        this.length_dict['왼쪽팔길이'] = left_arm_length;
        this.length_dict['오른쪽팔길이'] = right_arm_length;
        this.length_dict['왼쪽다리길이'] = left_leg_length;
        this.length_dict['오른쪽다리길이'] = right_leg_length;

        // 각도 계산필요

        let sholder_angle = this.get_angle(ls, rs);
        console.log(`어깨의 기울기 ${sholder_angle}`);
        let hip_angle = this.get_angle(lh, rh);
        console.log(`골반의 기울기 ${hip_angle}`);


        this.angle_dict['어깨기울기'] = sholder_angle;
        this.angle_dict['골반기울기'] = hip_angle;

        // 상하체 비율
        let body_return = this.body_ratio(ls, rs, lh, rh, la, ra);
    
        // let results = [
        //     {Upperbody : upper_body_length},
        //     {Lowerbody : lower_body_length},
        //     {Body_ratio : result}]
        console.log(body_return);
        console.log(body_return.Lowerbody);
        let nor = cv.imencode('.png',normal_img).toString('base64');
        let can = cv.imencode('.png', can_img).toString('base64');
        let con = cv.imencode('.png', img).toString('base64');
        let front_result = {
            'F_left_arm' : left_arm_length,
            'F_right_arm' : right_arm_length,
            'F_left_leg' : left_leg_length,
            'F_right_leg' : right_leg_length,
            'F_sholder_angle' : sholder_angle,
            'F_hip_angle' : hip_angle,
            'F_upperbody' : body_return.Upperbody,
            'F_lowerbody' : body_return.Lowerbody,
            'F_body_ratio' : body_return.Body_ratio,
            'F_normal_img' : nor,
            'F_canny_img' : can,
            'F_con_img' : con
        }
        
        cv.imwrite("front_tensor.jpg", img);
        return front_result;
    }


    left_analyze()
    {
        console.log("좌측 분석 시작");

        const img = this.normal_img.copy();
        const normal_img = this.normal_img.copy();
        cv.imwrite('left_normal.jpg', img);
        const grayimg = this.normal_img.cvtColor(COLOR_BGR2GRAY);
        cv.imwrite('left_togray.jpg', grayimg);
        const can_img = grayimg.canny(80,80,3,false);
        cv.imwrite('left_drawcanny.jpg', can_img);
        const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));


        let arr = [];
        for (let i = 0; i < contours.length; i++)
        {
            if (contours[i].isConvex) {
                // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
            }
            else 
            {
                let pt = contours[i].getPoints();
                arr.push(pt);
            }
        }
        let size_ratio_x = img.cols / 640;
        let size_raito_y = img.rows / 480;

        let fls = new cv.Point2(0,0);
        let fle = new cv.Point2(0,0);
        this.humanpose.human_pose.forEach(function(keypoint)
        {
            const { x, y } = keypoint.position;
            
            if(keypoint.part == "leftShoulder")
            {
                let px = x * size_ratio_x;
                let py = y * size_raito_y;

                fls = new cv.Point2(px, py);
            }
            if(keypoint.part == "leftEar")
            {
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                fle = new cv.Point2(px, py);
            }
        });

        //왼쪽 어깨 세로 선
        img.drawLine(new cv.Point2(fls.x, 0), new cv.Point2(fls.x, img.rows), new cv.Vec3(102,0,255),2);
        //왼쪽 어깨 가로 선
        img.drawLine(new cv.Point2(0, fls.y), new cv.Point2(img.cols, fls.y), new cv.Vec3(102,0,255),2);

        //왼쪽 귀 세로 선
        img.drawLine(new cv.Point2(fle.x, 0), new cv.Point2(fle.x, img.rows), new cv.Vec3(102, 0, 255),2);

        //거리선 그릴 y
        let y = (fls.y+fle.y)/2;
        let s_point = new cv.Point2(fle.x, y);
        let e_point = new cv.Point2(fls.x, y);

        //귀부터 어깨까지의 직선
        img.drawLine(s_point, e_point, new cv.Vec3(102,0,255),2);
        let ear_to_sholder = true;
        if(fle.x < fls.x)
        {
            console.log("어깨보다 귀가 더 앞에 있음");
            ear_to_sholder = true;
        }
        else
        {
            console.log("귀가 더 뒤에 있음");
            ear_to_sholder = false
        }

        let les_length = this.length_p(e_point,s_point);
        console.log(`좌측 귀부터 어깨까지의 거리:${les_length}`);


        let zero_img = new cv.Mat(img.rows, img.cols, cv.CV_8UC3,[0,0,0]);

        img.drawContours(arr, -1, new cv.Vec3(0,225,0),1);
        cv.imwrite('left_draw_con.jpg', img);
        

        zero_img.drawContours(arr, -1, new cv.Vec3(153, 0, 255), 1);
        cv.imwrite('left_drawcontours.jpg', zero_img);

        let lr=0;
        this.humanpose.human_pose.forEach(function(keypoint)
        {
            const { x, y } = keypoint.position;
            let px = x * size_ratio_x;
            let py = y * size_raito_y;
            if(lr%2 == 0)
            {
                img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 0, 255), 1);
                zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 204, 51), 1);
            }
            else
            {
                img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 255, 255), 1);
                zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 0, 255), 1);
            }
            
            
            lr += 1;
        });
        cv.imwrite('left_result_img.jpg', zero_img);

        let nor = cv.imencode('.png',normal_img).toString('base64');
        let can = cv.imencode('.png', can_img).toString('base64');
        let con = cv.imencode('.png', img).toString('base64');

        let left_result = {
            'ear_to_sholder' : ear_to_sholder,
            'ear_to_sholder_length' :les_length,
            'left_normal_img' : nor,
            'left_canny_img' : can,
            'left_con_img' : con
        }
        return left_result;

    }


    right_analyze()
    {
        console.log("우측분석 시작");
        const img = this.normal_img.copy();
        const normal_img = this.normal_img.copy();
        cv.imwrite('right_normal.jpg', img);
        const grayimg = this.normal_img.cvtColor(COLOR_BGR2GRAY);
        cv.imwrite('right_togray.jpg', grayimg);
        const can_img = grayimg.canny(80,80,3,false);
        cv.imwrite('right_drawcanny.jpg', can_img);
        const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));

        let arr = [];
        for (let i = 0; i < contours.length; i++)
        {
            if (contours[i].isConvex) {
                // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
            }
            else 
            {
                let pt = contours[i].getPoints();
                arr.push(pt);
            }
        }
        let size_ratio_x = img.cols / 640;
        let size_raito_y = img.rows / 480;

        let frs = new cv.Point2(0,0);
        let fre = new cv.Point2(0,0);
        this.humanpose.human_pose.forEach(function(keypoint)
        {
            const { x, y } = keypoint.position;
            
            if(keypoint.part == "rightShoulder")
            {
                let px = x * size_ratio_x;
                let py = y * size_raito_y;

                frs = new cv.Point2(px, py);
            }
            if(keypoint.part == "rightEar")
            {
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                fre = new cv.Point2(px, py);
            }
        });


        //오른쪽 어깨 세로 선
        img.drawLine(new cv.Point2(frs.x, 0), new cv.Point2(frs.x, img.rows), new cv.Vec3(102,0,255),2);

        //오른쪽 어깨 가로 선
        img.drawLine(new cv.Point2(0, frs.y), new cv.Point2(img.cols, frs.y), new cv.Vec3(102,0,255),2);

        //오른쪽 귀 세로 선
        img.drawLine(new cv.Point2(fre.x, 0), new cv.Point2(fre.x, img.rows), new cv.Vec3(102, 0, 255),2);

        //거리선 그릴 y
        let y = (frs.y+fre.y)/2;
        let s_point = new cv.Point2(frs.x, y); //어깨
        let e_point = new cv.Point2(fre.x, y); // 귀

        //어깨부터 귀까지의 수직선
        img.drawLine(s_point, e_point, new cv.Vec3(102,0,255),2);        
        let ear_to_sholder = true;
        if(frs.x < fre.x)
        {
            //어깨보다 귀의 x가 더 크면..... 신체기준 귀가 더 앞으로나옴
            console.log("어깨보다 귀가 더 앞에 있음");
            ear_to_sholder = true;
        }
        else
        {
            console.log("귀가 더 뒤에 있음");
            ear_to_sholder = false;
        }

        let res_length = this.length_p(s_point, e_point);
        console.log(`우측 어깨부터 귀까지의 거리:${res_length}`);
        let zero_img = new cv.Mat(img.rows, img.cols, cv.CV_8UC3,[0,0,0]);


        
        img.drawContours(arr, -1, new cv.Vec3(0,225,0),1);
        cv.imwrite('right_draw_con.jpg', img);
        

        zero_img.drawContours(arr, -1, new cv.Vec3(153, 0, 255), 1);
        cv.imwrite('right_drawcontours.jpg', zero_img);

                     /*코 , 왼눈, 오른눈, 왼귀, 오른귀
             왼어깨, 오른어깨, 왼팔꿈치, 오른팔꿈치, 왼손목, 오른손목
             왼골반, 오른골반, 왼무릎, 오른무릎, 왼발목, 오른발목*/


        //포인트별 원
        let rr=0;
        this.humanpose.human_pose.forEach(function(keypoint)
        {
            const { x, y } = keypoint.position;
            let px = x * size_ratio_x;
            let py = y * size_raito_y;
            if(rr%2 == 0) //오른쪽에 대한 좌표
            {
                img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 255, 255), 1);
                zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 0, 255), 1);
            }
            else //왼쪽에 대한 좌표
            {
                img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 0, 255), 1);
                zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 204, 51), 1);
            }
            
            
            rr += 1;
        });


        let nor = cv.imencode('.png',normal_img).toString('base64');
        let can = cv.imencode('.png', can_img).toString('base64');
        let con = cv.imencode('.png', img).toString('base64');

        let right_result = {
            'ear_to_sholder' : ear_to_sholder,
            'ear_to_sholder_length' : res_length,
            'right_normal_img' : nor,
            'right_canny_img' : can,
            'right_con_img' : con
        }

        return right_result;
    }

    back_analyze()
    {
        console.log("후면분석 시작");

        const img = this.normal_img.copy();
        const normal_img = this.normal_img.copy();
        cv.imwrite('back_normal.jpg', img);
        const grayimg = this.normal_img.cvtColor(COLOR_BGR2GRAY);
        cv.imwrite('back_togray.jpg', grayimg);
        const can_img = grayimg.canny(80,80,3,false);
        cv.imwrite('back_drawcanny.jpg', can_img);
        const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));
        let arr = [];
        for (let i = 0; i < contours.length; i++)
        {
            if (contours[i].isConvex) {
                // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
            }
            else 
            {
                let pt = contours[i].getPoints();
                arr.push(pt);
            }
        }
        let zero_img = new cv.Mat(img.rows, img.cols, cv.CV_8UC3,[0,0,0]);

        img.drawContours(arr, -1, new cv.Vec3(0,225,0),1);
        cv.imwrite('back_draw_con.jpg', img);
        zero_img.drawContours(arr, -1, new cv.Vec3(153, 0, 255), 1);
        cv.imwrite('back_drawcontours.jpg', zero_img);


        //포인트별 원
        // pose.keypoints.forEach(function(keypoint)
        // {
        //     const { x, y } = keypoint.position;
        //     let px = x * size_ratio_x;
        //     let py = y * size_raito_y;
        //     img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 0, 255), 1);
        //     zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 204, 51), 1);
        // });


        let size_ratio_x = img.cols / 640;
        let size_ratio_y = img.rows / 480;
        
        this.humanpose.human_pose.forEach(function(pose)
        {
            console.log(pose);
            const { x, y } = pose.position;
            let px = x * size_ratio_x;
            let py = y * size_ratio_y;
            img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 0, 255), 1);
            zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 204, 51), 1);
        });


        console.log("원그리기 완료");

        cv.imwrite('back_result_img.jpg', zero_img);

        let ls = new cv.Point2(0,0); // 왼쪽 어깨
        let rs = new cv.Point2(0,0); // 오른쪽 어깨
        let lw = new cv.Point2(0,0); // 왼쪽 손목
        let rw = new cv.Point2(0,0); // 오른쪽 손목
        let lh = new cv.Point2(0,0); // 왼쪽 골반
        let rh = new cv.Point2(0,0); // 오른쪽 골반
        let la = new cv.Point2(0,0); // 왼쪽 발목
        let ra = new cv.Point2(0,0); // 오른쪽 발목
        
        this.humanpose.human_pose.forEach(function(keypoint)
        {
            const { x, y } = keypoint.position;
            let px = x * size_ratio_x;
            let py = y * size_ratio_y;
            if(keypoint.part == 'leftShoulder')
            {
                console.log('왼쪽어깨');
                ls = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'rightShoulder')
            {
                console.log('오른쪽어깨');
                rs = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'leftWrist')
            {
                console.log('왼쪽손목');
                lw = new cv.Point2(px,py);
            }
            else if(keypoint.part == 'rightWrist')
            {
                console.log('오른쪽손목');
                rw = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'leftHip')
            {
                console.log('왼쪽 골반');
                lh = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'rightHip')
            {
                console.log('오른쪽 골반');
                rh = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'leftAnkle')
            {
                console.log('왼족 발목');
                la = new cv.Point2(px, py);
            }
            else if(keypoint.part == 'rightAnkle')
            {
                console.log('오른쪽 발목');
                ra = new cv.Point2(px, py);
            }
        });
        let left_arm_length = this.length_p(ls, lw);
        console.log(`왼쪽 팔 길이: ${left_arm_length}`);
        let right_arm_length = this.length_p(rw, rs);
        console.log(`오른쪽 팔 길이: ${right_arm_length}`);
        let left_leg_length = this.length_p(lh, la);
        console.log(`왼쪽 다리 길이: ${left_leg_length}`);
        let right_leg_length = this.length_p(rh, rs);
        console.log(`오른쪽 다리 길이: ${right_leg_length}`);

        this.length_dict['왼쪽팔길이'] = left_arm_length;
        this.length_dict['오른쪽팔길이'] = right_arm_length;
        this.length_dict['왼쪽다리길이'] = left_leg_length;
        this.length_dict['오른쪽다리길이'] = right_leg_length;

        // 각도 계산필요

        let sholder_angle = this.get_angle(ls, rs);
        console.log(`어깨의 기울기 ${sholder_angle}`);
        let hip_angle = this.get_angle(lh, rh);
        console.log(`골반의 기울기 ${hip_angle}`);


        this.angle_dict['어깨기울기'] = sholder_angle;
        this.angle_dict['골반기울기'] = hip_angle;

        // 상하체 비율
        let body_return = this.body_ratio(ls, rs, lh, rh, la, ra);
    

        cv.imwrite("back_tensor.jpg", img);
        // let front_result = {
        //     'F_left_arm' : left_arm_length,
        //     'F_right_arm' : right_arm_length,
        //     'F_left_leg' : left_leg_length,
        //     'F_right_leg' : right_leg_length,
        //     'F_sholder_angle' : sholder_angle,
        //     'F_hip_angle' : hip_angle,
        //     'F_upperbody' : body_return.Upperbody,
        //     'F_lowerbody' : body_return.Lowerbody,
        //     'F_body_ratio' : body_return.Body_ratio
        // }
        let nor = cv.imencode('.png',normal_img).toString('base64');
        let can = cv.imencode('.png', can_img).toString('base64');
        let con = cv.imencode('.png', img).toString('base64');

        let back_result = {
            'B_left_arm' : left_arm_length,
            'B_right_arm' : right_arm_length,
            'B_left_leg' : left_leg_length,
            'B_right_leg' : right_leg_length,
            'B_sholder_angle' : sholder_angle,
            'B_hip_angle' : hip_angle,
            'B_upperbody' : body_return.Upperbody,
            'B_lowerbody' : body_return.Lowerbody,
            'B_body_ratio' : body_return.Body_ratio,
            'B_normal_img' : nor,
            'B_canny_img' : can,
            'B_con_img' : con
        }

        // img.getData()
        // Buffer.from(img.getData());
        // console.log(back_result.B_normal_img);

        return back_result;
    }







    

    tensor_left(img_1)
    {
        const loadAndDetectPose = async (img) => {
            const net = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: 640, height: 480 },
                multiplier: 0.75,
                quantBytes: 2,
                minPartConfidence: 0.2
            });

            const imgResized = img.resize(new cv.Size(640, 480));
            const input = cv.imencode('.jpg', imgResized).toString('base64');
            const tensor = tf.node.decodeImage(Buffer.from(input, 'base64'));

            const pose = await net.estimateSinglePose(tensor, {
                flipHorizontal: false
            });

            let size_ratio_x = img.cols / 640;
            let size_raito_y = img.rows / 480;

            console.log(pose.keypoints);

            const grayimg = img.cvtColor(COLOR_BGR2GRAY);
            cv.imwrite('left_togray.jpg', grayimg);
            const can_img = grayimg.canny(80,80,3,false);
            const canny_img = can_img.copy();

            cv.imwrite('left_drawcanny.jpg', can_img);
            const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));
            const arr = [];
            var man_top = img.sizes[1];
            var man_bottom = 0;
            for (let i = 0; i < contours.length; i++)
            {
                if (contours[i].isConvex) 
                {
                    // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
                }
                else 
                {
                    let pt = contours[i].getPoints();
                    arr.push(pt);

                    let ys = pt.map(point => point.y);
                    let max_y = Math.max(...ys);
                    let min_y = Math.min(...ys);
                    /// ... 은 스프레드 연산자 iterableObj를 깔끔하게 펼쳐줌
                    if (man_top > min_y) 
                    {
                        man_top = min_y;
                    }
                    if (max_y > man_bottom) 
                    {
                        man_bottom = max_y;
                    }
                }
            }
            let center_top = new cv.Point2(img.cols/2, man_top);
            let center_bot = new cv.Point2(img.cols/2, man_bottom);



            
             /*코 , 왼눈, 오른눈, 왼귀, 오른귀
             왼어깨, 오른어깨, 왼팔꿈치, 오른팔꿈치, 왼손목, 오른손목
             왼골반, 오른골반, 왼무릎, 오른무릎, 왼발목, 오른발목*/
            let fls = new cv.Point2(0,0);
            let fle = new cv.Point2(0,0);
            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                
                if(keypoint.part == "leftShoulder")
                {
                    let px = x * size_ratio_x;
                    let py = y * size_raito_y;

                    fls = new cv.Point2(px, py);
                }
                if(keypoint.part == "leftEar")
                {
                    let px = x * size_ratio_x;
                    let py = y * size_raito_y;
                    fle = new cv.Point2(px, py);
                }
            });
            //왼쪽 어깨 세로 선
            img.drawLine(new cv.Point2(fls.x, 0), new cv.Point2(fls.x, img.rows), new cv.Vec3(102,0,255),2);
            //왼쪽 어깨 가로 선
            img.drawLine(new cv.Point2(0, fls.y), new cv.Point2(img.cols, fls.y), new cv.Vec3(102,0,255),2);

            //왼쪽 귀 세로 선
            img.drawLine(new cv.Point2(fle.x, 0), new cv.Point2(fle.x, img.rows), new cv.Vec3(102, 0, 255),2);

            //거리선 그릴 y
            let y = (fls.y+fle.y)/2;
            let s_point = new cv.Point2(fle.x, y);
            let e_point = new cv.Point2(fls.x, y);

            //귀부터 어깨까지의 직선
            img.drawLine(s_point, e_point, new cv.Vec3(102,0,255),2);

            if(fle.x < fls.x)
            {
                console.log("어깨보다 귀가 더 앞에 있음");
            }
            else
            {
                console.log("귀가 더 뒤에 있음");
            }

            let les_length = this.length_p(e_point,s_point);
            console.log(`좌측 귀부터 어깨까지의 거리:${les_length}`);


            let zero_img = new cv.Mat(img.rows, img.cols, cv.CV_8UC3,[0,0,0]);

            img.drawContours(arr, -1, new cv.Vec3(0,225,0),1);
            cv.imwrite('left_draw_con.jpg', img);
            

            zero_img.drawContours(arr, -1, new cv.Vec3(153, 0, 255), 1);
            cv.imwrite('left_drawcontours.jpg', zero_img);

            //포인트별 원
            let lr=0;
            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                if(lr%2 == 0)
                {
                    img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 0, 255), 1);
                    zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 204, 51), 1);
                }
                else
                {
                    img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 255, 255), 1);
                    zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 0, 255), 1);
                }
                
                
                lr += 1;
            });



            cv.imwrite('left_result_img.jpg', zero_img);
            
            let ls = new cv.Point2(0,0); // 왼쪽 어깨
            let rs = new cv.Point2(0,0); // 오른쪽 어깨
            let lw = new cv.Point2(0,0); // 왼쪽 손목
            let rw = new cv.Point2(0,0); // 오른쪽 손목
            let lh = new cv.Point2(0,0); // 왼쪽 골반
            let rh = new cv.Point2(0,0); // 오른쪽 골반
            let la = new cv.Point2(0,0); // 왼쪽 발목
            let ra = new cv.Point2(0,0); // 오른쪽 발목

            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                if(keypoint.part == 'leftShoulder')
                {
                    console.log('왼쪽어깨');
                    ls = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightShoulder')
                {
                    console.log('오른쪽어깨');
                    rs = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftWrist')
                {
                    console.log('왼쪽손목');
                    lw = new cv.Point2(px,py);
                }
                else if(keypoint.part == 'rightWrist')
                {
                    console.log('오른쪽손목');
                    rw = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftHip')
                {
                    console.log('왼쪽 골반');
                    lh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightHip')
                {
                    console.log('오른쪽 골반');
                    rh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftAnkle')
                {
                    console.log('왼족 발목');
                    la = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightAnkle')
                {
                    console.log('오른쪽 발목');
                    ra = new cv.Point2(px, py);
                }
            });

            cv.imwrite("left_tensor.jpg", img);

        };

        loadAndDetectPose(img_1);
    }

    face_detection(keypoints)
    {
        keypoints.forEach(function(keypoint)
        {
            if(keypoint.part == 'nose')
            {
                console.log('nose');
            }
            if(keypoint.part == 'leftEye')
            {
                console.log('leftEye');
            }
            if(keypoint.part == 'rightEye')
            {
                console.log('righttEye');
            }
            if(keypoint.part == 'leftEar')
            {
                console.log('leftEar');
            }
            if(keypoint.part == 'rightEar')
            {
                console.log('rightEar');
            }

        });
    }


    get_angle(a= new cv.Point2(0,0), b=new cv.Point2(0,0))
    {
        // 두 점 사이의 각도
        let x = b.x - a.x;
        let y = b.y - a.y;
        let radian = Math.atan2(y,x);
        let degree = radian*(180/Math.PI);
        // let angle = (b.y-a.y)/(b.x-b.y);
        return degree;
    }
    
    length_p(a =new cv.Point2(0,0), b=new cv.Point2(0,0))
    {
        // 두 점 사이의 직선거리
        let result_length = Math.sqrt(Math.pow(b.x-a.x,2) + Math.pow(b.y-a.y,2));
        
        return result_length;
    }

    body_ratio(ls=new cv.Point2(0,0), rs=new cv.Point2(0,0)
    , lh=new cv.Point2(0,0), rh=new cv.Point2(0,0),
    la = new cv.Point2(0,0), ra = new cv.Point2(0,0))
    {
        // 어깨의 중간y
        let sholder_y = (ls.y + rs.y)/2;
        console.log(`어깨의 중간y ${sholder_y}`);
        // 골반의 중간y
        let hip_y = (lh.y+rh.y)/2;
        console.log(`골반의 중간y ${hip_y}`);
        // 발목의 중간y
        let ankle_y = (la.y+ra.y)/2;
        console.log(`발목의 중간y ${ankle_y}`);

        // 어깨중간y부터 골반중간y 까지의 거리 = 상체 길이
        let upper_body_length = hip_y - sholder_y ;
        console.log(`상체 길이: ${upper_body_length}`);

        //골반 중간y부터 발목중간 y까지의 거리 = 하체길이
        let lower_body_length = ankle_y - hip_y;
        console.log(`하체 길이 : ${lower_body_length}`);

        let result = upper_body_length/lower_body_length;
        console.log(`상 하체 비율:${result}`);

        this.ratio_dict['상체'] = upper_body_length;
        this.ratio_dict['하체'] = lower_body_length;
        this.ratio_dict['상하체비율'] = result;

        // 

        let results_body = {
            'Upperbody':upper_body_length,
            'Lowerbody' : lower_body_length,
            'Body_ratio' : result
        }
        
        return results_body;
    }






    



///////////////////////////////////////////////// 단일 정면

    tensor_front(img_1) {
        const loadAndDetectPose = async (img) => {
            const net = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: 640, height: 480 },
                multiplier: 0.75,
                quantBytes: 2,
                minPartConfidence: 0.2
            });

            const imgResized = img.resize(new cv.Size(640, 480));
            const input = cv.imencode('.jpg', imgResized).toString('base64');
            const tensor = tf.node.decodeImage(Buffer.from(input, 'base64'));

            const pose = await net.estimateSinglePose(tensor, {
                flipHorizontal: false
            });

            let size_ratio_x = img.cols / 640;
            let size_raito_y = img.rows / 480;
            console.log(`pose score 확인 ${pose.score}`);

            let total_score = 0;
            
            pose.keypoints.forEach(function(keypoint)
            {
                total_score += keypoint.score;
            });
            console.log(`total_score  확인: ${total_score}`);
            let avg_score = total_score/pose.keypoints.length;
            console.log(`avg score확인:${avg_score}`);
            console.log(pose.keypoints);


            const grayimg = img.cvtColor(COLOR_BGR2GRAY);
            cv.imwrite('front_togray.jpg', grayimg);
            const can_img = grayimg.canny(80,80,3,false);

            cv.imwrite('front_drawcanny.jpg', can_img);
            const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE, new cv.Point2(0, 0));
            const arr = [];
            var man_top = img.sizes[1];
            var man_bottom = 0;
            for (let i = 0; i < contours.length; i++)
            {
                if (contours[i].isConvex) {
                    // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
                }
                else 
                {
                    let pt = contours[i].getPoints();
                    arr.push(pt);

                    let ys = pt.map(point => point.y);
                    let max_y = Math.max(...ys);
                    let min_y = Math.min(...ys);
                    /// ... 은 스프레드 연산자 iterableObj를 깔끔하게 펼쳐줌
                    if (man_top > min_y) {
                        man_top = min_y;
                    }
                    if (max_y > man_bottom) {
                        man_bottom = max_y;
                    }
                }
            }
            // let zero_img = cv.Mat.zeros(img.cols, img.rows,cv.CV_8UC3);
            // let zero_img = img.zeros([img.cols,img.rows], cv.CV_8UC3);

            // const zeros = new Array(3).fill(0).map(() => new Array(img.rows).fill(0).map(() => new Uint8Array(img.cols).fill(0)));
            // let zero_img = cv.Mat.zeros([img.cols,img.rows], cv.CV_8UC3);
            let zero_img = new cv.Mat(img.rows, img.cols, cv.CV_8UC3,[0,0,0]);

            img.drawContours(arr, -1, new cv.Vec3(0,225,0),1);
            cv.imwrite('front_draw_con.jpg', img);
            

            zero_img.drawContours(arr, -1, new cv.Vec3(153, 0, 255), 1);
            cv.imwrite('front_drawcontours.jpg', zero_img);

            //포인트별 원
            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 0, 255), 1);
                zero_img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(102, 204, 51), 1);
            });



            cv.imwrite('front_result_img.jpg', zero_img);
            
            let ls = new cv.Point2(0,0); // 왼쪽 어깨
            let rs = new cv.Point2(0,0); // 오른쪽 어깨
            let lw = new cv.Point2(0,0); // 왼쪽 손목
            let rw = new cv.Point2(0,0); // 오른쪽 손목
            let lh = new cv.Point2(0,0); // 왼쪽 골반
            let rh = new cv.Point2(0,0); // 오른쪽 골반
            let la = new cv.Point2(0,0); // 왼쪽 발목
            let ra = new cv.Point2(0,0); // 오른쪽 발목


            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                if(keypoint.part == 'leftShoulder')
                {
                    console.log('왼쪽어깨');
                    ls = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightShoulder')
                {
                    console.log('오른쪽어깨');
                    rs = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftWrist')
                {
                    console.log('왼쪽손목');
                    lw = new cv.Point2(px,py);
                }
                else if(keypoint.part == 'rightWrist')
                {
                    console.log('오른쪽손목');
                    rw = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftHip')
                {
                    console.log('왼쪽 골반');
                    lh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightHip')
                {
                    console.log('오른쪽 골반');
                    rh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftAnkle')
                {
                    console.log('왼족 발목');
                    la = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightAnkle')
                {
                    console.log('오른쪽 발목');
                    ra = new cv.Point2(px, py);
                }
            });
            let left_arm_length = this.length_p(ls, lw);
            console.log(`왼쪽 팔 길이: ${left_arm_length}`);
            let right_arm_length = this.length_p(rw, rs);
            console.log(`오른쪽 팔 길이: ${right_arm_length}`);
            let left_leg_length = this.length_p(lh, la);
            console.log(`왼쪽 다리 길이: ${left_leg_length}`);
            let right_leg_length = this.length_p(rh, rs);
            console.log(`오른쪽 다리 길이: ${right_leg_length}`);

            this.length_dict['왼쪽팔길이'] = left_arm_length;
            this.length_dict['오른쪽팔길이'] = right_arm_length;
            this.length_dict['왼쪽다리길이'] = left_leg_length;
            this.length_dict['오른쪽다리길이'] = right_leg_length;

            // 각도 계산필요

            let sholder_angle = this.get_angle(ls, rs);
            console.log(`어깨의 기울기 ${sholder_angle}`);
            let hip_angle = this.get_angle(lh, rh);
            console.log(`골반의 기울기 ${hip_angle}`);


            this.angle_dict['어깨기울기'] = sholder_angle;
            this.angle_dict['골반기울기'] = hip_angle;

            // 상하체 비율
            this.body_ratio(ls, rs, lh, rh, la, ra);
        

            cv.imwrite("front_tensor.jpg", img);

            
            this.front_pose = pose;
        };

        loadAndDetectPose(img_1)
    }
}

module.exports = {ImageAnalyze};