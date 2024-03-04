import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";
import { GameSearchWrapper, SearchResult } from "./styled";
import { saveNewGame, searchGame } from "../../services/frankieNotion";

export default function Games({}) {
  const { games, setGames } = useContext(GlobalContext);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [loading, setLoading] = useState(null);
  const [gameTooltip, setGameToolTip] = useState(null);
  const [selectSearchedGame, setSelectedSearchedGame] = useState(null);

  function handleSearchGame() {
    if(search) {
      setLoading('search');
      searchGame(search).then(result => {
        setSearchResult(result);
        setShowSearchResult(true);
        setLoading(null);
        console.log(result);
      })
    }
  }

  function handleAddGame(game) {
    saveNewGame(game).then(e => console.log(e));
    // name, poster, genres, rating, first_release_date, done
  }

  return (
    <>
      <GameSearchWrapper>
        <h1>Jogos</h1>
        {showSearchInput 
          ? <div className="row"> 
              <button className="cancelSearch" onClick={() => {setShowSearchInput(false); setShowSearchResult(false)}}>&lt;</button>
              <input 
                autoFocus
                type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Procurar Novo Jogo" 
                onKeyDown={e => e.key === "Enter" && handleSearchGame()} 
              />
              <button className="search" onClick={handleSearchGame} disabled={loading === 'search'}>Buscar</button>
            </div>
          : <button className="new" onClick={() => setShowSearchInput(true)}>
              Novo jogo
            </button>
        }
        {showSearchResult &&
          <SearchResult>
            {searchResult.length < 1 
              ? <span>Sem resultados para sua  busca :(</span>
              : <ul>
                  {searchResult.map((game, gameIndex) => {
                    return (
                      <li key={gameIndex}>
                        <img 
                          className={selectSearchedGame?.id === game.id ? 'active' : ''} src={game.poster} alt="poster"
                          onMouseEnter={() => setGameToolTip(gameIndex)} onMouseLeave={() => setGameToolTip(null)}
                          onClick={() => setSelectedSearchedGame(game)}  
                        />
                        {gameTooltip === gameIndex &&
                          <span className="gameTooltip" onMouseEnter={() => setGameToolTip(gameIndex)}>{game.name}</span>
                        }
                        {selectSearchedGame?.id === game.id &&
                          <div className="game">
                            <h2>{selectSearchedGame.name}</h2>
                            <div className="genres">
                              {selectSearchedGame.genres.map(genre => 
                                <span key={genre.id}>{genre.name}</span>  
                              )}
                            </div>
                            <button onClick={() => handleAddGame(game)}>Adicionar</button>
                          </div>
                        }
                      </li>
                    )
                  })}
                </ul>
            }
          </SearchResult>
        }
      </GameSearchWrapper>
      <List items={games} setItems={setGames}/>
    </>
  )
}