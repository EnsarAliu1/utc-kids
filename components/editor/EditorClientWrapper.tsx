"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamic import of BlocklyPlayground to disable SSR for the client-side canvas/workspace
const BlocklyPlayground = dynamic(
  () => import("./BlocklyPlayground"),
  { ssr: false }
);

interface Props {
  student: {
    fullName: string;
    level: number;
    xp: number;
  };
  modules: any[];
  completedIds: string[];
  initialSnapshots: Record<string, any>;
}

export default function EditorClientWrapper({ student, modules, completedIds, initialSnapshots }: Props) {
  return (
    <BlocklyPlayground
      initialStudent={student}
      modules={modules}
      initialCompletedIds={completedIds}
      initialSnapshots={initialSnapshots}
    />
  );
}

