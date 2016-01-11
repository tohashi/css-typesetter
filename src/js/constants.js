import keyMirror from 'keymirror';

const ActionTypes = keyMirror({
  UPDATE_TEXT: null,
  REMOVE_TEXT: null,
  COPY_TEXT: null,
  UNDO: null,
  REDO: null,
  IMPORT_TEXTS: null,
  CLEAR_TEXTS: null,

  SET_IMAGE_PATH: null,
  SET_PREVIEW_WIDTH: null,
  SET_IMAGE_SIZE: null
});

export { ActionTypes };

