import styled from "styled-components";

export const MoblieMenu = styled.div`
  background-color: aqua;
  position: absolute;
  top: 0;
  right: 0;
  min-height: 100vh;
  width: 60vw;
  display: ${(props) => props.$toggle ? "flex" : "none"};
  flex-direction: column;
  align-items: center;
  padding-top: 8px;
`;
