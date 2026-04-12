import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { RiskNotice } from '@/components/RiskNotice';
import { createAssistantReply, summarizeSession } from '@/services/response-engine';
import { classifyRiskLevel } from '@/services/risk-classifier';
import { STARTER_CHIPS } from '@/types';
import type { SessionMode, RiskLevel } from '@/types';
import { Send, ArrowLeft, MoreHorizontal } from 'lucide-react';

export const Route = createFileRoute('/app/chat/$sessionId')({
  component: ChatSessionPage,
});

function ChatSessionPage() {
  const { sessionId } = Route.useParams();
  const { user } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('green');
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [sessionRes, messagesRes] = await Promise.all([
        supabase.from('sessions').select('*').eq('id', sessionId).eq('user_id', user.id).single(),
        supabase.from('messages').select('*').eq('session_id', sessionId).eq('user_id', user.id).order('created_at', { ascending: true }),
      ]);
      if (sessionRes.data) setSession(sessionRes.data);
      if (messagesRes.data) setMessages(messagesRes.data);
    };
    load();
  }, [user, sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!user || !content.trim() || !session) return;
    setSending(true);

    const risk = classifyRiskLevel(content);
    setRiskLevel(risk);

    if (risk !== 'green') {
      await supabase.from('safety_events').insert({
        user_id: user.id,
        session_id: sessionId,
        severity: risk,
        signals: { text: content.substring(0, 200) },
        action_taken: 'displayed_risk_notice',
      });
    }

    const userMsg = { session_id: sessionId, user_id: user.id, role: 'user' as const, content };
    const { data: savedUser } = await supabase.from('messages').insert(userMsg).select().single();
    if (savedUser) setMessages((prev) => [...prev, savedUser]);

    // Generate assistant reply
    const reply = createAssistantReply(session.mode as SessionMode, content, sessionId);
    const assistantMsg = { session_id: sessionId, user_id: user.id, role: 'assistant' as const, content: reply };
    const { data: savedAssistant } = await supabase.from('messages').insert(assistantMsg).select().single();
    if (savedAssistant) setMessages((prev) => [...prev, savedAssistant]);

    await supabase.from('sessions').update({ risk_level: risk }).eq('id', sessionId);

    setInput('');
    setSending(false);
    textareaRef.current?.focus();
  };

  const endSession = async () => {
    if (!user) return;
    const summary = summarizeSession(messages.map((m) => ({ role: m.role, content: m.content })));
    await supabase.from('sessions').update({ status: 'completed', ended_at: new Date().toISOString(), summary }).eq('id', sessionId);
    setSession((prev: any) => prev ? { ...prev, status: 'completed', summary } : prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 160) + 'px';
    }
  };

  if (!session) {
    return <div className="flex items-center justify-center h-full text-muted-foreground text-sm py-20">Loading session...</div>;
  }

  return (
    <div className="flex flex-col h-screen lg:h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <a href="/app/chat" className="p-1.5 rounded-lg hover:bg-accent lg:hidden">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </a>
          <div>
            <h2 className="text-sm font-medium text-foreground">{session.title || 'Session'}</h2>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">{session.mode.replace('_', ' ')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {session.status === 'active' && (
            <Button variant="outline" size="sm" onClick={endSession}>End session</Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-sm">Start with what feels most present.</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {STARTER_CHIPS.slice(0, 4).map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-2 rounded-xl text-xs bg-card border border-border text-foreground hover:border-primary/30 transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card/60 backdrop-blur-md border border-border/50 text-foreground rounded-bl-md'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {sending && (
          <div className="flex justify-start">
            <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {riskLevel !== 'green' && <RiskNotice level={riskLevel} />}

        {session.status === 'completed' && session.summary && (
          <div className="rounded-2xl bg-calm/20 border border-calm/30 p-5 space-y-2">
            <h3 className="text-sm font-medium text-foreground">Session summary</h3>
            <p className="text-sm text-muted-foreground">{session.summary}</p>
          </div>
        )}
      </div>

      {/* Composer */}
      {session.status === 'active' && (
        <div className="border-t border-border/50 px-4 py-3 bg-card/40 backdrop-blur-md">
          <div className="flex items-end gap-2 max-w-2xl mx-auto">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKeyDown}
              placeholder="Share what's on your mind..."
              rows={1}
              className="flex-1 resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim() || sending}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Reflecta is for self-reflection, not therapy or crisis support.
          </p>
        </div>
      )}
    </div>
  );
}
