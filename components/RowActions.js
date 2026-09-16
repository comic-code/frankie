import {
  setRatingAction,
  setTextAction,
  toggleAchievementsAction,
  toggleDoneAction,
} from "@/app/actions";
import AutoSubmitSelect from "./AutoSubmitSelect";

const Hidden = ({ section, ano, id }) => (
  <>
    <input type="hidden" name="section" value={section} />
    <input type="hidden" name="ano" value={ano} />
    <input type="hidden" name="id" value={id} />
  </>
);

/** Nota: select que salva sozinho ao escolher */
export function RatingForm({ section, ano, id, rating, ratings }) {
  return (
    <form action={setRatingAction}>
      <Hidden section={section} ano={ano} id={id} />
      <AutoSubmitSelect
        name="rating"
        defaultValue={rating ?? ""}
        className="w-16 rounded-full border border-green bg-bg-alt px-2 py-0.5 text-xs text-green"
      >
        <option value="">—</option>
        {ratings.map((value) => (
          // o rótulo aparece curto ("4.5") mas o valor enviado é o nome exato da
          // opção no Notion ("4.5 / 5.0 ⭐️") — senão a API recusa
          <option key={value} value={value}>
            {value.replace(" / 5.0 ⭐️", "")}
          </option>
        ))}
      </AutoSubmitSelect>
    </form>
  );
}

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

/** Notas (jogos) / citação (livros), dentro de um <details> pra não poluir a linha */
export function TextEditor({ section, ano, id, value, label }) {
  return (
    <details className="mt-2">
      <summary className="cursor-pointer text-xs text-fg/40 transition hover:text-fg/70">
        {value ? label : `${label} (vazio)`}
      </summary>
      <form action={setTextAction} className="mt-2 flex flex-col gap-2">
        <Hidden section={section} ano={ano} id={id} />
        <textarea
          name="value"
          defaultValue={value}
          rows={3}
          className="w-full rounded-lg border-2 border-bg bg-black/30 p-2 text-sm text-fg"
        />
        <button
          type="submit"
          className="self-start rounded-lg border-2 border-bg bg-green px-3 py-1 text-xs font-bold text-white transition hover:brightness-110"
        >
          salvar
        </button>
      </form>
    </details>
  );
}
