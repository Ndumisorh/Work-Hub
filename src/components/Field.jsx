
export default function Field({ label, ...props }) {
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <span style={{ display: "block", fontSize: 12.5, color: "#8B9389", marginBottom: 6, fontWeight: 500 }}>{label}</span>
      <input
        {...props}
        style={{
          width: "100%", boxSizing: "border-box", background: "#0D1A17", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 8, padding: "9px 12px", color: "#EDEFEC", fontSize: 13.5, outline: "none",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#3FD6AA")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />
    </label>
  );
}
