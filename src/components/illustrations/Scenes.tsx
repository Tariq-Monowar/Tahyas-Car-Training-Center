/**
 * Hand-painted style scenes set in Lakshmipur, Bangladesh.
 * Used wherever the owner hasn't added a real photo yet (see public/images/real/README.txt).
 * Bangladesh details: right-hand-drive cars keeping LEFT, paddy fields, coconut trees,
 * tin-roof houses, rickshaws, CNG auto-rickshaws, colourful buses.
 */
import {
  Birds, Bush, BusRear, C, CarRear, CarSide, Cloud, Cng, Cone, Hut, Paddy, Palm, Person, Pole, Rickshaw, Road, Scene, Sky, Sun, TreeLine,
} from "./kit";

/* 1. HERO — village road through paddy fields at golden hour, learner car keeping left */
export function HeroScene() {
  return (
    <Scene>
      <Sky id="hero" top="#8fcfe8" bottom="#ffe2a6" />
      <Sun x={600} y={170} r={30} />
      <Cloud x={160} y={90} s={1.1} />
      <Cloud x={520} y={60} s={0.8} o={0.85} />
      <Cloud x={700} y={120} s={0.6} o={0.8} />
      <Birds x={300} y={140} />
      <TreeLine y={232} color="#5a9a62" o={0.7} />
      <TreeLine y={244} />
      <Hut x={120} y={262} s={0.55} />
      <Hut x={610} y={260} s={0.5} roof="#8aa0b3" wall="#efdcb6" />
      <Paddy y={258} h={242} />
      {/* pond on the right */}
      <ellipse cx="690" cy="330" rx="120" ry="26" fill="#7fc4d9" opacity=".85" />
      <ellipse cx="690" cy="326" rx="80" ry="8" fill="#fff" opacity=".35" />
      <Road vx={390} vy={258} bl={150} br={600} color="#8b8578" edge="#d9c49a" />
      <Palm x={60} y={430} s={1.25} />
      <Palm x={150} y={330} s={0.7} lean={-1} />
      <Palm x={720} y={470} s={1.3} lean={-1} />
      <Palm x={600} y={300} s={0.55} />
      <Bush x={250} y={300} s={0.6} />
      <Bush x={560} y={292} s={0.5} color={C.treeDark} />
      {/* learner car keeps to the LEFT side of the road */}
      <CarRear x={318} y={438} s={1.15} />
    </Scene>
  );
}

/* 2. BASIC — inside a right-hand-drive car: hands on the wheel, village road ahead */
export function BasicScene() {
  return (
    <Scene>
      <Sky id="basic" top="#9bd4ec" bottom="#fdebc0" />
      <Cloud x={200} y={70} s={0.9} />
      <Cloud x={620} y={90} s={0.7} />
      <TreeLine y={196} />
      <Paddy y={210} h={140} />
      <Road vx={330} vy={210} bl={60} br={520} color="#8b8578" edge="#d9c49a" />
      <Palm x={40} y={300} s={0.8} />
      <Palm x={700} y={290} s={0.9} lean={-1} />
      {/* windscreen frame + mirror */}
      <path d="M0 0 H800 V40 Q400 10 0 40 Z" fill="#1d2433" />
      <path d="M0 0 L70 0 L0 260 Z M800 0 L730 0 L800 260 Z" fill="#1d2433" />
      <rect x="350" y="34" width="100" height="26" rx="12" fill="#1d2433" />
      {/* dashboard */}
      <path d="M0 300 Q400 250 800 300 V500 H0 Z" fill="#2a3242" />
      <path d="M0 312 Q400 264 800 312" stroke="#3a4458" strokeWidth="6" fill="none" />
      <rect x="250" y="330" width="120" height="60" rx="10" fill="#1d2433" />
      <rect x="262" y="342" width="96" height="36" rx="6" fill="#3b5578" />
      {/* gear lever (left of the driver in a RHD car) */}
      <path d="M320 500 L326 420" stroke="#1d2433" strokeWidth="14" strokeLinecap="round" />
      <circle cx="326" cy="414" r="16" fill="#111827" />
      {/* steering wheel on the RIGHT */}
      <g transform="translate(560 410)">
        <circle r="128" fill="none" stroke="#111827" strokeWidth="26" />
        <path d="M-120 -10 Q0 -40 120 -10" stroke="#111827" strokeWidth="22" fill="none" />
        <path d="M0 -14 V120" stroke="#111827" strokeWidth="22" />
        <circle r="34" fill="#1f2937" />
        <circle r="12" fill={C.amber} />
        {/* forearms from the driver's seat, hands at ten and two */}
        <path d="M-200 140 L-118 -50" stroke="#4dabf7" strokeWidth="40" strokeLinecap="round" />
        <path d="M200 140 L118 -50" stroke="#4dabf7" strokeWidth="40" strokeLinecap="round" />
        <path d="M-136 -20 L-116 -52 M136 -20 L116 -52" stroke={C.skin} strokeWidth="30" strokeLinecap="round" />
        <g fill={C.skin}>
          <ellipse cx="-112" cy="-66" rx="22" ry="18" />
          <ellipse cx="112" cy="-66" rx="22" ry="18" />
        </g>
      </g>
    </Scene>
  );
}

/* 3. ADVANCED — Lakshmipur town road: rickshaws, a CNG, shops, poles; all traffic keeps left */
export function TownScene() {
  const shops = [
    { x: 0, w: 130, h: 170, c: "#f6c6a8", a: "#e8590c" },
    { x: 130, w: 110, h: 210, c: "#cfe3f2", a: "#1971c2" },
    { x: 240, w: 120, h: 150, c: "#f2e3b3", a: "#2f9e44" },
    { x: 440, w: 120, h: 190, c: "#e6d2f0", a: "#ae3ec9" },
    { x: 560, w: 120, h: 160, c: "#f8d7da", a: "#e03131" },
    { x: 680, w: 120, h: 220, c: "#d3f9d8", a: "#f08c00" },
  ];
  return (
    <Scene>
      <Sky id="town" top="#a5d8ef" bottom="#fff1cf" />
      <Cloud x={420} y={70} s={0.9} />
      {shops.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={300 - b.h} width={b.w} height={b.h} fill={b.c} />
          {[0, 1].map((r) =>
            [0, 1].map((cc) => (
              <rect key={`${r}${cc}`} x={b.x + 18 + cc * (b.w / 2 - 6)} y={300 - b.h + 20 + r * 44} width={b.w / 2 - 30} height="26" rx="3" fill="#5b7088" opacity=".75" />
            )),
          )}
          <path d={`M${b.x + 6} 262 h${b.w - 12} l-8 18 h${-(b.w - 28)} Z`} fill={b.a} />
          <rect x={b.x + 14} y="280" width={b.w - 28} height="20" fill="#6b5844" opacity=".6" />
        </g>
      ))}
      <Pole x={380} y={300} h={190} />
      <Pole x={760} y={300} h={190} />
      <path d="M380 120 Q570 150 760 120 M380 128 Q570 162 760 128" stroke="#495057" strokeWidth="2" fill="none" />
      <rect x="0" y="300" width="800" height="200" fill="#8a8f9a" />
      <rect x="0" y="300" width="800" height="16" fill="#c2b59b" />
      <path d="M0 410 H800" stroke="#fff" strokeWidth="5" strokeDasharray="40 30" opacity=".8" />
      {/* left lane: traffic moving left-to-right on the near (left) side */}
      <Rickshaw x={110} y={392} s={0.9} />
      <Cng x={620} y={384} s={0.95} />
      <CarSide x={360} y={478} s={0.95} facing={-1} />
      <Rickshaw x={720} y={478} s={0.85} facing={-1} />
    </Scene>
  );
}

/* 4. PARKING — practice ground with cones, car reversing, instructor guiding */
export function ParkingScene() {
  return (
    <Scene>
      <Sky id="park" top="#9fd6ee" bottom="#fdf0cc" />
      <Cloud x={170} y={80} s={0.9} />
      <Cloud x={620} y={60} s={0.7} />
      <TreeLine y={220} />
      <Palm x={90} y={250} s={0.6} />
      <Palm x={700} y={252} s={0.7} lean={-1} />
      <Bush x={560} y={250} s={0.6} />
      <rect x="0" y="240" width="800" height="260" fill={C.grass} />
      <path d="M120 300 Q400 280 700 300 L760 500 L60 500 Z" fill="#c8b48a" />
      {/* parking bay */}
      <path d="M470 330 L470 460 M650 330 L650 460" stroke="#fff" strokeWidth="5" strokeDasharray="14 10" />
      <Cone x={470} y={330} s={0.9} />
      <Cone x={650} y={330} s={0.9} />
      <Cone x={470} y={462} s={1.05} />
      <Cone x={650} y={462} s={1.05} />
      {/* car reversing into the bay */}
      <CarSide x={330} y={440} s={0.95} facing={-1} />
      <path d="M470 400 Q520 380 560 404" stroke={C.amber} strokeWidth="6" fill="none" strokeDasharray="12 9" strokeLinecap="round" />
      <path d="M552 392 L566 408 L546 414" stroke={C.amber} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Person x={720} y={440} s={0.9} shirt="#f8f9fa" pants="#495057" arm="point" />
    </Scene>
  );
}

/* 5. HIGHWAY — wide highway between paddy fields, colourful bus ahead, car in the LEFT lane */
export function HighwayScene() {
  return (
    <Scene>
      <Sky id="hw" top="#6fbde4" bottom="#e6f4fa" />
      <Cloud x={150} y={110} s={1.3} />
      <Cloud x={560} y={80} s={1.1} />
      <Cloud x={760} y={150} s={0.7} />
      <TreeLine y={236} color="#5a9a62" o={0.75} />
      <Paddy y={250} h={250} />
      <Road vx={420} vy={250} bl={70} br={760} color="#5f6572" edge="#cfd4dc" line="#ffd43b" />
      <Palm x={30} y={360} s={0.9} />
      <Palm x={90} y={300} s={0.55} />
      <Palm x={770} y={380} s={1} lean={-1} />
      <Palm x={700} y={300} s={0.55} lean={-1} />
      <BusRear x={360} y={318} s={0.42} />
      <CarRear x={300} y={450} s={1.1} plateL={false} />
    </Scene>
  );
}

/* 6. WOMEN — a woman in hijab driving (right-hand drive), calm village background */
export function WomenScene({ evening = false }: { evening?: boolean }) {
  /* Driver in the FRONT side window (car coords: front = +x). Hijab, face looking ahead. */
  const driver = (
    <g>
      <path d="M26 -56 C22 -70 28 -82 40 -82 C52 -82 58 -72 56 -60 L56 -56 Z" fill="#c2255c" />
      <path d="M40 -60 C40 -72 44 -77 49 -77 C54 -77 57 -72 56 -65 C55 -60 51 -57 46 -58 Z" fill={C.skin} />
      <circle cx="52" cy="-69" r="1.3" fill="#2b2118" />
      <path d="M56 -63 q-2 2 -4 1" stroke="#7a4a2c" strokeWidth="1.2" fill="none" />
      <path d="M68 -70 L74 -56" stroke="#111827" strokeWidth="4" strokeLinecap="round" />
      <path d="M48 -57 L70 -62" stroke={C.skin} strokeWidth="5" strokeLinecap="round" />
    </g>
  );
  return (
    <Scene>
      <Sky id={evening ? "wE" : "wM"} top={evening ? "#f7b2a5" : "#a9dcef"} bottom={evening ? "#ffe3b3" : "#fff2d6"} />
      <Sun x={evening ? 620 : 640} y={evening ? 220 : 110} r={28} color={evening ? "#ffe8a3" : "#fff6d6"} />
      <Cloud x={180} y={90} s={0.9} />
      <TreeLine y={250} />
      <Hut x={560} y={276} s={0.6} />
      <Palm x={110} y={290} s={0.8} />
      <Palm x={720} y={300} s={0.85} lean={-1} />
      <rect x="0" y="276" width="800" height="224" fill={C.grass} />
      <rect x="0" y="380" width="800" height="120" fill="#a59c8c" />
      <path d="M0 440 H800" stroke="#fff" strokeWidth="5" strokeDasharray="40 30" opacity=".7" />
      <Bush x={300} y={290} s={0.6} />
      {/* car facing left so we see its right side — the driver's side in a RHD car */}
      <CarSide x={410} y={450} s={1.45} facing={-1} window="#b9d4ea" driver={driver} />
    </Scene>
  );
}

/* 7. FIRST LESSON — instructor explains, learner listens, car parked on a field */
export function JourneyScene() {
  return (
    <Scene>
      <Sky id="jr" top="#b4e0f2" bottom="#fff4d6" />
      <Sun x={140} y={110} r={26} />
      <Cloud x={480} y={80} s={0.9} />
      <TreeLine y={240} />
      <Hut x={600} y={262} s={0.55} />
      <Hut x={70} y={262} s={0.45} roof="#90a4b6" />
      <Palm x={520} y={270} s={0.6} />
      <rect x="0" y="260" width="800" height="240" fill={C.grass} />
      <path d="M0 330 Q400 300 800 330 V500 H0 Z" fill="#8fcd78" />
      <CarSide x={300} y={430} s={1.1} />
      <Person x={520} y={440} s={1} shirt="#f8f9fa" pants="#495057" arm="point" />
      <Person x={610} y={444} s={0.95} shirt="#74c0fc" pants="#343a40" />
    </Scene>
  );
}

/* 8. INSTRUCTOR — friendly trainer with a thumbs-up next to the training car */
export function InstructorScene() {
  return (
    <Scene>
      <Sky id="ins" top="#94d0ea" bottom="#fff0c9" />
      <Cloud x={620} y={80} s={0.9} />
      <TreeLine y={230} />
      {/* small training centre: green tin roof, blank yellow sign */}
      <g transform="translate(470 300)">
        <rect x="0" y="-90" width="220" height="90" fill="#f1e2c2" />
        <path d="M-16 -86 L110 -140 L236 -86 Z" fill="#2f9e44" />
        <rect x="70" y="-60" width="40" height="60" fill="#8a6a45" />
        <rect x="20" y="-62" width="34" height="26" fill="#5b7088" />
        <rect x="140" y="-62" width="56" height="26" fill="#5b7088" />
        <rect x="60" y="-118" width="100" height="22" rx="4" fill={C.amber} />
        <circle cx="110" cy="-107" r="7" fill="none" stroke={C.navy} strokeWidth="3" />
      </g>
      <Palm x={420} y={300} s={0.75} />
      <Palm x={740} y={300} s={0.7} lean={-1} />
      <rect x="0" y="300" width="800" height="200" fill="#c8b48a" />
      <path d="M0 300 H800 V320 H0 Z" fill={C.grass} />
      <CarSide x={260} y={450} s={1.15} />
      <Person x={500} y={460} s={1.05} shirt="#f8f9fa" pants="#343a40" arm="thumb" />
    </Scene>
  );
}

export const scenes = {
  hero: HeroScene,
  "course-basic": BasicScene,
  "course-advance": TownScene,
  "course-parking": ParkingScene,
  "course-highway": HighwayScene,
  "course-women": () => <WomenScene evening />,
  women: () => <WomenScene />,
  journey: JourneyScene,
  why: InstructorScene,
} as const;

export type SceneName = keyof typeof scenes;

export function Illustration({ name }: { name: SceneName }) {
  const S = scenes[name];
  return <S />;
}
