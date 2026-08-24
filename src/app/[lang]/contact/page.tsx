"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, MessageSquare, Send, CheckCircle2, Bug, Code2 } from "lucide-react";
import { toast } from "sonner";
import { siteConfig, SupportedLanguage } from "@/config/site";
import { JsonLd } from "@/components/shared/JsonLd";

interface ContactPageProps {
  params: {
    lang: string;
  };
}

export default function ContactPage({ params }: ContactPageProps) {
  const lang = (params?.lang === "pt" ? "pt" : "en") as SupportedLanguage;
  const isPt = lang === "pt";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("feature_request");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast.error(isPt ? "Por favor, preencha todos os campos." : "Please fill out all fields.");
      return;
    }

    setSubmitted(true);
    toast.success(
      isPt
        ? "Mensagem enviada com sucesso! Responderemos em breve."
        : "Message sent successfully! We will get back to you shortly."
    );
  };

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: isPt ? "Início" : "Home", item: `${siteConfig.url}/${lang}` },
          { name: isPt ? "Contato" : "Contact", item: `${siteConfig.url}/${lang}/contact` },
        ]}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center sm:text-left border-b border-border pb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            <Mail className="h-4 w-4" />
            <span>{isPt ? "Canais de Atendimento" : "Support & Inquiries"}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            {isPt ? "Fale com a Equipe lafitelimadev.tools" : "Get in Touch with lafitelimadev.tools"}
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            {isPt
              ? "Tem sugestões de novas ferramentas, encontrou um bug ou precisa de suporte comercial? Estamos sempre à disposição."
              : "Have a feature request, bug report, or business inquiry? We'd love to hear from you."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {isPt ? "E-mail Direto" : "Direct Email"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isPt
                  ? "Para dúvidas técnicas, solicitações de parcerias e DPO:"
                  : "For technical queries, partnerships, and DPO communications:"}
              </p>
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="font-mono text-xs font-bold text-primary hover:underline block"
              >
                {siteConfig.contactEmail}
              </a>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 space-y-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Bug className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-foreground">
                {isPt ? "Relatar Bug ou Sugerir Ferramenta" : "Bug Reports & Feedback"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isPt
                  ? "Valorizamos a contribuição da comunidade para expandir o catálogo e a precisão técnica das ferramentas."
                  : "Community contributions help us expand our suite and maintain strict mathematical accuracy."}
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                  <h3 className="text-lg font-bold text-foreground">
                    {isPt ? "Mensagem Recebida!" : "Thank You!"}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    {isPt
                      ? "Agradecemos o seu contato. Nossa equipe técnica responderá o mais breve possível."
                      : "We appreciate your message. Our engineering team will review it and reply shortly."}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setName("");
                      setEmail("");
                      setMessage("");
                    }}
                    className="mt-4 inline-flex rounded-lg border border-border bg-muted/40 px-4 py-2 text-xs font-semibold hover:bg-muted"
                  >
                    {isPt ? "Enviar outra mensagem" : "Send another message"}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      {isPt ? "Seu Nome" : "Your Name"}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isPt ? "Ex: Lucas Silva" : "e.g. Alex Morgan"}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      {isPt ? "E-mail de Contato" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="dev@empresa.com"
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      {isPt ? "Assunto" : "Topic"}
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-xs text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="feature_request">{isPt ? "💡 Sugestão de Nova Ferramenta" : "💡 Feature / New Tool Request"}</option>
                      <option value="bug_report">{isPt ? "🐛 Relato de Erro / Bug" : "🐛 Bug Report"}</option>
                      <option value="partnership">{isPt ? "🤝 Parceria ou Publicidade" : "🤝 Business & Advertising Inquiry"}</option>
                      <option value="other">{isPt ? "💬 Outros Assuntos" : "💬 General Inquiry"}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1.5">
                      {isPt ? "Mensagem" : "Message"}
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        isPt
                          ? "Descreva sua dúvida, sugestão ou detalhe do erro com exemplos..."
                          : "Describe your question, request or bug details with reproducibility steps..."
                      }
                      className="w-full rounded-lg border border-border bg-background p-3.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs font-bold text-primary-foreground shadow hover:bg-primary/90 transition-colors"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isPt ? "Enviar Mensagem" : "Submit Message"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
