import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { formats, modules } from './EditorToolbar';

export const Editor = ({ outRef }) => {
  return (
    <>
      <EditorToolbar />
      <ReactQuill
        ref={outRef}
        name="dasdasd"
        theme="snow"
        placeholder={'Write something awesome...'}
        modules={modules}
        formats={formats}
      />
    </>
  );
};

export default Editor;
