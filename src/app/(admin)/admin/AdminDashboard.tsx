"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LogOut, Sun, Moon, RefreshCw, Search, Download, X, Phone, Mail, MessageCircle, Copy,
  Trash2, CircleCheck, CircleX, Clock, Users, CalendarDays, ChevronDown,
  ExternalLink, StickyNote, SlidersHorizontal, RotateCcw, Inbox, Check, Eye, UserPlus, Award, GraduationCap,
} from "lucide-react";
import styles from "./admin.module.css";
import AddStudentModal from "./AddStudentModal";
import CertificateModal from "./CertificateModal";
import CustomCertificateModal from "./CustomCertificateModal";
import {
  STATUS_LABEL, GENDER_LABEL, DAY, bn, waNumber, dayStr, addDays, fmtDay, trainingInfo,
  type Status, type Enrollment, type Certificate,
} from "./shared";

/* ── Types & constants ─────────────────────────────────────────────────── */
type DateRange = "all" | "today" | "7d" | "30d" | "custom";
type SortKey = "newest" | "oldest";
type Training = "all" | "ongoing" | "upcoming" | "ended" | "unset" | "certified";
type Theme = "light" | "dark";

const THEME_KEY = "tahyas-admin-theme";
const PAGE_SIZE = 20;

const fmtDate = (d: string) => new Date(d).toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
const fmtTime = (d: string) => new Date(d).toLocaleTimeString("bn-BD", { hour: "numeric", minute: "2-digit" });
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function relative(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "এইমাত্র";
  if (m < 60) return `${bn(m)} মিনিট আগে`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${bn(h)} ঘণ্টা আগে`;
  const days = Math.floor(h / 24);
  if (days < 30) return `${bn(days)} দিন আগে`;
  return fmtDate(d);
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function exportCSV(rows: Enrollment[]) {
  const head = ["নাম", "ফোন", "ইমেইল", "কোর্স", "বয়স", "লিঙ্গ", "অবস্থা", "ট্রেনিং শুরু", "ট্রেনিং শেষ", "সার্টিফিকেট নং", "মন্তব্য", "অ্যাডমিন নোট", "তারিখ"];
  const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = rows.map((e) => [
    e.name, e.phone, e.email ?? "", e.course, e.age ?? "", GENDER_LABEL[e.gender ?? ""] ?? "",
    STATUS_LABEL[e.status] ?? e.status, dayStr(e.trainingStart), dayStr(e.trainingEnd), e.certificate?.no ?? "",
    e.message ?? "", e.adminNote ?? "",
    new Date(e.createdAt).toLocaleString("en-GB"),
  ].map((v) => esc(String(v))).join(","));
  // BOM so Excel renders Bengali correctly
  const blob = new Blob(["﻿" + [head.map(esc).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `enrollments-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ── Component ─────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<Enrollment[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [counts, setCounts] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [theme, setTheme] = useState<Theme>("dark");

  // filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<Status | "all">("all");
  const [course, setCourse] = useState("all");
  const [gender, setGender] = useState("all");
  const [range, setRange] = useState<DateRange>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [training, setTraining] = useState<Training>("all");
  const [showFilters, setShowFilters] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());

  // drawer / dialogs
  const [activeId, setActiveId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showCustomCert, setShowCustomCert] = useState(false);
  const [certFor, setCertFor] = useState<string | null>(null);
  const [trainDraft, setTrainDraft] = useState({ start: "", end: "" });
  const [savingTrain, setSavingTrain] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; text: string; kind: "ok" | "err" }[]>([]);

  const reqSeq = useRef(0);       // ignore stale responses when filters change quickly
  const needMeta = useRef(true);  // counts + course list: only on first load / manual refresh

  /* ── Theme ── */
  useEffect(() => {
    const t = document.documentElement.dataset.theme;
    setTheme(t === "light" ? "light" : "dark");
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch { /* storage unavailable */ }
  }

  /* ── Toasts ── */
  const toast = useCallback((text: string, kind: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  /* ── Data (server-side filters + cursor pagination) ── */
  // Wait until typing pauses before hitting the server.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const buildParams = useCallback(() => {
    const p = new URLSearchParams();
    if (status !== "all") p.set("status", status);
    if (course !== "all") p.set("course", course);
    if (gender !== "all") p.set("gender", gender || "none");
    if (sort === "oldest") p.set("sort", "oldest");
    if (training !== "all") p.set("training", training);
    if (debouncedSearch) p.set("q", debouncedSearch);
    let lo = 0, hi = 0;
    if (range === "today") lo = startOfDay(new Date());
    else if (range === "7d") lo = Date.now() - 7 * DAY;
    else if (range === "30d") lo = Date.now() - 30 * DAY;
    else if (range === "custom") {
      if (from) lo = new Date(from + "T00:00:00").getTime();
      if (to) hi = new Date(to + "T00:00:00").getTime() + DAY - 1;
    }
    if (lo) p.set("from", String(lo));
    if (hi) p.set("to", String(hi));
    return p;
  }, [status, course, gender, sort, training, debouncedSearch, range, from, to]);

  const fetchPage = useCallback(async (cursor: string | null) => {
    const seq = cursor ? reqSeq.current : ++reqSeq.current;
    const p = buildParams();
    p.set("limit", String(PAGE_SIZE));
    if (cursor) p.set("cursor", cursor);
    const withMeta = !cursor && needMeta.current;
    if (withMeta) p.set("meta", "1");

    if (cursor) setLoadingMore(true);
    try {
      const r = await fetch(`/api/admin/enrollments?${p}`, { cache: "no-store" });
      if (r.status === 401) { router.replace("/admin/login"); return; }
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (seq !== reqSeq.current) return; // a newer request replaced this one
      const rows: Enrollment[] = Array.isArray(d.items) ? d.items : [];
      setItems((prev) => (cursor ? [...prev, ...rows] : rows));
      setNextCursor(d.nextCursor ?? null);
      if (d.meta) {
        setCounts({ total: 0, pending: 0, confirmed: 0, cancelled: 0, ...d.meta.counts });
        setCourses(d.meta.courses ?? []);
        needMeta.current = false;
      }
      if (!cursor) setSelected(new Set());
      setLoadError("");
      setLastUpdated(new Date());
    } catch {
      if (seq === reqSeq.current) setLoadError("ডেটা লোড করা যায়নি। আবার চেষ্টা করুন।");
    } finally {
      if (seq === reqSeq.current) { setLoading(false); setRefreshing(false); setLoadingMore(false); }
    }
  }, [buildParams, router]);

  // First page whenever filters change (also runs once on mount).
  useEffect(() => { fetchPage(null); }, [fetchPage]);

  function refresh() {
    needMeta.current = true;
    setRefreshing(true);
    fetchPage(null);
  }

  async function exportFiltered() {
    setExporting(true);
    try {
      const p = buildParams();
      p.set("export", "1");
      const r = await fetch(`/api/admin/enrollments?${p}`, { cache: "no-store" });
      if (!r.ok) throw new Error();
      const d = await r.json();
      const rows: Enrollment[] = d.items ?? [];
      if (rows.length === 0) toast("এক্সপোর্ট করার মতো কিছু নেই", "err");
      else exportCSV(rows);
    } catch {
      toast("এক্সপোর্ট ব্যর্থ হয়েছে", "err");
    } finally {
      setExporting(false);
    }
  }

  /* ── Lock page scroll while a sheet/modal is open (important on phones) ── */
  const overlayOpen = !!(activeId || certFor || showAdd || showCustomCert || confirmDelete);
  useEffect(() => {
    if (!overlayOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [overlayOpen]);

  /* ── Keyboard shortcuts ── */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        if (confirmDelete) setConfirmDelete(null);
        else if (certFor) setCertFor(null);
        else if (showCustomCert) setShowCustomCert(false);
        else if (showAdd) setShowAdd(false);
        else if (activeId) setActiveId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, confirmDelete, certFor, showAdd, showCustomCert]);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  /* ── Mutations (optimistic, no list re-fetch) ── */
  function shiftCounts(rows: Enrollment[], next: Status | null) {
    setCounts((c) => {
      const n = { ...c };
      for (const e of rows) {
        n[e.status] = Math.max(0, n[e.status] - 1);
        if (next) n[next]++;
        else n.total = Math.max(0, n.total - 1);
      }
      return n;
    });
  }

  async function updateStatus(ids: string[], next: Status) {
    const prevItems = items;
    const prevCounts = counts;
    const changed = items.filter((e) => ids.includes(e._id) && e.status !== next);
    shiftCounts(changed, next);
    setItems((d) => d
      .map((e) => (ids.includes(e._id) ? { ...e, status: next } : e))
      // drop rows that no longer match the active status tab (keep the one open in the drawer)
      .filter((e) => status === "all" || e.status === status || e._id === activeId));
    try {
      const r = await fetch("/api/admin/enrollments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, status: next }),
      });
      if (!r.ok) throw new Error();
      toast(ids.length > 1 ? `${bn(ids.length)}টি আবেদন "${STATUS_LABEL[next]}" করা হয়েছে` : `অবস্থা "${STATUS_LABEL[next]}" করা হয়েছে`);
      setSelected(new Set());
    } catch {
      setItems(prevItems);
      setCounts(prevCounts);
      toast("আপডেট ব্যর্থ হয়েছে", "err");
    }
  }

  async function saveNote(id: string) {
    setSavingNote(true);
    try {
      const r = await fetch("/api/admin/enrollments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], adminNote: noteDraft }),
      });
      if (!r.ok) throw new Error();
      setItems((d) => d.map((e) => (e._id === id ? { ...e, adminNote: noteDraft } : e)));
      toast("নোট সংরক্ষিত হয়েছে");
    } catch {
      toast("নোট সংরক্ষণ ব্যর্থ", "err");
    } finally {
      setSavingNote(false);
    }
  }

  async function doDelete(ids: string[]) {
    setConfirmDelete(null);
    try {
      const r = await fetch("/api/admin/enrollments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!r.ok) throw new Error();
      shiftCounts(items.filter((e) => ids.includes(e._id)), null);
      setItems((d) => d.filter((e) => !ids.includes(e._id)));
      setSelected((s) => { const n = new Set(s); ids.forEach((i) => n.delete(i)); return n; });
      if (activeId && ids.includes(activeId)) setActiveId(null);
      toast(`${bn(ids.length)}টি আবেদন মুছে ফেলা হয়েছে`);
    } catch {
      toast("মুছতে ব্যর্থ হয়েছে", "err");
    }
  }

  async function saveTraining(id: string) {
    const { start, end } = trainDraft;
    if (start && end && start > end) { toast("শুরুর তারিখ শেষের তারিখের পরে হতে পারে না", "err"); return; }
    setSavingTrain(true);
    try {
      const r = await fetch("/api/admin/enrollments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], trainingStart: start, trainingEnd: end }),
      });
      if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error);
      const toIso = (s: string) => (s ? `${s}T00:00:00.000Z` : null);
      setItems((d) => d.map((e) => (e._id === id ? { ...e, trainingStart: toIso(start), trainingEnd: toIso(end) } : e)));
      toast("ট্রেনিংয়ের তারিখ সংরক্ষিত হয়েছে");
    } catch (err) {
      toast(err instanceof Error && err.message ? err.message : "সংরক্ষণ ব্যর্থ", "err");
    } finally {
      setSavingTrain(false);
    }
  }

  function onStudentCreated(e: Enrollment) {
    setShowAdd(false);
    setItems((d) => [e, ...d]);
    setCounts((c) => ({ ...c, total: c.total + 1, confirmed: c.confirmed + 1 }));
    if (!courses.includes(e.course)) setCourses((c) => [...c, e.course].sort());
    toast(`${e.name} যোগ হয়েছে`);
  }

  function setCertificate(id: string, cert: Certificate | null) {
    setItems((d) => d.map((e) => (e._id === id ? { ...e, certificate: cert } : e)));
  }

  async function copy(text: string) {
    try { await navigator.clipboard.writeText(text); toast("কপি হয়েছে"); }
    catch { toast("কপি করা যায়নি", "err"); }
  }

  /* ── Derived ── */
  const activeFilterCount =
    (course !== "all" ? 1 : 0) + (gender !== "all" ? 1 : 0) + (range !== "all" ? 1 : 0) + (sort !== "newest" ? 1 : 0) + (training !== "all" ? 1 : 0);
  const anyFilter = activeFilterCount > 0 || status !== "all" || search.trim() !== "";

  function resetFilters() {
    setSearch(""); setDebouncedSearch(""); setStatus("all"); setCourse("all"); setGender("all");
    setRange("all"); setFrom(""); setTo(""); setSort("newest"); setTraining("all");
  }

  const allSelected = items.length > 0 && items.every((e) => selected.has(e._id));
  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(items.map((e) => e._id)));
  }
  function toggleOne(id: string) {
    setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  }

  const active = activeId ? items.find((e) => e._id === activeId) ?? null : null;
  function openDrawer(e: Enrollment) {
    setActiveId(e._id);
    setNoteDraft(e.adminNote ?? "");
    setTrainDraft({ start: dayStr(e.trainingStart), end: dayStr(e.trainingEnd) });
  }
  const certTarget = certFor ? items.find((e) => e._id === certFor) ?? null : null;

  /* ── Render ── */
  const statCards: { key: Status | "all"; label: string; value: number; icon: React.ReactNode; tone: string }[] = [
    { key: "all", label: "মোট আবেদন", value: counts.total, icon: <Users size={18} />, tone: styles.toneBlue },
    { key: "pending", label: "অপেক্ষমান", value: counts.pending, icon: <Clock size={18} />, tone: styles.toneAmber },
    { key: "confirmed", label: "নিশ্চিত", value: counts.confirmed, icon: <CircleCheck size={18} />, tone: styles.toneGreen },
  ];

  return (
    <div className={styles.layout}>
      {/* ── Top bar ── */}
      <header className={styles.topbar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>🚗</span>
          <span className={styles.brandName}>তাহয়াস</span>
          <span className={styles.brandSep} />
          <span className={styles.brandLabel}>Admin Panel</span>
        </div>
        <div className={styles.topbarRight}>
          <button className={styles.iconBtn} onClick={refresh} title="রিফ্রেশ" aria-label="রিফ্রেশ">
            <RefreshCw size={16} className={refreshing ? styles.spin : ""} />
          </button>
          <button className={styles.iconBtn} onClick={toggleTheme}
            title={theme === "dark" ? "লাইট মোড" : "ডার্ক মোড"} aria-label="থিম পরিবর্তন">
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button className={styles.logoutBtn} onClick={logout}>
            <LogOut size={15} /> <span className={styles.hideSm}>লগআউট</span>
          </button>
        </div>
      </header>

      <main className={styles.main}>
        {/* ── Page heading ── */}
        <div className={styles.pageHead}>
          <div>
            <h1 className={styles.pageTitle}>ড্যাশবোর্ড</h1>
            <p className={styles.pageSub}>
              {lastUpdated ? <>সর্বশেষ আপডেট: {fmtTime(lastUpdated.toISOString())}</> : "লোড হচ্ছে…"}
            </p>
          </div>
          <div className={styles.headActions}>
            <button className={styles.ghostBtn} onClick={exportFiltered} disabled={exporting || items.length === 0}
              title="বর্তমান ফিল্টারের সব আবেদন এক্সপোর্ট হবে">
              <Download size={15} /> {exporting ? "এক্সপোর্ট হচ্ছে…" : "CSV"}
            </button>
            <button className={styles.ghostBtn} onClick={() => setShowCustomCert(true)}>
              <Award size={15} /> কাস্টম সার্টিফিকেট
            </button>
            <button className={`${styles.primaryBtn} ${styles.desktopOnly}`} onClick={() => setShowAdd(true)}>
              <UserPlus size={15} /> নতুন স্টুডেন্ট
            </button>
          </div>
        </div>

        {loadError && (
          <div className={styles.alert}>
            {loadError}
            <button onClick={refresh}>আবার চেষ্টা</button>
          </div>
        )}

        {/* ── Stats ── */}
        <div className={styles.statsRow}>
          {statCards.map((c) => (
            <button key={c.key} className={`${styles.stat} ${c.tone} ${status === c.key ? styles.statActive : ""}`}
              onClick={() => setStatus(c.key)} aria-pressed={status === c.key}>
              <div className={styles.statTop}>
                <span className={styles.statLabel}>{c.label}</span>
                <span className={styles.statIcon}>{c.icon}</span>
              </div>
              <div className={styles.statNum}>{loading ? <span className={styles.skelNum} /> : bn(c.value)}</div>
            </button>
          ))}
        </div>

        {/* ── Table card ── */}
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <div className={styles.cardTitle}>
              স্টুডেন্ট ও আবেদন
            </div>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <Search size={15} />
                <input ref={searchRef} className={styles.search} placeholder="নাম, ফোন, ইমেইল বা কোর্স খুঁজুন…"
                  value={search} onChange={(e) => setSearch(e.target.value)} />
                {search ? (
                  <button className={styles.searchClear} onClick={() => setSearch("")} aria-label="মুছুন"><X size={14} /></button>
                ) : <kbd className={styles.kbd}>/</kbd>}
              </div>
              <button className={`${styles.ghostBtn} ${showFilters ? styles.ghostBtnOn : ""}`} onClick={() => setShowFilters((v) => !v)}>
                <SlidersHorizontal size={15} /> ফিল্টার
                {activeFilterCount > 0 && <span className={styles.filterDot}>{bn(activeFilterCount)}</span>}
              </button>
            </div>
          </div>

          {/* status tabs */}
          <div className={styles.tabs} role="tablist">
            {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
              <button key={s} role="tab" aria-selected={status === s}
                className={`${styles.tab} ${status === s ? styles.tabOn : ""}`} onClick={() => setStatus(s)}>
                {s === "all" ? "সব" : STATUS_LABEL[s]}
                <span className={styles.tabCount}>{bn(s === "all" ? counts.total : counts[s])}</span>
              </button>
            ))}
          </div>

          {/* filter panel */}
          {showFilters && (
            <div className={styles.filters}>
              <label className={styles.fGroup}>
                <span>কোর্স</span>
                <select value={course} onChange={(e) => setCourse(e.target.value)}>
                  <option value="all">সব কোর্স</option>
                  {courses.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className={styles.fGroup}>
                <span>ট্রেনিং</span>
                <select value={training} onChange={(e) => setTraining(e.target.value as Training)}>
                  <option value="all">সব</option>
                  <option value="ongoing">চলমান</option>
                  <option value="upcoming">শুরু হয়নি</option>
                  <option value="ended">শেষ হয়েছে</option>
                  <option value="unset">তারিখ দেওয়া নেই</option>
                  <option value="certified">সার্টিফিকেট দেওয়া হয়েছে</option>
                </select>
              </label>
              <label className={styles.fGroup}>
                <span>লিঙ্গ</span>
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="all">সব</option>
                  <option value="male">পুরুষ</option>
                  <option value="female">নারী</option>
                  <option value="other">অন্যান্য</option>
                  <option value="">উল্লেখ নেই</option>
                </select>
              </label>
              <label className={styles.fGroup}>
                <span>আবেদনের সময়</span>
                <select value={range} onChange={(e) => setRange(e.target.value as DateRange)}>
                  <option value="all">সব সময়</option>
                  <option value="today">আজ</option>
                  <option value="7d">গত ৭ দিন</option>
                  <option value="30d">গত ৩০ দিন</option>
                  <option value="custom">নির্দিষ্ট তারিখ…</option>
                </select>
              </label>
              {range === "custom" && (
                <>
                  <label className={styles.fGroup}>
                    <span>শুরু</span>
                    <input type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
                  </label>
                  <label className={styles.fGroup}>
                    <span>শেষ</span>
                    <input type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
                  </label>
                </>
              )}
              <label className={styles.fGroup}>
                <span>সাজানো</span>
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="newest">নতুন আগে</option>
                  <option value="oldest">পুরাতন আগে</option>
                </select>
              </label>
              <button className={styles.resetBtn} onClick={resetFilters} disabled={!anyFilter}>
                <RotateCcw size={14} /> রিসেট
              </button>
            </div>
          )}

          {/* bulk actions */}
          {selected.size > 0 && (
            <div className={styles.bulkBar}>
              <span><b>{bn(selected.size)}</b>টি নির্বাচিত</span>
              <div className={styles.bulkActions}>
                <button className={styles.bulkOk} onClick={() => updateStatus([...selected], "confirmed")}><Check size={14} /> নিশ্চিত</button>
                <button className={styles.bulkWarn} onClick={() => updateStatus([...selected], "pending")}><Clock size={14} /> অপেক্ষমান</button>
                <button className={styles.bulkWarn} onClick={() => updateStatus([...selected], "cancelled")}><CircleX size={14} /> বাতিল</button>
                <button className={styles.bulkWarn} onClick={() => exportCSV(items.filter((e) => selected.has(e._id)))}><Download size={14} /> CSV</button>
                <button className={styles.bulkDanger} onClick={() => setConfirmDelete([...selected])}><Trash2 size={14} /> মুছুন</button>
                <button className={styles.bulkClose} onClick={() => setSelected(new Set())} aria-label="নির্বাচন বাতিল"><X size={15} /></button>
              </div>
            </div>
          )}

          {/* table */}
          {loading ? (
            <div className={styles.skeleton}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.skelRow} />)}
            </div>
          ) : items.length === 0 ? (
            <div className={styles.empty}>
              <Inbox size={40} strokeWidth={1.4} />
              <p>{anyFilter ? "এই ফিল্টারে কোনো আবেদন পাওয়া যায়নি।" : "এখনো কোনো আবেদন আসেনি।"}</p>
              {anyFilter && <button className={styles.ghostBtn} onClick={resetFilters}><RotateCcw size={14} /> ফিল্টার রিসেট</button>}
            </div>
          ) : (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.chkCell}>
                        <input type="checkbox" className={styles.chk} checked={allSelected} onChange={toggleAll} aria-label="সব নির্বাচন" />
                      </th>
                      <th>আবেদনকারী</th>
                      <th>ফোন</th>
                      <th>কোর্স</th>
                      <th>ট্রেনিং</th>
                      <th>অবস্থা</th>
                      <th className={styles.actionsHead}>অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((e) => (
                      <tr key={e._id} className={selected.has(e._id) ? styles.rowSel : ""} onClick={() => openDrawer(e)}>
                        <td className={styles.chkCell} onClick={(ev) => ev.stopPropagation()}>
                          <input type="checkbox" className={styles.chk} checked={selected.has(e._id)} onChange={() => toggleOne(e._id)} aria-label={`${e.name} নির্বাচন`} />
                        </td>
                        <td data-label="আবেদনকারী">
                          <div className={styles.person}>
                            <span className={styles.avatar} data-status={e.status}>{initials(e.name)}</span>
                            <div className={styles.personText}>
                              <span className={styles.name}>
                                {e.name}
                                {e.adminNote && <StickyNote size={12} className={styles.noteIcon} aria-label="নোট আছে" />}
                                {e.certificate && <Award size={13} className={styles.certIcon} aria-label="সার্টিফিকেট দেওয়া হয়েছে" />}
                              </span>
                              <span className={styles.personSub}>
                                {e.source === "admin" ? "অ্যাডমিন যোগ করেছেন" : `আবেদন ${relative(e.createdAt)}`}
                                {e.email ? ` · ${e.email}` : ""}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td data-label="ফোন" className={styles.phone} onClick={(ev) => ev.stopPropagation()}>
                          <a href={`tel:${e.phone}`}>{e.phone}</a>
                        </td>
                        <td data-label="কোর্স"><span className={styles.coursePill}>{e.course}</span></td>
                        <td data-label="ট্রেনিং"><TrainingCell e={e} /></td>
                        <td data-label="অবস্থা" onClick={(ev) => ev.stopPropagation()}>
                          <select className={`${styles.statusSelect} ${styles[e.status]}`} value={e.status}
                            onChange={(ev) => updateStatus([e._id], ev.target.value as Status)} aria-label="অবস্থা পরিবর্তন">
                            <option value="pending">অপেক্ষমান</option>
                            <option value="confirmed">নিশ্চিত</option>
                            <option value="cancelled">বাতিল</option>
                          </select>
                        </td>
                        <td className={styles.actions} onClick={(ev) => ev.stopPropagation()}>
                          <a className={styles.actBtn} href={`tel:${e.phone}`} title="কল করুন"><Phone size={14} /></a>
                          <a className={`${styles.actBtn} ${styles.actWa}`} href={`https://wa.me/${waNumber(e.phone)}`} target="_blank" rel="noreferrer" title="WhatsApp"><MessageCircle size={14} /></a>
                          <button className={`${styles.actBtn} ${styles.actCert} ${e.certificate ? styles.actCertOn : ""}`}
                            onClick={() => setCertFor(e._id)} disabled={e.status === "cancelled"}
                            title={e.certificate ? "সার্টিফিকেট দেখুন / পাঠান" : "সার্টিফিকেট তৈরি করুন"}><Award size={14} /></button>
                          <button className={`${styles.actBtn} ${styles.actView}`} onClick={() => openDrawer(e)} title="বিস্তারিত"><Eye size={14} /></button>
                          <button className={`${styles.actBtn} ${styles.actDanger}`} onClick={() => setConfirmDelete([e._id])} title="মুছুন"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* cursor pagination: load the next batch on demand */}
              <div className={styles.pager}>
                <span className={styles.pagerInfo}>
                  {bn(items.length)}টি দেখানো হচ্ছে{!nextCursor && items.length > PAGE_SIZE ? " · সব লোড হয়েছে" : ""}
                </span>
                {nextCursor && (
                  <button className={styles.ghostBtn} onClick={() => fetchPage(nextCursor)} disabled={loadingMore}>
                    {loadingMore ? <><RefreshCw size={14} className={styles.spin} /> লোড হচ্ছে…</> : <><ChevronDown size={15} /> আরও দেখুন</>}
                  </button>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      {/* ── Detail drawer ── */}
      {active && (
        <div className={styles.overlay} onClick={() => setActiveId(null)}>
          <aside className={styles.drawer} onClick={(e) => e.stopPropagation()} role="dialog" aria-label="আবেদনের বিস্তারিত">
            <div className={styles.drawerHead}>
              <div className={styles.person}>
                <span className={`${styles.avatar} ${styles.avatarLg}`} data-status={active.status}>{initials(active.name)}</span>
                <div className={styles.personText}>
                  <span className={styles.drawerName}>{active.name}</span>
                  <span className={`${styles.badge} ${styles[active.status]}`}>{STATUS_LABEL[active.status]}</span>
                </div>
              </div>
              <button className={styles.iconBtn} onClick={() => setActiveId(null)} aria-label="বন্ধ করুন"><X size={18} /></button>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.quick}>
                <a href={`tel:${active.phone}`} className={styles.quickBtn}><Phone size={16} /> কল</a>
                <a href={`https://wa.me/${waNumber(active.phone)}`} target="_blank" rel="noreferrer" className={`${styles.quickBtn} ${styles.quickWa}`}><MessageCircle size={16} /> WhatsApp</a>
                {active.email && <a href={`mailto:${active.email}`} className={styles.quickBtn}><Mail size={16} /> ইমেইল</a>}
              </div>

              <h3 className={styles.dSection}>অবস্থা পরিবর্তন</h3>
              <div className={styles.statusSwitch}>
                {(["pending", "confirmed", "cancelled"] as const).map((s) => (
                  <button key={s} className={`${styles.switchBtn} ${active.status === s ? styles[`sw_${s}`] : ""}`}
                    onClick={() => active.status !== s && updateStatus([active._id], s)}>
                    {s === "pending" ? <Clock size={14} /> : s === "confirmed" ? <CircleCheck size={14} /> : <CircleX size={14} />}
                    {STATUS_LABEL[s]}
                  </button>
                ))}
              </div>

              <h3 className={styles.dSection}><GraduationCap size={14} /> ট্রেনিং সময়কাল</h3>
              <div className={styles.trainBox}>
                <TrainingCell e={active} wide />
                <div className={styles.trainInputs}>
                  <label className={styles.fField}>
                    <span>শুরু</span>
                    <input type="date" value={trainDraft.start} onChange={(ev) => setTrainDraft((t) => ({ ...t, start: ev.target.value }))} />
                  </label>
                  <label className={styles.fField}>
                    <span>শেষ</span>
                    <input type="date" value={trainDraft.end} min={trainDraft.start || undefined}
                      onChange={(ev) => setTrainDraft((t) => ({ ...t, end: ev.target.value }))} />
                  </label>
                </div>
                <div className={styles.chips}>
                  {[7, 15, 30, 45, 60].map((n) => (
                    <button key={n} type="button" className={styles.chip} disabled={!trainDraft.start}
                      onClick={() => setTrainDraft((t) => ({ ...t, end: addDays(t.start, n - 1) }))}>
                      {bn(n)} দিন
                    </button>
                  ))}
                </div>
                <div className={styles.noteFoot}>
                  <span>{trainDraft.start || trainDraft.end ? "" : "তারিখ দিলে কত দিন বাকি দেখাবে"}</span>
                  <button className={styles.primaryBtn} onClick={() => saveTraining(active._id)}
                    disabled={savingTrain || (trainDraft.start === dayStr(active.trainingStart) && trainDraft.end === dayStr(active.trainingEnd))}>
                    {savingTrain ? "সংরক্ষণ হচ্ছে…" : "তারিখ সংরক্ষণ"}
                  </button>
                </div>
              </div>

              <h3 className={styles.dSection}><Award size={14} /> সার্টিফিকেট</h3>
              <div className={styles.certCard}>
                {active.certificate ? (
                  <>
                    <div>
                      <b className={styles.mono}>{active.certificate.no}</b>
                      <span>প্রদান: {fmtDate(active.certificate.issuedAt)}</span>
                    </div>
                    <button className={styles.primaryBtn} onClick={() => setCertFor(active._id)}>
                      <MessageCircle size={15} /> দেখুন / পাঠান
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <b>এখনো দেওয়া হয়নি</b>
                      <span>{active.status === "cancelled" ? "বাতিল আবেদনে সার্টিফিকেট দেওয়া যায় না" : "যেকোনো সময় তৈরি করে WhatsApp-এ পাঠাতে পারবেন"}</span>
                    </div>
                    <button className={styles.primaryBtn} onClick={() => setCertFor(active._id)} disabled={active.status === "cancelled"}>
                      <Award size={15} /> তৈরি করুন
                    </button>
                  </>
                )}
              </div>

              <h3 className={styles.dSection}>তথ্য</h3>
              <dl className={styles.info}>
                <div><dt>ফোন</dt><dd>{active.phone} <button className={styles.copyBtn} onClick={() => copy(active.phone)} aria-label="কপি"><Copy size={13} /></button></dd></div>
                <div><dt>ইমেইল</dt><dd>{active.email ? <>{active.email} <button className={styles.copyBtn} onClick={() => copy(active.email!)} aria-label="কপি"><Copy size={13} /></button></> : "—"}</dd></div>
                <div><dt>কোর্স</dt><dd>{active.course}</dd></div>
                <div><dt>বয়স</dt><dd>{active.age ? `${bn(Number(active.age) || 0)} বছর` : "—"}</dd></div>
                <div><dt>লিঙ্গ</dt><dd>{GENDER_LABEL[active.gender ?? ""] ?? "—"}</dd></div>
                <div><dt><CalendarDays size={13} /> আবেদনের সময়</dt><dd>{fmtDate(active.createdAt)}, {fmtTime(active.createdAt)}</dd></div>
                <div><dt>আবেদন ID</dt><dd className={styles.mono}>{active._id.slice(-8).toUpperCase()}</dd></div>
              </dl>

              {active.message && (
                <>
                  <h3 className={styles.dSection}>আবেদনকারীর মন্তব্য</h3>
                  <blockquote className={styles.message}>{active.message}</blockquote>
                </>
              )}

              <h3 className={styles.dSection}><StickyNote size={14} /> অ্যাডমিন নোট</h3>
              <textarea className={styles.noteArea} rows={4} value={noteDraft} onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="যেমন: ফোন করা হয়েছে, শনিবার ক্লাস শুরু…" maxLength={2000} />
              <div className={styles.noteFoot}>
                <span>শুধু অ্যাডমিন দেখতে পাবে</span>
                <button className={styles.primaryBtn} onClick={() => saveNote(active._id)}
                  disabled={savingNote || noteDraft === (active.adminNote ?? "")}>
                  {savingNote ? "সংরক্ষণ হচ্ছে…" : "নোট সংরক্ষণ"}
                </button>
              </div>
            </div>

            <div className={styles.drawerFoot}>
              <a href={`/enroll/confirm/${active._id}`} target="_blank" rel="noreferrer" className={styles.ghostBtn}><ExternalLink size={14} /> কনফার্মেশন পেজ</a>
              <button className={styles.dangerBtn} onClick={() => setConfirmDelete([active._id])}><Trash2 size={14} /> মুছুন</button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Delete confirm ── */}
      {confirmDelete && (
        <div className={`${styles.overlay} ${styles.overlayCenter}`} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()} role="alertdialog">
            <div className={styles.modalIcon}><Trash2 size={22} /></div>
            <h3>{bn(confirmDelete.length)}টি আবেদন মুছে ফেলবেন?</h3>
            <p>এই কাজটি আর ফেরানো যাবে না।</p>
            <div className={styles.modalBtns}>
              <button className={styles.ghostBtn} onClick={() => setConfirmDelete(null)}>বাতিল</button>
              <button className={styles.dangerBtn} onClick={() => doDelete(confirmDelete)} autoFocus>হ্যাঁ, মুছুন</button>
            </div>
          </div>
        </div>
      )}

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} onCreated={onStudentCreated} />}
      {showCustomCert && <CustomCertificateModal onClose={() => setShowCustomCert(false)} toast={toast} />}

      {certTarget && (
        <CertificateModal
          enrollment={certTarget}
          onClose={() => setCertFor(null)}
          onSaved={(c) => setCertificate(certTarget._id, c)}
          onRevoked={() => { setCertificate(certTarget._id, null); setCertFor(null); }}
          toast={toast}
        />
      )}

      {/* ── Floating "add student" button (phones) ── */}
      {!overlayOpen && selected.size === 0 && (
        <button className={styles.fab} onClick={() => setShowAdd(true)} aria-label="নতুন স্টুডেন্ট">
          <UserPlus size={20} /> স্টুডেন্ট
        </button>
      )}

      {/* ── Toasts ── */}
      <div className={styles.toasts} aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${t.kind === "err" ? styles.toastErr : ""}`}>
            {t.kind === "err" ? <CircleX size={16} /> : <CircleCheck size={16} />} {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Training status (days left + progress) ────────────────────────────── */
function TrainingCell({ e, wide = false }: { e: Enrollment; wide?: boolean }) {
  const info = trainingInfo(e.trainingStart, e.trainingEnd);
  if (!info) return <span className={styles.trainNone}>তারিখ দেওয়া নেই</span>;
  return (
    <div className={`${styles.train} ${wide ? styles.trainWide : ""}`} data-state={info.state}>
      <span className={styles.trainLabel}>{info.label}</span>
      {info.progress !== null && (
        <span className={styles.trainBar}><span style={{ width: `${Math.round(info.progress * 100)}%` }} /></span>
      )}
      <small className={styles.trainDates}>
        {e.trainingStart ? fmtDay(e.trainingStart) : "?"} – {e.trainingEnd ? fmtDay(e.trainingEnd) : "?"}
        {wide && info.totalDays ? ` · মোট ${bn(info.totalDays)} দিন` : ""}
      </small>
    </div>
  );
}
