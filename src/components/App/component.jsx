import React from 'react';
import RichTextEditor from '../RichTextEditor';

const isInvalid = false;

export default function App() {
  return (
    <RichTextEditor
      isInvalid={isInvalid}
    />
  );
}
