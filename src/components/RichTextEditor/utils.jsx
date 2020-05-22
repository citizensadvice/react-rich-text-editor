import React from 'react';

export const hasMark = (type, editorValue) => editorValue
  .activeMarks.some((mark) => mark.type === type);

export const hasBlock = (type, editorValue) => editorValue
  .blocks.some((node) => node.type === type);

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


// takes a HTML element object and returns a Slate fragment
// https://docs.slatejs.org/concepts/09-serializing#deserializing
export const deserialize = (el) => {
  if (el.nodeType === 3) {
    return el.textContent;
  } if (el.nodeType !== 1) {
    return null;
  } return el.textContent;
};

// Add a dictionary of block tags.
const BLOCK_TAGS = {
  p: 'paragraph',
  div: 'div',
  span: 'span',
  li: 'list-item',
  ul: 'bulletList',
  ol: 'numberedList',
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  em: 'italic',
  strong: 'bold',
  u: 'underlined',
};

export const rules = [
  // Rules for handling blocks
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'block',
          type,
          data: {
            className: el.getAttribute('class'),
            href: el.getAttribute('href'),
          },
          nodes: next(el.childNodes),
        };
      }
      return null;
    },
    serialize(obj, children) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'bulletList':
            return <ul>{children}</ul>;
          case 'numberedList':
            return <ol>{children}</ol>;
          case 'list-item':
            return <li>{children}</li>;
          case 'indentIncrease':
            return <div className="rte-indent-increase">{children}</div>;
          case 'paragraphLeft':
            return <div className="rte-paragraph-left">{children}</div>;
          case 'paragraphCentre':
            return <div className="rte-paragraph-center">{children}</div>;
          case 'paragraphRight':
            return <div className="rte-paragraph-right">{children}</div>;
          case 'link':
            return <a href={children}>{children}</a>;
          case 'div':
            return <div>{children}</div>;
          case 'span':
            return <span>{children}</span>;
          case 'paragraph':
            return <p>{children}</p>;
          default:
            return <p>{children}</p>;
        }
      }
      return null;
    },
  },
  // Rules for handling marks
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName.toLowerCase()];
      if (type) {
        return {
          object: 'mark',
          type,
          nodes: next(el.childNodes),
        };
      }
      return null;
    },
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <strong>{children}</strong>;
          case 'italic':
            return <em>{children}</em>;
          case 'underlined':
            return <u>{children}</u>;
          default:
            return <strong>{children}</strong>;
        }
      }
      return null;
    },
  },
];
