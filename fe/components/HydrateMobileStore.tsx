// components/HydrateProductStore.tsx
"use client";

import { useMobileStore } from "@/lib/store";
import { Mobile } from "@/lib/validate/mobile";
import { useEffect } from "react";

export function HydrateMobileStore({ mobiles }: { mobiles: Mobile[] }) {
  console.log("check", mobiles);
  const setMobiles = useMobileStore((state) => state.setMobiles);

  useEffect(() => {
    setMobiles(mobiles);
  }, [mobiles, setMobiles]);

  return <></>;
}
