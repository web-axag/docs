import React, { useState, useEffect, useRef } from 'react';
import styles from './styles.module.css';
// Generated at build time by scripts/generate-site-stats.mjs, so these can't drift.
import siteStats from '@site/src/data/site-stats.json';

interface Stat {
  value: number;
  suffix?: string;
  label: string;
  icon: string;
}

const stats: Stat[] = [
  { value: siteStats.documentationPages, label: 'Documentation Pages', icon: '📄' },
  { value: siteStats.industryDomains, label: 'Industry Domains', icon: '🏭' },
  { value: siteStats.validatedExamples, label: 'Validated Examples', icon: '✅' },
  { value: siteStats.lintRules, label: 'Lint Rules', icon: '🔍' },
  { value: siteStats.specificationAttributes, label: 'Specification Attributes', icon: '🏷️' },
  { value: siteStats.sdkPackages, label: 'SDK Packages', icon: '📦' },
];

function useCountUp(target: number, isVisible: boolean, duration = 1500): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!isVisible) return;

    startTime.current = null;

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };

    animationFrame.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [isVisible, target, duration]);

  return count;
}

function StatCard({ stat, isVisible, delay }: { stat: Stat; isVisible: boolean; delay: number }) {
  const count = useCountUp(stat.value, isVisible, 1500 + delay);

  return (
    <div className={styles.stat} style={{ animationDelay: `${delay}ms` }}>
      <div className={styles.statIcon}>{stat.icon}</div>
      <div className={styles.statValue}>{count}{stat.suffix || ''}</div>
      <div className={styles.statLabel}>{stat.label}</div>
    </div>
  );
}

export default function HomepageStats(): JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.statsSection} ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              stat={stat}
              isVisible={isVisible}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
