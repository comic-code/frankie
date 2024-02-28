import { useState } from "react";
import moment from "moment";

import TodoCheckBox from "../utils/TodoCheckbox";
import { ListWrapper } from "./styles";

export default function List({items, setItems}) {
  const [itemEditing, setItemEditing] = useState(null);

  const ratings = [
    "Sem Nota", "5.0 / 5.0 ⭐️", "4.5 / 5.0 ⭐️", "4.0 / 5.0 ⭐️", "3.5 / 5.0 ⭐️", "3.0 / 5.0 ⭐️", "2.5 / 5.0 ⭐️", "2.0 / 5.0 ⭐️", "1.5 / 5.0 ⭐️", "1.0 / 5.0 ⭐️", "0.5 / 5.0 ⭐️", "0.0 / 5.0 ⭐️"
  ]

  function handleSetItems(item, changes) {
    setItems(old => {
      let newItems = [...old]
      const index = newItems.findIndex(element => element.id === item.id);
      newItems[index].done = changes.done === undefined ? newItems[index].done : changes.done;
      newItems[index].rating = changes.rating === undefined ? newItems[index].rating : changes.rating;
      
      if(itemEditing) {
        const lastItemEditingIndex = newItems.findIndex(element => element.id === itemEditing.id);
        newItems[lastItemEditingIndex] = itemEditing
      }
      return newItems
    });
  }

  console.log(itemEditing)

  return (
    <ListWrapper>
      {items.map(item => {
        return (
          <li key={item.id}>
            <img src={item.poster} alt='poster'/>
            <div className="content">
              <TodoCheckBox label={item.name} checked={item.done} setChecked={(newValue) => {
                setItemEditing(item)
                handleSetItems(item, {done: newValue})}
              }/>
              <div className="row">
                {item.done &&
                  <div className="leftInfos">
                    {item.doneDate &&
                      <span className="date">{moment(item.doneDate).format("DD/MM/YYYY")}</span> 
                    }
                    <select value={item.rating} onChange={(e) => handleSetItems(item, {rating: e.target.value})}>
                      {ratings.map((rating, index) => 
                        <option key={index}>{rating}</option>  
                      )}
                    </select>
                  </div>
                }
                {itemEditing?.id === item.id && 
                  <div className="editing">
                    <button>Cancelar</button>
                    <button>Salvar</button>
                  </div>
                }
              </div>
            </div>
          </li>
        )
      })}
    </ListWrapper>
  )
}