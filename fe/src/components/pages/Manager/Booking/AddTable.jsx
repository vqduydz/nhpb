import { Box, Checkbox, FormControl, ListItemText, MenuItem, OutlinedInput, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import * as tableAPI from '_/services/api/tableApi';
import { useThemMui } from '_/context/ThemeMuiContext';
import { MyButton } from '_/components/common';
import { MyTextField } from '_/components/common/CustomComponents/CustomMui';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      border: 0,
    },
  },
};

export default function AddTable({ confirm, reSelectTable, setReSelectTable, currentTable = [] }) {
  const [tables, setTables] = useState([]);
  const { loading } = useThemMui();
  const [typeTableSelect, setTypeTableSelect] = useState('');
  const [typeTableDrop, setTypeTableDrop] = useState([]);
  const [tableSelectList, setTableSelectList] = useState([]);
  const [tableSelect, setTableSelect] = useState([]);
  const [display, setDisplay] = useState(false);
  const [notif, setNotif] = useState();

  const showList = () => {
    setDisplay(true);
  };
  const hideList = () => {
    setTimeout(() => {
      setDisplay(false);
    }, 200);
  };
  useEffect(() => {
    (async () => {
      await tableAPI.tableApi().then((res) => {
        const tables = res.tablesShortByType;
        setTypeTableDrop(() => tables.map((table) => table.type));
        setTables(tables);
      });
    })();
  }, [loading]);

  useEffect(() => {
    setTableSelectList(tables.find((group) => group.type === typeTableSelect)?.tables || []);
    setTableSelect([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeTableSelect]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    const tableSelect = typeof value === 'string' ? value.split(',') : value;
    const newArray = tableSelectList.filter((item) => tableSelect.includes(item.name));
    setTableSelect(newArray);
  };

  const handleConfirm = () => {
    const tables = tableSelect.map((table) => table.name);
    if (tables.length <= 0) {
      setNotif('Chưa chọn bàn');
      return;
    }
    confirm(tables);
  };

  const render = () => {
    return (
      <Box
        sx={{
          borderBottom: '1px solid #f5f5f5',
          '& .time-btn': {
            ':hover': { backgroundColor: '#f5f5f5' },
          },
        }}
      >
        {typeTableDrop.map((time, i) => {
          return (
            <MyButton
              className="time-btn"
              type={'button'}
              style={{
                width: '100%',
                fontSize: '1.4rem',
                padding: '5px 10px',
                lineHeight: 'normal',
                borderBottom: '1px solid #f5f5f5',
                borderRadius: '0',
              }}
              key={i}
              onClick={() => {
                setTypeTableSelect(time);
              }}
            >
              <Typography width={'100%'} textAlign={'left'} fontSize={'1.4rem'}>
                {time}
              </Typography>
            </MyButton>
          );
        })}
      </Box>
    );
  };

  //=======================

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {notif ? (
        <Box
          sx={{
            backgroundColor: notif ? '#fe2c55' : 'transparent',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
            p: '0 20px',
            '& p': { lineHeight: 0.9 },
          }}
        >
          <Typography lineHeight={'10px'} sx={{ color: '#fff', height: '10px' }}>
            {notif}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            height: '30px',
            fontSize: '1.4rem',
            position: 'relative',
            '::after': {
              zIndex: 1,
              display: 'block',
              position: 'absolute',
              top: '50%',
              content: `''`,
              height: '1px',
              width: '100%',
              backgroundColor: '#0000003b',
            },
          }}
        />
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', mt: '15px' }}>
        <Box
          sx={{
            width: '150px',
            border: '1px solid transparent',
            position: 'relative',
            '& *': { fontSize: '1.4rem !important' },
          }}
        >
          <MyTextField
            autoComplete="off"
            size="small"
            label="Chọn loại bàn"
            fullWidth
            type="text"
            value={typeTableSelect}
            onBlur={hideList}
            onFocus={showList}
            sx={{ background: 'transparent', outline: 'none', border: 'none' }}
            placeholder="Chọn loại bàn ..."
            inputProps={{
              readOnly: true,
            }}
          />

          {display && (
            <Box
              className="asdasdas"
              sx={{
                backgroundColor: '#fff',
                position: 'absolute',
                left: '0',
                border: '1px solid #ccc',
                borderBottom: '2px solid #ccc',
                width: '100%',
                textAlign: 'left',
                minHeight: '50px',
                maxHeight: '30vh',
                overflow: 'auto',
                zIndex: 2,
                overflowY: 'scroll',
                '& .search-list': {
                  padding: '0 10px',
                },
                '*': {
                  color: '#000',
                },
              }}
            >
              {render()}
            </Box>
          )}
        </Box>
        <FormControl
          sx={{
            // m: 1,
            flex: 1,
            '& *': { fontSize: '1.4rem !important' },
            '& .Mui-focused': { borderTop: '1px solid #afafaf', outline: '1px solid #afafaf' },
            '& .MuiSelect-select.MuiSelect-outlined': {
              border: 'none!important',
              outline: 'none!important',
              padding: '7.5px 14px',
              '&:focus': {
                border: 'none!important',
                outline: '1px solid #afafaf !important',
              },
            },
          }}
        >
          <Select
            className="asdasda123"
            labelId="demo-multiple-checkbox-label"
            id="demo-multiple-checkbox"
            multiple
            value={tableSelect.map((table) => table.name)}
            onChange={handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
            placeholder="Chọn bàn..."
            sx={
              {
                // border: '1px solid #afafaf',
              }
            }
          >
            {tableSelectList.map((table, i) => {
              return (
                <MenuItem
                  disabled={!table?.available && !currentTable?.includes(table.name)}
                  sx={{
                    // backgroundColor: !table?.available && !currentTable?.includes(table.name) ? '#0000000a' : '#fff',
                    borderTop:
                      (typeTableSelect === 'Bàn lớn' && i % 5 === 0) || (typeTableSelect === 'Bàn nhỏ' && i % 6 === 0)
                        ? '1px solid #000'
                        : 'none',
                    '& *': { fontSize: '1.4rem !important' },
                    '& .Mui-checked': {
                      color: 'green!important',
                    },
                  }}
                  key={i}
                  value={table?.name}
                >
                  <Checkbox
                    disabled={!table?.available && !currentTable?.includes(table.name)}
                    checked={tableSelect.indexOf(table) > -1}
                  />
                  <ListItemText
                    primary={
                      !table?.available && !currentTable?.includes(table.name)
                        ? `${table?.name} is not available`
                        : table?.name
                    }
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <MyButton type="button" onClick={handleConfirm} color={{ borderColor: 'orange', bgColor: 'orange' }}>
          Chọn bàn
        </MyButton>
        {reSelectTable && (
          <MyButton
            type="button"
            onClick={() => setReSelectTable(false)}
            color={{ borderColor: 'orange', bgColor: 'orange' }}
          >
            Hủy
          </MyButton>
        )}
      </Box>
    </Box>
  );
}

// tôi có danh sách  các bàn như sau :
//    tables: [
//       { table_id: 'BN01', type: 'Bàn nhỏ', available: true, max: 4 },
//       { table_id: 'BN02', type: 'Bàn nhỏ', available: true, max: 4 },
//       { table_id: 'BN03', type: 'Bàn nhỏ', available: true, max: 4 },
//       { table_id: 'BN04', type: 'Bàn nhỏ', available: false, max: 4 },
//       { table_id: 'BN05', type: 'Bàn nhỏ', available: true, max: 4 },
//       { table_id: 'BL01', type: 'Bàn lớn', available: true, max: 6 },
//       { table_id: 'BL02', type: 'Bàn lớn', available: false, max: 6 },
//       { table_id: 'BL03', type: 'Bàn lớn', available: true, max: 6 },
//       { table_id: 'BL04', type: 'Bàn lớn', available: true, max: 6 },
//       { table_id: 'BL05', type: 'Bàn lớn', available: true, max: 6 },
//     ],
// tôi muốn phân loại bàn xuất ra danh sách mới như sau :

// [
//   {
//     name:'Bàn nhỏ'
//     tables:[
//       { table_id: 'BN01', type: 'Bàn nhỏ', available: true, max: 4 },
//       { table_id: 'BN02', type: 'Bàn nhỏ', available: true, max: 4 },
//       { table_id: 'BN03', type: 'Bàn nhỏ', available: true, max: 4 },
//       { table_id: 'BN04', type: 'Bàn nhỏ', available: false, max: 4 },
//       { table_id: 'BN05', type: 'Bàn nhỏ', available: true, max: 4 },
//     ]
//   },
//   {
//     name:'Bàn lớn'
//     tables:[
//       { table_id: 'BL01', type: 'Bàn lớn', available: true, max: 6 },
//       { table_id: 'BL02', type: 'Bàn lớn', available: false, max: 6 },
//       { table_id: 'BL03', type: 'Bàn lớn', available: true, max: 6 },
//       { table_id: 'BL04', type: 'Bàn lớn', available: true, max: 6 },
//       { table_id: 'BL05', type: 'Bàn lớn', available: true, max: 6 },
//     ]
//   },
// ]
