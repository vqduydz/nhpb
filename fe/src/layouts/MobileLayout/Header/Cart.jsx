import { Backdrop, Fade, Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';

const Cart = (props) => {
    const { cartOpen, setCartOpen } = props;
    return (
        <Modal
            sx={{ '.MuiModal-backdrop': { backgroundColor: '#00000022' } }}
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Fade in={cartOpen}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        height: '100%',
                        left: '50%',
                        transform: 'translateX( -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 10,
                        outline: 'none',
                        p: '10px',
                    }}
                >
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        Text in a modal
                    </Typography>
                    <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                        Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                    </Typography>
                </Box>
            </Fade>
        </Modal>
    );
};

export default Cart;
