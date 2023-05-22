import { Inner } from '_/components/common/CustomComponents/CustomMui';

import EditorCT from './EditorCT';
import DropDown from './DropDown';
import { useEffect, useMemo, useState } from 'react';
import useDebounce from '_/hook/useDebounce';
import { Box } from '@mui/material';

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

// plugins:
// 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss',
// toolbar:
// 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
