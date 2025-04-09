import styled from "styled-components";

export const WishListItem = styled.li`
  display: flex;

  div {
    display: flex;
    flex: 1;
  }
  
  div.listItemlabel {
  }
  
  div.listItemPriority {
    max-width: 100px;
    flex: auto;
  }
  
  div.listItemValue {
    max-width: 200px;
    flex: auto;
    justify-content: flex-end;
  }

`

export const WishListHeader = styled(WishListItem)`
  font-weight: bold;
`