import ClearIcon from '@mui/icons-material/Clear';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputBase } from '@mui/material';
import { unwrapResult } from '@reduxjs/toolkit';
import removeVietnameseTones from '_/utills/removeVietnameseTones';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './SearchBox.module.scss';
import { useThemMui } from '_/context/ThemeMuiContext';
import useDebounce from '_/hook/useDebounce';
import { getMenu } from '_/redux/slices';

const cx = classNames.bind(styles);

function SearchBox({ searchValue, setSearchValue, menusSearch, setMenusSearch }) {
  const dispatch = useDispatch();
  const debounce = useDebounce(searchValue, 500);
  const { loading } = useThemMui();
  const [load, setLoad] = useState(false);

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

  useEffect(() => {
    if (!debounce.trim()) {
      setMenusSearch({
        items: [],
        imagePath: '',
      });
      return;
    }
    setLoad(true);
    const slug = removeVietnameseTones(debounce).toLowerCase().replace(/ /g, '-');
    dispatch(getMenu({ name: slug }))
      .then(unwrapResult)
      .then((result) => {
        setMenusSearch({
          items: result.menus,
          imagePath: result.imagePath,
        });
        setLoad(false);
      })
      .catch((error) => {
        setLoad(false);
        console.log({ error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounce, loading]);

  return (
    <Box
      sx={{
        background: '#f7d800',
        color: '#fff',
        outline: 'none',
        lineHeight: '50px',
        height: '50px',
        paddingLeft: '50px',
        paddingRight: '50px',
        position: 'relative',
        borderRadius: '6px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          width: '50px',
          height: '50px',
          lineHeight: '50px',
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
          backgroundColor: '#fff',
          borderRadius: '6px',
          padding: '5px 10px',
          outline: 'none',
          border: 'none',
          width: '100% ',
        }}
        placeholder="Tìm món ăn"
      />
      <Box
        sx={{
          width: '50px',
          height: '50px',
          lineHeight: '50px',
          position: 'absolute',
          top: 0,
          right: 0,
          color: '#333',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {!!searchValue && !load && (
          <IconButton onClick={handleClear} type="button">
            <ClearIcon fontSize="medium" />
          </IconButton>
        )}
        {!!searchValue && load && (
          <IconButton onClick={handleClear} type="button">
            <RotateRightIcon className={cx('loading')} fontSize="medium" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default SearchBox;
