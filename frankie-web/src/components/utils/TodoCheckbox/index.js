import { CheckBlockWrapper } from "./styles";

export default function CheckBlock({checked, setChecked, label}) {
  return (
    <CheckBlockWrapper>
      <input type="checkbox" id={label} checked={checked} onChange={setChecked}/>
      <label htmlFor={label} data-content={label}>{label}</label>
    </CheckBlockWrapper>
  )
}