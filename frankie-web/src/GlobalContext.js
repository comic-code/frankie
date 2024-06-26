import { createContext, useEffect, useState } from "react";
import { getGames } from "./services/frankieNotion";

export const GlobalContext = createContext({});

export default function GlobalProvider({ children }) {
  const [currentSession, setCurrentSession] = useState("finances");
  const [games, setGames] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");

  async function handleGetGames() {
    getGames().then(response => setGames(response));
  }

  useEffect(() => {
    handleGetGames();
  }, []);

  return (
    <GlobalContext.Provider value={{
      currentSession, setCurrentSession,
      games, setGames, handleGetGames,
      selectedStatus, setSelectedStatus
    }}>
      {children}
    </GlobalContext.Provider>
  )
}