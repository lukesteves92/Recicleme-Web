import AssistantChat from "@/components/AssistantChat";

export default function AssistentePage() {
  return (
    <div className="grid gap-6">
      <div className="card card-body">
        <h1 className="text-2xl font-semibold">Converse com o Assistente</h1>
        <p className="text-zinc-400">
          Peça ações (“pausar minhas ofertas”) ou tire dúvidas (“como cadastrar item?”).
        </p>
      </div>
      <AssistantChat />
    </div>
  );
}
