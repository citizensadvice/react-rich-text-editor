import React from 'react';
import LinkNewWindow from './components/LinkNewWindow';

export const hasMark = (type, editorValue) => editorValue
  .activeMarks.some((mark) => mark.type === type);

export const hasBlock = (type, editorValue) => editorValue
  .blocks.some((node) => node.type === type);

const onClick = (e, href) => {
  e.preventDefault();
  window.open(href);
};

export const renderBlock = (props, editor, next) => {
  const { attributes, children, node } = props;
  const className = node.data.get('className');
  switch (node.type) {
    case 'paragraph':
      return <p className={className} {...attributes}>{children}</p>;
    case 'span':
      return <span className="paragraph-inline" {...attributes}>{children}</span>;
    case 'bulletList':
      return <ul {...attributes}>{children}</ul>;
    case 'numberedList':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'list-item-child':
      return <span {...attributes}>{children}</span>;
    case 'indentIncrease':
      return <div className="rte-indent-increase" {...attributes}>{children}</div>;
    case 'paragraphLeft':
      return <p className="rte-paragraph-left" {...attributes}>{children}</p>;
    case 'paragraphCentre':
      return <p className="rte-paragraph-center" {...attributes}>{children}</p>;
    case 'paragraphRight':
      return <p className="rte-paragraph-right" {...attributes}>{children}</p>;
    case 'link': {
      const { ...remainingAttributes } = attributes;
      const { data, nodes } = node;
      const hasText = nodes.some((obj) => obj.text.length > 0);
      const href = data.get('href');
      return (
        <LinkNewWindow
          {...remainingAttributes}
          href={href}
          onClick={(e) => onClick(e, href)}
          className={`${!hasText ? 'rte-link-new-window-no-text' : 'rte-link-new-window'}`}
        >
          {children}
        </LinkNewWindow>
      );
    }
    case 'heading-1':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-2':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-3':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-4':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-5':
      return <h5 {...attributes}>{children}</h5>;
    case 'heading-6':
      return <h6 {...attributes}>{children}</h6>;
    default:
      return next();
  }
};

export const renderMark = (props, editor, next) => {
  const { children, mark, attributes } = props;
  switch (mark.type) {
    case 'bold':
      return <b {...attributes}>{children}</b>;
    case 'italic':
      return <i {...attributes}>{children}</i>;
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
  ul: 'bulletList',
  ol: 'numberedList',
  a: 'link',
  li: 'list-item',
  h1: 'heading-1',
  h2: 'heading-2',
  h3: 'heading-3',
  h4: 'heading-4',
  h5: 'heading-5',
  h6: 'heading-6',
};

// Add a dictionary of mark tags.
const MARK_TAGS = {
  b: 'bold',
  strong: 'bold',
  i: 'italic',
  em: 'italic',
  u: 'underlined',
};

export const rules = [
  {
    // what we get when we retrieve data
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName.toLowerCase()];
      const mark = MARK_TAGS[el.tagName.toLowerCase()];
      if (mark) {
        return {
          object: 'text',
          text: el.textContent,
          marks: [mark],
        };
      }

      if (!type) {
        return {
          object: 'text',
          leaves: [el.textContent],
        };
      } return {
        object: 'block',
        type,
        data: {
          className: el.getAttribute('class'),
          href: el.getAttribute('href'),
        },
        nodes: next(el.childNodes),
      };
    },
    // what we send when we send data
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold':
            return <b>{children}</b>;
          case 'italic':
            return <i>{children}</i>;
          case 'underlined':
            return <u>{children}</u>;
          default:
            return <b>{children}</b>;
        }
      }

      if (obj.object === 'block') {
        console.log(obj.type);
        switch (obj.type) {
          case 'bulletList':
            return <ul>{children}</ul>;
          case 'numberedList':
            return <ol>{children}</ol>;
          case 'list-item':
            return <li>{children}</li>;
          case 'list-item-child':
            return <span>{children}</span>;
          case 'indentIncrease':
            return <div className={obj.data.get('className')}>{children}</div>;
          case 'paragraphLeft':
            return <p className="rte-paragraph-left">{children}</p>;
          case 'paragraphCentre':
            return <p className="rte-paragraph-center">{children}</p>;
          case 'paragraphRight':
            return <p className="rte-paragraph-right">{children}</p>;
          case 'link': {
            const { data, nodes } = obj;
            const hasText = nodes.some((o) => o.text.length > 0);
            const href = data.get('href');
            const textNewWindow = Array.from(children)[0][0].includes('new window');
            return (
              <LinkNewWindow
                href={href}
                textNewWindow={textNewWindow}
                onClick={(e) => onClick(e, href)}
                className={`${!hasText ? 'rte-link-new-window-no-text' : 'rte-link-new-window'}`}
              >
                {children}
              </LinkNewWindow>
            );
          }
          case 'div':
            return <div>{children}</div>;
          case 'paragraph':
            return <p className={obj.data.get('className')}>{children}</p>;
          default:
            return <p>{children}</p>;
        }
      }
      return null;
    },
  },
];
