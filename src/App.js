import React, { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { useTranslation } from "react-i18next";
import { i18nToTessLang, navToi18nLang } from "./utils/navigatorLangToTessLang";
import Image from "image-js";

const App = () => {
  const { t, i18n } = useTranslation();

const normalWorker=createWorker()
const grayWorker=createWorker()
const inverseWorker=createWorker()
const inverseGrayWorker=createWorker()
const grayInverseWorker=createWorker()
const inverseGrayMaskWorker=createWorker()
var asyncLines=[]
const  [lines,setLines]=useState([])

const workers=[normalWorker,grayWorker,inverseWorker,grayInverseWorker,inverseGrayWorker,inverseGrayMaskWorker]

const recognizeAll=async(img)=>{
  console.log("started")
  const transformedImages=[
    await Image.load(img).then(img=>img.toDataURL()),
    await Image.load(img).then(img=>img.grey().toDataURL()),
    await Image.load(img).then(img=>img.invert().toDataURL()),
    await Image.load(img).then(img=>img.grey().invert().toDataURL()),
    await Image.load(img).then(img=>img.invert().grey().toDataURL()),
    await Image.load(img).then(img=>img.invert().grey().mask({threshold:0.55}).toDataURL())
  ]
  workers.forEach((worker,index)=>doOCR(worker,transformedImages[index],index))
  
}

  const changeLanguage = (language, persist = false) => {
    i18n.changeLanguage(language);
    if (persist) {
      localStorage.setItem("lang", language);
    }
  };

  //const [ocr, setOcr] = useState("Recognizing...");
  const [srcObject, setSrcObjext] = useState("");
  const srcDoc = `
<html>
  <body>${srcObject}</body>
</html>
`;
  const doOCR = async (worker,url,index) => {
    await worker.load();
    await worker.loadLanguage(i18nToTessLang(i18n.language));
    await worker.initialize(i18nToTessLang(i18n.language));
    const {data} = await worker.recognize(url);
    await data.lines.forEach( (line,index)=>{
      if(index===7)console.log(line.confidence,line.text)
      if(!asyncLines[index]||asyncLines[index].confidence<line.confidence)
      asyncLines[index]=line
    })
    console.log(data.hocr)

    console.log([...asyncLines])
    if(index===5)
    setLines(asyncLines)
  };

  const video = useRef();
  const fileInput = useRef();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const [w, h] = [video.current?.videoWidth, video.current?.videoHeight];
  canvas.width = w;
  canvas.height = h;

  var constraints = { audio: false, video: { width: 720, height: 720 } };

  useEffect(() => {
    //ensure language is correct
    if (!localStorage.getItem("lang")) changeLanguage(navToi18nLang());
    else if (localStorage.getItem("lang") !== i18n.language)
      changeLanguage(localStorage.getItem("lang"));

    //setup camera
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (mediaStream) {
        video.current.srcObject = mediaStream;
        video.current.onloadedmetadata = function (e) {
          video.current.play();
        };
      })
      .catch(function (err) {
        console.log(err.name + ":" + err.message);
      });
    // eslint-disable-next-line
  }, []);

  const takeAPhoto = () => {
    video.current.pause();
    context.drawImage(video.current, 0, 0, w, h);
    doOCR(canvas.toDataURL());
  };

  const startAgain = () => {
    video.current.play();
  };

  const uploadFile = () => {
    fileInput.current.click();
  };

  const [src, setSrc] = useState("");
  const recognizeUploaded = (e) => {
    console.log(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);

    //setSrc(url);
    //doOCR(url);
    testCanny(url);
  };

  const testCanny = (url) => {
    recognizeAll(url)
  // Image.load(url).then((img) => {
  //   console.log("img: ", img);
  //   const grey = img.invert().grey().mask({threshold: 0.55})
  //  /*    .grey().invert() 
  //     .mask({ threshold: 0.3 });
  //   console.log("grey: ", grey); */
  //   // const edge = cannyEdgeDetector(grey);
  //   //console.log("edge: ", edge);
  //   setSrc(grey.toDataURL());
  //   doOCR(grey.toDataURL())
  // });
  };

  return (
    <div className="App">
      <button onClick={() => changeLanguage("en", true)}>EN</button>
      <button onClick={() => changeLanguage("pl", true)}>PL</button>
      <button onClick={takeAPhoto}>{t("takeAPhoto")}</button>
      <button onClick={startAgain}>{t("restart")}</button>
      <video ref={video} />
      <button onClick={uploadFile}>{t("fileUpload")}</button>
      <input
        type="file"
        name="file"
        ref={fileInput}
        onChange={recognizeUploaded}
        accept="image/*"
        hidden
      />
      {src && <img src={lines} alt="" />}
      {lines.map(line=><div>{line.text}</div>)}
      <iframe width="720" srcDoc={srcDoc} title="output" sandbox="allow-scripts" />
    </div>
  );
};

export default App;
