import styled from "styled-components";
export const StyledSummaryTitle = styled.span`
   {
    font-weight: bold;
    font-size: 12px;
  }
`;
export const StyledSummaryDescription = styled.div`
   {
    margin-top: 20px;
    font-weight: 400;
    font-size: 12px;
    line-height: 15px;
  }
`;

export const StyledRoundBox = styled.div`
   {
    border-radius: 10px;
    background-color: white;
    padding: 10px;
    padding-bottom: 0px;
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: 12px;
  }
`;
export const StyledSubmitDecision = styled.div`
   {
    font-weight: bold;
    font-size: 12px;
    margin-left: 20px;
  }
`;

export const StyledDecisionButton = styled.div`
   {
    display: flex;
    justify-content: center;
    align-items: center;
    /* padding: 10px 28px; */
    gap: 10px;
    background: transparent;
    border: 0;
    position: relative;
    outline: 1px solid ${(props) => props.theme.colors.black};
    outline-offset: -1px;
    border-radius: 12px;
    box-shadow: 0px 2px 0px #121212;
    height: 40px;
    width: 100%;

    :hover {
      cursor: pointer;
      box-shadow: 0px 4px 0px #121212;
      transition: 0.5s;
    }

    :active {
      box-shadow: 0px 0px 0px #121212;
      transform: translateY(4px);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

   
    }

    &.white {
      background: ${(props) => props.theme.colors.white};
      color: ${(props) => props.theme.colors.black};
      svg {
        width: 18px;
        height: 18px;
        stroke: ${(props) => props.theme.colors.black};
        display: flex;
        align-content: center;
      }
    }
  }
`;

export const StyledSummaryTab = styled.div`
   {
    margin: 15px 10px;
  }
`;
