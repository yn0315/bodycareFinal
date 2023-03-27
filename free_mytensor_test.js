const cv = require('opencv4nodejs');
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');
const { COLOR_BGR2GRAY } = require('opencv4nodejs');

class ImageAnalyze2
{
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
    
    trust_get(img1)
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
            
            //포인트별 원
            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 255, 0), 1);
            });
            
            let ls = new cv.Point2(0,0); // 왼쪽 어깨
            let rs = new cv.Point2(0,0); // 오른쪽 어깨
            let lw = new cv.Point2(0,0); // 왼쪽 손목
            let rw = new cv.Point2(0,0); // 오른쪽 손목
            let lh = new cv.Point2(0,0); // 왼쪽 골반
            let rh = new cv.Point2(0,0); // 오른쪽 골반
            let la = new cv.Point2(0,0); // 왼쪽 발목
            let ra = new cv.Point2(0,0); // 오른쪽 발목


            let body_trust = 0;
            let face_trust = 0;

            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                if(keypoint.part == 'leftShoulder')
                {
                    body_trust += keypoint.score;
                    ls = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightShoulder')
                {
                    body_trust += keypoint.score;
                    rs = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftWrist')
                {
                    body_trust += keypoint.score;
                    lw = new cv.Point2(px,py);
                }
                else if(keypoint.part == 'rightWrist')
                {
                    body_trust += keypoint.score;
                    rw = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftHip')
                {
                    body_trust += keypoint.score;
                    lh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightHip')
                {
                    body_trust += keypoint.score;
                    rh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftAnkle')
                {
                    body_trust += keypoint.score;
                    la = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightAnkle')
                {
                    body_trust += keypoint.score;
                    ra = new cv.Point2(px, py);
                }
                else
                {
                    face_trust += keypoint.score;
                }
            });

            console.log(`face 신뢰도 : ${face_trust/8}`);
            console.log(`body 신뢰도 : ${body_trust/5}`);

        };

        loadAndDetectPose(img1);

    }

    tensor_sup(img_1) {        
        const loadAndDetectPose = async (img) => {
            
            const net = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: { width: img.cols, height: img.rows },
                //                          640                 480
                multiplier: 0.75,
                quantBytes: 2,
                minPartConfidence: 0.2
            });

            const imgResized = img.resize(new cv.Size(img.cols, img.rows));
            const input = cv.imencode('.jpg', imgResized).toString('base64');
            const tensor = tf.node.decodeImage(Buffer.from(input, 'base64'));

            const pose = await net.estimateSinglePose(tensor, {
                flipHorizontal: false
            });

            let size_ratio_x = img.cols / 480;
            let size_raito_y = img.rows / 640;

            console.log(pose.keypoints);
            
            //포인트별 원
            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                img.drawCircle(new cv.Point(px, py), 3, new cv.Vec(0, 255, 0), 1);
            });
            
            let ls = new cv.Point2(0,0); // 왼쪽 어깨
            let rs = new cv.Point2(0,0); // 오른쪽 어깨
            let lw = new cv.Point2(0,0); // 왼쪽 손목
            let rw = new cv.Point2(0,0); // 오른쪽 손목
            let lh = new cv.Point2(0,0); // 왼쪽 골반
            let rh = new cv.Point2(0,0); // 오른쪽 골반
            let la = new cv.Point2(0,0); // 왼쪽 발목
            let ra = new cv.Point2(0,0); // 오른쪽 발목

            let body_trust = 0;
            let face_trust = 0;

            pose.keypoints.forEach(function(keypoint)
            {
                const { x, y } = keypoint.position;
                let px = x * size_ratio_x;
                let py = y * size_raito_y;
                if(keypoint.part == 'leftShoulder')
                {
                    body_trust += keypoint.score;
                    ls = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightShoulder')
                {
                    body_trust += keypoint.score;
                    rs = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftWrist')
                {
                    body_trust += keypoint.score;
                    lw = new cv.Point2(px,py);
                }
                else if(keypoint.part == 'rightWrist')
                {
                    body_trust += keypoint.score;
                    rw = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftHip')
                {
                    body_trust += keypoint.score;
                    lh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightHip')
                {
                    body_trust += keypoint.score;
                    rh = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'leftAnkle')
                {
                    body_trust += keypoint.score;
                    la = new cv.Point2(px, py);
                }
                else if(keypoint.part == 'rightAnkle')
                {
                    body_trust += keypoint.score;
                    ra = new cv.Point2(px, py);
                }
                else
                {
                    face_trust += keypoint.score;
                }
            });





            let left_arm_length = this.length_p(ls, lw);
            console.log(`왼쪽 팔 길이: ${left_arm_length}`);
            img.drawLine(ls, lw, new cv.Vec3(255,0,0));

            let right_arm_length = this.length_p(rw, rs);
            img.drawLine(rw, rs, new cv.Vec3(125,225,125));
            console.log(`오른쪽 팔 길이: ${right_arm_length}`);

            let left_leg_length = this.length_p(lh, la);
            console.log(`왼쪽 다리 길이: ${left_leg_length}`);
            img.drawLine(lh,la, new cv.Vec3(0,0,225));

            let right_leg_length = this.length_p(rh, ra);
            console.log(`오른쪽 다리 길이: ${right_leg_length}`);
            img.drawLine(rh, ra, new cv.Vec3(0,255,255));


            //상하체 비율
            this.body_ratio(ls, rs, lh, rh, la, ra);


            // 각도 계산필요

            let sholder_angle = this.get_angle(rs, ls);
            console.log(`어깨의 기울기 ${sholder_angle}도`);
            let hip_angle = this.get_angle(rh, lh);
            console.log(`골반의 기울기 ${hip_angle}도`);

            cv.imshowWait('result', img);

            cv.imwrite("tensor.jpg", img);

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

    draw_pose(pose)
    {
        
        
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

    }

    get_angle(a= new cv.Point2(0,0), b=new cv.Point2(0,0))
    {
        let x = b.x - a.x;
        let y = b.y - a.y;
        let radian = Math.atan2(y,x);
        let degree = radian*180/Math.PI;
        let angle = (b.y-a.y)/(b.x-b.y);
        console.log(`기울기 ${angle}`);
        return degree;
    }
    length_p(a =new cv.Point2(0,0), b=new cv.Point2(0,0))
    {
        let result_length = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

        return result_length;
    }

}

var test_img = cv.imread("C:\\Users\\202-14\\Desktop\\final_project\\front.jpg");
const ia = new ImageAnalyze2()
ia.tensor_sup(test_img);
