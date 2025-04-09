import { useContext, useState } from "react";
import moment from "moment";

import TodoCheckBox from "../utils/TodoCheckbox";
import AchievementsIcon from "../../assets/icons/achievement.png";
import { ListWrapper } from "./styles";
import { GlobalContext } from "../../GlobalContext";

export default function List({items, setItems, color, handleSaveItem}) {
  const [itemEditing, setItemEditing] = useState(null);
  const { loadingArea } = useContext(GlobalContext);
  const ratings = [
    "Sem Nota", "5.0 / 5.0 ⭐️", "4.5 / 5.0 ⭐️", "4.0 / 5.0 ⭐️", "3.5 / 5.0 ⭐️", "3.0 / 5.0 ⭐️", "2.5 / 5.0 ⭐️", "2.0 / 5.0 ⭐️", "1.5 / 5.0 ⭐️", "1.0 / 5.0 ⭐️", "0.5 / 5.0 ⭐️", "0.0 / 5.0 ⭐️"
  ]

  function handleEditItem(props) {
    setItemEditing(old => {
      if(old) {
        return {
          ...old, 
          done: props.done ? !old.done : old.done,
          rating: props.rating ? props.rating : old.rating
        }
      }
    });
  }

  return (
    <ListWrapper color={color}>
      {items.map(item => {
        return (
          <li key={item.id} onClick={() => itemEditing?.id !== item.id && setItemEditing(item)}>
            <img src={item.poster} alt='poster'/>
            <div className="content">
              <TodoCheckBox
                label={item.name} checked={(itemEditing && itemEditing.id === item.id) ? itemEditing.done : item.done}
                setChecked={() => handleEditItem({done: true})}
              />
              <div className="row">
                {((itemEditing?.id === item.id && itemEditing.done) || item.done) &&
                  <div className="leftInfos">
                    {item.doneDate &&
                      <span className="date">{moment(item.doneDate).format("DD/MM/YYYY")}</span> 
                    }
                      <select value={item.rating} onChange={(e) => handleEditItem({rating: e.target.value})}>
                      {ratings.map((rating, index) => 
                        <option key={index}>{rating}</option>  
                      )}
                    </select>
                  </div>
                }
                {(itemEditing?.id === item.id && itemEditing?.done !== item.done) &&
                  <div className="editing">
                    <button onClick={() => setItemEditing(null)}>Cancelar</button>
                    <button onClick={() => handleSaveItem(itemEditing, setItemEditing)} disabled={loadingArea === 'edit'}>Salvar</button>
                  </div>
                }
                {item.doneAchievements && 
                  <img class="doneAchievements" src={AchievementsIcon} alt="Platinado" />
                } 
              </div>
            </div>
          </li>
        )
      })}
    </ListWrapper>
  )
}