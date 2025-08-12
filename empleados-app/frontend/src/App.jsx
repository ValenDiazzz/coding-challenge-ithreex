import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API}/employees`);
        if (!cancelled) setEmployees(res.data);
      } catch (e) {
        if (!cancelled) setError("Failed to load employees");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // agrupa por área y ordena por área alfabéticamente
  const byArea = useMemo(() => {
    const map = new Map();
    for (const e of employees) {
      const key = e.area ?? "Unknown";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    // ordena nombres dentro de cada área
    for (const list of map.values()) {
      list.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }
    // retorna un array ordenado por área
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [employees]);

  return (
    <div style={{maxWidth: 1000, margin: "0 auto", padding: 16, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif"}}>
      <Header />

      {error && <Banner type="error" message={error} />}
      {loading && <Skeleton />}

      {!loading && !error && (
        <>
          {byArea.map(([area, list]) => (
            <section key={area} style={{marginBottom: 28}}>
              <h2 style={{margin: "12px 0"}}>{area} — {list.length}</h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 12
              }}>
                {list.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setSelected(e)}
                    style={{
                      textAlign: "left",
                      padding: 12,
                      borderRadius: 12,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{fontWeight: 600, marginBottom: 4}}>{e.full_name}</div>
                    <div style={{color: "#6b7280", fontSize: 14}}>
                      Edad: {e.age} · Antigüedad: {e.seniority_years} {e.seniority_years === 1 ? "año" : "años"}
                    </div>
                    <div style={{color: "#6b7280", fontSize: 14}}>Tel: {e.phone}</div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </>
      )}

      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <h3 style={{marginTop: 0}}>{selected.full_name}</h3>
          <InfoRow label="Área" value={selected.area} />
          <InfoRow label="Edad" value={selected.age} />
          <InfoRow label="Antigüedad" value={`${selected.seniority_years} ${selected.seniority_years === 1 ? "año" : "años"}`} />
          <InfoRow label="Teléfono" value={selected.phone} />
          <div style={{marginTop: 16, textAlign: "right"}}>
            <button onClick={() => setSelected(null)} style={btnPrimary}>Cerrar</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Header() {
  return (
    <header style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16}}>
      <h1 style={{margin: 0, fontSize: 28}}>Employees</h1>
      <small style={{color: "#6b7280"}}>Powered by React + Axios</small>
    </header>
  );
}

function Banner({ type = "info", message }) {
  const colors = type === "error"
    ? { bg: "#fef2f2", border: "#fecaca", text: "#991b1b" }
    : { bg: "#eff6ff", border: "#bfdbfe", text: "#1e3a8a" };
  return (
    <div style={{
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      borderRadius: 8,
      padding: "10px 12px",
      marginBottom: 12
    }}>
      {message}
    </div>
  );
}

function Skeleton() {
  return (
    <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12}}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} style={{
          height: 72,
          borderRadius: 12,
          background: "linear-gradient(90deg,#f3f4f6,#e5e7eb,#f3f4f6)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.2s infinite"
        }} />
      ))}
      <style>{`@keyframes shimmer{0%{background-position:0% 0}100%{background-position:-200% 0}}`}</style>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)",
      display: "grid", placeItems: "center", padding: 16, zIndex: 50
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 12, padding: 16, width: "100%", maxWidth: 420,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
      }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px dashed #e5e7eb"}}>
      <span style={{color: "#6b7280"}}>{label}</span>
      <span>{value}</span>
    </div>
  );
}

const btnPrimary = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #1d4ed8",
  background: "#1d4ed8",
  color: "white",
  cursor: "pointer"
};
