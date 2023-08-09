import ClearIcon from '@mui/icons-material/Clear';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase } from '@mui/material';
import classNames from 'classnames/bind';

import styles from './SearchBox.module.scss';
import MyButton from '../MyButton/MyButton';

const cx = classNames.bind(styles);

function SearchBox({
  searchValue,
  setSearchValue,
  loading = false,
  placeholder = '',
  sx = {},
  handleCreate,
  handleImport,
  search = true,
  create = true,
  upload = true,
}) {
  const handleChange = (e) => {
    const searchValue = e.target.value.replace(/ + /g, ' ');
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    } else {
      setSearchValue('');
    }
    if (!searchValue.trim()) {
      setSearchValue('');
    }
  };
  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <>
      {search && (
        <Box
          sx={{
            borderRadius: '4px',
            display: 'flex',
            gap: '10px',
            justifyContent: 'start',
            border: '1px solid #f7d800',
            width: '100%',
            ...sx,
          }}
        >
          <Box
            sx={{
              background: '#f7d800',
              color: '#fff',
              outline: 'none',
              padding: '2px 40px',
              position: 'relative',
              width: '100%',
            }}
          >
            <Box
              sx={{
                width: '40px',
                height: '40px',
                position: 'absolute',
                top: 0,
                left: 0,
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <SearchIcon fontSize="medium" />
            </Box>
            <InputBase
              type="text"
              value={searchValue}
              onChange={handleChange}
              sx={{
                borderRadius: '4px',
                backgroundColor: '#fff',
                padding: '1px 10px',
                width: '100% ',
              }}
              placeholder={placeholder}
            />

            <Box
              sx={{
                width: '40px',
                height: '40px',
                position: 'absolute',
                top: 0,
                right: 0,
                color: '#333',
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              {!!searchValue && !loading && (
                <IconButton onClick={handleClear} type="button">
                  <ClearIcon fontSize="medium" />
                </IconButton>
              )}
              {!!searchValue && loading && (
                <IconButton onClick={handleClear} type="button">
                  <RotateRightIcon className={cx('loading')} fontSize="medium" />
                </IconButton>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '10px',
          '& .btn': {
            height: '40px',
            fontSize: '1.4rem',
          },
        }}
      >
        {create && (
          <MyButton
            color={{ bgColor: 'green', mainColor: '#fff' }}
            onClick={() => handleCreate(true)}
            padding={'3px 8px'}
            className="btn"
            style={{ width: '80px' }}
          >
            Tạo mới
          </MyButton>
        )}
        {upload && (
          <MyButton
            color={{ bgColor: 'blue', mainColor: '#fff' }}
            onClick={() => handleImport(true)}
            padding={'3px 8px'}
            className="btn"
          >
            Import
          </MyButton>
        )}
      </Box>
    </>
  );
}

export default SearchBox;
