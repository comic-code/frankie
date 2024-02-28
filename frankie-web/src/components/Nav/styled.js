import styled from "styled-components";

export const NavWrapper = styled.nav`
  display: flex;
  padding: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  position: absolute;
  width: 5rem;
  background: var(--white);
  border-bottom-right-radius: 1rem;
  border-top-right-radius: 1rem;
  border: 2px solid var(--orange-alt);
  border-left: 0;
  -webkit-box-shadow: -1px 10px 7px -7px rgba(0,0,0,0.75);
  -moz-box-shadow: -1px 10px 7px -7px rgba(0,0,0,0.75);
  box-shadow: -1px 10px 7px -7px rgba(0,0,0,0.75);

  div {
    display: flex;
    flex-direction: column;
    flex: 1;

    button {
      border-left: 2px solid var(--orange-alt);
      width: 100%;
      font-size: 2rem;
      filter: drop-shadow(1px 1px 1px #000000);

      &:hover {
        filter: brightness(1.1);
      }

      &:not(:last-child) {
        margin-bottom: 0.5rem;
      } 
    }
  }
`