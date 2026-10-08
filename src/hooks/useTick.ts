"use client";

import { useEffect, useState } from "react";

/** Re-renders every `ms` while `active`, e.g. so a status worked out from the time updates itself. */
export function useTick(active: boolean, ms = 2000) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setTick((n) => n + 1), ms);
    return () => clearInterval(timer);
  }, [active, ms]);
}
