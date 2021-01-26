import React, { useState, useRef, useEffect } from "react";
import { createWorker } from "tesseract.js";

const App = () => {
  const worker = createWorker({
    logger: (m) => console.log(m),
  });
  const [ocr, setOcr] = useState("Recognizing...");

  const doOCR = async (url) => {
    await worker.load();
    await worker.loadLanguage("pol");
    await worker.initialize("pol");
    const {
      data: { text,...rest },
    } = await worker.recognize(url);
    console.log(rest)
    setOcr(text);
    console.log(text);
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
const [src,setSrc]=useState('')
  const recognizeUploaded = (e)=>{
    console.log(e.target.files[0])
    const url=URL.createObjectURL(e.target.files[0])
    setSrc(url)
    doOCR(url);
  }

  return (
    <div className="App">
      <button onClick={takeAPhoto}>take a photo</button>
      <button onClick={startAgain}>start again</button>
      <video ref={video} />
      <button onClick={uploadFile}>wgraj plik</button>
      <input
        type="file"
        name='file'
        ref={fileInput}
        onChange={recognizeUploaded}
        hidden
      />
      <img src={src} alt="gowno"/>
      <p>{ocr}</p>
    </div>
  );
};

export default App;
