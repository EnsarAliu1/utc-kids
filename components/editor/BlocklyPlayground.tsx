"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { javascriptGenerator } from "blockly/javascript";
import { Play, RotateCcw, AlertTriangle, CheckCircle, ChevronRight, Award, FileCode } from "lucide-react";
import { awardXP, AwardXPResult } from "@/lib/actions/xp.actions";

// Konfigurimi i Sfidave HTML
interface ChallengeConfig {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  validateCode: (code: string) => { passed: boolean; errorMsg?: string };
}

const CHALLENGES: ChallengeConfig[] = [
  {
    id: "sfida_html_1",
    name: "1. Faqja Ime e Parë 🏷️",
    description: "Krijo një faqe të thjeshtë që përmban një titull kryesor <h1> me tekstin saktësisht 'Përshëndetje Botë!' brenda trupit të faqes (html_body).",
    xpReward: 30,
    validateCode: (code) => {
      const hasBody = code.includes("<body") && code.includes("</body>");
      const hasH1 = code.includes("<h1>Përshëndetje Botë!</h1>");
      if (!hasBody) {
        return { passed: false, errorMsg: "Mungon blloku 'Trup i faqes (html_body)' në workspace." };
      }
      if (!hasH1) {
        return { passed: false, errorMsg: "Mungon titulli kryesor <h1> ose teksti nuk është saktësisht 'Përshëndetje Botë!'." };
      }
      return { passed: true };
    },
  },
  {
    id: "sfida_html_2",
    name: "2. Artikulli me Foto 📰",
    description: "Ndërto një artikull që përmban një titull çfarëdo <h1>, një paragraf <p> me tekstin saktësisht 'Unë po mësoj kodim!' dhe një bllok 'Foto (html_img)'.",
    xpReward: 40,
    validateCode: (code) => {
      const hasH1 = code.includes("<h1") && code.includes("</h1>");
      const hasP = code.includes("<p>Unë po mësoj kodim!</p>");
      const hasImg = code.includes("<img");
      if (!hasH1) {
        return { passed: false, errorMsg: "Faqja duhet të përmbajë një titull <h1>." };
      }
      if (!hasP) {
        return { passed: false, errorMsg: "Mungon paragrafi <p> ose teksti nuk është saktësisht 'Unë po mësoj kodim!'." };
      }
      if (!hasImg) {
        return { passed: false, errorMsg: "Mungon blloku i fotos (html_img)." };
      }
      return { passed: true };
    },
  },
  {
    id: "sfida_html_3",
    name: "3. Butoni Kozmik Interaktiv 👆",
    description: "Krijo një buton të gjelbër (green) me tekstin saktësisht 'Kliko Këtu' dhe shto një link <a> me tekstin 'UTC Kids' që të dërgon te adresa 'https://utckids.com'.",
    xpReward: 50,
    validateCode: (code) => {
      const hasButton = code.includes("<button") && code.includes("background-color: #10B981;") && code.includes("Kliko Këtu");
      const hasLink = code.includes('href="https://utckids.com"') && code.includes("UTC Kids");
      if (!hasButton) {
        return { passed: false, errorMsg: "Mungon butoni ose nuk ka ngjyrën e gjelbër apo tekstin 'Kliko Këtu'." };
      }
      if (!hasLink) {
        return { passed: false, errorMsg: "Mungon linku <a>, nuk ka tekstin 'UTC Kids' ose nuk të dërgon te 'https://utckids.com'." };
      }
      return { passed: true };
    },
  },
];

export default function BlocklyPlayground() {
  const blocklyDiv = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);

  // States
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [generatedCode, setGeneratedCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [gameStatus, setGameStatus] = useState<"idle" | "running" | "success" | "missed">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  
  // Server Action Results
  const [xpResult, setXpResult] = useState<AwardXPResult | null>(null);

  const challenge = CHALLENGES[activeChallengeIdx];

  // Regjistro blloket e personalizuara HTML vetëm një herë
  useEffect(() => {
    // 1. Trup i faqes (Body Container)
    if (!Blockly.Blocks["html_body"]) {
      Blockly.Blocks["html_body"] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
              .appendField("📦 Trup i faqes (body)");
          this.appendStatementInput("CONTENT")
              .setCheck(null)
              .appendField("Përmbajtja:");
          this.setColour("#10B981"); // Emerald color
          this.setTooltip("Ky bllok mban të gjithë strukturën e faqes suaj.");
        },
      };
      javascriptGenerator.forBlock["html_body"] = function (block: Blockly.Block) {
        const content = javascriptGenerator.statementToCode(block, "CONTENT");
        return `<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <style>\n    body { font-family: system-ui, sans-serif; padding: 20px; background-color: #0b120d; color: #ffffff; }\n    h1 { color: #00F59B; border-bottom: 1px solid rgba(0,245,155,0.2); padding-bottom: 8px; }\n    p { line-height: 1.6; color: #a1a1aa; }\n  </style>\n</head>\n<body>\n${content}</body>\n</html>`;
      };
    }

    // 2. Titull H1
    if (!Blockly.Blocks["html_h1"]) {
      Blockly.Blocks["html_h1"] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
              .appendField("🏷️ Titull H1")
              .appendField(new Blockly.FieldTextInput("Përshëndetje Botë!"), "TEXT");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour("#3B82F6"); // Blue
          this.setTooltip("Krijon një titull të madh kryesor.");
        },
      };
      javascriptGenerator.forBlock["html_h1"] = function (block: Blockly.Block) {
        const text = block.getFieldValue("TEXT");
        return `<h1>${text}</h1>\n`;
      };
    }

    // 3. Paragraf P
    if (!Blockly.Blocks["html_p"]) {
      Blockly.Blocks["html_p"] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
              .appendField("📝 Paragraf p")
              .appendField(new Blockly.FieldTextInput("Kjo është një fjali."), "TEXT");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour("#8B5CF6"); // Purple
          this.setTooltip("Krijon një paragraf teksti.");
        },
      };
      javascriptGenerator.forBlock["html_p"] = function (block: Blockly.Block) {
        const text = block.getFieldValue("TEXT");
        return `<p>${text}</p>\n`;
      };
    }

    // 4. Foto IMG
    if (!Blockly.Blocks["html_img"]) {
      Blockly.Blocks["html_img"] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
              .appendField("🖼️ Foto img")
              .appendField(new Blockly.FieldDropdown([
                ["Logo UTC Kids", "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&auto=format&fit=crop&q=60"],
                ["Macja Cute", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=60"],
                ["Roboti", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=300&auto=format&fit=crop&q=60"],
                ["Gjithësia", "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&auto=format&fit=crop&q=60"]
              ]), "SRC");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour("#EC4899"); // Pink
          this.setTooltip("Shfaq një foto në faqen tuaj.");
        },
      };
      javascriptGenerator.forBlock["html_img"] = function (block: Blockly.Block) {
        const src = block.getFieldValue("SRC");
        return `<img src="${src}" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 10px; border: 1px solid #27272a;" />\n`;
      };
    }

    // 5. Link A
    if (!Blockly.Blocks["html_a"]) {
      Blockly.Blocks["html_a"] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
              .appendField("🔗 Link a")
              .appendField("tekst:")
              .appendField(new Blockly.FieldTextInput("UTC Kids"), "TEXT")
              .appendField("adresa:")
              .appendField(new Blockly.FieldTextInput("https://utckids.com"), "HREF");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour("#F59E0B"); // Orange
          this.setTooltip("Krijon një lidhje që mund të klikohet.");
        },
      };
      javascriptGenerator.forBlock["html_a"] = function (block: Blockly.Block) {
        const text = block.getFieldValue("TEXT");
        const href = block.getFieldValue("HREF");
        return `<a href="${href}" target="_blank" style="color: #00F59B; text-decoration: underline;">${text}</a>\n`;
      };
    }

    // 6. Buton BUTTON
    if (!Blockly.Blocks["html_button"]) {
      Blockly.Blocks["html_button"] = {
        init: function (this: Blockly.Block) {
          this.appendDummyInput()
              .appendField("🔘 Buton")
              .appendField("tekst:")
              .appendField(new Blockly.FieldTextInput("Kliko Këtu"), "TEXT")
              .appendField("ngjyra:")
              .appendField(new Blockly.FieldDropdown([
                ["Gjelbër", "green"],
                ["Kaltër", "blue"],
                ["Kuqe", "red"]
              ]), "COLOR");
          this.setPreviousStatement(true, null);
          this.setNextStatement(true, null);
          this.setColour("#14B8A6"); // Teal
          this.setTooltip("Krijon një buton të klikueshëm.");
        },
      };
      javascriptGenerator.forBlock["html_button"] = function (block: Blockly.Block) {
        const text = block.getFieldValue("TEXT");
        const color = block.getFieldValue("COLOR");
        let style = "padding: 8px 16px; border: none; border-radius: 6px; color: white; cursor: pointer; font-weight: bold;";
        if (color === "green") style += " background-color: #10B981;";
        else if (color === "blue") style += " background-color: #3B82F6;";
        else if (color === "red") style += " background-color: #EF4444;";
        return `<button style="${style}">${text}</button>\n`;
      };
    }
  }, []);

  // Inicializo Blockly Workspace kur ndryshon sfida
  useEffect(() => {
    if (!blocklyDiv.current) return;

    if (workspaceRef.current) {
      workspaceRef.current.dispose();
    }

    const toolboxJson = {
      kind: "flyoutToolbox",
      contents: [
        { kind: "block", type: "html_body" },
        { kind: "block", type: "html_h1" },
        { kind: "block", type: "html_p" },
        { kind: "block", type: "html_img" },
        { kind: "block", type: "html_a" },
        { kind: "block", type: "html_button" },
      ],
    };

    workspaceRef.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolboxJson,
      scrollbars: false,
      trashcan: true,
      zoom: {
        controls: false,
        wheel: false,
      },
      theme: {
        name: "dark-custom",
        blockStyles: {},
        categoryStyles: {},
        componentStyles: {
          workspaceBackgroundColour: "#0b120d",
          toolboxBackgroundColour: "#070c08",
          toolboxTextColour: "#ffffff",
          flyoutBackgroundColour: "#070c08",
          flyoutTextColour: "#ffffff",
          scrollbarColour: "#00F59B",
        },
      } as any,
    });

    // Auto-krijo bllokun kryesor Body
    const bodyBlock = workspaceRef.current.newBlock("html_body");
    bodyBlock.initSvg();
    bodyBlock.render();
    bodyBlock.setDeletable(false); // S'mund ta fshijë trupin

    // Vendose në qendër të workspace
    bodyBlock.moveBy(50, 40);

    // Vendos kodin fillestar
    const initialCode = javascriptGenerator.workspaceToCode(workspaceRef.current);
    setGeneratedCode(initialCode);

    // Dëgjuesi i ndryshimeve në workspace
    workspaceRef.current.addChangeListener(() => {
      if (workspaceRef.current) {
        try {
          const code = javascriptGenerator.workspaceToCode(workspaceRef.current);
          setGeneratedCode(code);
        } catch (e) {
          console.error(e);
        }
      }
    });

    resetGame();

    return () => {
      if (workspaceRef.current) {
        workspaceRef.current.dispose();
        workspaceRef.current = null;
      }
    };
  }, [activeChallengeIdx]);

  // Reset Game State
  const resetGame = () => {
    setIsRunning(false);
    setGameStatus("idle");
    setErrorMessage("");
    setXpResult(null);
  };

  // Testo kodin HTML kundrejt rregullave të sfidës
  const validateHTMLCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setErrorMessage("");
    setXpResult(null);

    // Shto një animacion të shkurtër ngarkimi
    await new Promise((resolve) => setTimeout(resolve, 800));

    const checkRes = challenge.validateCode(generatedCode);

    if (checkRes.passed) {
      setGameStatus("success");
      setIsRunning(false);

      // Thirr Server Action për të shtuar XP
      const res = await awardXP(challenge.xpReward, challenge.id);
      setXpResult(res);
    } else {
      setGameStatus("missed");
      setErrorMessage(checkRes.errorMsg || "Faqja juaj nuk plotëson udhëzimet.");
      setIsRunning(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Kolona e Majtë: Blockly Editor */}
      <div className="lg:col-span-7 flex flex-col bg-[#0a0f0c] border border-[#00F59B]/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 bg-[#070c08] border-b border-[#00F59B]/10 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#00F59B] uppercase tracking-wider">Blloqet e HTML</h3>
            <p className="text-xs text-zinc-400 mt-0.5">Tërhiq dhe vendos blloqet HTML brenda bllokut të Trupit.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={validateHTMLCode}
              disabled={isRunning || !generatedCode}
              className="px-4 py-2 bg-[#00F59B] text-zinc-950 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-[#00d888] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Testo Kodin
            </button>
            <button
              onClick={resetGame}
              disabled={isRunning}
              className="p-2 border border-zinc-800 rounded-xl hover:bg-zinc-900 active:scale-95 transition-all disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Blockly workspace target div */}
        <div ref={blocklyDiv} className="w-full h-[400px] relative" />
      </div>

      {/* Kolona e Djathtë: HTML Preview Sandbox & Code Output */}
      <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
        {/* Challenge Selection & Instructions */}
        <div className="bg-[#0e1410] border border-[#00F59B]/10 rounded-2xl p-5 shadow-lg">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Zgjidh Sfidën:</label>
          <select
            value={activeChallengeIdx}
            onChange={(e) => setActiveChallengeIdx(Number(e.target.value))}
            className="w-full bg-[#070d0a] border border-[#00F59B]/20 text-white rounded-xl px-3 py-2 mt-1.5 focus:outline-none focus:border-[#00F59B] text-sm font-semibold transition-all cursor-pointer"
          >
            {CHALLENGES.map((ch, idx) => (
              <option key={ch.id} value={idx}>
                {ch.name} (+{ch.xpReward} XP)
              </option>
            ))}
          </select>

          <div className="mt-4 p-3 bg-[#070d0a]/60 border border-zinc-900 rounded-xl">
            <h4 className="text-xs font-bold text-[#00F59B]">Udhëzimet e Misionit:</h4>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">{challenge.description}</p>
          </div>
        </div>

        {/* Real-time HTML Preview Sandbox */}
        <div className="bg-[#0b120d] border border-[#00F59B]/10 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden shadow-lg">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-semibold border-b border-zinc-800/40 pb-2">
            <FileCode className="w-3.5 h-3.5 text-[#00F59B]" />
            Shfaqja e Faqes Live (Live Preview)
          </div>

          <div className="w-full h-[250px] rounded-xl overflow-hidden border border-zinc-900 shadow-inner bg-white relative">
            <iframe
              title="HTML Live Preview Sandbox"
              srcDoc={generatedCode || "<p style='padding:20px; font-family:sans-serif; color:#888; text-align:center;'>Tërhiq blloqet për të parë rezultatin këtu...</p>"}
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts"
            />
          </div>

          {/* Overlay i Statusit për Rezultatin e Testimit */}
          {gameStatus === "missed" && (
            <div className="absolute inset-0 bg-[#070d0a]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
              <AlertTriangle className="w-10 h-10 text-amber-500 mb-2 animate-pulse" />
              <h4 className="font-extrabold text-amber-400 font-sans">Kodi nuk është i plotë!</h4>
              <p className="text-xs text-zinc-300 mt-2 max-w-[280px] leading-relaxed">{errorMessage}</p>
              <button
                onClick={resetGame}
                className="mt-4 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-bold rounded-xl transition-all"
              >
                Kthehu te Redaktimi 🔄
              </button>
            </div>
          )}

          {gameStatus === "success" && (
            <div className="absolute inset-0 bg-[#070d0a]/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
              <CheckCircle className="w-12 h-12 text-[#00F59B] mb-2 animate-bounce" />
              <h4 className="text-xl font-extrabold text-[#00F59B]">Sfida u Krye! 🎉</h4>
              <p className="text-xs text-zinc-400 mt-1">HTML-ja jote u verifikua dhe është 100% e saktë!</p>

              {xpResult && (
                <div className="mt-4 p-3 bg-[#0a1410] border border-[#00F59B]/20 rounded-xl max-w-[300px] w-full">
                  {xpResult.success ? (
                    <>
                      {xpResult.xpAwarded && xpResult.xpAwarded > 0 ? (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-zinc-400">Pikë të fituara:</span>
                          <span className="font-bold text-[#00F59B] flex items-center gap-1">
                            +{xpResult.xpAwarded} XP <Award className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      ) : (
                        <div className="text-xs text-amber-400 text-center font-medium leading-relaxed">
                          ⚠️ Sfida është zgjidhur më parë. Pikët nuk u shtuan sërish për të shmangur abuzimet.
                        </div>
                      )}
                      {xpResult.newBadge && (
                        <div className="mt-2 pt-2 border-t border-[#00F59B]/10 flex flex-col items-center justify-center">
                          <span className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Medalje e Re!</span>
                          <span className="text-sm font-bold text-white mt-0.5">
                            {xpResult.newBadge.emoji} {xpResult.newBadge.title}
                          </span>
                        </div>
                      )}
                      {xpResult.levelUp && (
                        <div className="mt-2 pt-2 border-t border-[#00F59B]/10 text-center text-xs font-bold text-[#00F59B] animate-pulse">
                          🌟 U ngjite në Nivelin {xpResult.newLevel}! 🌟
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-xs text-red-400">{xpResult.error}</div>
                  )}
                </div>
              )}

              <div className="mt-5 flex gap-2">
                <button
                  onClick={resetGame}
                  className="px-3 py-1.5 border border-zinc-800 hover:bg-zinc-900 text-zinc-400 text-xs font-semibold rounded-xl transition-all"
                >
                  Rishiko Kodin
                </button>
                {activeChallengeIdx < CHALLENGES.length - 1 && (
                  <button
                    onClick={() => {
                      setActiveChallengeIdx(activeChallengeIdx + 1);
                      resetGame();
                    }}
                    className="px-4 py-1.5 bg-[#00F59B] text-zinc-950 text-xs font-bold rounded-xl flex items-center gap-1 hover:bg-[#00d888] transition-all"
                  >
                    Sfida e Radhës <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Code Compiler Display */}
        <div className="bg-[#0e1410] border border-[#00F59B]/10 rounded-2xl p-5 shadow-lg flex-1 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Kodi HTML i Gjeneruar:</h4>
            <p className="text-[10px] text-zinc-500 mt-0.5">Shiko se si blloqet tuaja përkthehen në kod real HTML.</p>
          </div>
          <pre className="mt-3 p-3 bg-[#070d0a] text-[#00F59B] font-mono text-xs rounded-xl overflow-x-auto min-h-[80px] border border-zinc-900 max-h-[140px] overflow-y-auto">
            {generatedCode || "<!-- Vendos blloqe brenda Trupit të faqes... -->"}
          </pre>
        </div>
      </div>
    </div>
  );
}
