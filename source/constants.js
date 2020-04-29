import { isKeyHotkey } from 'is-hotkey';

export const IS_BOLD_HOTKEY = isKeyHotkey('mod+b');
export const IS_ITALIC_HOTKEY = isKeyHotkey('mod+i');
export const IS_UNDERLINED_HOTKEY = isKeyHotkey('mod+u');

export const FORM_GROUP_COLLECTION = document.getElementsByClassName('notes');
export const RTE_FORM_CTRL_COLLECTION = document.getElementsByClassName('rte-form-control', 'is-invalid', 'is-focused');
export const RTE_COLLECTION = document.getElementsByClassName('rich-text-editor');

export const DEFAULT_NODE = 'paragraph';
