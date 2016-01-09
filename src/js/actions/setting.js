import { ActionTypes } from '../constants'

export default {
  setImagePath(files) {
    const file = files[0];
    if (!/image/.test(file.type)) {
      return;
    }
    return {
      type: ActionTypes.SET_IMAGE_PATH,
      path: file.preview
    };
  },

  setPreviewWidth(previewWidth) {
    return { type: ActionTypes.SET_PREVIEW_WIDTH, previewWidth }
  }
};

