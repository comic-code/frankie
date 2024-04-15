import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";
import { GameSearchWrapper, SearchResult } from "./styled";
import { saveNewGame, searchGame } from "../../services/frankieNotion";
import moment from "moment";
import SelectStatus from "../SelectStatus";

export default function Games({}) {
  const { games, setGames, handleGetGames, selectedStatus, setSelectedStatus } = useContext(GlobalContext);
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

          : <div className="row">
              <SelectStatus selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
              <button className="new" onClick={() => setShowSearchInput(true)}>
                Novo jogo
              </button>
            </div>
        }
        {gameTooltip &&
          <span className="gameTooltip">{gameTooltip.name}</span>
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
                          onMouseEnter={() => setGameToolTip(game)} onMouseLeave={() => setGameToolTip(null)}
                          onClick={() => setSelectedSearchedGame(game)}  
                        />
                        {selectSearchedGame?.id === game.id &&
                          <div className="game">
                            <h2>{selectSearchedGame.name}</h2>
                            {selectSearchedGame.first_release_date &&
                              <h3>{moment(new Date(selectSearchedGame.first_release_date * 1000).toISOString().substring(0, 10)).format('YYYY')}</h3>
                            }
                            <div className="genres">
                              {selectSearchedGame.genres?.map(genre => 
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
      <List 
        items={
          selectedStatus === 'all' ? games
          : selectedStatus === 'to-do' ? games.filter(item => !item.done)
          : games.filter(item => item.done)} 
        setItems={setGames}
      />
    </>
  )
}