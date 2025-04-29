import { useContext, useState } from "react";

import { GlobalContext } from "../../../GlobalContext";
import { ListHeaderWrapper } from "../../ListHeader/styles";
import moment from "moment";
import SelectStatus from "../../SelectStatus";
import { saveNewBook } from "../../../services/frankieNotion";

export default function BooksHeader({ }) {
  const { selectedStatus, setSelectedStatus, loadingArea, books, handleGetBooks } = useContext(GlobalContext);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverURL, setCoverURL] = useState("");

  function handleAddBook() {
    const haveBook = books.some(el => el.name === title);
    if(haveBook) {
      alert('Livro já existe na lista.');
    } else if(!title || !author || !coverURL) {
      alert('Preencha os dados!');
    } else {
      const book = {
        name: title,
        coverURL: coverURL,
        author
      }
      saveNewBook(book).then(() => {
        setTitle("");
        setAuthor("");
        setCoverURL("");
        handleGetBooks();
      });
    }
  }

  return (
    <ListHeaderWrapper background="var(--green2)">
      <h1>Livros</h1>
      {showForm 
        ? <div className="row"> 
            <button className="cancelSearch" onClick={() => {setShowForm(false)}}>&lt;</button>
              <input 
                className="bookTitle" 
                autoFocus
                type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder='Título'
              />
              <input type="text"value={coverURL} onChange={e => setCoverURL(e.target.value)} placeholder='URL da capa' />
              <input type="text" className="bookAuthor" value={author} onChange={e => setAuthor(e.target.value)} placeholder='Autor' />
              <button className="new" onClick={handleAddBook} disabled={loadingArea === 'add'}>Adicionar</button>
          </div>
      
        : <div className="row">
            <SelectStatus selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus} />
            <button className="new" onClick={() => setShowForm(true)}>
              Novo Livro
            </button>
          </div>
              }
    </ListHeaderWrapper>
  )
}