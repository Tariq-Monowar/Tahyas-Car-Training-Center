"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import styles from "./admin.module.css";

interface Enrollment {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  course: string;
  age?: string;
  status: string;
  createdAt: string;
}

const statusLabel: Record<string, string> = { pending: "অপেক্ষমান", confirmed: "নিশ্চিত", cancelled: "বাতিল" };

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Enrollment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/enrollments")
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  const filtered = data.filter((e) =>
    !search || [e.name, e.phone, e.email ?? "", e.course].some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const counts = { total: data.length, pending: data.filter(e => e.status === "pending").length, confirmed: data.filter(e => e.status === "confirmed").length };

  return (
    <div className={styles.layout}>
      <div className={styles.topbar}>
        <div className={styles.brand}>
          🚗 তাহয়াস <span>Admin Panel</span>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>
          <LogOut size={15} /> লগআউট
        </button>
      </div>

      <div className={styles.main}>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{counts.total}</div>
            <div className={styles.statLabel}>মোট আবেদন</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{counts.pending}</div>
            <div className={styles.statLabel}>অপেক্ষমান</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{counts.confirmed}</div>
            <div className={styles.statLabel}>নিশ্চিত</div>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHead}>
            <span className={styles.cardTitle}>ভর্তির আবেদন সমূহ</span>
            <input
              className={styles.search}
              placeholder="নাম, ফোন বা কোর্স খুঁজুন…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className={styles.empty}>লোড হচ্ছে…</div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>কোনো আবেদন পাওয়া যায়নি।</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>নাম</th>
                    <th>ফোন</th>
                    <th>কোর্স</th>
                    <th>তারিখ</th>
                    <th>অবস্থা</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => (
                    <tr key={e._id}>
                      <td className={styles.name}>{e.name}{e.age ? <span style={{ color: "#9ca3af", fontWeight: 400 }}> ({e.age})</span> : ""}</td>
                      <td className={styles.phone}><a href={`tel:${e.phone}`}>{e.phone}</a></td>
                      <td className={styles.course}>{e.course}</td>
                      <td className={styles.date}>{new Date(e.createdAt).toLocaleDateString("bn-BD")}</td>
                      <td><span className={`${styles.badge} ${styles[e.status] || styles.pending}`}>{statusLabel[e.status] ?? e.status}</span></td>
                      <td><a href={`/enroll/confirm/${e._id}`} target="_blank" className={styles.viewLink}>দেখুন ↗</a></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
