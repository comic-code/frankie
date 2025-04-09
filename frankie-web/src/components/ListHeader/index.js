import { useContext, useState } from "react";

import { GlobalContext } from "../../GlobalContext";
import { ListHeaderWrapper, SearchResult } from "./styles";
import SelectStatus from "../SelectStatus";
import moment from "moment";

export default function ListHeader({labels, showSearchInput, setShowSearchInput, setShowSearchResult, handleSearch, search, setSearch, showSearchResult, searchResult, handleAddItem}) {
  const { selectedStatus, setSelectedStatus, loadingArea } = useContext(GlobalContext);
  const [gameTooltip, setGameToolTip] = useState(null);
  const [selectSearchedGame, setSelectedSearchedGame] = useState(null);

  return (
    <ListHeaderWrapper>
        <h1>{labels.title}</h1>
        {showSearchInput 
          ? <div className="row"> 
              <button className="cancelSearch" onClick={() => {setShowSearchInput(false); setShowSearchResult(false)}}>&lt;</button>
              <input 
                autoFocus
                type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder={labels.placeholder}
                onKeyDown={e => e.key === "Enter" && handleSearch()} 
              />
              <button className="search" onClick={handleSearch} disabled={loadingArea === 'search'}>Buscar</button>
            </div>

          : <div className="row">
              <SelectStatus selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
              {labels.button &&
                <button className="new" onClick={() => setShowSearchInput(true)}>
                  {labels.button}
                </button>
              }
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
                            <button onClick={() => handleAddItem(game)} disabled={loadingArea === 'save'}>Adicionar</button>
                          </div>
                        }
                      </li>
                    )
                  })}
                </ul>
            }
          </SearchResult>
        }
      </ListHeaderWrapper>
  )
}