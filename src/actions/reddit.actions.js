import { fetchAll, fetchOne } from '../apis/reddit.api';
export const ALL_FETCHED = 'ALL_FETCHED';
export const POST_FETCHED = 'POST_FETCHED';
export const VOTE_POST = 'VOTE_POST';
export const VOTE_COMMENT = 'VOTE_COMMENT';
export const ADD_COMMENT = 'ADD_COMMENT';

export function allFetchSuccess(posts) {
  return {
    type: ALL_FETCHED,
    payload: posts,
  };
}

export function clearAllPosts() {
  return allFetchSuccess(null);
}

export function postFetchSuccess(post) {
  return {
    type: POST_FETCHED,
    payload: post,
  };
}

export function clearPost() {
  return postFetchSuccess(null);
}

export function votePost(index, val) {
  return {
    type: VOTE_POST,
    payload: index,
    value: val,
  };
}

export function voteComment(indexRoute, val) {
  return {
    type: VOTE_COMMENT,
    payload: indexRoute,
    value: val,
  };
}

export function addComment(indexRoute, val) {
  return {
    type: ADD_COMMENT,
    payload: indexRoute,
    value: val,
  };
}

export const getAllPosts = () => (dispatch) => {
  dispatch(clearAllPosts());
  fetchAll()
    .then((resp) => resp.json())
    .then((json) => {
      dispatch(allFetchSuccess(json?.data?.children));
    })
    .catch((res) => {
      console.error(res);
    });
};

export const getPost = (permalink) => (dispatch) => {
  dispatch(clearPost());
  fetchOne(permalink)
    .then((resp) => resp.json())
    .then((json) => {
      dispatch(postFetchSuccess(json));
    })
    .catch((res) => {
      console.error(res);
    });
};
