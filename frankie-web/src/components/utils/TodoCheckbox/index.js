import { CheckBlockWrapper } from "./styles";

export default function CheckBlock({checked, setChecked, label}) {
  return (
    <CheckBlockWrapper>
      <input type="checkbox" id={label} checked={checked} onChange={setChecked}/>
      <label for={label} data-content={label}>{label}</label>
    </CheckBlockWrapper>
  )
}