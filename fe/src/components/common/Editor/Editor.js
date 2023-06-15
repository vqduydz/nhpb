import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats, modules } from './EditorToolbar';
import { Box } from '@mui/material';

export const Editor = ({ outRef, sx }) => {
  return (
    <Box sx={{ '& .ql-editor': { ...sx } }}>
      <EditorToolbar />
      <ReactQuill
        ref={outRef}
        name="dasdasd"
        theme="snow"
        placeholder={'Write here...'}
        modules={modules}
        formats={formats}
      />
    </Box>
  );
};

export default Editor;
