// 'C:\\Users\\202-14\\Desktop\\final_project\\big_front_body.png'

const cv = require('opencv4nodejs');
const posenet = require('@tensorflow-models/posenet');
const tf = require('@tensorflow/tfjs-node');

const loadAndDetectPose = async (img) => {
  const net = await posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: { width: 640, height: 480 },
    multiplier: 0.75,
    quantBytes: 2,
    minPartConfidence : 0.2
  });

//   const img = cv.imread('C:\\Users\\202-14\\Desktop\\final_project\\wear_front_body.png');
  const imgResized = img.resize(new cv.Size(640, 480));
  const input = cv.imencode('.jpg', imgResized).toString('base64');
  const tensor = tf.node.decodeImage(Buffer.from(input, 'base64'));
 
  const pose = await net.estimateSinglePose(tensor, {
    flipHorizontal: false
  });

  let size_ratio_x = img.cols / 640;
  let size_raito_y = img.rows / 480;

  console.log(pose.keypoints);
  pose.keypoints.forEach(keypoint => {
    const { x, y } = keypoint.position;
    let px = x*size_ratio_x;
    let py = y*size_raito_y;
    img.drawCircle(new cv.Point(px, py), 5, new cv.Vec(0, 255, 0), 2);
  });

//   pose.keypoints.forEach(from=>{
//     pose.keypoints.forEach(to=>
//         {
//             img.drawLine(new cv.Point2(from.position.x, from.position.y), 
//                 new cv.Point2(to.position.x, to.position.y), new cv.Vec(255,0,0),2);
//         });
//   });

  cv.imshowWait('Pose Estimation Result', img);
  cv.destroyAllWindows();
};



const img = cv.imread('C:\\Users\\202-14\\Desktop\\final_project\\wear_front_body.png');
loadAndDetectPose(img);

