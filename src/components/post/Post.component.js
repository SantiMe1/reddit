import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getPost } from '../../actions/reddit.actions';
import ListItem from '../list-item/ListItem.component';
import Comment from '../comment/Comment.component';
import { useParams } from 'react-router-dom';

const StyledLoading = styled.div`
  text-align: center;
  font-size: 20px;
`;

export default function Post() {
  const params = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.reddit.post);
  const comments = useSelector((state) => state.reddit.comments);
  useEffect(() => {
    dispatch(getPost(params['*']));
  }, [dispatch, params]);

  return (
    <>
      {post ? (
        <div>
          <ListItem
            key={post.name}
            title={post.title}
            thumbnail={post.thumbnail}
            score={post.score}
            isVideo={post.is_video}
            created={post.created}
            author={post.author}
            numComments={post.num_comments}
          />
          {comments ? (
            comments.map(
              (item, index) =>
                item.kind === 't1' && (
                  <Comment
                    key={item.data.name}
                    body={item.data.body}
                    author={item.data.author}
                    score={item.data.score}
                    created={item.data.created}
                    votedUp={item.data.votedUp}
                    votedDown={item.data.votedDown}
                    depth={item.data.depth}
                    replies={item.data.replies}
                    indexRoute={[index]}
                  />
                )
            )
          ) : (
            <div>There are no comments yet.</div>
          )}
        </div>
      ) : (
        <StyledLoading>Loading...</StyledLoading>
      )}
    </>
  );
}
