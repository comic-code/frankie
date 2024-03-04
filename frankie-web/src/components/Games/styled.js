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
    border-left: 2px solid var(--background);
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
      background-color: var(--orange);
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

export const SearchResult = styled.div`
    display: flex;
    align-items: center;
    margin-top: 0.5rem;
    overflow-x: auto;
    border-radius: 0.5rem;
    animation: forwardTop 0.25s ease 0s 1 normal forwards;

    > span {
      color: #fff;
    }

    ul {
      display: flex;
      flex: 1;
      position: relative;

      li {
        display: flex;

        img {
          width: 5rem;
          height: 109px;
          text-align: center;
          border: 2px solid var(--background);
          border-radius: 3px;
          margin-left: 0.5rem;

          &.active {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
          }
        }

        span.gameTooltip {
          position: absolute;
          background: var(--background);
          color: #fff;
          display: flex;
          bottom: 0.75rem;
          left: 0.75rem;
          border-radius: 0.5rem;
          border: 2px solid var(--orange);
          padding: 0.2rem;
          z-index: 999;
          animation: fade 0.25s ease 0s 1 normal forwards;

        }

        div.game {
          background-color: var(--background);
          animation: forwardLeft 0.25s ease 0s 1 normal forwards;
          width: 20rem;
          border-top-right-radius: 3px;
          border-bottom-right-radius: 3px;

          h2 {
            font-size: 1rem;
            color: #fff;
            margin: 0.25rem;
          }

          div.genres {
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            padding: 0 0.25rem;

            span {
              font-size: 0.8rem;
              font-weight: bold;
              color: var(--pink);
            }
          }

          button {
            position: absolute;
            right: 0.25rem;
            bottom: 0.25rem;
            border-color: #fff;
          }
        }
      }
    }
`