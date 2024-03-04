import styled from "styled-components";

export const GameSearchWrapper = styled.section`
  background-color: var(--orange-alt);
  width: 40rem;
  padding: 1rem;
  border: 2px  solid var(--orange-alt);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  animation: forwardLeft 0.25s ease 0s 1 normal forwards;

  h1 {
    color: #fff;
    border-left: 2px solid var(--orange);
    padding-left: 0.3rem;
    margin-bottom: 0.5rem;
  }

  > div.row {
    display: flex;
    animation: fade 0.25s ease 0s 1 normal forwards;

    input {
      margin-left: auto;  
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border: 2px solid var(--background);
      border-right: 0;
    }
  }
  button {
    background-color: var(--green);
    padding: 0.5rem;
    border-radius: 0.5rem;
    border: 2px solid var(--background);

    &.cancelSearch {
      background-color: var(--pink);
    }

    &.new {
      margin-left: auto;
      animation: fade 0.5s ease 0s 1 normal forwards;
    }

    &.search {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
`