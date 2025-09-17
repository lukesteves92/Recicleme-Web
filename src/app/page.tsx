export default function HomePage() {
  return (
    <div className="grid gap-6">
      <section className="card">
        <h1 className="text-3xl font-semibold mb-2">ReUse! – descarte correto, cidade mais limpa</h1>
        <p className="text-white/80">
          Agende coletas residenciais de recicláveis, encontre pontos de coleta próximos
          e acompanhe o status em tempo real.
        </p>
        <div className="mt-4 flex gap-3">
          <a className="btn" href="/auth/sign-up">Criar conta</a>
          <a className="link" href="/points">Ver pontos de coleta</a>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-4">
        {[
          ["Como funciona", "Solicite coleta em poucos cliques e receba confirmação."],
          ["Materiais aceitos", "Plástico, vidro, papel, metal, eletrônicos e orgânico."],
          ["Transparência", "Acompanhe o andamento: solicitada → agendada → concluída."]
        ].map(([title, desc]) => (
          <div key={title} className="card">
            <h3 className="text-xl font-semibold mb-1">{title}</h3>
            <p className="text-white/80">{desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
