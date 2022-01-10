import { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Moment from 'react-moment';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { voteComment, addComment } from '../../actions/reddit.actions';

const StyledCommentWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: white;
  margin: 5px 0;
  padding: 4px;
  box-sizing: border-box;
  border: 1px solid #eaeaea;
  ${(props) => (props.depth % 2 !== 0 ? 'background: #f7f7f8' : '')};
`;

const StyledArrows = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  color: #c1c2c3;
`;

const StyledUpArrow = styled.div`
  height: 20px;
  width: 20px;
  &:hover svg path {
    fill: #ff0000;
  }
  svg path {
    ${(props) => (props.selected ? 'fill: #ff0000' : '')};
  }
`;

const StyledDownArrow = styled.div`
  height: 20px;
  width: 20px;
  transform: rotate(180deg);
  &:hover svg path {
    fill: #0060ff;
  }
  svg path {
    ${(props) => (props.selected ? 'fill: #0060ff' : '')};
  }
`;

const StyledComment = styled.div`
  width: 100%;
`;

const StyledItemDescription = styled.div`
  display: flex;
  padding-top: 4px;
  font-size: 14px;
`;

const StyledAuthor = styled.span`
  color: #0067a4;
  font-weight: bold;
  margin-right: 10px;
`;

const StyledScore = styled.span`
  color: #484848;
  font-weight: bold;
  margin-right: 10px;
`;

const StyledTimestamp = styled.span`
  color: #606060;
  margin-right: 10px;
`;

const StyledReplyLink = styled.div`
  cursor: pointer;
  font-weight: bold;
  color: #404040;
  font-size: 14px;
  margin: 5px 0;
`;

const StyledReplyBox = styled.div`
  display: flex;
  padding-right: 10px;
  align-items: center;
`;
const StyledReplyTexarea = styled.textarea`
  width: 100%;
  font-family: arial;
  border: 1px solid #c3c3c3;
  padding: 5px;
`;

const StyledReplySave = styled.button`
  background: #0067a4;
  border-radius: 5px;
  border: 0;
  margin-left: 6px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  height: 30px;
`;
const StyledReplyCancel = styled.button`
  background: #787878;
  border-radius: 5px;
  border: 0;
  margin-left: 6px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  height: 30px;
`;

const getReplyObj = (body, replies, depth) => {
  const id = replies ? replies.data.children.length : 0;
  const author = 'Me';
  return {
    kind: 't1',
    data: {
      name: `t1_${author}_${id}`,
      body,
      author,
      score: 0,
      created: Date.now() / 1000,
      depth,
      replies: '',
    },
  };
};

export default function Comment({
  body,
  author,
  score,
  created,
  votedUp,
  votedDown,
  depth,
  replies,
  indexRoute,
}) {
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [reply, setReply] = useState('');
  const dispatch = useDispatch();
  const voteUp = (votedUp, votedDown) => {
    let votes = 1;
    if (votedDown) votes = 2;
    if (votedUp) votes = 0;
    dispatch(voteComment(indexRoute, votes));
  };

  const voteDown = (votedUp, votedDown) => {
    let votes = -1;
    if (votedDown) votes = 0;
    if (votedUp) votes = -2;
    dispatch(voteComment(indexRoute, votes));
  };

  const toggleReply = () => {
    setShowReplyBox(!showReplyBox);
  };

  const saveReply = () => {
    const replyObj = getReplyObj(reply, replies, depth + 1, indexRoute);
    dispatch(addComment(indexRoute, replyObj));
    setReply('');
    setShowReplyBox(false);
  };

  return (
    <StyledCommentWrapper
      ariaLabel={body}
      tabIndex="0"
      onClick={() => {}}
      depth={depth}
    >
      <StyledArrows>
        <StyledUpArrow
          selected={votedUp}
          onClick={(e) => {
            e.preventDefault();
            voteUp(votedUp, votedDown);
          }}
        >
          <Arrow />
        </StyledUpArrow>
        <StyledDownArrow
          selected={votedDown}
          onClick={(e) => {
            e.preventDefault();
            voteDown(votedUp, votedDown);
          }}
        >
          <Arrow />
        </StyledDownArrow>
      </StyledArrows>
      <StyledComment>
        <StyledItemDescription>
          <StyledAuthor>{author}</StyledAuthor>
          <StyledScore>
            {score} {score === 1 ? 'point' : 'points'}
          </StyledScore>
          <StyledTimestamp>
            <Moment fromNow>{created * 1000}</Moment>
          </StyledTimestamp>
        </StyledItemDescription>
        <div>{body}</div>
        <StyledReplyLink tabIndex="0" onClick={toggleReply}>
          reply
        </StyledReplyLink>
        {showReplyBox && (
          <StyledReplyBox>
            <StyledReplyTexarea
              placeholder="What are you thoughts?"
              value={reply}
              onChange={(e) => {
                setReply(e.target.value);
              }}
            />
            <StyledReplySave onClick={saveReply}>save</StyledReplySave>
            <StyledReplyCancel
              onClick={() => {
                setReply('');
                setShowReplyBox(false);
              }}
            >
              cancel
            </StyledReplyCancel>
          </StyledReplyBox>
        )}
        {replies &&
          replies.data?.children.map(
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
                  index={index}
                  depth={item.data.depth}
                  replies={item.data.replies}
                  indexRoute={[...indexRoute, index]}
                />
              )
          )}
      </StyledComment>
    </StyledCommentWrapper>
  );
}
