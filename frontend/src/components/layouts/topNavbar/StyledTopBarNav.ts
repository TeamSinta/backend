import styled from "styled-components";
import TextIconBtn from "../../common/textIconBtn/TextIconBtn";
import SearchInput from "components/common/form/serchInput/SearchInput";

export const StyledTextIconBtn = styled(TextIconBtn)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 9px 173px;
  gap: 10px;
  width: 216px;
  height: 40px;
`;

export const StyledSearchInput = styled(SearchInput)`
  position: absolute;
  left: 0%;
  right: 51.42%;
  top: 0%;
  bottom: 0%;
  width: 216px;
`;

export const TopNavBarWrapper = styled.div`
  // add any additional styling you need for the wrapper component
  display: flex;
  padding: 10px;
  border-radius: 5px;
  border: none;
  position: absolute;
  width: 1200px;
  left: 210px;
  top: 30px;
  justify-content: space-between;
`;
