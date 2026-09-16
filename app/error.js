"use client";

// Rede de proteção: no app antigo, um erro no backend derrubava o processo
// inteiro (o GET /list matava o server). Aqui o erro fica isolado na página.
export default function Error({ error, reset }) {
  return (
    <div className="mx-auto mt-24 w-[40rem] max-w-full rounded-lg border-2 border-orange bg-bg-alt p-6">
      <h1 className="text-xl font-bold text-orange">Deu ruim ao falar com o Notion</h1>
      <p className="mt-2 text-sm break-words text-fg/70">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded-lg border-2 border-bg bg-orange px-3 py-2 font-bold text-white transition hover:brightness-110"
      >
        Tentar de novo
      </button>
    </div>
  );
}
