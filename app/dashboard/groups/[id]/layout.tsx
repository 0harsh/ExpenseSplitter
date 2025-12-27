"use client"

import { GroupProvider } from "@/lib/GroupContext";
import { useParams } from "next/navigation";

export default function GroupsLayout({ children}: { children: React.ReactNode; params: { id: string } }) {

  const params = useParams();
  const groupId = params.id as string;

  return (
    <GroupProvider groupId={groupId}>
      {children}
    </GroupProvider>
  );
}
