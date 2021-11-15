import React, {useState} from 'react'
import Navbar from './navbar.jsx'
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import "./create_profile.css"

const list_value = [];

function handleTags(e) {
    const value = e.target.value;
    console.log(value);
    list_value.push(value);
    console.log(list_value);
}

export default function Profile() {

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'placeholder' },
  ];
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
    return (
        <div>
            <Navbar/>
            <br/>
            <div className="join_title">Create Your Profile</div>
            <div className="tag">
            <Autocomplete
                open={open}
                multiple
                autoComplete="off"
                freeSolo
                autoSelect
                options={top100Films}
                onChange={handleTags}
                onOpen={() => {
                    if (inputValue) {
                      setOpen(false);
                    }
                    else {
                        setOpen(false)
                    }
                  }}
                onClose={() => setOpen(false)}
                onInputChange={(e, value, reason) => {
                    setInputValue(value);
            
                    if (!value) {
                      setOpen(false);
                    }
                  }}
                noOptionsText
                getOptionLabel={option => option.title || option}
                filterSelectedOptions
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Add Your Tags"
                    placeholder=""
                />
                )}
            />
    </div>
        </div>
    )
}