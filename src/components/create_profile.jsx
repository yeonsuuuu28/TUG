import React from 'react'
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

const profile = () => {

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
    { title: 'placeholder' },
  ];

    return (
        <div>
            <Navbar/>
            <br/>
            <div className="join_title">Create Your Profile</div>
            <div className="tag">
            <Autocomplete
                multiple
                autoComplete="off"
                freeSolo
                autoSelect
                options={top100Films}
                onChange={handleTags}
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

export default profile