import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from "./navbar.jsx";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import MyClass from "./my_class.jsx";
import ActiveTeams from './activeteams.jsx';
import Profile from "./profile.jsx";

const StyledTabs = styled(Tabs)({
    '& 	.MuiTabs-indicator': {
        width: "3.5px",
    }, 
})

const StyledTab = styled(Tab)({
    fontFamily: "Lato",
    fontSize: 14,
    '&.Mui-selected': {
        color: '#1b1e2e',
        fontWeight: "bold",
        backgroundColor: "#eeeeee"
      },
})

const theme = createTheme({
    palette: {
      primary: {
        main: '#1b1e2e',
      },
    },
  });

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
            
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
    <Navbar />
    <ThemeProvider theme={theme}>
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 'calc(100vh - 80px)'}}
    >
      <StyledTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: 'divider'}}
        textColor= "primary"
        indicatorColor="primary"
      >
        <StyledTab label="Your Class" {...a11yProps(0)} sx={{  height: 'calc((100vh - 80px)/4)', width: 130}} />
        <StyledTab label="Active Team" {...a11yProps(1)} sx={{ height: 'calc((100vh - 80px)/4)', width: 130 }}/>
        <StyledTab label="Past Team" {...a11yProps(2)} sx={{ height: 'calc((100vh - 80px)/4)', width: 130 }}/>
        <StyledTab label="Profile" {...a11yProps(3)} sx={{ height: 'calc((100vh - 80px)/4)', width: 130 }}/>
      </StyledTabs>
      <TabPanel value={value} index={0}>
        <MyClass/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ActiveTeams />
      </TabPanel>
      <TabPanel value={value} index={2}>
        Past Teams
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Profile />
      </TabPanel>
    </Box> </ThemeProvider> </div>
  );
}