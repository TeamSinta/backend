import styled from "styled-components";
export const StyledCommentInput = styled.input`
   {
    flex: 1;
    border: none;
    outline: none;
    background-color: transparent;
    ::placeholder {
      color: black;
    }
  }
`;
export const StyledCommentBox = styled.div`
   {
    position: absolute;
    bottom: 0;
    margin-bottom: 10px;
    left: 15px;
    right: 15px;
    display: flex;
    border-radius: 10px;
    background: white;
    padding: 5px 15px;
    align-items: center;
    justify-content: flex-end;
  }
`;
export const StyledCommentList = styled.div`
   {
    margin-top: 10px;
    height: 35vh;
    overflow-y: auto;
    font-size: 12px;
    overflow-y: scroll;
    padding-bottom: 20px;
    ::-webkit-scrollbar {
      background-color: #f6f6fb;
      border-radius: 10px;
      padding: 0px;
      margin: 0px;
      width: 5px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: white;

      border-radius: 5px;
      padding: 0px;
      margin: 0px;
      width: 5px;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
      padding: 1px;
      padding: 0px;
      margin: 0px;
      width: 5px;
    }
  }
`;
