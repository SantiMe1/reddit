import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Moment from 'react-moment';
import DefaultImage from './assets/default.png';
import SelfImage from './assets/self.png';
import NSFWImage from './assets/nsfw.png';
import VideoIcon from './assets/video.png';
import { ReactComponent as Arrow } from '../../assets/arrow.svg';
import { votePost } from '../../actions/reddit.actions';

const StyledPosition = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  width: 25px;
  color: #d2c9c2;
  font-size: 22px;
  margin-right: 10px;
`;

const StyledScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 70px;
  color: #c1c2c3;
  font-weight: bold;
  font-size: 17px;
  margin-right: 15px;
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

const StyledScoreText = styled.span`
  ${(props) => (props.votedUp ? 'color: #ff0000' : '')};
  ${(props) => (props.votedDown ? 'color: #0060ff' : '')};
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

const StyledItemImage = styled.img`
  width: 85px;
  margin-right: 10px;
`;

const StyledListItem = styled.li`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: white;
  margin: 5px;
  padding: 10px;
  box-sizing: border-box;

  &:hover,
  &:focus {
    .item-info {
      background: #f0f3fc;
    }
  }
`;

const StyledItemInfo = styled.div`
  width: 100%;
`;

const StyledItemTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  color: #1500ff;
`;

const StyledItemDescription = styled.div`
  display: flex;
  padding-top: 4px;
`;

const StyledVideoIcon = styled.img`
  width: 35px;
  margin-right: 10px;
`;

const StyledSubmittedBy = styled.div`
  font-size: 14px;
  color: #606060;
`;

const StyledAuthor = styled.span`
  color: #0067a4;
`;

const StyledCommentsNum = styled.div`
  font-size: 14px;
  color: #484848;
  font-weight: bold;
`;

const getImageSrc = (val) => {
  switch (val) {
    case '':
      return DefaultImage;
    case 'self':
      return SelfImage;
    case 'default':
      return DefaultImage;
    case 'nsfw':
      return NSFWImage;
    default:
      return val;
  }
};

const getScoreText = (score) => {
  const digits = score?.toString().length;
  if (digits < 5) return score;
  const num = score / 1000;
  return `${num.toFixed(1)}k`;
};

export default function ListItem({
  title,
  thumbnail,
  position,
  score,
  isVideo,
  created,
  author,
  numComments,
  votedUp,
  votedDown,
}) {
  const dispatch = useDispatch();

  const voteUp = (position, votedUp, votedDown) => {
    const index = position - 1;
    let votes = 1;
    if (votedDown) votes = 2;
    if (votedUp) votes = 0;
    dispatch(votePost(index, votes));
  };

  const voteDown = (position, votedUp, votedDown) => {
    const index = position - 1;
    let votes = -1;
    if (votedDown) votes = 0;
    if (votedUp) votes = -2;
    dispatch(votePost(index, votes));
  };

  return (
    <StyledListItem ariaLabel={title} tabIndex="0" onClick={() => {}}>
      {position && <StyledPosition>{position}</StyledPosition>}
      <StyledScore>
        {position && (
          <StyledUpArrow
            selected={votedUp}
            onClick={(e) => {
              e.preventDefault();
              voteUp(position, votedUp, votedDown);
            }}
          >
            <Arrow />
          </StyledUpArrow>
        )}
        <StyledScoreText votedUp={votedUp} votedDown={votedDown}>
          {getScoreText(score)}
        </StyledScoreText>
        {position && (
          <StyledDownArrow
            selected={votedDown}
            onClick={(e) => {
              e.preventDefault();
              voteDown(position, votedUp, votedDown);
            }}
          >
            <Arrow />
          </StyledDownArrow>
        )}
      </StyledScore>
      <StyledItemImage src={getImageSrc(thumbnail)} alt={title} />
      <StyledItemInfo className="item-info">
        <StyledItemTitle>{title}</StyledItemTitle>
        <StyledItemDescription>
          {isVideo && (
            <StyledVideoIcon src={VideoIcon} alt="Post contains video" />
          )}
          <div>
            <StyledSubmittedBy>
              submitted <Moment fromNow>{created * 1000}</Moment> by{' '}
              <StyledAuthor>{author}</StyledAuthor>
            </StyledSubmittedBy>
            <StyledCommentsNum>{numComments} comments</StyledCommentsNum>
          </div>
        </StyledItemDescription>
      </StyledItemInfo>
    </StyledListItem>
  );
}
