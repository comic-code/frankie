"use client";

// Um select que envia o próprio formulário ao mudar. São 4 linhas de JS no
// lugar de um botão "salvar" repetido em cada linha da lista — e o resto da
// interface continua funcionando sem JavaScript (formulários nativos).
export default function AutoSubmitSelect({ name, defaultValue, className, children }) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      onChange={(event) => event.currentTarget.form?.requestSubmit()}
      className={className}
    >
      {children}
    </select>
  );
}
