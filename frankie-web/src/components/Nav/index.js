import { useContext } from "react";

import { NavWrapper } from "./styled";
import { GlobalContext } from "../../GlobalContext";

export default function Nav() {
  const { setCurrentSession } = useContext(GlobalContext);
  return (
    <NavWrapper>
      <div>
        <button onClick={() => setCurrentSession('finances')}>💰</button>
        <button onClick={() => setCurrentSession('games')}>🎮</button>
        <button onClick={() => setCurrentSession('books')}>📚</button>
        <button onClick={() => setCurrentSession('whishList')}>🛒</button>
      </div>
    </NavWrapper>
  )
}