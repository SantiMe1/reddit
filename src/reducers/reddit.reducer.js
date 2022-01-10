import {
  ALL_FETCHED,
  POST_FETCHED,
  VOTE_POST,
  VOTE_COMMENT,
  ADD_COMMENT,
} from '../actions/reddit.actions';

const initialState = {
  posts: null,
  post: null,
  comments: null,
};

const setCommentVote = (comments, indexRoute, value) => {
  if (!indexRoute.length) return comments;
  const targetIndex = indexRoute.shift();
  return comments.map((comment, index) => {
    if (index === targetIndex) {
      if (indexRoute.length) {
        comment.data.replies.data.children = setCommentVote(
          comment.data.replies.data.children,
          indexRoute,
          value
        );
      } else {
        comment.data.originalScore =
          comment.data.originalScore !== undefined
            ? comment.data.originalScore
            : comment.data.score;
        comment.data.score = value
          ? comment.data.score + value
          : comment.data.originalScore;
        comment.data.votedUp = value > 0;
        comment.data.votedDown = value < 0;
      }
    }
    return comment;
  });
};

const getNewRepliesObj = (reply) => ({
  kind: 'Listing',
  data: { children: [reply] },
});

const saveComment = (comments, indexRoute, value) => {
  if (!indexRoute.length) return comments;
  const targetIndex = indexRoute.shift();
  return comments.map((comment, index) => {
    if (index === targetIndex) {
      if (indexRoute.length) {
        comment.data.replies.data.children = saveComment(
          comment.data.replies.data.children,
          indexRoute,
          value
        );
      } else {
        if (comment.data.replies) {
          comment.data.replies.data.children.unshift(value);
        } else {
          comment.data.replies = getNewRepliesObj(value);
        }
      }
    }
    return comment;
  });
};

export default function redditReducer(state = initialState, action) {
  switch (action.type) {
    case ALL_FETCHED:
      return {
        ...state,
        posts: action.payload,
      };

    case POST_FETCHED:
      return {
        ...state,
        post: action.payload ? action.payload[0].data?.children[0]?.data : null,
        comments: action.payload ? action.payload[1].data?.children : null,
      };

    case VOTE_POST:
      return {
        ...state,
        posts: state.posts.map((post, i) =>
          i === action.payload
            ? {
                ...post,
                data: {
                  ...post.data,
                  originalScore:
                    post.data.originalScore !== undefined
                      ? post.data.originalScore
                      : post.data.score,
                  score: action.value
                    ? post.data.score + action.value
                    : post.data.originalScore,
                  votedUp: action.value > 0,
                  votedDown: action.value < 0,
                },
              }
            : post
        ),
      };
    case VOTE_COMMENT:
      return {
        ...state,
        comments: [
          ...state.comments,
          setCommentVote(state.comments, action.payload, action.value),
        ],
      };
    case ADD_COMMENT:
      return {
        ...state,
        comments: [
          ...state.comments,
          saveComment(state.comments, action.payload, action.value),
        ],
      };
    default:
      return state;
  }
}
