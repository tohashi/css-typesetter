import keyMirror from 'keymirror';

const ActionTypes = keyMirror({
  UPDATE_TEXT: null,
  REMOVE_TEXT: null,
  COPY_TEXT: null,
  CHANGE_ZOOM: null,
  UNDO: null,
  REDO: null
});

export { ActionTypes };

