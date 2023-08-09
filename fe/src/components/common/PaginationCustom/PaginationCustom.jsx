import { Box, MenuItem, Pagination, Select } from '@mui/material';

const PaginationCustom = ({ total_page = 1, page, setPage, limit_per_page, setlimit_per_page }) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        padding: '10px',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          '& *': { fontWeight: 500 },
          '& .MuiOutlinedInput-notchedOutline': { border: 'none', minWidth: '20px' },
          '& .MuiButtonBase-root.MuiPaginationItem-root.Mui-selected': {
            backgroundColor: 'green',
            color: '#fff',
          },
        }}
      >
        <label>Hiển thị</label>
        <Select
          onChange={(e) => {
            setlimit_per_page(e.target.value);
          }}
          required
          sx={{ minWidth: '60px' }}
          size="small"
          value={limit_per_page}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
        <Pagination
          count={total_page}
          page={page}
          boundaryCount={2}
          onChange={(e, value) => {
            setPage(value);
          }}
        />
      </Box>
    </Box>
  );
};

export default PaginationCustom;
