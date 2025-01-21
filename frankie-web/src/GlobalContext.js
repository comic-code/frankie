import { createContext, useEffect, useState } from "react";
import { getGames, getBooks } from "./services/frankieNotion";

export const GlobalContext = createContext({});

export default function GlobalProvider({ children }) {
  const [currentSession, setCurrentSession] = useState("finances");
  const [games, setGames] = useState([]);
  const [books, setBooks] = useState([]);
  const [loadingArea, setLoadingArea] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");

  async function handleGetGames() {
    getGames().then(response => setGames(response));
  }

  async function handleGetBooks() {
    getBooks().then(response => setBooks(response));
  }

  useEffect(() => {
    handleGetGames();
    handleGetBooks();
  }, []);

  return (
    <GlobalContext.Provider value={{
      currentSession, setCurrentSession,
      games, setGames, handleGetGames,
      books, setBooks, handleGetBooks,
      selectedStatus, setSelectedStatus,
      loadingArea, setLoadingArea
    }}>
      {children}
    </GlobalContext.Provider>
  )
}