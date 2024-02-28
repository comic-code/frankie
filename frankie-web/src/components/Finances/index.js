import { useEffect, useState } from "react";
import { FinancesWrapper } from "./styled";

export default function Finances({}) {
  const [income, setIncome] = useState(2000);
  const [newInvoice, setNewInvoice] = useState("");
  const [total, setTotal] = useState(0);
  const [remains, setRemains] = useState(0);
  const [invoices, setInvoices] = useState([]);

  function handleAddInvoice() {
    newInvoice && setInvoices(invoices => [...invoices, {label: newInvoice, value: 0}]);
    setNewInvoice("");
  }

  function handleRemoveInvoice(invoiceIndex) {
    let invoicesArray = [...invoices];
    invoicesArray.splice(invoiceIndex, 1);
    setInvoices(invoicesArray);

    !invoicesArray.length && window.localStorage.setItem('invoices', []);
  }

  function handleChangeInvoiceValue(invoiceIndex, value) {
    let invoicesArray = [...invoices];
    if(!isNaN(value) && value >= 0) {
      invoicesArray[invoiceIndex].value = Number(value);
      setInvoices(invoicesArray);
    }
  }

  function handleChangeIncome(value) {
    if(!isNaN(value) && value >= 0) {
      setIncome(Number(value));
    }
  }

  function handleCalculateTotal() {
    let total = 0;
    invoices.forEach(invoice => {
      total += invoice.value;
    })
    setTotal(Number(total));
  }

  useEffect(() => {
    handleCalculateTotal();
    invoices.length && window.localStorage.setItem('invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    setRemains(Number(income - total));
  }, [total, income]);

  useEffect(() => {
    const invoices = window.localStorage.getItem('invoices');
    invoices && setInvoices(JSON.parse(invoices));
    
  }, []);
  return (
    <FinancesWrapper>
      <div className="header">
        <input 
          type="text" placeholder="Nova Despesa" 
          value={newInvoice} onChange={e => setNewInvoice(e.target.value)} 
          onKeyDown={e => e.key === "Enter" && handleAddInvoice()}
        />
        <button onClick={handleAddInvoice}>+</button>
      </div>
      <div className="invoices">
        {invoices.length 
          ? invoices.map((invoice, invoiceIndex) =>
            <article key={invoiceIndex}>
              <button onClick={() => handleRemoveInvoice(invoiceIndex)}>-</button>
              <label>{invoice.label}:</label>
              <span>
                R$
                <input 
                  type="text" 
                  value={invoice.value?.toFixed(2)} onChange={e => handleChangeInvoiceValue(invoiceIndex, e.target.value)}
                />
              </span>
            </article>)
          : <p>Sem Despesas :)</p>
        }
      </div>
      <footer>
        {invoices.length > 0 &&
          <div>
            <label>Despesas Totais:</label>
            <span>{total.toFixed(2)}</span>
          </div>
        }
        <div>
          <label>Salário:</label>
          <input type="text" onChange={e => handleChangeIncome(e.target.value)} value={income.toFixed(2)} />
        </div>
        <div>
          <label>Restante:</label>
          <span className="remains">{remains.toFixed(2)}</span>
        </div>
      </footer>
    </FinancesWrapper>
  )
}