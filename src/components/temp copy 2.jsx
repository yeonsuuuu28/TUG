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
                            <b>Q1</b>. Do you like pineapple pizza?
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
            <div className="button101"><span className="button100">Never</span><span className="button100">Maybe</span><span className="button100">Absolutely</span></div>
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
                            <b>Q2</b>. Do you like mint-chocolate?                     </td>
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
            <div className="button101"><span className="button100">Never</span><span className="button100">Maybe</span><span className="button100">Absolutely</span></div>
            <div className = "centerAlign">
            
                                        </div>
        </div>
    )
}