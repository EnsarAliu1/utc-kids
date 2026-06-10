"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import {
  FileCode,
  Maximize2,
  ArrowLeft,
  Trophy,
  Flame,
  Play,
  Sparkles,
  BookOpen,
  ChevronRight,
  Check,
  Award,
  Compass,
  Loader2,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { awardXP, saveWorkspaceSnapshot, type AwardXPResult } from "@/lib/actions/xp.actions";


// Dynamic challenge code validator using database solutions
const validateChallenge = (code: string, solution: string) => {
  const normalizedCode = code.toLowerCase().replace(/\s+/g, "");
  const normalizedSolution = solution.toLowerCase().replace(/\s+/g, "");

  if (normalizedSolution === "<img>" || normalizedSolution === "img") {
    if (!normalizedCode.includes("<img")) {
      return { passed: false, errorMsg: "Mungon blloku i Fotos (img) në faqen tuaj." };
    }
    return { passed: true };
  }
  if (normalizedSolution === "<a>" || normalizedSolution === "a") {
    if (!normalizedCode.includes("<a")) {
      return { passed: false, errorMsg: "Mungon blloku i Linkut (a) në faqen tuaj." };
    }
    return { passed: true };
  }
  if (normalizedSolution === "<ul>" || normalizedSolution === "ul") {
    if (!normalizedCode.includes("<ul")) {
      return { passed: false, errorMsg: "Mungon blloku i Listës (ul) në faqen tuaj." };
    }
    return { passed: true };
  }

  // Substring checker for custom strings or tags
  if (!normalizedCode.includes(normalizedSolution)) {
    const displaySolution = solution.replace(/<[^>]*>?/gm, '');
    return {
      passed: false,
      errorMsg: `Kodi i gjeneruar nuk përmban elementin ose tekstin e kërkuar: "${displaySolution || solution}"`
    };
  }

  return { passed: true };
};


const DEFAULT_CSS = `    body{font-family:system-ui,-apple-system,sans-serif;padding:32px;background:#0f172a;color:#f1f5f9;text-align:center;}
    h1{color:#38bdf8;font-size:2.2rem;margin-bottom:16px;text-shadow:0 0 10px rgba(56,189,248,0.2);}
    h2{color:#06b6d4;font-size:1.6rem;margin-bottom:12px;}
    p{color:#cbd5e1;font-size:1.1rem;line-height:1.6;margin-bottom:16px;}
    img{max-width:100%;border-radius:16px;border:4px solid #1e293b;box-shadow:0 10px 15px -3px rgba(0,0,0,0.3);margin:16px 0;}
    button{padding:12px 24px;font-size:1rem;font-weight:bold;border:none;border-radius:12px;cursor:pointer;transition:transform 0.2s;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.1);}
    button:hover{transform:scale(1.05);}
    a{display:inline-block;color:#38bdf8;text-decoration:none;font-weight:500;border-bottom:2px solid transparent;transition:border-color 0.2s;margin:8px;}
    a:hover{border-color:#38bdf8;}
    ul{list-style:none;padding:0;display:inline-block;text-align:left;background:#1e293b;border-radius:12px;padding:16px 24px;margin:16px 0;border:1px solid rgba(255,255,255,0.05);}
    li{font-size:1rem;color:#f1f5f9;margin:8px 0;display:flex;align-items:center;gap:8px;}
    li::before{content:"🚀";font-size:0.9rem;}`;

function registerCustomBlocks() {
  // 1. html_html
  if (!Blockly.Blocks["html_html"]) {
    Blockly.Blocks["html_html"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("<html>");
        this.appendStatementInput("CONTENT").setCheck(null);
        this.appendDummyInput().appendField("</html>");
        this.setColour("#1E293B");
      },
    };
    javascriptGenerator.forBlock["html_html"] = (block: Blockly.Block) => {
      const content = javascriptGenerator.statementToCode(block, "CONTENT");
      return `<!DOCTYPE html>\n<html>\n${content}</html>`;
    };
  }

  // 2. html_head
  if (!Blockly.Blocks["html_head"]) {
    Blockly.Blocks["html_head"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("<head>");
        this.appendStatementInput("CONTENT").setCheck(null);
        this.appendDummyInput().appendField("</head>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#475569");
      },
    };
    javascriptGenerator.forBlock["html_head"] = (block: Blockly.Block) => {
      const content = javascriptGenerator.statementToCode(block, "CONTENT");
      return `<head>\n  <meta charset="utf-8">\n  <style>\n${DEFAULT_CSS}\n  </style>\n${content}</head>\n`;
    };
  }

  // 3. html_title
  if (!Blockly.Blocks["html_title"]) {
    Blockly.Blocks["html_title"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput()
          .appendField("<title>")
          .appendField(new Blockly.FieldTextInput("UTC Kids Space"), "TEXT")
          .appendField("</title>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#64748B");
      },
    };
    javascriptGenerator.forBlock["html_title"] = (block: Blockly.Block) => {
      return `  <title>${block.getFieldValue("TEXT")}</title>\n`;
    };
  }

  // 4. html_body
  if (!Blockly.Blocks["html_body"]) {
    Blockly.Blocks["html_body"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("<body>");
        this.appendStatementInput("CONTENT").setCheck(null);
        this.appendDummyInput().appendField("</body>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#8B5CF6");
      },
    };
    javascriptGenerator.forBlock["html_body"] = (block: Blockly.Block) => {
      const content = javascriptGenerator.statementToCode(block, "CONTENT");
      return `<body>\n${content}</body>\n`;
    };
  }

  // 2. html_h1
  if (!Blockly.Blocks["html_h1"]) {
    Blockly.Blocks["html_h1"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput()
          .appendField("<h1>")
          .appendField(new Blockly.FieldTextInput("Përshëndetje Botë!"), "TEXT")
          .appendField("</h1>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#3B82F6");
      },
    };
    javascriptGenerator.forBlock["html_h1"] = (block: Blockly.Block) => {
      return `<h1>${block.getFieldValue("TEXT")}</h1>\n`;
    };
  }

  // 3. html_h2
  if (!Blockly.Blocks["html_h2"]) {
    Blockly.Blocks["html_h2"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput()
          .appendField("<h2>")
          .appendField(new Blockly.FieldTextInput("Sub-misioni im"), "TEXT")
          .appendField("</h2>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#06B6D4");
      },
    };
    javascriptGenerator.forBlock["html_h2"] = (block: Blockly.Block) => {
      return `<h2>${block.getFieldValue("TEXT")}</h2>\n`;
    };
  }

  // 4. html_p
  if (!Blockly.Blocks["html_p"]) {
    Blockly.Blocks["html_p"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput()
          .appendField("<p>")
          .appendField(new Blockly.FieldTextInput("Unë po mësoj kodim!"), "TEXT")
          .appendField("</p>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6366F1");
      },
    };
    javascriptGenerator.forBlock["html_p"] = (block: Blockly.Block) => {
      return `<p>${block.getFieldValue("TEXT")}</p>\n`;
    };
  }

  // 5. html_img
  if (!Blockly.Blocks["html_img"]) {
    Blockly.Blocks["html_img"] = {
      init: function (this: Blockly.Block) {
        const options: [string, string][] = [
          ["Mars Rover 🪐", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=60"],
          ["Cute Space Cat 🐱", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=60"],
          ["Roboti 🤖", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=60"],
          ["Galaktika 🌌", "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=300&auto=format&fit=crop&q=60"],
        ];
        this.appendDummyInput()
          .appendField("<img src=\"")
          .appendField(new Blockly.FieldDropdown(options), "SRC")
          .appendField("\" />");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#EC4899");
      },
    };
    javascriptGenerator.forBlock["html_img"] = (block: Blockly.Block) => {
      return `<img src="${block.getFieldValue("SRC")}" style="max-width:100%;border-radius:12px;margin:12px 0;" />\n`;
    };
  }

  // 6. html_a
  if (!Blockly.Blocks["html_a"]) {
    Blockly.Blocks["html_a"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput()
          .appendField("<a href=\"")
          .appendField(new Blockly.FieldTextInput("https://utckids.com"), "HREF")
          .appendField("\">")
          .appendField(new Blockly.FieldTextInput("UTC Kids"), "TEXT")
          .appendField("</a>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#F59E0B");
      },
    };
    javascriptGenerator.forBlock["html_a"] = (block: Blockly.Block) => {
      return `<a href="${block.getFieldValue("HREF")}" target="_blank">${block.getFieldValue("TEXT")}</a>\n`;
    };
  }

  // 7. html_button
  if (!Blockly.Blocks["html_button"]) {
    Blockly.Blocks["html_button"] = {
      init: function (this: Blockly.Block) {
        const colors: [string, string][] = [
          ["Gjelbër 🟢", "green"],
          ["Kaltër 🔵", "blue"],
          ["Kuqe 🔴", "red"],
        ];
        this.appendDummyInput()
          .appendField("<button class=\"")
          .appendField(new Blockly.FieldDropdown(colors), "COLOR")
          .appendField("\">")
          .appendField(new Blockly.FieldTextInput("Kliko Këtu"), "TEXT")
          .appendField("</button>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#10B981");
      },
    };
    javascriptGenerator.forBlock["html_button"] = (block: Blockly.Block) => {
      const colors: Record<string, string> = { green: "#10B981", blue: "#3B82F6", red: "#EF4444" };
      const bg = colors[block.getFieldValue("COLOR")];
      return `<button style="padding:12px 24px;border:none;border-radius:12px;color:white;cursor:pointer;font-weight:bold;background-color:${bg};">${block.getFieldValue("TEXT")}</button>\n`;
    };
  }

  // 8. html_list
  if (!Blockly.Blocks["html_list"]) {
    Blockly.Blocks["html_list"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("<ul>");
        this.appendStatementInput("CONTENT").setCheck(null);
        this.appendDummyInput().appendField("</ul>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#A855F7");
      },
    };
    javascriptGenerator.forBlock["html_list"] = (block: Blockly.Block) => {
      const content = javascriptGenerator.statementToCode(block, "CONTENT");
      return `<ul>\n${content}</ul>\n`;
    };
  }

  // 9. html_li
  if (!Blockly.Blocks["html_li"]) {
    Blockly.Blocks["html_li"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput()
          .appendField("<li>")
          .appendField(new Blockly.FieldTextInput("Udhëto në Mars"), "TEXT")
          .appendField("</li>");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#D946EF");
      },
    };
    javascriptGenerator.forBlock["html_li"] = (block: Blockly.Block) => {
      return `<li>${block.getFieldValue("TEXT")}</li>\n`;
    };
  }

  // 10. html_spacer
  if (!Blockly.Blocks["html_spacer"]) {
    Blockly.Blocks["html_spacer"] = {
      init: function (this: Blockly.Block) {
        this.appendDummyInput().appendField("<br />");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#6B7280");
      },
    };
    javascriptGenerator.forBlock["html_spacer"] = () => {
      return `<br />\n`;
    };
  }
}


interface StudentData {
  fullName: string;
  level: number;
  xp: number;
}

interface Challenge {
  id: string;
  lessonId: string;
  instructions: string;
  solutionCode: string;
  xpReward: number;
}

interface Lesson {
  id: string;
  title: string;
  challenges: Challenge[];
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Props {
  initialStudent: StudentData;
  modules: Module[];
  initialCompletedIds: string[];
  initialSnapshots: Record<string, any>;
}

export default function BlocklyPlayground({ initialStudent, modules, initialCompletedIds, initialSnapshots }: Props) {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Gjej sfidën e parë të papërfunduar për ta nisur nxënësin aty ku ka mbetur
  let defaultLessonId = modules[0]?.lessons[0]?.id || "";
  let defaultChallengeIdx = 0;
  let foundUncompleted = false;

  for (const mod of modules) {
    for (const les of mod.lessons) {
      for (let i = 0; i < les.challenges.length; i++) {
        const ch = les.challenges[i];
        if (!initialCompletedIds.includes(ch.id)) {
          defaultLessonId = les.id;
          defaultChallengeIdx = i;
          foundUncompleted = true;
          break;
        }
      }
      if (foundUncompleted) break;
    }
    if (foundUncompleted) break;
  }

  // Curriculum State
  const [activeLessonId, setActiveLessonId] = useState<string>(defaultLessonId);
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(defaultChallengeIdx);
  const [snapshots, setSnapshots] = useState<Record<string, any>>(initialSnapshots || {});

  // Sync state with dynamic props
  const [student, setStudent] = useState<StudentData>(initialStudent);
  const [completedIds, setCompletedIds] = useState<string[]>(initialCompletedIds);

  // Ndërtojmë listën dinamike të hapur (rishikohet pas çdo plotësimi)
  const computeUnlockedIds = (completedList: string[]): Set<string> => {
    const flat = modules.flatMap((m) =>
      m.lessons.flatMap((l) => l.challenges.map((c) => ({ ...c })))
    );
    const firstUnc = flat.findIndex((c) => !completedList.includes(c.id));
    return new Set(
      flat.filter((_, i) => firstUnc === -1 ? true : i <= firstUnc).map((c) => c.id)
    );
  };
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(() => computeUnlockedIds(initialCompletedIds));

  // Blockly state
  const [generatedCode, setGeneratedCode] = useState("");
  const [status, setStatus] = useState<"idle" | "running" | "success" | "missed">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [xpResult, setXpResult] = useState<AwardXPResult | null>(null);


  // Active curriculum objects
  const activeLesson = modules
    .flatMap((m) => m.lessons)
    .find((l) => l.id === activeLessonId);
  const challenges = activeLesson?.challenges || [];
  const challenge = challenges[activeChallengeIdx] || null;


  // Kalimi i sfidës me ruajtje automatike të gjendjes paraprake
  const changeChallenge = async (newLessonId: string, newChallengeIdx: number) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (workspaceRef.current && challenge) {
      try {
        const state = Blockly.serialization.workspaces.save(workspaceRef.current);
        setSnapshots((prev) => ({ ...prev, [challenge.id]: state }));
        await saveWorkspaceSnapshot(challenge.id, state);
      } catch (err) {
        console.error("Gabim gjatë ruajtjes së workspace:", err);
      }
    }
    setActiveLessonId(newLessonId);
    setActiveChallengeIdx(newChallengeIdx);
    resetStatus();
  };

  useEffect(() => {
    if (!blocklyDiv.current) return;
    workspaceRef.current?.dispose();

    registerCustomBlocks();

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      renderer: "zelos",
      toolbox: {
        kind: "flyoutToolbox",
        contents: [
          "html_h1",
          "html_h2",
          "html_p",
          "html_img",
          "html_a",
          "html_button",
          "html_list",
          "html_li",
          "html_spacer"
        ].map((type) => ({ kind: "block", type })),
      },
      scrollbars: true,
      trashcan: true,
      zoom: { controls: true, wheel: true, startScale: 0.95 },
      theme: {
        name: "utc-dark",
        blockStyles: {},
        categoryStyles: {},
        componentStyles: {
          workspaceBackgroundColour: "#080e0b",
          toolboxBackgroundColour: "#060b08",
          toolboxTextColour: "#ffffff",
          flyoutBackgroundColour: "#060b08",
          flyoutTextColour: "#ffffff",
          scrollbarColour: "#00F59B33",
          scrollbarOpacity: 0.6,
        },
      } as any,
    });

    // Ringarko workspace nga snapshot ose krijo boilerplate
    const hasSnapshot = challenge && snapshots[challenge.id];
    if (hasSnapshot) {
      try {
        Blockly.serialization.workspaces.load(snapshots[challenge.id], workspaceRef.current);
      } catch (err) {
        console.error("Dështoi ringarkimi i snapshot:", err);
        initializeBoilerplate();
      }
    } else {
      initializeBoilerplate();
    }

    function initializeBoilerplate() {
      if (!workspaceRef.current) return;
      workspaceRef.current.clear();

      const htmlBlock = workspaceRef.current.newBlock("html_html");
      htmlBlock.initSvg();
      htmlBlock.render();
      htmlBlock.setDeletable(false);
      htmlBlock.setMovable(false);
      htmlBlock.moveBy(20, 20);

      const headBlock = workspaceRef.current.newBlock("html_head");
      headBlock.initSvg();
      headBlock.render();
      headBlock.setDeletable(false);
      headBlock.setMovable(false);

      const titleBlock = workspaceRef.current.newBlock("html_title");
      titleBlock.initSvg();
      titleBlock.render();
      titleBlock.setDeletable(false);

      const headContentConnection = headBlock.getInput("CONTENT")?.connection;
      const titlePreviousConnection = titleBlock.previousConnection;
      if (headContentConnection && titlePreviousConnection) {
        headContentConnection.connect(titlePreviousConnection);
      }

      const bodyBlock = workspaceRef.current.newBlock("html_body");
      bodyBlock.initSvg();
      bodyBlock.render();
      bodyBlock.setDeletable(false);
      bodyBlock.setMovable(false);

      const htmlContentConnection = htmlBlock.getInput("CONTENT")?.connection;
      const headPreviousConnection = headBlock.previousConnection;
      if (htmlContentConnection && headPreviousConnection) {
        htmlContentConnection.connect(headPreviousConnection);
      }

      const headNextConnection = headBlock.nextConnection;
      const bodyPreviousConnection = bodyBlock.previousConnection;
      if (headNextConnection && bodyPreviousConnection) {
        headNextConnection.connect(bodyPreviousConnection);
      }
    }

    const initial = javascriptGenerator.workspaceToCode(workspaceRef.current);
    setGeneratedCode(initial);

    workspaceRef.current.addChangeListener((e) => {
      if (!workspaceRef.current || e.isUiEvent) return;
      try {
        const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
        setGeneratedCode(code);

        // Debounce saving workspace state
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(async () => {
          if (!workspaceRef.current || !challenge) return;
          try {
            const state = Blockly.serialization.workspaces.save(workspaceRef.current);
            setSnapshots((prev) => ({ ...prev, [challenge.id]: state }));
            await saveWorkspaceSnapshot(challenge.id, state);
          } catch {
            /* ignore */
          }
        }, 1500);
      } catch {
        /* ignore */
      }
    });

    const handleResize = () => {
      if (workspaceRef.current) {
        Blockly.svgResize(workspaceRef.current);
      }
    };
    window.addEventListener("resize", handleResize);
    setTimeout(handleResize, 100);

    resetStatus();

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      // Save current state on unmount/re-load
      if (workspaceRef.current && challenge) {
        try {
          const state = Blockly.serialization.workspaces.save(workspaceRef.current);
          saveWorkspaceSnapshot(challenge.id, state);
        } catch {
          /* ignore */
        }
      }
      window.removeEventListener("resize", handleResize);
      workspaceRef.current?.dispose();
      workspaceRef.current = null;
    };
  }, [activeLessonId, activeChallengeIdx]);

  const resetStatus = () => {
    setStatus("idle");
    setErrorMessage("");
    setXpResult(null);
  };

  const handleRun = async () => {
    if (!challenge || status === "running") return;
    setStatus("running");
    setErrorMessage("");
    setXpResult(null);

    await new Promise((r) => setTimeout(r, 850));

    // Dynamic database-driven validator
    const result = validateChallenge(generatedCode, challenge.solutionCode);


    if (result.passed) {
      setStatus("success");
      const res = await awardXP(challenge.xpReward, challenge.id);
      setXpResult(res);
      if (res.success) {
        const newCompleted = [...new Set([...completedIds, challenge.id])];
        setCompletedIds(newCompleted);
        // Rifreskojmë listën e hapur pas plotësimit të sfidës
        setUnlockedIds(computeUnlockedIds(newCompleted));
        // Instantly increment client state for rapid feedback
        setStudent((prev) => ({
          ...prev,
          xp: res.newXp ?? prev.xp,
          level: res.newLevel ?? prev.level,
        }));
      }
    } else {
      setStatus("missed");
      setErrorMessage(result.errorMsg || "Faqja juaj nuk plotëson udhëzimet.");
    }
  };

  const handleNextChallenge = () => {
    if (activeChallengeIdx < challenges.length - 1) {
      changeChallenge(activeLessonId, activeChallengeIdx + 1);
    } else {
      const allLessons = modules.flatMap((m) => m.lessons);
      const activeIdxInAll = allLessons.findIndex((l) => l.id === activeLessonId);

      if (activeIdxInAll < allLessons.length - 1) {
        const nextL = allLessons[activeIdxInAll + 1];
        changeChallenge(nextL.id, 0);
      }
    }
  };

  const currentLevelProgress = student.xp % 100;
  const xpRequiredForNext = 100 - currentLevelProgress;

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-[#070d0a] text-white">
      {/* ── Top Premium Gamified Header ────────────────────────────────────── */}
      <header className="h-16 border-b border-[#00F59B]/10 bg-[#0a0f0c] px-5 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-[#00F59B] transition-all bg-[#0e1410] px-3.5 py-2 rounded-xl border border-zinc-800 hover:border-[#00F59B]/30"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Kthehu te Paneli
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F59B] animate-pulse" />
            <span className="text-base font-bold tracking-tight text-white">
              Sfidat e Kodimit: <span className="text-[#00F59B]">{activeLesson?.title}</span>
            </span>
          </div>
        </div>

        {/* Real-time responsive student statistics bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-[#0e1410] border border-zinc-800 px-4 py-2 rounded-2xl">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Niveli {student.level}</span>
                <span className="text-[10px] font-extrabold text-amber-400">{student.xp} XP</span>
              </div>
              <div className="w-32 bg-zinc-900 rounded-full h-2 mt-1 relative overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-[#00F59B] to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${currentLevelProgress}%` }}
                />
              </div>
            </div>
            <div className="h-6 w-px bg-zinc-800" />
            <div className="flex items-center gap-1 text-xs">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-zinc-300">
                Nxënësi: <span className="text-[#00F59B] font-bold">{student.fullName}</span>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Workspace ───────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 w-full overflow-hidden">
        {/* ── Left Panel: Curriculum Browser ────────────────────────────────── */}
        <aside className="w-72 flex-shrink-0 border-r border-white/5 bg-[#060b08] flex flex-col min-h-0 overflow-y-auto">
          <div className="p-4 border-b border-white/5">
            <p className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#00F59B]" /> Misionet e Kursit
            </p>
          </div>

          <div className="flex-1 p-3 space-y-4">
            {modules.map((mod) => (
              <div key={mod.id} className="space-y-1">
                <h4 className="text-[11px] font-bold text-zinc-400 tracking-wider uppercase px-2 mb-2">
                  {mod.title}
                </h4>
                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isSelected = les.id === activeLessonId;
                    const solvedChallenges = les.challenges.filter((c: any) => completedIds.includes(c.id)).length;
                    const totalChallenges = les.challenges.length;
                    const isDone = totalChallenges > 0 && solvedChallenges === totalChallenges;
                    // Leksioni është i hapur vetëm nëse ka sfida të hapura
                    const lessonUnlocked = les.challenges.some((c: any) => unlockedIds.has(c.id));
                    // Sfida e parë e pakryer e këtij leksioni
                    const firstUncompletedIdx = les.challenges.findIndex((c: any) => !completedIds.includes(c.id));
                    const entryIdx = firstUncompletedIdx >= 0 ? firstUncompletedIdx : 0;

                    return (
                      <button
                        key={les.id}
                        onClick={() => {
                          if (!lessonUnlocked) return; // BLLOKIM
                          changeChallenge(les.id, entryIdx);
                        }}
                        disabled={!lessonUnlocked}
                        className={`w-full text-left p-3 rounded-xl transition-all duration-300 border flex flex-col gap-1.5 relative group
                          ${
                            !lessonUnlocked
                              ? "opacity-40 cursor-not-allowed border-transparent bg-transparent"
                              : isSelected
                              ? "bg-[#00F59B]/10 border-[#00F59B]/30 shadow-md shadow-[#00F59B]/5 text-white"
                              : "bg-transparent border-transparent hover:bg-white/5 text-zinc-400 hover:text-white"
                          }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base flex-shrink-0">
                            {!lessonUnlocked ? "🔒" : isDone ? "✅" : isSelected ? "🛰️" : "📁"}
                          </span>
                          <span className="text-xs font-bold truncate flex-1">
                            {les.title}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pl-6">
                          <span className="text-[10px] text-zinc-500 font-semibold">
                            {lessonUnlocked ? `${solvedChallenges}/${totalChallenges} Sfida` : "E bllokuar"}
                          </span>
                          {lessonUnlocked && totalChallenges > 0 && (
                            <div className="flex gap-0.5">
                              {les.challenges.map((c: any) => (
                                <span
                                  key={c.id}
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    completedIds.includes(c.id) ? "bg-[#00F59B]" : unlockedIds.has(c.id) ? "bg-zinc-600" : "bg-zinc-900"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-white/5 bg-[#070d09] text-[10px] text-zinc-500 leading-relaxed">
            <span className="text-amber-400 font-bold">Këshillë:</span> Zgjidh leksionet sipas radhës për të marrë arritjet kryesore!
          </div>
        </aside>

        {/* ── Center: Workspace + Instructions ────────────────────────────── */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#080e0b] relative">
          {/* Active Challenge Selection & Instructions */}
          {challenge && (
            <div className="flex flex-col border-b border-white/5 bg-[#060b08] flex-shrink-0 p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-1.5">
                  {challenges.map((ch, idx) => {
                    const isActive = idx === activeChallengeIdx;
                    const isCompleted = completedIds.includes(ch.id);
                    const isChallengeUnlocked = unlockedIds.has(ch.id);
                    return (
                      <button
                        key={ch.id}
                        disabled={!isChallengeUnlocked}
                        onClick={() => {
                          if (!isChallengeUnlocked) return; // BLLOKIM
                          changeChallenge(activeLessonId, idx);
                        }}
                        title={!isChallengeUnlocked ? "Përfundo sfidat e mëparshme për ta zhbllokuar" : undefined}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border
                          ${
                            !isChallengeUnlocked
                              ? "opacity-30 cursor-not-allowed bg-zinc-950 border-zinc-900 text-zinc-600"
                              : isActive
                              ? "bg-[#00F59B]/10 border-[#00F59B]/30 text-[#00F59B]"
                              : isCompleted
                              ? "bg-emerald-950/20 border-emerald-900/30 text-emerald-400 hover:bg-emerald-950/40"
                              : "bg-zinc-900/50 border-zinc-800/50 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                          }`}
                      >
                        {!isChallengeUnlocked ? "🔒" : isCompleted ? <Check className="w-3 h-3" /> : null}
                        {isChallengeUnlocked ? `Sfida ${idx + 1}` : `${idx + 1}`}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold">
                  <Award className="w-3.5 h-3.5" /> +{challenge.xpReward} XP
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0a120e] border border-[#00F59B]/10 rounded-xl p-3.5">
                <div className="p-2 bg-[#00F59B]/10 border border-[#00F59B]/20 rounded-xl text-[#00F59B] flex-shrink-0">
                  <Rocket className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1">
                    🚀 Misioni {activeChallengeIdx + 1}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {challenge.instructions}
                  </p>

                </div>
              </div>
            </div>
          )}


          {/* Blockly Drawing Canvas */}
          <div ref={blocklyDiv} className="flex-1 w-full" />
        </main>

        {/* ── Right Panel: Live View & Runs ────────────────────────────────── */}
        <aside className="w-80 flex-shrink-0 border-l border-white/5 bg-[#060b08] flex flex-col overflow-hidden min-h-0">
          {/* Live Preview Console - takes full height above run controls */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-[#070d09] border-b border-white/5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] font-semibold text-zinc-500">Foto e Gjallë (Live Preview)</span>
            </div>

            <div className="flex-1 bg-white relative">
              <iframe
                title="Live Preview"
                srcDoc={
                  generatedCode ||
                  "<p style='padding:40px;font-family:sans-serif;color:#888;text-align:center;font-size:14px;background:#0f172a;height:100%;margin:0;'>Tërhiq blloqe kozmike për të filluar ndërtimin...</p>"
                }
                className="w-full h-full border-none"
                sandbox="allow-scripts"
              />
            </div>
          </div>


          {/* Run and Validation Feedback Panel */}
          <div className="p-4 bg-[#0a0f0c] border-t border-white/5 flex-shrink-0">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <button
                  onClick={handleRun}
                  disabled={status === "running" || !generatedCode}
                  className="flex-1 h-11 rounded-xl bg-[#00F59B] text-zinc-950 font-bold text-sm flex items-center justify-center gap-2
                    hover:bg-[#00d888] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-[#00F59B]/20"
                >
                  {status === "running" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Duke testuar kodin...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Kontrollo Misionin
                    </>
                  )}
                </button>
                <button
                  onClick={resetStatus}
                  disabled={status === "running"}
                  className="h-11 w-11 rounded-xl border border-zinc-800 hover:bg-zinc-900 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <RotateCcw className="w-4 h-4 text-zinc-400" />
                </button>
              </div>

              {/* Feedback messages */}
              {status === "missed" && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 animate-fade-in">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-amber-400">Jo ende! 🤔</p>
                      <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">{errorMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="bg-[#00F59B]/10 border border-[#00F59B]/30 rounded-xl p-3.5 animate-fade-in space-y-2.5">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-[#00F59B] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-[#00F59B]">Misioni u Krye me Sukses! 🎉</p>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Kodi juaj u verifikua dhe është i saktë.</p>
                    </div>
                  </div>

                  {xpResult?.success && (
                    <div className="space-y-1.5 border-t border-white/5 pt-2">
                      {xpResult.xpAwarded && xpResult.xpAwarded > 0 ? (
                        <div className="flex justify-between items-center bg-[#070d09] rounded-lg px-2.5 py-1.5 border border-zinc-800">
                          <span className="text-[10px] text-zinc-500">Shpërblimi:</span>
                          <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                            <Award className="w-3.5 h-3.5" /> +{xpResult.xpAwarded} XP
                          </span>
                        </div>
                      ) : (
                        <p className="text-[10px] text-amber-400 text-center">Sfida ishte zgjidhur — progres i ruajtur.</p>
                      )}

                      {xpResult.newBadge && (
                        <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                          <span className="text-lg">{xpResult.newBadge.emoji}</span>
                          <div>
                            <p className="text-[8px] text-amber-400 font-bold uppercase tracking-wider">Medalje e Re!</p>
                            <p className="text-[10px] font-bold text-white">{xpResult.newBadge.title}</p>
                          </div>
                        </div>
                      )}

                      {xpResult.levelUp && (
                        <div className="bg-[#00F59B]/10 border border-[#00F59B]/20 rounded-lg p-2 text-center">
                          <p className="text-[11px] font-bold text-[#00F59B] animate-pulse">
                            🌟 Urime! Ke kaluar në Nivelin {xpResult.newLevel}!
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    onClick={handleNextChallenge}
                    className="w-full py-2 bg-[#00F59B] text-zinc-950 font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 hover:bg-[#00d888] transition-all"
                  >
                    Vazhdo te Sfida/Leksioni tjetër <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
