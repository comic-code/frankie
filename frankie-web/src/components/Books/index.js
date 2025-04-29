import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";
import moment from "moment";
import SelectStatus from "../SelectStatus";
import BooksHeader from "./components/BooksHeader";
import { patchBook } from "../../services/frankieNotion";

export default function Books({}) {
  const { selectedStatus, setLoadingArea, books, setBooks, handleGetBooks } = useContext(GlobalContext);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [loading, setLoading] = useState(null);
  const [gameTooltip, setGameToolTip] = useState(null);
  const [selectSearchedGame, setSelectedSearchedGame] = useState(null);

  function handleEditBook(item, setItem) {
    setLoadingArea('edit');
    patchBook(item).then(() => {
      handleGetBooks();
      setLoadingArea(null);
      setItem(null);
    }).catch(err => {
      alert('Falha ao atualizar livro!');
      setLoadingArea(null);
      console.error(err);
    }); 
  }

  useEffect(() => {
    handleGetBooks();
  }, []);


  return (
    <>
      <BooksHeader />
      <List 
        items={
          selectedStatus === 'all' ? books
          : selectedStatus === 'to-do' ? books.filter(item => !item.done)
          : books.filter(item => item.done)} 
        setItems={setBooks}
        handleSaveItem={handleEditBook}
      />
    </>
  )
}