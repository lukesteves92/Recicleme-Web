"use client";

import { useState } from "react";
import AssistantChat from "./AssistantChat";
import Link from "next/link";

export default function AssistantLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* botão flutuante */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 btn btn-primary shadow-xl"
        aria-label="Abrir assistente"
      >
        Assistente
      </button>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute bottom-0 right-0 left-0 md:left-auto md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-6 md:w-[560px]">
            <div className="card">
              <div className="card-body">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Assistente ReUse</div>
                  <div className="flex items-center gap-2">
                    <Link href="/assistente" className="text-sm text-zinc-400 hover:text-white">
                      Abrir página
                    </Link>
                    <button className="text-sm text-zinc-400 hover:text-white" onClick={() => setOpen(false)}>
                      Fechar
                    </button>
                  </div>
                </div>
                <AssistantChat />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
