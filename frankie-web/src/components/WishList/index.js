import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../GlobalContext";
import List from "../List";
import { GameSearchWrapper, SearchResult, WishListHeader, WishListItem } from "./styles";
import { getList, saveNewGame, saveWishListItem, searchGame } from "../../services/frankieNotion";
import moment from "moment";
import SelectStatus from "../SelectStatus";
import ListHeader from "../ListHeader";
import { ListWrapper } from "../List/styles";
import WishListForm from "./WishListForm";

export default function WhishList({}) {
  const { selectedStatus, setLoadingArea } = useContext(GlobalContext);
  const [items, setItems] = useState([]);
  const [showWishForm, setShowWishForm] = useState(false);

  function handleAddItem(priority, label, averageValue) {
    if(priority === 'Prioridade' || !label) {
      return 
    } else {
      setLoadingArea('add');
      saveWishListItem({label, priority, averageValue}).then(response => {
        setLoadingArea(null);
        console.log(response);
        setItems(old => [{label, priority, averageValue}, ...old])
      })
    }
  }

  useEffect(() => {
    getList().then(list => { setItems(list); });
  }, []);

  return (
    <>
      <WishListForm labels={{title: 'Lista de compras', button: 'Adicionar Novo Item'}} setShowForm={setShowWishForm} showForm={showWishForm} handleAddItem={handleAddItem} />
      <ListWrapper>
        <WishListHeader>
          <div className="listItemLabel">Label</div>
          <div className="listItemPriority">Prioridade</div>
          <div className="listItemValue">Valor ~</div>
        </WishListHeader>
        {items.map((item, index) => (
          <WishListItem key={index}>
            <div className="listItemLabel">
              {item.label}
            </div>
            <div className="listItemPriority">
              {item.priority}
            </div>
            <div className="listItemValue">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.averageValue)}
            </div>
          </WishListItem>
        ))}
      </ListWrapper>
    </>
  )
}