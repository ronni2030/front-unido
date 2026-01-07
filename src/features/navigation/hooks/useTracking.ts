import { useEffect, useState } from "react";
import type { TrackingItem } from "../types/tracking.types";
import * as service from "../services/tracking.service";

export const useTracking = () => {
  const [tracking, setTracking] = useState<TrackingItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await service.getTracking();
    setTracking(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return {
    tracking,
    loading,
    reload: load,
  };
};
