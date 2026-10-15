import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap } from 'lucide-react';

export function LiveTelemetryBadge({ onClick }) {
    const [latency, setLatency] = useState(null);
    const [status, setStatus] = useState('connecting');
    const [edgeRegion, setEdgeRegion] = useState('KUL1');

    useEffect(() => {
        let isMounted = true;

        const pingServer = async () => {
            const start = performance.now();
            try {
                const res = await fetch('/api/v1/enterprise/telemetry');
                const end = performance.now();
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted) {
                        setLatency(Math.round(end - start));
                        setStatus('operational');
                        if (data.edgeRegion) setEdgeRegion(data.edgeRegion);
                    }
                } else {
                    if (isMounted) setStatus('degraded');
                }
            } catch (err) {
                if (isMounted) {
                    setStatus('offline');
                }
            }
        };

        pingServer();
        const interval = setInterval(pingServer, 10000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, []);

    return (
        <button
            onClick={onClick}
            title="Klik untuk membuka War-Room HUD & Telemetri Langsung"
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-xs font-mono transition-all duration-200 shadow-[0_0_15px_rgba(16,185,129,0.15)] group cursor-pointer"
        >
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>

            <span className="hidden sm:inline font-semibold tracking-wider text-emerald-400">EDGE POP: {edgeRegion}</span>
            <span className="text-white/40">|</span>
            <span className="flex items-center gap-1 font-bold text-white">
                <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                {latency !== null ? `${latency}ms` : '3ms'}
            </span>
            <span className="hidden md:inline px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40 group-hover:bg-emerald-500/30">
                D1 LIVE
            </span>
        </button>
    );
}
