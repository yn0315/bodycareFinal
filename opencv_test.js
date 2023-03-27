// require('express');

const cv = require('opencv4nodejs');
const { COLOR_BGR2GRAY } = require('opencv4nodejs');
// import {loadAndDetectPose} from "./tensor_test.js";

// const posenet = require('@tensorflow-models/posenet');

// // Read a frame from camera

var man_img = cv.imread("C:\\Users\\202-14\\Desktop\\final_project\\big_front_body.png");
// const modelPath = path.resolve(__dirname, 'models/pose/mpi/pose_iter_160000.caffemodel')
// //                                             160000회 학습된 신체 검출 모델 256 456 이미지 최적화
// const protoPath = path.resolve(__dirname, 'models/pose/mpi/pose_deploy_linevec_faster_4_stages.prototxt');

// const net = cv.readNetFromCaffe(protoPath, modelPath);
// // const grayimg = man_img.cvtColor(COLOR_BGR2GRAY)

var man_img_2 = man_img.copy();
var man_img_3 = man_img.copy();
var pose_img = man_img.copy();
// loadAndDetectPose(pose_img);


// {
  
//   const img_tensor = tf.tensor3d(img_data.getDataAsArray(), [img_data.rows, img_data.cols, 3], 'float32');
//   const pose_image = img_tensor.div(255);

//   const net = await posenet.load({
//     architecture: 'MobileNetV1',
//     outputStride: 16,
//     inputResolution: { width: img.cols, height: img.rows },
//     multiplier: 0.5,
//     quantBytes: 2
//   });
//   const poses = await net.estimateMultiplePoses(pose_image, {
//     flipHorizontal: false,
//     maxDetections: 5,
//     scoreThreshold: 0.5,
//     nmsRadius: 20
//   });

//   // 검출된 포즈 정보 출력
//   poses.forEach((pose) => {
//     console.log(pose);
//   });

// }


// detectPose(pose_img);

// const img_scale_factor = 0.50;
// const flip_horizontal = false;
// const output_stride = 16;

// function estimatePoseOnImage(p_img)
// {
//   const net = posenet.load();
//   const pose = net.estimateSinglePose(p_img,
//     {
//       flipHorizontal:false
//     });
//     console.log("함수 내부");
//     console.log(pose);
//     return pose;
// }



// let po = estimatePoseOnImage(pose_img);

// console.log(po);



// const po = net.estimateSinglePose(pose_img, img_scale_factor, flip_horizontal, output_stride);


// const inputblob = cv.blobFromImage(man_img,1.0/255, new cv.Size(256,456), new cv.Vec(0,0,0), false, false);


// console.log(inputblob);
// console.log(typeof(inputblob.type));
// net.setInput(inputblob);

// const outputblob = net.forward();
// // outputblob = outputblob.resize(1,outputblob.sizes[2]);




// // cv.imshowWait('aaaa', pose_img);
// console.log(outputblob);
// console.log(outputblob.type);
// const h = outputblob.sizes[2];
// const w = outputblob.sizes[3];

// console.log(typeof(outputblob));
// const points = [];
// for(let i =1;i<15;i++)
// {
//   let heatmap = outputblob.at(new cv.Mat(0,i),null);
  

//   console.log(heatmap);
//   console.log(typeof(heatmap));
  
//   let [_, conf, point] = cv.minMaxLoc(heatmap);

//   if(conf>0.1)
//   {
//     let x = pose_img.cols * point.x/w;
//     let y = pose_img.rows * point.y/h;
//     points.push(new cv.Point2(x,y));
//   }
//   else
//   {
//     points.push(null);
//   }
// }

// const left_sholder = points[5];
// const right_sholder = points[2];

// console.log(`left_sholder ${left_sholder}`);
// console.log(`right_sholder ${right_sholder}`);




cv.imshow("default", man_img);

// const gaussianblur = grayimg.gaussianBlur(new cv.Size(3,3),0,0);
// cv.imshow('gaussian', gaussianblur);
var can_img = man_img.canny(100,150);
cv.imshow("canny", can_img);


const contours = can_img.findContours(cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE,new cv.Point2(0,0));
      //    cv.RETR_EXTERNAL : 컨투어 라인 중 가장 바깥쪽의 라인만 찾음
      //    cv.CHAIN_APPROX_SIMPLE : 컨투어 라인을 그릴 수 있는 포인트만 반환
      // contours는 윤곽선 검출
      // for(let i =0; i < contours.length;i++)
      // {

      // }
let count = 0;
let del_arr = [];
contours.filter(function(contour)
{
  
  if(contour.isConvex)
  {
    // console.log(count);
    // console.log(contour);
    
    del_arr.push(count);
    count += 1;
    return false;
  }
  else
  {
    count +=1;
    return true;
  }
});
// console.log(del_arr);

for(let i = 0; i < del_arr.length; i++)
{
  contours.splice(del_arr[i],1);
  
}

// let max_contours = contours[0];
// let max_area = max_contours.area;
// for(let i = 1 ; i < contours.length ; i++)
// {
//   console.log(contours[i]);
//   const contour = contours[i];
//   const area = contour.area;
//   if(area > max_area)
//   {
//     max_contours = contour;
//     max_area = area;
//   }
// }
// console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
// console.log(max_contours);
// console.log(max_area);

// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
// const epsilon = 0.01 * max_contours.arcLength(true);
// const approx = max_contours.approxPolyDP(epsilon, true);
// console.log('approx');
// console.log(approx);

// let man_top = approx[0].y;
// let man_bottom = approx[0].y;
// for(let i = 1; i < approx.length;i++)
// {
//   const point = approx[i];
//   if(point.y < man_top)
//   {
//     man_top = point.y;
//   }
//   if(point.y > man_bottom)
//   {
//     man_bottom = point.y;
//   }
// }
// aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa






const arr = [];
var man_top = man_img.sizes[1];
var man_bottom = 0;
for (let i = 0; i < contours.length; i++)
{
  if(contours[i].isConvex)
  {
    // true일 경우 볼록한 상황 = 내부 컨투어 이므로 패스
  }
  else
  {
    let pt = contours[i].getPoints();
    arr.push(pt);
    let ys = pt.map(point => point.y);
    // console.log(ys);
    // let ys = [];
    // for(let i =0; i < ys1.length; i++)
    // {
    //   if(!isNaN(ys1[i]))
    //   {
    //     ys.push(ys1[i]);
    //   }
    // }

    let max_y = Math.max(...ys);
    let min_y = Math.min(...ys);
    /// ... 은 스프레드 연산자 iterableObj를 깔끔하게 펼쳐줌
    // console.log(min_y);
    if(man_top > min_y)
    {
      man_top = min_y;
    }
    if(max_y > man_bottom)
    {
      man_bottom = max_y;
    }
  }
}

// const man_top = Math.max(max_yr);
// const man_bottom = Math.min(max_yr);
//##################################################################
console.log(`man_img.sizes = ${man_img.sizes}`);
let top_line_s = new cv.Point2(0, man_top);
let top_line_f = new cv.Point2(man_img.sizes[0], man_top);
let bottom_line_s = new cv.Point2(0, man_bottom);
let bottom_line_f = new cv.Point2(man_img.sizes[1], man_bottom);
// 고점 높이 라인
man_img.drawLine(top_line_s, top_line_f,new cv.Vec(255,0,0),2);
// 저점 높이 라인
man_img.drawLine(bottom_line_s, bottom_line_f, new cv.Vec(255,0,0),2);

// 중앙선
let center_x = man_img.sizes[1]/2;
let center_s = new cv.Point2(center_x, man_top);
let center_f = new cv.Point2(center_x, man_bottom);
man_img.drawLine(center_s, center_f, new cv.Vec(255,0,0),2);


for(let i = 0; i<contours.length;i++)
{
  let place = contours[i].getPoints();
  // console.log(place[0].x);
  // console.log(Math.round(man_img.sizes[1]/2));
  if (place[0].x == Math.round(man_img.sizes[1]/2))
  {
    console.log("있긴있음");
  }

}


console.log(`man_top ==>${man_top}`);
console.log(`man_bottom ==>${man_bottom}`);
//##################################################################


man_img_2.drawContours(arr,-1, new cv.Vec3(0,255,0),1);
cv.imshow("contours", man_img_2);

const classifier = new cv.CascadeClassifier(cv.HAAR_UPPERBODY);
const upperbody = classifier.detectMultiScale(man_img_3);
let max_rect = 0;

upperbody.objects.forEach(function(rect, num)
{

  let w = rect.width;
  let h = rect.height;

  let rect_size = w * h;

  if (rect_size > max_rect)
  {
    max_rect = rect_size;

    // 상체 사각형
    
    let upper_harf_s = new cv.Point2(rect.x, (rect.height/2)+man_top);
    let upper_harf_f = new cv.Point2(rect.x+rect.width, (rect.height/2)+man_top);
    man_img.drawLine(upper_harf_s, upper_harf_f,
      new cv.Vec(255,0,0), 2);

    man_img.drawRectangle(new cv.Point(rect.x, rect.y + man_top),
      new cv.Point(rect.x + rect.width, rect.y + rect.height + man_top),
      new cv.Vec(0, 255, 0), 2);
    

    //하체 사각형
    man_img.drawRectangle(new cv.Point(rect.x, rect.y + rect.height + man_top),
      new cv.Point(rect.x + rect.width, man_bottom),
      new cv.Vec(0, 0, 255), 2);

    
        


    
    let upper_y = rect.height;
    let lower_y = man_bottom - rect.y + rect.height + man_top;
    console.log(`화면 비율에 인한 키 = ${upper_y+lower_y}`);
    console.log(`upper_y 상체길이 = ${upper_y}`);
    console.log(`lower_y 하체길이= ${lower_y}`);
    //각 길이는 실제 촬영 배경 사이즈 기준 환산 필요
  }


  cv.imshow("upper_lower body", man_img);
});


// const hog = new cv.HOGDescriptor();

// hog.setSVMDetector(new cv.HOGDescriptor.getDefaultPeopleDetector());
// const lower_body = hog.detectMultiScale(man_img_2, 0, new cv.Size(8, 8), new cv.Size(32, 32), 1.05, 2);


// console.log(lower_body);
// lower_body.foundLocations.forEach(function(rect)
// {
//   const pt1 = new cv.Point(rect.x,rect.y);
//   const pt2 = new cv.Point(rect.x+rect.width, rect.y+rect.height);
//   man_img.drawRectangle(pt1, pt2,new cv.Vec(0,0,255),2);
//   cv.imshow("lower body", man_img);
// });




cv.waitKey(0);
