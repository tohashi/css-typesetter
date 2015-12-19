import keyMirror from 'keymirror';

const ActionTypes = keyMirror({
  UPDATE_TEXT: null,
  REMOVE_TEXT: null,
  COPY_TEXT: null,
  UNDO: null,
  REDO: null,
  IMPORT: null
});

export { ActionTypes };

