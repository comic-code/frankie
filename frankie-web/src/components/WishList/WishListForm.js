import { useContext, useState } from "react";

import { GlobalContext } from "../../GlobalContext";
import SelectStatus from "../SelectStatus";
import moment from "moment";
import { ListHeaderWrapper } from "../ListHeader/styles";
import { saveWishListItem } from "../../services/frankieNotion";

export default function WishListForm({labels, showForm, setShowForm }) {
  const { selectedStatus, setSelectedStatus, loadingArea, setLoadingArea } = useContext(GlobalContext);
  const [label, setLabel] = useState('');
  const [priority, setPriority] = useState('Prioridade');
  const [averageValue, setAverageValue] = useState('');
  const priorities = ['Prioridade', 'Baixa', 'Média', 'Alta'];

  function handleAddItem() {
    if(priority === 'Prioridade' || label) {
      return 
    } else {
      saveWishListItem({label, priority, averageValue}).then(response => {
        console.log(response);
      })
    }
  }

  return (
    <ListHeaderWrapper>
      <h1>{labels.title}</h1>
      {showForm 
        ? <div className="row"> 
            <button className="cancelSearch" onClick={() => {setShowForm(false)}}>&lt;</button>
              <input autoFocus style={{ marginRight: 'auto' }}
                type="text" value={label} onChange={e => setLabel(e.target.value)} placeholder='Descrição'
              />
              <select value={priority} onChange={e => setPriority(e.target.value)}>
                {priorities.map(priority => (
                  <option value={priority} key={priority}>{priority}</option>
                ))}
              </select>
              <input type="text" value={averageValue} onChange={e => setAverageValue(e.target.value)} placeholder='Preço Estimado' style={{ width: 115 }} />
              <button className="new" onClick={handleAddItem} disabled={loadingArea === 'add'}>Adicionar</button>
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