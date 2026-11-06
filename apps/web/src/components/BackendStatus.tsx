'use client';

import React, { useEffect, useState } from 'react';
import styles from './BackendStatus.module.css';

interface HealthData {
  status: 'ok' | 'degraded' | 'offline';
  appName?: string;
  environment?: string;
  version?: string;
  timestamp?: string;
  uptimeSeconds?: number;
  services?: {
    database?: {
      status: 'connected' | 'disconnected';
      latencyMs?: number;
      message?: string;
    };
    redis?: {
      status: 'connected' | 'disconnected';
      latencyMs?: number;
      message?: string;
    };
  };
}

export default function BackendStatus() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

  const checkHealth = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${apiUrl}/health`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setHealth(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reach API endpoint');
      setHealth({
        status: 'offline',
        services: {
          database: { status: 'disconnected', message: 'Backend API unreachable' },
          redis: { status: 'disconnected', message: 'Backend API unreachable' },
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, [apiUrl]);

  const dbStatus = health?.services?.database?.status || 'disconnected';
  const redisStatus = health?.services?.redis?.status || 'disconnected';

  return (
    <div className={styles.statusCard} id="phase1-system-status">
      <div className={styles.headerRow}>
        <div className={styles.titleArea}>
          <span className="serif-heading" style={{ fontSize: '1.4rem' }}>
            Phase 1 Infrastructure Live Monitor
          </span>
          {loading ? (
            <span className={`${styles.statusPill} ${styles.statusLoading}`}>
              <span className="pulse-dot" /> Checking...
            </span>
          ) : health?.status === 'ok' ? (
            <span className={`${styles.statusPill} ${styles.statusConnected}`}>
              <span className="pulse-dot" /> All Systems Online
            </span>
          ) : health?.status === 'degraded' ? (
            <span className={`${styles.statusPill} ${styles.statusLoading}`}>
              <span className="pulse-dot" /> Services Degraded
            </span>
          ) : (
            <span className={`${styles.statusPill} ${styles.statusDisconnected}`}>
              <span className="pulse-dot" /> Backend Offline
            </span>
          )}
        </div>

        <button
          onClick={checkHealth}
          className={styles.refreshBtn}
          disabled={loading}
          id="btn-recheck-health"
        >
          {loading ? 'Probing...' : '↻ Re-check Status'}
        </button>
      </div>

      <div className={styles.metricsGrid}>
        {/* Next.js Frontend */}
        <div className={styles.metricItem}>
          <div className={styles.metricLabel}>Frontend Client</div>
          <div className={styles.metricValue}>
            <span className={`${styles.statusPill} ${styles.statusConnected}`}>
              Next.js 14 Active
            </span>
          </div>
          <div className={styles.metricMeta}>Port 3000 • Pure CSS Design System</div>
        </div>

        {/* NestJS API */}
        <div className={styles.metricItem}>
          <div className={styles.metricLabel}>Backend REST API</div>
          <div className={styles.metricValue}>
            {loading ? (
              <span className={`${styles.statusPill} ${styles.statusLoading}`}>Connecting</span>
            ) : health?.status === 'offline' ? (
              <span className={`${styles.statusPill} ${styles.statusDisconnected}`}>Offline</span>
            ) : (
              <span className={`${styles.statusPill} ${styles.statusConnected}`}>NestJS v10 Online</span>
            )}
          </div>
          <div className={styles.metricMeta}>
            {errorMsg ? errorMsg : `Port 4000 • Uptime: ${health?.uptimeSeconds ?? 0}s`}
          </div>
        </div>

        {/* PostgreSQL Database */}
        <div className={styles.metricItem}>
          <div className={styles.metricLabel}>PostgreSQL 16 & Prisma</div>
          <div className={styles.metricValue}>
            <span
              className={`${styles.statusPill} ${
                dbStatus === 'connected' ? styles.statusConnected : styles.statusDisconnected
              }`}
            >
              {dbStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className={styles.metricMeta}>
            {health?.services?.database?.latencyMs !== undefined
              ? `Latency: ${health.services.database.latencyMs}ms`
              : health?.services?.database?.message || 'Database connection pending'}
          </div>
        </div>

        {/* Redis Cache & BullMQ */}
        <div className={styles.metricItem}>
          <div className={styles.metricLabel}>Redis 7 & BullMQ</div>
          <div className={styles.metricValue}>
            <span
              className={`${styles.statusPill} ${
                redisStatus === 'connected' ? styles.statusConnected : styles.statusDisconnected
              }`}
            >
              {redisStatus === 'connected' ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <div className={styles.metricMeta}>
            {health?.services?.redis?.latencyMs !== undefined
              ? `Latency: ${health.services.redis.latencyMs}ms`
              : health?.services?.redis?.message || 'Queue & Cache pending'}
          </div>
        </div>
      </div>

      <div className={styles.envInfo}>
        <div>
          <strong>Target API:</strong> <code>{apiUrl}</code>
        </div>
        <div>
          <strong>Environment:</strong> <code>{health?.environment || process.env.NODE_ENV || 'development'}</code>
        </div>
        <div>
          <strong>Timestamp:</strong> <code>{health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'N/A'}</code>
        </div>
      </div>
    </div>
  );
}
