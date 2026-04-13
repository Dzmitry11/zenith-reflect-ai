import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { RiskNotice } from '@/components/RiskNotice';
import { createAssistantReply, summarizeSession } from '@/services/response-engine';
import { classifyRiskLevel } from '@/services/risk-classifier';
import { STARTER_CHIPS } from '@/types';
import type { SessionMode, RiskLevel } from '@/types';
import { Send, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Route = createFileRoute('/app/chat/$sessionId')({
  component: ChatSessionPage,
});

/* ── Typing animation hook ── */
function useTypingEffect(text: string, speed = 18) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(id);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return { displayed, done };
}

/* ── Single message bubble ── */
function MessageBubble({ msg, isLatestAssistant }: { msg: any; isLatestAssistant: boolean }) {
  const isUser = msg.role === 'user';
  const { displayed, done } = useTypingEffect(
    isLatestAssistant ? msg.content : msg.content,
    isLatestAssistant ? 18 : 0,
  );

  const text = isLatestAssistant && !done ? displayed : msg.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] as const }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-card/60 backdrop-blur-md border border-border/50 text-foreground rounded-bl-md'
        }`}
      >
        {text}
        {isLatestAssistant && !done && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
            className="inline-block w-[2px] h-[1em] bg-foreground/60 ml-0.5 align-text-bottom"
          />
        )}
      </div>
    </motion.div>
  );
}

/* ── Typing indicator dots ── */
function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.25 }}
      className="flex justify-start"
    >
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-muted-foreground/50"
              animate={{ y: [0, -6, 0] }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ChatSessionPage() {
  const { sessionId } = Route.useParams();
  const { user } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('green');
  const [latestAssistantId, setLatestAssistantId] = useState<string | null>(null);
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
    setInput('');

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
    if (savedAssistant) {
      setLatestAssistantId(savedAssistant.id);
      setMessages((prev) => [...prev, savedAssistant]);
    }

    await supabase.from('sessions').update({ risk_level: risk }).eq('id', sessionId);

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
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 space-y-4"
            >
              <p className="text-muted-foreground text-sm">Start with what feels most present.</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {STARTER_CHIPS.slice(0, 4).map((chip, i) => (
                  <motion.button
                    key={chip}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    onClick={() => sendMessage(chip)}
                    className="px-3 py-2 rounded-xl text-xs bg-card border border-border text-foreground hover:border-primary/30 transition-all"
                  >
                    {chip}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            isLatestAssistant={msg.id === latestAssistantId && msg.role === 'assistant'}
          />
        ))}

        <AnimatePresence>
          {sending && <TypingDots />}
        </AnimatePresence>

        {riskLevel !== 'green' && <RiskNotice level={riskLevel} />}

        {session.status === 'completed' && session.summary && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl bg-calm/20 border border-calm/30 p-5 space-y-2"
          >
            <h3 className="text-sm font-medium text-foreground">Session summary</h3>
            <p className="text-sm text-muted-foreground">{session.summary}</p>
          </motion.div>
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