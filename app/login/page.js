import { loginAction } from "./actions";

export const metadata = { title: "Entrar" };

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const erro = params?.erro === "1";
  const next = typeof params?.next === "string" ? params.next : "";

  return (
    <div className="mx-auto mt-24 w-[24rem] max-w-full">
      <form
        action={loginAction}
        className="anim-forward-left rounded-lg border-2 border-orange-alt bg-bg-alt p-6"
      >
        <h1 className="border-l-2 border-orange-alt pl-2 text-2xl font-bold text-orange-alt">
          Frankie
        </h1>
        <p className="mt-2 text-sm text-fg/60">
          Senha pra entrar. O login fica salvo por 180 dias neste dispositivo.
        </p>

        <input type="hidden" name="next" value={next} />
        <input
          name="password"
          type="password"
          autoFocus
          required
          autoComplete="current-password"
          aria-label="Senha"
          className="mt-4 w-full rounded-lg border-2 border-bg bg-fg px-3 py-2 font-mono text-bg"
        />

        {erro ? <p className="mt-2 text-sm font-bold text-orange">Senha errada.</p> : null}

        <button
          type="submit"
          className="mt-4 w-full rounded-lg border-2 border-bg bg-green px-3 py-2 font-bold text-white transition hover:brightness-110"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
