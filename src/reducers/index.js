import { combineReducers } from 'redux';
import redditReducer from './reddit.reducer';

export default combineReducers({
  reddit: redditReducer,
});
