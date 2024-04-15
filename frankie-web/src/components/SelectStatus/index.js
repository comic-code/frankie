import { SelectStatusWrapper } from "./styles";
import TodoIcon from "../../assets/icons/to-do.png";
import DoneIcon from "../../assets/icons/done.png";

export default function SelectStatus({ selectedStatus, setSelectedStatus }) {
  return (
    <SelectStatusWrapper>
      <span className={`all ${selectedStatus === 'all' ? 'active' : ''}`} onClick={() => setSelectedStatus('all')}>
        Todos
      </span>
      <span className={`${selectedStatus === 'to-do' ? 'active' : ''}`} onClick={() => setSelectedStatus('to-do')}>
        <img src={TodoIcon} alt="Não Finalizados"/>
      </span>
      <span className={`${selectedStatus === 'done' ? 'active' : ''}`} onClick={() => setSelectedStatus('done')}>
        <img src={DoneIcon} alt="Finalizados" />
      </span>
    </SelectStatusWrapper>
  )
}