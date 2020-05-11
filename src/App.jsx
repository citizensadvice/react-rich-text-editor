import React from 'react';
import RichTextEditor from './RichTextEditor';
import './index.scss';

const isInvalid = false;

export function App() {
  return (
    <RichTextEditor
      isInvalid={isInvalid}
    />
  );
}
