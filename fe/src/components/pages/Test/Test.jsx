import { Inner } from '_/components/common/CustomComponents/CustomMui';

import { Box } from '@mui/material';
import { useState } from 'react';
import DropDown from './DropDown';

const dropList = ['aaaaa', 'bbbb', 'ccccc', 'ddddd', 'fffff', 'eeeee'];
const Test = () => {
  const [result, setResult] = useState('');
  const [resulta, setResulta] = useState('');

  return (
    <Inner>
      <Box sx={{ display: 'flex' }}>
        <DropDown result={result} dropList={dropList} setResult={setResult} />
        <DropDown result={result} dropList={dropList} setResult={setResult} />
        <DropDown result={resulta} dropList={dropList} setResult={setResulta} />
        <DropDown result={resulta} dropList={dropList} setResult={setResulta} />
      </Box>
    </Inner>
  );
};

export default Test;
