import { toggleAchievementsAction, toggleDoneAction } from "@/app/actions";

const Hidden = ({ section, ano, id }) => (
  <>
    <input type="hidden" name="section" value={section} />
    <input type="hidden" name="ano" value={ano} />
    <input type="hidden" name="id" value={id} />
  </>
);

// Só os dois interruptores ficam fora do modo de edição: são ações de um clique,
// reversíveis, e as mais frequentes (marcar zerado quando termina).
/** Zerado / lido: clicar marca, clicar de novo desmarca (a data é automática) */
export function DoneToggle({ section, ano, id, done, date, label }) {
  return (
    <form action={toggleDoneAction}>
      <Hidden section={section} ano={ano} id={id} />
      <input type="hidden" name="done" value={done ? "false" : "true"} />
      <button
        type="submit"
        title={done ? `desmarcar ${label}` : `marcar como ${label}`}
        className={`rounded-full border px-2 py-0.5 transition ${
          done
            ? "border-green-alt/50 text-green-alt hover:brightness-125"
            : "border-fg/20 text-fg/40 hover:text-fg"
        }`}
      >
        {done ? "✔" : "○"} {label}
        {done && date ? ` ${date}` : ""}
      </button>
    </form>
  );
}

/** 100% / platinado (só jogos) */
export function AchievementsToggle({ ano, id, done }) {
  return (
    <form action={toggleAchievementsAction}>
      <input type="hidden" name="ano" value={ano} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="next" value={done ? "false" : "true"} />
      <button
        type="submit"
        title={done ? "tirar o 100%" : "marcar 100% / platinado"}
        className={`px-1 transition ${done ? "" : "opacity-25 hover:opacity-70"}`}
      >
        🏆
      </button>
    </form>
  );
}
