import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";
import { GameSearchWrapper } from "./styled";
import { searchGame } from "../../services/frankieNotion";

export default function Games({}) {
  const { games, setGames } = useContext(GlobalContext);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShoSearchResult] = useState(false);

  function handleSearchGame() {
    if(search) {
      searchGame(search).then(result => {
        setSearchResult(result);
        setShoSearchResult(true);
        console.log(result);
      })
    }
  }

  return (
    <>
      <GameSearchWrapper>
        <h1>Jogos</h1>
        {showSearchInput 
          ? <div className="row"> 
              <button className="cancelSearch" onClick={() => setShowSearchInput(false)}>&lt;</button>
              <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Procurar Novo Jogo" />
              <button className="search" onClick={handleSearchGame}>Buscar</button>
            </div>
          : <button className="new" onClick={() => setShowSearchInput(true)}>
              Novo jogo
            </button>
        }
        {showSearchResult &&
          <div className="searchResult">
            {searchResult.length < 1 
              ? <span>Sem resultados para a  busca :(</span>
              : <></>
            }
          </div>
        }
      </GameSearchWrapper>
      <List items={games} setItems={setGames}/>
    </>
  )
}