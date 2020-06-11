import React from 'react';
import { getEventTransfer } from 'slate-react';
import wordFilter from 'tinymce-word-paste-filter';

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

// underline and italic are not coming as a <u/> and <i/> tags so are not cleaned up by wordFilter
// convert underlined and italic text coming as <span/> into <u/> and <i/>
const replaceSpanWithElement = (element, span) => {
  element.innerHTML = span.innerHTML;
  if (span.parentNode) {
    span.parentNode.replaceChild(element, span);
    // add one white space before and one after the <element/> tag because it sticks its contents to its siblings
    const space = document.createTextNode('\u00A0');
    element.parentNode.insertBefore(space, element.nextSibling);
    element.parentNode.insertBefore(document.createTextNode('\u00A0'), element);

    // remove white space if it is first child
    if (!element.parentNode.firstChild.innerHTML) {
      element.parentNode.removeChild(element.parentNode.firstChild);
    }
  }
};

const processedHtml = (html, transfer) => {
  const body = html.parseHtml(transfer.html);
  const array = Array.from(body.querySelectorAll('span'));
  const underline = array.filter((span) => span.style.textDecoration === 'underline');
  const italic = array.filter((span) => span.style.fontStyle === 'italic');
  const bold = Array.from(body.querySelectorAll('b'))
    .filter((b) => b.style.fontWeight === 'normal');

  if (underline && !!underline.length) {
    underline.forEach((span) => {
      const u = document.createElement('u');
      replaceSpanWithElement(u, span);
    });
  }
  if (italic && !!italic.length) {
    italic.forEach((span) => {
      const i = document.createElement('i');
      replaceSpanWithElement(i, span);
      if (i.parentNode && i.parentNode.tagName === 'P') {
        i.parentNode.parentNode.insertBefore(i, i.parentNode);
        i.parentNode.removeChild(i.nextSibling);
      }
    });
  }

  // activates <b/> tags format, TODO: uncomment when deserialization works
  // if (bold && !!bold.length) {
  //   bold.forEach((b) => {
  //     b.removeAttribute('style');
  //     b.removeAttribute('id');
  //   });
  // }
  return body.outerHTML;
};

/* eslint-disable consistent-return */
export const onPaste = async (event, editor, next) => {
  const textIsLink = hasLinks(editor.value);
  const transfer = getEventTransfer(event);
  const { type, text } = transfer;

  if (type !== 'html') return next();

  if (type === 'html') {
    const html = new Html({ rules, type: 'paragraph' });
    const processedTransferHtml = processedHtml(html, transfer);

    // clean html from microsoft word format
    // it adds unnecessary markup and makes it impossible for slate to deserialize it
    const cleanedHtml = wordFilter(processedTransferHtml);
    const doc = html.deserialize(cleanedHtml).document;
    await event.preventDefault();
    editor.insertFragment(doc);
  }

  if (textIsLink) {
    editor.command(unwrapLink);
  } else if (!textIsLink) editor.command(wrapLink, text);
};

export const onClick = (e, href) => {
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
