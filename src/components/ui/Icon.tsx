import {
  Car, CircleGauge, Compass, Hand, Milestone, MoonStar, ShieldCheck, Signpost,
  Smartphone, Smile, SquareParking, TrafficCone, Users, UserRound, type LucideProps,
} from "lucide-react";
import type { IconName } from "@/config/site";

/** Steering wheel (not in Lucide) — same 24px grid & 2px stroke as Lucide. */
export function SteeringIcon(props: LucideProps) {
  const { size = 24, strokeWidth = 2, ...rest } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" {...(rest as React.SVGProps<SVGSVGElement>)}
    >
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M3 10.5c3-1 6-1.3 9-1.3s6 .3 9 1.3M10 13.8 6.5 20M14 13.8l3.5 6.2" />
    </svg>
  );
}

/** "No phone" icon: phone with a slash. */
function PhoneOffIcon(props: LucideProps) {
  return (
    <span style={{ position: "relative", display: "inline-grid" }}>
      <Smartphone {...props} />
      <svg viewBox="0 0 24 24" width={props.size ?? 24} height={props.size ?? 24} style={{ position: "absolute", inset: 0 }} aria-hidden="true">
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
      </svg>
    </span>
  );
}

const map: Record<IconName, React.ComponentType<LucideProps>> = {
  steering: SteeringIcon,
  gauge: CircleGauge,
  parking: SquareParking,
  highway: Milestone,
  women: UserRound,
  users: Users,
  shield: ShieldCheck,
  car: Car,
  hand: Hand,
  smile: Smile,
  signpost: Signpost,
  cone: TrafficCone,
  "phone-off": PhoneOffIcon,
  moon: MoonStar,
  compass: Compass,
};

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const C = map[name];
  return <C aria-hidden="true" strokeWidth={2} {...props} />;
}

export function WhatsAppIcon({ size = 24, ...rest }: { size?: number } & React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...rest}>
      <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.17-1.5A9.93 9.93 0 1 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.07.89.9-2.98-.2-.31a8.22 8.22 0 1 1 6.87 3.73Zm4.5-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.55.12-.17.25-.64.8-.78.96-.15.17-.29.19-.54.06a6.74 6.74 0 0 1-3.36-2.94c-.25-.44.25-.4.72-1.35.08-.16.04-.3-.02-.43l-.76-1.82c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.65.3 2.74 2.74 0 0 0-.86 2.04 4.76 4.76 0 0 0 1 2.53 10.9 10.9 0 0 0 4.18 3.69c1.55.67 2.16.73 2.94.61.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29Z" />
    </svg>
  );
}
