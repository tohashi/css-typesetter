import _ from 'lodash';
import { ActionTypes } from '../constants';

function uniqueKey(prefix) {
  const key = _.uniqueId(prefix);
  if (instance.exists(key)) {
    return uniqueKey(`${key}-`);
  }
  return key;
}

function getInitialState() {
  return {
    key: _.uniqueId('text-'),
    x: 0,
    y: 0,
    width: 160,
    height: 20,
    value: 'test',
    fontSize: 12,
    scale: 1,
    lineHeight: null,
    letterSpacing: null,
    textAlign: 'left'
  };
};

const initialState = [getInitialState()];

export default function texts(state = initialState, action) {
  switch(action.actionType) {
  case ActionTypes.ADD_TEXT:
    return [
      _.defaults(action.params, getInitialState()),
      ...state
    ]
  default:
    return state;
  }
}

