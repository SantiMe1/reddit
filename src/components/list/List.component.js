import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { getAllPosts } from '../../actions/reddit.actions';
import ListItem from '../list-item/ListItem.component';
import { Link } from 'react-router-dom';

const StyledList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  a {
    text-decoration: none;
  }
`;

const StyledLoading = styled.div`
  text-align: center;
  font-size: 20px;
`;

export default function List() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.reddit.posts);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  return (
    <StyledList>
      {posts ? (
        posts.map((item, index) => (
          <Link to={`/post${item.data.permalink}`} key={item.data.name}>
            <ListItem
              title={item.data.title}
              thumbnail={item.data.thumbnail}
              position={index + 1}
              score={item.data.score}
              isVideo={item.data.is_video}
              created={item.data.created}
              author={item.data.author}
              numComments={item.data.num_comments}
              votedUp={item.data.votedUp}
              votedDown={item.data.votedDown}
            />
          </Link>
        ))
      ) : (
        <StyledLoading>Loading...</StyledLoading>
      )}
    </StyledList>
  );
}
