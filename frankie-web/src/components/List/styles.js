import styled from "styled-components";

export const ListWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: #0003;
  padding: 1rem;
  max-height: 80vh;
  width: 40rem;
  max-width: 90%;
  overflow-y: auto;
  animation: forwardLeft 0.25s ease 0s 1 normal forwards;
  margin-bottom: auto;

  > li {
    list-style: none;
    display: flex;
    margin-bottom: 0.5rem;
    padding: 0.5rem;
    padding-bottom: 1rem;
    color: #fff;
    cursor: pointer;
    transition: 0.2s;
    position: relative;

    &:hover{
      background-color: #343434;
      transition: 0.3s;
    }

    &:not(:last-child) {
      border-bottom: 2px solid var(--orange-alt);
    }

    > img {
      width: 5rem;;
      height: 109px;
      text-align: center;
      border: 2px solid var(--background);
      border-radius: 3px;
    }

    > div.content {
      padding-left: 1rem;
      display: flex;
      flex: 1;
      flex-direction: column;

      div.row {
        display: flex;
        justify-content: space-between;
        height: 100%;
      }

      div.leftInfos {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        span.date {
          color: var(--pink);
          font-weight: bold;
          margin-top: auto;
        }

        select {
          width: 8rem;
        }
      }

      div.editing {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        margin-left: auto;

        button {
          margin-top: auto;
          background-color: var(--green);
          margin-left: 1rem;
          padding: 0.5rem;
          /* color: var(--background); */
          border: 2px solid var(--background);
          border-radius: 0.5rem;
          &:first-child {
            background-color: var(--orange);
          }
        }
      }
    }

    img.doneAchievements {
      position: absolute;
      top: 0;
      right: 0;
      width: 2.5rem;

    }
  }
`