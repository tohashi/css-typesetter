import keyMirror from 'keymirror';

const ActionTypes = keyMirror({
  ADD_TEXT: null,
  UPDATE_TEXT: null,
  REMOVE_TEXT: null,
  COPY_TEXT: null,
  UNDO: null,
  REDO: null,
  IMPORT: null,
  CLEAR: null,

  SET_IMAGE_PATH: null,
  SET_PREVIEW_WIDTH: null
});

export { ActionTypes };

