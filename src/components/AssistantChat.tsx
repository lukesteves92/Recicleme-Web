"use client";

import { useEffect, useRef, useState } from "react";

type Msg =
  | { role: "user" | "assistant"; type: "text"; text: string }
  | { role: "assistant"; type: "points"; points: Array<{ id: string; name: string; address?: string | null; latitude: number; longitude: number; website?: string | null }> };

export default function AssistantChat() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", type: "text", text: "Olá! Posso listar pontos de entrega ou cadastrar um novo." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", type: "text", text }]);
    setLoading(true);
    try {
      const r = await fetch("/api/assistant/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const j = await r.json();

      const reply =
        j?.watson?.output?.generic?.map((g: any) => g.text).filter(Boolean).join(" ") || "";

      if (j?.actionResult?.points?.length) {
        setMessages((m) => [
          ...m,
          ...(reply ? [{ role: "assistant", type: "text", text: reply } as Msg] : []),
          { role: "assistant", type: "points", points: j.actionResult.points } as Msg,
        ]);
      } else if (j?.actionResult?.point) {
        const p = j.actionResult.point;
        setMessages((m) => [
          ...m,
          { role: "assistant", type: "text", text: reply || "Ponto criado com sucesso." },
          {
            role: "assistant",
            type: "points",
            points: [p],
          } as Msg,
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", type: "text", text: reply || "(sem resposta)" },
        ]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", type: "text", text: "Falha ao falar com o assistente." }]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") send();
  }

  return (
    <div className="card">
      <div className="card-body">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-semibold">Assistente ReUse</h1>
          <span className="tag">pontos de entrega</span>
        </div>

        <div ref={listRef} className="h-[420px] overflow-y-auto pr-1 space-y-3">
          {messages.map((m, i) => {
            if (m.type === "text") {
              return (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    m.role === "user"
                      ? "ml-auto bg-orange-600 text-white"
                      : "bg-zinc-800 border border-zinc-700 text-zinc-100"
                  }`}
                >
                  {m.text}
                </div>
              );
            }
            return (
              <div key={i} className="grid gap-3 md:grid-cols-2">
                {m.points.map((p) => (
                  <div key={p.id} className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900">
                    <div className="font-medium text-lg">{p.name}</div>
                    {p.address && <div className="text-zinc-300">{p.address}</div>}
                    <div className="text-sm text-zinc-500">
                      Lat {p.latitude.toFixed(4)} · Lng {p.longitude.toFixed(4)}
                    </div>
                    {p.website && (
                      <a href={p.website} target="_blank" className="link mt-2 inline-block">
                        Website
                      </a>
                    )}
                  </div>
                ))}
              </div>
            );
          })}

          {loading && (
            <div className="inline-flex items-center gap-2 text-zinc-400">
              <span className="size-2 rounded-full bg-zinc-500 animate-bounce" />
              <span className="size-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:120ms]" />
              <span className="size-2 rounded-full bg-zinc-500 animate-bounce [animation-delay:240ms]" />
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <input
            className="input"
            placeholder="Ex.: listar pontos de entrega"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
          />
          <button className="btn btn-primary" onClick={send} disabled={loading}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
