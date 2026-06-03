"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamic import of BlocklyPlayground to disable SSR for the client-side canvas/workspace
const BlocklyPlayground = dynamic(
  () => import("./BlocklyPlayground"),
  { ssr: false }
);

export default function EditorClientWrapper() {
  return <BlocklyPlayground />;
}
