import React from 'react';
import RichTextEditor from './RichTextEditor';
import './index.scss';

function App() {
  const containerStyles = {
    maxWidth: '43.75rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '3rem',
  };

  const isInvalid = false;

  return (
    <div style={containerStyles}>
      <RichTextEditor
        isInvalid={isInvalid}
      />
    </div>
  );
}

export default App;
