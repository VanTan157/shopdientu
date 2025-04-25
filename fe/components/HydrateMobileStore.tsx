// components/HydrateProductStore.tsx
"use client";

import { useMobileStore } from "@/lib/store";
import { Mobile } from "@/lib/types/mobile";
import { useEffect } from "react";

export function HydrateMobileStore({ mobiles }: { mobiles: Mobile[] }) {
  const setMobiles = useMobileStore((state) => state.setMobiles);

  useEffect(() => {
    setMobiles(mobiles);
  }, [mobiles, setMobiles]);

  return <></>;
}
