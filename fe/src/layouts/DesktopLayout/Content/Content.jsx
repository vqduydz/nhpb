import { Box } from '@mui/material';

import { Loading } from '_/components/common';
import { useThemMui } from '_/context/ThemeMuiContext';

function Content({ children }) {
  const { loading } = useThemMui();
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {loading && <Loading />}
      <Box
        sx={{
          padding: ` var(--padding)`,
          borderRadius: ` 0px 0px 6px 6px`,
          width: ` 100%`,
          minWidth: ` 768px`,
          minHeight: `calc(100vh - 389px)`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Content;
