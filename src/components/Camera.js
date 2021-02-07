import React, { useRef, useEffect,useState } from "react";
import { useTranslation } from "react-i18next";

const Camera = ({ doOCR }) => {
  const { t } = useTranslation();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const video = useRef();
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const [w, h] = [video.current?.videoWidth, video.current?.videoHeight];
  canvas.width = w;
  canvas.height = h;
  var constraints = { audio: false, video: { width: 720, height: 720 } };

  useEffect(() => {
    //setup camera=
    const currentVid=video.current
    if (isCameraOn)
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((mediaStream) => {
            currentVid.srcObject = mediaStream;
            currentVid.onloadedmetadata = function (e) {
                currentVid.play();
          };
        })
        .catch(function (err) {
          console.log(err.name + ":" + err.message);
        });

    return () => {
      if (currentVid) currentVid.srcObject.getTracks()[0].stop();
    };
    // eslint-disable-next-line
  }, [isCameraOn]);

  const takeAPhoto = () => {
    video.current.pause();
    context.drawImage(video.current, 0, 0, w, h);
    doOCR(canvas.toDataURL());
  };

  const startAgain = () => {
    video.current.play();
  };

  return (
    <><span>
    <input
      type="checkbox"
      value={isCameraOn}
      onChange={(e) => setIsCameraOn((prev) => !prev)}
    />
    turn camera on
  </span>
      {isCameraOn && (
        <>
          <button onClick={takeAPhoto}>{t("takeAPhoto")}</button>
          <button onClick={startAgain}>{t("restart")}</button>
          <video ref={video} />
        </>
      )}
    </>
  );
};

export default Camera;
