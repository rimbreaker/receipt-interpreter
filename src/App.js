import React, { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";
import { useTranslation } from "react-i18next";
import { i18nToTessLang, navToi18nLang } from "./utils/navigatorLangToTessLang";
//import { MarvinImage,Marvin } from "marvinj";

const App = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (language, persist = false) => {
    i18n.changeLanguage(language);
    if (persist) {
      localStorage.setItem("lang", language);
    }
  };
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  const [ocr, setOcr] = useState("Recognizing...");

  const doOCR = async (url) => {
    await worker.load();
    await worker.loadLanguage(i18nToTessLang(i18n.language));
    await worker.initialize(i18nToTessLang(i18n.language));
    const { data } = await worker.recognize(url);
    console.log(data);
    setOcr(data.text);
  };

  const video = useRef();
  const fileInput = useRef();
  const canvas = document.createElement("canvas");
  //var testImage = new MarvinImage(); //marvin testing
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


//const imageTestLoaded=()=>{
//  var segments = Marvin.findTextRegions(testImage, 10, 20, 70, 200); 
//drawSegments(segments, testImage); 
//testImage.draw(canvas); 
//}

  //function drawSegments(segments, image){ 
  //  for(var i in segments){ 
  //    var seg = segments[i];
  //    // Skip segments that are too small
  //    if(seg.height >= 5){ 
  //      image.drawRect(seg.x1, seg.y1-5, seg.width, seg.height+10, 0xFFFF0000); 
  //      image.drawRect(seg.x1+1, seg.y1-4, seg.width-2, seg.height+8, 0xFFFF0000); 
  //    } 
  //  } 
  //}

  const [src, setSrc] = useState("");
  const recognizeUploaded = (e) => {
    //testImage.load(src, imageTestLoaded);
    console.log(e.target.files[0]);
    const url = URL.createObjectURL(e.target.files[0]);
    setSrc(url);
    doOCR(url);
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
      {src && <img src={src} alt="" />}
      <p>{ocr}</p>
    </div>
  );
};

export default App;
