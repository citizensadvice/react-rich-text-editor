import React from 'react';
import { getEventTransfer } from 'slate-react';
import Html from 'slate-html-serializer';
import { rules } from './utils';
import LinkNewWindow from './components/LinkNewWindow';


export function wrapLink(editor, href) {
  editor.wrapInline({
    type: 'link',
    data: { href },
  });

  editor.moveToEnd();
}

export function unwrapLink(editor) {
  editor.unwrapInline('link');
}

export const hasLinks = (value) => value.inlines.some((inline) => inline.type === 'link');

/* eslint-disable consistent-return */
export const onLinkPaste = (event, editor, next) => {
  const textIsLink = hasLinks(editor.value);

  const transfer = getEventTransfer(event);
  const { type, text } = transfer;

  if (type !== 'text' && type !== 'html') return next();

  if (type === 'html') {
    event.preventDefault();
    const html = new Html({ rules });
    const { document } = html.deserialize(transfer.html);

    editor.insertFragment(document);
  }

  if (textIsLink) {
    editor.command(unwrapLink);
  } else if (!textIsLink) editor.command(wrapLink, text);

  if (editor.value.selection.isCollapsed) return next();
};

const onClick = (e, href) => {
  e.preventDefault();
  window.open(href);
};

export const renderInline = (props, editor, next) => {
  const { attributes, children, node } = props;

  // remove the ref that's passed in from editor as function components cannot be given refs
  // without using React.forwardRef().
  const { ...remainingAttributes } = attributes;

  switch (node.type) {
    case 'link': {
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

    default: {
      return next();
    }
  }
};
