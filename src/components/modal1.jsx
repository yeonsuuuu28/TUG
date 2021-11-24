import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import "./modal.css"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function goMyPage() {
    window.location.href = "/mypage"
}

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div onClick={handleOpen} className="join_button">JOIN</div>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign:"center", paddingTop: "5px"}}>
            <b>You have successfully joined this class!</b>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2, textAlign:"center" }}>
            Visit my page to start team-building,<br/>
             or continue joining more classes!
            <table className="modalmodal">
                <tbody>
                    <tr>
                        <td>
                            <span className="join_button" onClick={()=>{goMyPage()}}>My Page</span>
                        </td>
                        <td>
                            <span className="modal_button1" onClick={handleClose}>Join More</span>
                        </td>
                    </tr>
                </tbody>
            </table>
            
            
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}