import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";
import { GameSearchWrapper, SearchResult } from "./styled";
import { saveNewGame, searchGame } from "../../services/frankieNotion";
import moment from "moment";
import SelectStatus from "../SelectStatus";
import ListHeader from "../ListHeader";

export default function Games({}) {
  const { games, setGames, handleGetGames, selectedStatus, setLoadingArea } = useContext(GlobalContext);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);

  function handleSearchGame() {
    if(search) {
      setLoadingArea('search');
      searchGame(search).then(result => {
        setSearchResult(result);
        setShowSearchResult(true);
        setLoadingArea(null);
      })
    }
  }

  function handleAddGame(game) {
    const haveGame = games.some(el => el.name === game.name);
    if(haveGame) {
      alert('Jogo já existe na lista.');
    } else {
      saveNewGame(game).then(() => {
        handleGetGames();
        setShowSearchResult(false);
        setSearch("");
      });
    }
  }

  useEffect(() => {
    handleGetGames();
  }, []);


  return (
    <>
      <ListHeader 
        labels={{title: 'Jogos', button: 'Novo Jogo', placeholder: 'Procurar Novo Jogo'}}
        showSearchInput={showSearchInput} setShowSearchInput={setShowSearchInput} 
        setShowSearchResult={setShowSearchResult} 
        handleSearch={handleSearchGame}
        search={search} setSearch={setSearch}
        showSearchResult={showSearchResult} searchResult={searchResult}
        handleAddItem={handleAddGame}
      />
      <List 
        color="orange-alt"
        items={
          selectedStatus === 'all' ? games
          : selectedStatus === 'to-do' ? games.filter(item => !item.done)
          : games.filter(item => item.done)} 
        setItems={setGames}
      />
    </>
  )
}