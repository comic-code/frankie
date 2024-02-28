import styled from "styled-components";

export const FinancesWrapper = styled.section`
  border: 2px solid var(--green);
  border-radius: 0.5rem;
  animation: forwardLeft 0.25s ease 0s 1 normal forwards;
  
  .header {
    display: flex;
    padding: 1rem;
    background-color: var(--green);
    border-top-right-radius: 0.2rem;
    border-top-left-radius: 0.2rem;

    input {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      height: 30px;
      border: 2px solid var(--orange-alt);
      font-size: 1.2rem;
    }

    button {
      height: 50px;
      background-color: var(--orange-alt);
      padding: 0.5rem;
      border-top-right-radius: 0.5rem;
      border-bottom-right-radius: 0.5rem;
      width: 5rem;
      font-size: 2rem;
    }
  }

  div.invoices {
    padding: 1rem;
    color: #fff;
    background-color: #0003;

    p {
      text-align: center;
    }

    article {
      display: flex;
      align-items: center;
      animation: forwardLeft 0.25s ease 0s 1 normal forwards;

      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }

      button {
        width: 2.5rem;
        margin-right: 0.5rem;
        color: var(--orange);
        font-size: 1.5rem;
      }

      label {
        font-weight: bold;
        font-size: 1.1rem;
      }

      span {
        margin-left: auto;
      }

      input {
        margin-left: 0.5rem;
        width: 4rem;
        border: 2px solid var(--orange);
        text-align: right;
      }
    }
  }

  footer {
    padding: 1rem;
    background-color: var(--green);

    div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      &:not(:last-child) {
        margin-bottom: 0.5rem;
      }

      label {
        font-weight: bold;
        color: #fff;
      }

      span {
        color: var(--orange);
        background-color: var(--green-alt);
        padding: 0.5rem;
        border-radius: 0.5rem;
        width: 5rem;
        text-align: right;

        &.remains {
          color: #fff;
        }
      }
  
      input {
        width: 5rem;
        padding: 0 0.5rem;
        height: 37px;
        text-align: right;
        font-size: 1rem;
      }
    }

  }
`