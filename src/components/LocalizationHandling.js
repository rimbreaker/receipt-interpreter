import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {  navToi18nLang } from "../utils/navigatorLangToTessLang";

const Localization = () => {
  const { i18n } = useTranslation(); 

  const changeLanguage = (language, persist = false) => {
    i18n.changeLanguage(language);
    if (persist) {
      localStorage.setItem("lang", language);
    }
  };

  useEffect(() => {
    //ensure language is correct
    if (!localStorage.getItem("lang")) changeLanguage(navToi18nLang());
    else if (localStorage.getItem("lang") !== i18n.language)
      changeLanguage(localStorage.getItem("lang"));
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <button onClick={() => changeLanguage("en", true)}>EN</button>
      <button onClick={() => changeLanguage("pl", true)}>PL</button>
    </>
  );
};

export default Localization;
