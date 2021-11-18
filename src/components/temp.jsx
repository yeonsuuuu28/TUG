import React from "react";
import Navbar from "./navbar_quiz";
import { Checkbox } from "@mui/material";
import { FormControl } from "@mui/material";
import { RadioGroup, Radio } from "@mui/material";
import { FormControlLabel } from "@mui/material";

export default function Quiz(){
    const [Q1, setQ1] = React.useState("");
    const [Q2, setQ2] = React.useState("");
    const [checked, setCheck] = React.useState(true);
    const [checked2, setCheck2] = React.useState(true);


    function handleChange(){
        if(checked){
            setCheck(false)
        }
        else{
            setCheck(true)
        }
    }

    return(
        <div>
            <Navbar/>
            <div className = "join_title">
                It's Quiz Time!
            </div>
            <br/>
            <br/>
            <table className = "quizTable">
                <tbody>
                    <tr>
                        <td className = "nopadding">

                        </td>
                        <td className = "mini_explanation">
                            Check if this question<br/> is important to you!
                        </td>
                    </tr>
                    <tr>
                        <td className = "question_title12">
                            <b>Q1</b>. How comfortable are you with your English skills?
                        </td>
                        <td className = "checkboxQuiz">
                            <Checkbox
                                checked={checked}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                                 sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className = "centerAlign">
            <FormControl component="fieldset">
                                            <RadioGroup row aria-label="position" name="position" value={Q1} onChange={(e) => setQ1(e.target.value)} sx={{
    '& .MuiSvgIcon-root': {
      fontSize: 35,
    },
  }}> 
                                                <FormControlLabel
                                                value="1"
                                                control={<Radio color="primary" />}
                                                label="Not Confident &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                className = "radioform"
                                                sx={{
                                                    '.MuiFormControlLabel-label': {
                                                      fontSize: 20,
                                                    },
                                                  }}
                                                />
                                                <FormControlLabel
                                                value="2"
                                                control={<Radio color="primary" />}
                                                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                className = "radioform"
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                      fontSize: 35,
                                                    },
                                                  }}
                                                />
                                                <FormControlLabel
                                                value="3"
                                                control={<Radio color="primary" />}
                                                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                      fontSize: 35,
                                                    },
                                                  }}
                                                className = "radioform"
                                                />
                                                <FormControlLabel
                                                value="4"
                                                control={<Radio color="primary" />}
                                                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                      fontSize: 35,
                                                    },
                                                  }}
                                                className = "radioform"
                                                />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FormControlLabel
                                                value="5"
                                                control={<Radio color="primary" />}
                                                sx={{
                                                    '.MuiFormControlLabel-label': {
                                                      fontSize: 20,
                                                    },
                                                  }}
                                                label=" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Very Fluent"
                                                labelPlacement="end"
                                                className = "radioform"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                        </div>
            <table className = "quizTable">
                <tbody>
                    <tr>
                        <td className = "nopadding">
                        </td>
                        <td className = "mini_explanation">
                            Check if this question<br/> is important to you!
                        </td>
                    </tr>
                    <tr>
                        <td className = "question_title12">
                            <b>Q2</b>. What teammate do you prefer? An ethusiastic person or a relaxed person?                        </td>
                        <td className = "checkboxQuiz">
                            <Checkbox
                                checked={checked2}
                                onChange={handleChange}
                                inputProps={{ 'aria-label': 'controlled' }}
                                 sx={{ '& .MuiSvgIcon-root': { fontSize: 40 } }}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className = "centerAlign">
            <FormControl component="fieldset">
                                            <RadioGroup row aria-label="position" name="position" value={Q2} onChange={(e) => setQ2(e.target.value)} sx={{
    '& .MuiSvgIcon-root': {
      fontSize: 35,
    },
  }}> 
                                                <FormControlLabel
                                                value="1"
                                                control={<Radio color="primary" />}
                                                label="Very Enthusiastic &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                className = "radioform"
                                                sx={{
                                                    '.MuiFormControlLabel-label': {
                                                      fontSize: 20,
                                                    },
                                                  }}
                                                />
                                                <FormControlLabel
                                                value="2"
                                                control={<Radio color="primary" />}
                                                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                className = "radioform"
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                      fontSize: 35,
                                                    },
                                                  }}
                                                />
                                                <FormControlLabel
                                                value="3"
                                                control={<Radio color="primary" />}
                                                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                      fontSize: 35,
                                                    },
                                                  }}
                                                className = "radioform"
                                                />
                                                <FormControlLabel
                                                value="4"
                                                control={<Radio color="primary" />}
                                                label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                                                labelPlacement="start"
                                                sx={{
                                                    '& .MuiSvgIcon-root': {
                                                      fontSize: 35,
                                                    },
                                                  }}
                                                className = "radioform"
                                                />
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                <FormControlLabel
                                                value="5"
                                                control={<Radio color="primary" />}
                                                sx={{
                                                    '.MuiFormControlLabel-label': {
                                                      fontSize: 20,
                                                    },
                                                  }}
                                                label=" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Very Relaxed"
                                                labelPlacement="end"
                                                className = "radioform"
                                                />
                                            </RadioGroup>
                                        </FormControl>
                                        </div>
        </div>
    )
}