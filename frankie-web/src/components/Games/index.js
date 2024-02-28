import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";

export default function Games({}) {
  const { games, setGames } = useContext(GlobalContext);

  useEffect(() => {
    console.log(games);
  }, [])

  return (
    <>
      <List items={games} setItems={setGames}/>
    </>
  )
}