import React, { useRef } from "react";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/css/css";
import "codemirror/mode/yaml/yaml";
import "codemirror/mode/stex/stex";
import "codemirror/mode/sql/sql";
import "codemirror/mode/sass/sass";
import "codemirror/mode/sas/sas";
import "codemirror/mode/rust/rust";
import "codemirror/mode/r/r";
import "codemirror/mode/python/python";
import "codemirror/mode/powershell/powershell";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/htmlembedded/htmlembedded";
import "codemirror/mode/go/go";
import "codemirror/mode/dockerfile/dockerfile";
import "codemirror/mode/django/django";
import "codemirror/mode/dart/dart";
import "codemirror/mode/clike/clike";

import { Controlled as ControlledEditor } from "react-codemirror2";
import Clipboard from "react-clipboard.js";

const CodeWindow = ({ value, onChange }) => {
  const handleChange = (editor, data, value) => {
    onChange(value);
  };
  const select = useRef();
  const options = [
    { label: "javascript", modeName: "javascript" },
    { label: "xml/html", modeName: "xml" },
    { label: "css", modeName: "css" },
    { label: "yaml", modeName: "yaml" },
    { label: "LaTeX/sTeX", modeName: "stex" },
    { label: "sql", modeName: "sql" },
    { label: "sass", modeName: "sass" },
    { label: "sas", modeName: "sas" },
    { label: "rust", modeName: "rust" },
    { label: "r", modeName: "r" },
    { label: "python", modeName: "python" },
    { label: "powershell", modeName: "powershell" },
    { label: "markdown", modeName: "markdown" },
    { label: "html with css", modeName: "htmlmixed" },
    { label: "html with jsx", modeName: "htmlembedded" },
    { label: "go", modeName: "go" },
    { label: "dockerfile", modeName: "dockerfile" },
    { label: "django", modeName: "django" },
    { label: "dart", modeName: "dart" },
    { label: "c", modeName: "clike" },
    { label: "c++", modeName: "clike" },
    { label: "c#", modeName: "clike" },
    { label: "java", modeName: "clike" },
    { label: "scala", modeName: "clike" },
    { label: "kotlin", modeName: "clike" },
  ];
  return (
    <>
      <select ref={select}>
        {options.map((op) => (
          <option key={op.label} value={op.modeName}>
            {op.label}
          </option>
        ))}
      </select>
      <Clipboard data-clipboard-text={value}>copy to clipboard</Clipboard>
      <ControlledEditor
        onBeforeChange={handleChange}
        value={value}
        options={{
          lineWrapping: true,
          lint: true,
          mode: select.current?.value || "javascript",
          lineNumbers: true,
          theme: "material",
          autocapitalize: true,
          autocorrect: true,
          smartIndent: true,
          spellcheck: true,
        }}
      />
    </>
  );
};

export default CodeWindow;
