import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";
import moment from "moment";
import SelectStatus from "../SelectStatus";

export default function Books({}) {
  const { selectedStatus, setSelectedStatus, books, setBooks, handleGetBooks } = useContext(GlobalContext);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [loading, setLoading] = useState(null);
  const [gameTooltip, setGameToolTip] = useState(null);
  const [selectSearchedGame, setSelectedSearchedGame] = useState(null);

  function handleSearchBook() {
    if(search) {
      
    }
  }

  function handleAddBook(book) {
    const haveBook = books.some(el => el.name === book.name);
    if(haveBook) {
      alert('O livro já existe na lista.');
    } else {

    }
  }

  useEffect(() => {
    handleGetBooks();
  }, []);


  return (
    <>
      <List 
        items={
          selectedStatus === 'all' ? books
          : selectedStatus === 'to-do' ? books.filter(item => !item.done)
          : books.filter(item => item.done)} 
        setItems={setBooks}
      />
    </>
  )
}