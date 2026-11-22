"use client";

import { useState } from "react";
import { TrafficLightSvg } from "./Signs";
import styles from "./Road.module.css";

type Light = "red" | "yellow" | "green";
type Props = { items: Record<Light, { name: string; meaning: string }>; hint: string };

/** Tap a lamp to read what it means. Works with keyboard too. */
export function TrafficLight({ items, hint }: Props) {
  const [on, setOn] = useState<Light>("red");
  const order: Light[] = ["red", "yellow", "green"];
  return (
    <div className={styles.light} data-on={on}>
      <div className={styles.lightPole}>
        <TrafficLightSvg on={on} size={190} />
        <div className={styles.lampButtons} role="group" aria-label={hint}>
          {order.map((l) => (
            <button key={l} type="button" data-light={l} aria-pressed={on === l} onClick={() => setOn(l)}>
              <span className="sr-only">{items[l].name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className={styles.lightText}>
        <p className={styles.lightHint}>{hint}</p>
        <div className={styles.lightTabs}>
          {order.map((l) => (
            <button key={l} type="button" data-light={l} aria-pressed={on === l} onClick={() => setOn(l)}>
              {items[l].name}
            </button>
          ))}
        </div>
        <p className={styles.lightMeaning} data-light={on} aria-live="polite">
          <strong>{items[on].name}:</strong> {items[on].meaning}
        </p>
      </div>
    </div>
  );
}
