import React from 'react';

export const hasMark = (type, editorValue) => editorValue.activeMarks.some((mark) => mark.type === type);

export const hasBlock = (type, editorValue) => editorValue.blocks.some((node) => node.type === type);

export const renderBlock = (props, editor, next) => {
  const { attributes, children, node } = props;

  switch (node.type) {
    case 'bulletList':
      return <ul {...attributes}>{children}</ul>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'numberedList':
      return <ol {...attributes}>{children}</ol>;
    case 'indentIncrease':
      return <div className="rte-indent-increase" {...attributes}>{children}</div>;
    case 'paragraphLeft':
      return <div className="rte-paragraph-left" {...attributes}>{children}</div>;
    case 'paragraphCentre':
      return <div className="rte-paragraph-center" {...attributes}>{children}</div>;
    case 'paragraphRight':
      return <div className="rte-paragraph-right" {...attributes}>{children}</div>;
    case 'link':
      return <a {...attributes}>{children}</a>;
    default:
      return next();
  }
};

export const renderMark = (props, editor, next) => {
  const { children, mark, attributes } = props;

  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>;
    case 'italic':
      return <em {...attributes}>{children}</em>;
    case 'underlined':
      return <u {...attributes}>{children}</u>;
    default:
      return next();
  }
};
