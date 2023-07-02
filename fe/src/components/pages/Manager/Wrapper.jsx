import { Box } from '@mui/material';

export const Wrapper = ({ children }) => {
  return (
    <Box
      sx={{
        pt: '10px',
        border: '1px solid #0000000a',
      }}
    >
      {children}
    </Box>
  );
};
