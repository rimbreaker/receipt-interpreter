import React from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'
import 'codemirror/mode/xml/xml'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/css/css'
import {Controlled as ControlledEditor} from 'react-codemirror2' 

const CodeWindow =({value,onChange})=>{

    const handleChange=(editor,data,value)=>{
        onChange(value)
    }

    return <ControlledEditor
    onBeforeChange={handleChange}
    value={value}
    options={{
            lineWrapping:true,
            lint:true,
            mode:'javascript',
            lineNumbers:true,
            theme:'material',
            autocapitalize:true,
            autocorrect:true,
            smartIndent:true,
            spellcheck:true
        }}/>
} 

export default CodeWindow