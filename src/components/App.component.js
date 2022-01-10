import styled from 'styled-components';
import List from './list/List.component';
import Post from './post/Post.component';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const StyledHeader = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 15px 40px;
  background: #242424;
  z-index: 1;

  @media (max-width: 500px) {
    justify-content: center;
  }
`;

const StyledTitle = styled.h1`
  color: #fff;
  margin: 0;
`;

const StyledContent = styled.div`
  padding: 20px;
  word-break: break-word;
`;

function App() {
  return (
    <div>
      <StyledHeader>
        <StyledTitle>Reddit Client</StyledTitle>
      </StyledHeader>
      <StyledContent>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<List />} />
            <Route path="post/*" element={<Post />} />
          </Routes>
        </BrowserRouter>
      </StyledContent>
    </div>
  );
}

export default App;
