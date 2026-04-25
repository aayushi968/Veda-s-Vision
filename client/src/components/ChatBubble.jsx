function renderLine(line, idx) {
  // Bold: **text**
  const parts = line.split(/\*\*(.+?)\*\*/g);
  const rendered = parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  );
  return <span key={idx}>{rendered}</span>;
}

function ChatBubble({ message, role }) {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  const lines = String(message || '').split('\n').filter((l) => l.trim() !== '');

  const content = lines.map((line, idx) => {
    const bulletMatch = line.match(/^[-•*]\s+(.+)/);
    const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);

    if (bulletMatch) {
      return (
        <li key={idx} className="flex items-start gap-2">
          <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${isUser ? 'bg-white/70' : 'bg-herbal'}`} />
          <span>{renderLine(bulletMatch[1], idx)}</span>
        </li>
      );
    }

    if (numberedMatch) {
      return (
        <li key={idx} className="flex items-start gap-2.5">
          <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${isUser ? 'bg-white/20 text-white' : 'bg-herbal/15 text-herbal'}`}>
            {numberedMatch[1]}
          </span>
          <span>{renderLine(numberedMatch[2], idx)}</span>
        </li>
      );
    }

    return <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>{renderLine(line, idx)}</p>;
  });

  const hasList = lines.some((l) => /^[-•*\d]\s/.test(l.trim()));

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm
        ${isUser ? 'bg-charcoal text-white' : isSystem ? 'border border-neem/20 bg-ivory text-slate-600 italic' : 'bg-white text-charcoal'}`}>
        {hasList
          ? <ul className="space-y-1.5">{content}</ul>
          : <div className="space-y-1">{content}</div>}
      </div>
    </div>
  );
}

export default ChatBubble;
