import { createGlobalStyle } from 'styled-components';
 
const GlobalStyle = createGlobalStyle`
  :root {
    --orange: #fb3700;
    --orange-alt: #fb6900;
    --green2: #007E80;
    /* --green3: #004853; */
    --white: #fefefe;
    --pink: #f88f89;
    --yellow: #eec276;
    --yellow-alt:#fbf6d0;
    --green: #00B98D;
    --green-alt:#79c3aa;
    --black-alt: #151515;
    /* --background:#1f0e1a; */
    --background: #282A36;
  }

  *, input {
    padding: 0;
    margin: 0;
    font-family: "Kode Mono", monospace;
  }

  
  body {
    background-color: var(--background);
  }
  
  main.mainContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--background);
  }
  
  select {
    background-color: var(--white);
    border: 2px solid var(--green);
    padding: 0.5rem;
    border-radius: 0.5rem;
  }

  button {
    background: none;
    border: none;
    color: var(--white);
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s;

    &:hover {
      filter: brightness(1.2);
      transition: 0.3s;
    }

    &:disabled {
      background-color: #666;
      cursor: progress;
    }
  }

  input {
    border: none;
    outline: none;
    border-radius: 0.5rem;
    padding: 0.5rem;
  }

  @keyframes forwardLeft {
    0% {
      transform: scaleX(0);
      transform-origin: 0% 0%;
      opacity: 0;
    }

    100% {
      transform: scaleX(1);
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }

  @keyframes forwardTop {
    0% {
      transform: scaleY(0);
      transform-origin: 0% 0%;
      opacity: 0;
    }

    100% {
      transform: scaleY(1);
      transform-origin: 0% 0%;
      opacity: 1;
    }
  }
  
  @keyframes fade {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
`;
 
export default GlobalStyle;