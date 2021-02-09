import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
import { useTranslation } from "react-i18next";
import Camera from "./components/Camera";
import Image from "image-js";
import CodeWindow from "./components/CodeWindow";
import Spinner from "./components/Spinner";
import LocalizationHandling from "./components/LocalizationHandling";
import {
  SwipeableDrawer,
  List,
  ListItem,
  ListItemIcon,
  Switch,
  ListItemText,
  IconButton,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  useTheme,
  Typography,
} from "@material-ui/core";
import LightModeIcon from "@material-ui/icons/BrightnessHigh";
import DarkModeIcon from "@material-ui/icons/Brightness4";
import OfflineOptionsIcon from "@material-ui/icons/WifiOff";
import MenuIcon from "@material-ui/icons/Dehaze";
import UploadIcon from "@material-ui/icons/CloudUpload";
import CameraIcon from "@material-ui/icons/CameraAlt";

const App = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const normalWorker = createWorker();
  const grayWorker = createWorker();
  const inverseWorker = createWorker();
  const inverseGrayWorker = createWorker();
  const grayInverseWorker = createWorker();
  var asyncLines = [];

  const workers = [
    normalWorker,
    grayWorker,
    inverseWorker,
    grayInverseWorker,
    inverseGrayWorker,
  ];
  const [isLoading, setIsLoading] = useState(false);

  const recognizeAll = async (img) => {
    setIsLoading(true);
    const transformedImages = [
      await Image.load(img).then((img) => img.toDataURL()),
      await Image.load(img).then((img) => img.grey().toDataURL()),
      await Image.load(img).then((img) => img.invert().toDataURL()),
      await Image.load(img).then((img) => img.grey().invert().toDataURL()),
      await Image.load(img).then((img) => img.invert().grey().toDataURL()),
    ];
    workers.forEach((worker, index) =>
      doOCR(worker, transformedImages[index], index)
    );
  };

  const checkForBetterGuesses = (lines) => {
    const wholeText = lines.map((line) => line.text).join("");
    let newText = "";
    const words = [];
    const symbols = [];
    lines.forEach((line) => words.push(...line.words));
    words.forEach((word) => symbols.push(...word.symbols));
    const keyWords = ["use", "set"];
    let symbolsOffset = 0;
    let indentation = 0;
    for (let i = 0; i < wholeText.length; i++) {
      //update offset
      if (
        symbols[i - symbolsOffset] &&
        wholeText[i] !== symbols[i - symbolsOffset].text
      ) {
        symbolsOffset++;
      }
      if (wholeText[i] === "{") indentation++;
      if (wholeText[i] === "}") indentation--;
      //ones checking values before
      if (i > 0 && i < wholeText.length) {
        //give indentation
        if (wholeText[i - 1] === "\n")
          for (let j = 0; j < indentation; j++) newText += "\t";
        //if in square braces then change to 0
        if (wholeText[i - 1] === "[" && wholeText[i + 1] === "]") {
          if (symbols[i - symbolsOffset].confidence < 95) {
            newText += "0";
            continue;
          }
        }
        //if zero surrounded by letters then change into capital O
        if (
          !isDigit(wholeText[i - 1]) &&
          !isDigit(wholeText[i + 1]) &&
          isDigit(wholeText[i])
        ) {
          if (
            symbols[i - symbolsOffset] &&
            symbols[i - symbolsOffset].confidence < 95
          ) {
            newText += "O";
            continue;
          }
        }
        //if it's a line with only b at the end then change it to };
        if (
          wholeText[i - 1] === "\n" &&
          wholeText[i + 1] === "\n" &&
          wholeText[i] === "b"
        ) {
          indentation--;
          newText = newText.slice(0, -1);
          newText += "};";
          continue;
        }
        //delete whitespaces after dots
        if (wholeText[i - 1] === "." && wholeText[i] === " ") continue;
        //delete whitespace between letter and paranthesis
        if (
          !isDigit(wholeText[i - 1]) &&
          wholeText[i] === " " &&
          wholeText[i + 1] === "("
        )
          continue;
        //if keyword before 's' then capitilize it
        if (
          keyWords.includes(wholeText.slice(i - 3, i)) &&
          wholeText[i] === "s"
        ) {
          newText += "S";
          continue;
        }
      }
      newText += wholeText[i];
    }
    return newText;
  };

  const isDigit = (symbol) => {
    if (typeof symbol === "string")
      return symbol.toLowerCase() === symbol.toUpperCase();
    else return false;
  };

  const [srcObject, setSrcObject] = useState("");

  const doOCR = async (worker, url, index) => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const { data } = await worker.recognize(url);
    await data.lines.forEach((line, index) => {
      if (!asyncLines[index] || asyncLines[index].confidence < line.confidence)
        asyncLines[index] = line;
    });

    if (index === 4) {
      setIsLoading(false);
      // asyncLines.forEach((line) => setSrcObject((prev) => prev + line.text));
      setSrcObject((prev) => prev + "\n" + checkForBetterGuesses(asyncLines));
      //setSrcObject(asyncLines.map((line) => line.text).join(""));
    }
  };

  const fileInput = useRef();

  const uploadFile = () => {
    fileInput.current.click();
  };

  const [src, setSrc] = useState("");

  const recognizeUploaded = (file) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setSrc(url);
      recognizeAll(url);
    }
  };

  const dropFile = (e) => {
    e.preventDefault();

    if (e.dataTransfer.items) {
      if (e.dataTransfer.items[0].kind === "file")
        var file = e.dataTransfer.items[0].getAsFile();
      recognizeUploaded(file);
    } else {
      recognizeUploaded(e.dataTransfer.files[0]);
    }
  };

  document.onpaste = function (pasteEvent) {
    var item = pasteEvent.clipboardData.items[0];

    if (item?.type.indexOf("image") === 0) {
      var blob = item.getAsFile();
      recognizeUploaded(blob);
    }
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  console.log();
  return (
    <>
      <SwipeableDrawer
        style={{ height: "200px" }}
        anchor="left"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpen={() => setIsDrawerOpen(true)}
      >
        <List>
          <ListItem>
            <ListItemIcon>
              {isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
            </ListItemIcon>
            <Switch
              checked={isDarkMode}
              onChange={() => setIsDarkMode((prev) => !prev)}
            />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <OfflineOptionsIcon />
            </ListItemIcon>
            <ListItemText>offline options</ListItemText>
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <OfflineOptionsIcon />
            </ListItemIcon>
            <ListItemText>app info</ListItemText>
          </ListItem>
        </List>
      </SwipeableDrawer>
      <IconButton onClick={() => setIsDrawerOpen(true)}>
        <MenuIcon />
      </IconButton>

      {isLoading && <Spinner />}
      {!isLoading && src && <img src={src} alt="" />}

      {selectedOption === 0 ? (
        <>
          <Paper
            variant="outlined"
            background="grey"
            style={{
              background: theme.palette.grey.A100,
              height: "80px",
              display: "flex",
              alignItems: "center",
            }}
            id="drop_zone"
            onDrop={dropFile}
            onDragOver={(e) => e.preventDefault()}
            onClick={uploadFile}
          >
            <Typography variant="h5" align="center">
              Drag and drop here, or click to upload
            </Typography>
            <input
              type="file"
              name="file"
              ref={fileInput}
              onChange={(e) => recognizeUploaded(e.target.files[0])}
              accept="image/*"
              hidden
            />
          </Paper>
        </>
      ) : (
        <Camera doOCR={doOCR} isCameraOn={selectedOption === 1} />
      )}
      <CodeWindow value={srcObject} onChange={setSrcObject} />
      <BottomNavigation
        style={{
          position: "fixed",
          bottom: 0,
          margin: "0",
          padding: 0,
          left: 0,
          right: 0,
          width: "100%",
        }}
        value={selectedOption}
        onChange={(event, newValue) => setSelectedOption(newValue)}
        showLabels
      >
        <BottomNavigationAction label="Upload file" icon={<UploadIcon />} />
        <BottomNavigationAction label="Take a photo" icon={<CameraIcon />} />
      </BottomNavigation>
    </>
  );
};

export default App;
