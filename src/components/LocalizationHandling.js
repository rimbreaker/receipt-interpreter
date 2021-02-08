import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { navToi18nLang } from "../utils/navigatorLangToTessLang";
import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";

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
      <FormControl style={{ margin: "8px", minWidth: 120 }}>
        <Select
          style={{ marginTop: "16px" }}
          value={i18n.language}
          onChange={(e) => changeLanguage(e.target.value, true)}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value="en">EN</MenuItem>
          <MenuItem value="pl">PL</MenuItem>
        </Select>
        <FormHelperText>select language</FormHelperText>
      </FormControl>
    </>
  );
};

export default Localization;
