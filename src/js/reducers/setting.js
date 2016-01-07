import { ActionTypes } from '../constants';

function getInitialState() {
  return {
    previewWidth: 720,
    previewHeight: 0,
    imageWidth: 0,
    imageHeight: 0,
    imageUrl: null,
    draggingKey: null
  };
};

const initialState = getInitialState();

export default function setting(state = initialState, action) {
  switch(action.actionType) {
  default:
    return state;
  }
}

