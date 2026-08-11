"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  processTerminalCommand,
  getPromptPath,
  getMobilePromptPath,
  getAutocompleteSuggestions,
  getInitialBanner,
  TerminalContext,
} from "@/utils/terminalEngine";
import { Terminal as TerminalIcon, RefreshCw, ShieldCheck } from "lucide-react";
import { APP_VERSION } from "@/utils/version";

interface LogLine {
  id: string;
  context: TerminalContext;
  promptPath: string;
  input?: string;
  output: string;
  timestamp: string;
}

export interface PendingConfirmationPayload {
  promptText: string;
  actionPayload: string;
  targetTitle: string;
  nextContext?: TerminalContext;
}

export default function Terminal() {
  const router = useRouter();
  const [context, setContext] = useState<TerminalContext>("main");
  const [history, setHistory] = useState<LogLine[]>(() => [
    {
      id: "init-banner",
      context: "main",
      promptPath: "osama@control-plane:~$",
      output: getInitialBanner(),
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirmationPayload | null>(null);

  const logsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll logs container on history update
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [history]);

  // Unified Command Execution Handler
  const handleExecute = (cmdToRun: string) => {
    const rawCmd = cmdToRun.trim();
    const timestamp = new Date().toLocaleTimeString();
    const promptPath = getPromptPath(context);

    // Prioritize processing Y/N confirmation if a confirmation is pending
    if (pendingConfirm) {
      const cleanInput = rawCmd.toLowerCase();

      // Confirm (y, Y, yes, YES, or empty Enter)
      if (!rawCmd || cleanInput === "y" || cleanInput === "yes") {
        const payload = pendingConfirm;
        setPendingConfirm(null);

        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            context,
            promptPath,
            input: rawCmd || "Y",
            output: `Opening "${payload.targetTitle}"...`,
            timestamp,
          },
        ]);

        router.push(payload.actionPayload);
        if (payload.nextContext) setContext(payload.nextContext);
        setInputVal("");
        return;
      }

      // Cancel (n, N, no, NO)
      if (cleanInput === "n" || cleanInput === "no" || cleanInput === "cancel") {
        setPendingConfirm(null);

        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            context,
            promptPath,
            input: rawCmd,
            output: "Navigation cancelled. The selected record remains displayed above.",
            timestamp,
          },
        ]);

        setInputVal("");
        return;
      }

      // Unrelated input during pending confirmation
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          context,
          promptPath,
          input: rawCmd,
          output: "Please enter Y to continue or N to remain in the terminal.",
          timestamp,
        },
      ]);

      setInputVal("");
      return;
    }

    if (!rawCmd) return;

    // Add to command history list
    const updatedCmdHistory = [...cmdHistory, rawCmd];
    setCmdHistory(updatedCmdHistory);
    setHistoryIdx(-1);

    // Process command with full history log passed
    const result = processTerminalCommand(rawCmd, context, updatedCmdHistory);

    if (result.action === "clear") {
      setHistory([]);
      if (result.nextContext) setContext(result.nextContext);
      setPendingConfirm(null);
      setInputVal("");
      return;
    }

    if (result.pendingConfirmation) {
      setPendingConfirm(result.pendingConfirmation);
    } else if (result.action === "open_link" && result.actionPayload) {
      router.push(result.actionPayload);
    }

    if (result.nextContext) {
      setContext(result.nextContext);
    }

    setHistory((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        context: result.nextContext || context,
        promptPath,
        input: rawCmd,
        output: result.output,
        timestamp,
      },
    ]);

    setInputVal("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleExecute(inputVal);
  };

  // Keyboard navigation & shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && pendingConfirm) {
      e.preventDefault();
      setPendingConfirm(null);
      const timestamp = new Date().toLocaleTimeString();
      const promptPath = getPromptPath(context);
      setHistory((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          context,
          promptPath,
          input: "<ESC>",
          output: "Navigation cancelled. The selected record remains displayed above.",
          timestamp,
        },
      ]);
      setInputVal("");
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx] || "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInputVal("");
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx] || "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const suggestions = getAutocompleteSuggestions(inputVal, context);
      if (suggestions.length === 1) {
        setInputVal(suggestions[0]);
      } else if (suggestions.length > 1) {
        const timestamp = new Date().toLocaleTimeString();
        const promptPath = getPromptPath(context);
        setHistory((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(2, 9),
            context,
            promptPath,
            input: inputVal,
            output: `SUGGESTIONS:\n${suggestions.join("  ")}`,
            timestamp,
          },
        ]);
      }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setHistory([]);
    }
  };

  // Semantic Terminal Line Output Parser & Interactive Row Component
  const renderOutputLine = (line: string, lineIdx: number) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={lineIdx} className="h-2" />;

    // 1. Status Block Line: [OK] CONTROL PLANE OPERATIONAL
    if (line.includes("[OK]")) {
      const okParts = line.split("[OK]");
      const statusText = okParts[1] || "";

      // Match operational status keywords
      const statusMatch = statusText.match(/(OPERATIONAL|SYNCHRONIZED|READY|ONLINE|COMPLETED|PASS)/i);

      if (statusMatch) {
        const keyword = statusMatch[0];
        const [labelPart, restPart] = statusText.split(keyword);

        return (
          <div key={lineIdx} className="flex items-center gap-2 font-mono text-xs py-0.5">
            <span className="text-[#32D74B] font-bold shrink-0">[OK]</span>
            <span className="text-text-primary font-medium">{labelPart}</span>
            <span className="text-[#32D74B] font-bold shrink-0">{keyword}</span>
            {restPart && <span className="text-text-secondary">{restPart}</span>}
          </div>
        );
      }

      return (
        <div key={lineIdx} className="flex items-center gap-2 font-mono text-xs py-0.5">
          <span className="text-[#32D74B] font-bold shrink-0">[OK]</span>
          <span className="text-text-primary">{statusText}</span>
        </div>
      );
    }

    // 2. Collection Item Line: [01] id — title (details)
    const recMatch = line.match(/^(\[(\d{1,2})\])\s*(.*)$/);
    if (recMatch) {
      const fullTag = recMatch[1]; // [01]
      const numOnly = recMatch[2]; // 01
      const restContent = recMatch[3]; // rest of line

      return (
        <div key={lineIdx} className="font-mono text-xs py-0.5 flex items-baseline gap-2">
          <button
            type="button"
            onClick={() => handleExecute(numOnly)}
            className="text-accent-cyan font-bold font-mono hover:underline hover:opacity-80 focus:outline-none focus:ring-1 focus:ring-accent-cyan rounded px-0.5 cursor-pointer shrink-0"
            aria-label={`Select item ${numOnly}`}
            title={`Click to select item ${numOnly}`}
          >
            {fullTag}
          </button>
          <span className="text-text-primary/90 font-normal">
            {restContent}
          </span>
        </div>
      );
    }

    // 3. Confirmation Prompt Line: View this experience in the Experience section? [Y/N]
    if (line.includes("[Y/N]")) {
      const questionText = line.replace("[Y/N]", "").trim();
      return (
        <div key={lineIdx} className="font-mono text-xs text-text-primary font-bold mt-2">
          <span className="text-[#32D74B] font-bold animate-pulse">? </span>
          <span>{questionText} </span>
          <span className="text-[#32D74B] font-bold">[Y/N]</span>
        </div>
      );
    }

    // 4. Section Headings (ALL CAPS titles)
    if (/^[A-Z0-9_\-\s]{4,}:?$/.test(line) && !line.startsWith("STACK:") && !line.startsWith("SUMMARY:")) {
      return (
        <div key={lineIdx} className="font-mono text-xs font-bold text-accent-cyan uppercase tracking-wider mt-2 mb-1">
          {line}
        </div>
      );
    }

    // 5. Warnings
    if (line.startsWith("Warning:") || line.startsWith("Please enter Y")) {
      return (
        <div key={lineIdx} className="font-mono text-xs text-amber-400 font-semibold">
          {line}
        </div>
      );
    }

    // 6. Errors
    if (line.startsWith("Command not found:") || line.startsWith("Error:") || line.startsWith("bash:")) {
      return (
        <div key={lineIdx} className="font-mono text-xs text-red-400 font-semibold">
          {line}
        </div>
      );
    }

    // 7. Command Help List Lines (Command Name on left, Description on right)
    const cmdHelpMatch = line.match(/^([a-z0-9_/<>\s\-]{1,18})\u00A0{2,}(.+)$/i);
    if (cmdHelpMatch) {
      const cmdName = cmdHelpMatch[1].trim();
      const cmdDesc = cmdHelpMatch[2].trim();
      return (
        <div key={lineIdx} className="font-mono text-xs py-0.5 flex items-start">
          <span className="w-28 sm:w-40 shrink-0 text-text-primary/90 font-mono">
            {cmdName}
          </span>
          <span className="flex-1 min-w-0 text-text-primary/90 font-mono leading-relaxed break-words">
            {cmdDesc}
          </span>
        </div>
      );
    }

    // Default Output Line
    return (
      <div key={lineIdx} className="font-mono text-xs text-text-primary/90 leading-relaxed break-words whitespace-pre-wrap">
        {line}
      </div>
    );
  };

  return (
    <section id="terminal" className="py-12 border-t border-border-muted scroll-mt-16">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-mono text-xs text-accent-cyan uppercase tracking-wider">
            {"// CONTROL_PLANE"}
          </h2>
          <h3 className="text-2xl font-bold tracking-tight mt-1">
            Interactive System Terminal
          </h3>
          <p className="font-mono text-xs text-text-secondary mt-1">
            Execute commands, inspect system logs, and query portfolio records.
          </p>
        </div>
        <div className="font-mono text-[11px] text-text-secondary bg-bg-secondary px-3 py-1.5 rounded border border-border-muted self-start flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-[#32D74B]" />
          <span>CLUSTER STATUS: OPERATIONAL</span>
        </div>
      </div>

      {/* Terminal Card Container */}
      <div className="bg-bg-secondary border border-border-muted rounded-lg shadow-xl overflow-hidden font-mono text-xs">
        {/* Terminal Header Bar */}
        <div className="bg-bg-tertiary border-b border-border-muted px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2 min-w-0">
            <TerminalIcon size={15} className="text-accent-cyan shrink-0" />
            <span className="font-bold text-accent-cyan text-xs leading-tight whitespace-normal sm:whitespace-nowrap sm:truncate break-words">
              OSAMA INFRASTRUCTURE CONTROL CONSOLE [v{APP_VERSION}-STABLE]
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setHistory([])}
              className="p-1 rounded text-text-secondary hover:text-accent-cyan transition-colors cursor-pointer"
              title="Clear Terminal Output (Ctrl + L)"
              aria-label="Clear Output"
            >
              <RefreshCw size={13} />
            </button>
          </div>
        </div>

        {/* Terminal Log Output Area */}
        <div
          ref={logsContainerRef}
          className="h-72 sm:h-80 p-4 overflow-y-auto space-y-3 bg-bg-primary/95 leading-relaxed selection:bg-accent-cyan selection:text-bg-primary"
        >
          {history.map((log) => (
            <div key={log.id} className="space-y-1">
              {log.input && (
                <div className="flex items-center gap-2 text-text-secondary text-[11px]">
                  <span className="text-accent-cyan font-bold">
                    <span className="hidden sm:inline">{log.promptPath}</span>
                    <span className="inline sm:hidden">
                      {log.promptPath.startsWith("osama@control-plane:")
                        ? log.promptPath.replace("osama@control-plane:", "")
                        : log.promptPath}
                    </span>
                  </span>
                  <span className="text-text-primary font-semibold">{log.input}</span>
                </div>
              )}
              <div className="space-y-0.5">
                {log.output.split("\n").map((line, idx) => renderOutputLine(line, idx))}
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Prompt Input Line */}
        <div className="p-3 bg-bg-secondary border-t border-border-muted">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-accent-cyan font-bold font-mono text-xs shrink-0 select-none">
              <span className="hidden sm:inline">{getPromptPath(context)}</span>
              <span className="inline sm:hidden">{getMobilePromptPath(context)}</span>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                pendingConfirm
                  ? "Enter Y to confirm or N to cancel..."
                  : "Type 'help' to list commands..."
              }
              className="flex-1 min-w-0 bg-transparent border-none outline-none font-mono text-xs text-text-primary placeholder:text-text-secondary/50 focus:ring-0"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="px-3 py-1 rounded bg-bg-tertiary border border-border-muted font-mono text-[11px] text-accent-cyan font-bold hover:bg-accent-cyan/10 transition-colors shrink-0 cursor-pointer"
            >
              EXECUTE
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
