import * as React from "react";
import type { Metadata } from 'next';
import StudiesViewer from "@/components/study-administrator/StudiesViewer";

export const metadata = {
  title: 'Studies | Study Administrator',
} satisfies Metadata;

export default function Page(): React.JSX.Element {
  return <StudiesViewer />;
}
