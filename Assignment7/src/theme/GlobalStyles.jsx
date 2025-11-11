import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    font-family: Arial, sans-serif;
    transition: all 0.3s ease;
  }
`;

export default GlobalStyles;
