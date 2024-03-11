import styled from "styled-components";

export const CheckBlockWrapper = styled.div`
  position: relative;

  input[type="checkbox"] {
    position: relative;
    width: 1.5em;
    height: 1.5em;
    color: black;
    border: 2px solid var(--white);
    border-radius: 4px;
    appearance: none;
    outline: 0;
    cursor: pointer;
    transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 1);
    margin-bottom: -2px;
    &::before {
      position: absolute;
      content: '';
      display: block;
      top: -2px;
      left: 3px;
      width: 8px;
      height: 14px;
      border-style: solid;
      border-color: white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
      opacity: 0;
    }
    &:checked {
      color: white;
      border-color: var(--green);
      background: var(--green);
      &::before {
        opacity: 1;
      }
      ~ label::before {
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      }
    }
  }

  label {
    position: absolute;
    top: -5px;
    cursor: pointer;
    font-size: 1.5em;
    font-weight: 600;
    padding: 0 0.25em 0;
    user-select: none;
    &::before {
      position: absolute;
      content: attr(data-content);
      color: #999;
      display: flex;  
      clip-path: polygon(0 0, 0 0, 0% 100%, 0 100%);
      text-decoration: line-through;
      text-decoration-thickness: 3px;
      text-decoration-color: black;
      transition: clip-path 200ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
  }
`

