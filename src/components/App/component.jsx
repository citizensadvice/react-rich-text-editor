// import './index.scss';
import React, { useState } from 'react';
import Html from 'slate-html-serializer';
import RichTextEditor from '../RichTextEditor';
import { rules } from '../RichTextEditor/utils';

const html = new Html({ rules });
const isInvalid = false;

export default function App() {
  const [contents, setContents] = useState();

  return (
    <>
      <RichTextEditor
        isInvalid={isInvalid}
        onEditorChange={(value) => setContents(html.serialize(value))}
      />

      <div style={{ marginTop: '1.5rem' }}>
        <label htmlFor="output">
          Current value
        </label>
        <output>
          <pre>
            {contents}
          </pre>
        </output>
      </div>
    </>
  );
}
