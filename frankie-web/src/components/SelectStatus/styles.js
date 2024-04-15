import styled from "styled-components";

export const SelectStatusWrapper = styled.div`
  display: flex;

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid var(--background);
    background-color: var(--white);
    font-weight: bold;
    cursor: pointer;
    /* width: 37px;
    height: 37px; */
    
    img {
      width: 37px;
      height: 37px;
    }

    &.all {
      padding: 0 0.5rem;
    }

    &.active {
      background-color: var(--orange);
      color: var(--white);
      transition: 0.2s;

      &:hover {
        filter: brightness(1);
      }
    }

    &:last-child {
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
    }

    &:first-child {
      border-top-left-radius: 0.5rem;
      border-bottom-left-radius: 0.5rem;
    }

    &:hover {
      filter: brightness(1.5);
    }

  }

`