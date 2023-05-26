import { Table, TableBody, TableCell, TableRow } from '@mui/material';

export default function CustomizedTables({ rows, sx }) {
  return (
    <Table aria-label="customized table">
      <TableBody
        sx={{
          border: '1px solid #0000000a',
          '& td': { borderColor: '#0000000a', fontWeight: 500, fontSize: '1.6rem', padding: '18px' },
          ...sx,
        }}
      >
        {rows.map((row) => (
          <TableRow key={row.name}>
            <TableCell
              sx={{
                color: '#337ab7',
                borderRight: '1px solid #0000000a',
              }}
              align="right"
              scope="row"
            >
              {row.name}
            </TableCell>
            <TableCell sx={{ color: '#fe2c55' }} align="right">
              {row.value}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
