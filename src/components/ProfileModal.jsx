import { useState } from "react";
import Modal from "./Modal";
import Icon from "./Icon";
import { colors, currencyOptions } from "../theme";

export default function ProfileModal({ profile, onClose, onSave }) {
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [photo, setPhoto] = useState(profile.photo);
  const [currencyCode, setCurrencyCode] = useState(profile.currency || "");
  const [error, setError] = useState("");

  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file for your profile photo.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setError("Choose an image smaller than 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(String(reader.result));
      setError("");
    };
    reader.onerror = () => setError("Could not read that image. Try another file.");
    reader.readAsDataURL(file);
  }

  function submit(event) {
    event.preventDefault();
    onSave({ name: name.trim(), title: title.trim(), photo, currency: currencyCode });
  }

  const inputStyle = { width: "100%", boxSizing: "border-box", background: "#0D1A17", border: `1px solid ${colors.borderStrong}`, borderRadius: 9, padding: "10px 12px", color: "#EDEFEC", fontSize: 13.5, outline: "none" };

  return (
    <Modal onClose={onClose} ariaLabelledBy="profile-modal-title">
      <form onSubmit={submit}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 id="profile-modal-title" style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F1F3EF" }}>Your profile</h2>
          <button type="button" onClick={onClose} aria-label="Close profile settings" style={{ background: "transparent", border: 0, color: colors.textMuted, padding: 4, cursor: "pointer" }}>
            <Icon name="x" size={17} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 19 }}>
          {photo ? (
            <img src={photo} alt="Profile preview" style={{ width: 58, height: 58, borderRadius: "50%", objectFit: "cover", border: "1px solid rgba(255,255,255,0.12)" }} />
          ) : (
            <div style={{ width: 58, height: 58, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "#182923", border: "1px solid rgba(255,255,255,0.1)", color: "#72DDB8" }}>
              <Icon name="user" size={24} />
            </div>
          )}
          <div>
            <label className="secondary-action" style={{ cursor: "pointer" }}>
              <Icon name="upload" size={14} /> Upload photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            </label>
            {photo && <button type="button" onClick={() => setPhoto("")} style={{ display: "block", marginTop: 7, padding: 0, border: 0, background: "none", color: "#B0BFB6", fontSize: 11.5, cursor: "pointer" }}>Remove photo</button>}
          </div>
        </div>

        <label style={{ display: "block", marginBottom: 14, color: colors.textMuted, fontSize: 12.5 }}>Full name
          <input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Your Name" maxLength={80} style={{ ...inputStyle, marginTop: 6 }} />
        </label>
        <label style={{ display: "block", marginBottom: 17, color: colors.textMuted, fontSize: 12.5 }}>Title <span style={{ opacity: 0.72 }}>(optional)</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Solo Studio or Freelancer" maxLength={60} style={{ ...inputStyle, marginTop: 6 }} />
        </label>

        <label style={{ display: "block", marginBottom: 7, color: colors.textMuted, fontSize: 12.5 }}>Main currency
          <select required value={currencyCode} onChange={(event) => setCurrencyCode(event.target.value)} style={{ ...inputStyle, marginTop: 6 }}>
            <option value="" disabled>Choose your main currency</option>
            {currencyOptions.map((option) => <option key={option.code} value={option.code}>{option.label}</option>)}
          </select>
        </label>
        <div style={{ fontSize: 11, color: colors.textFaint, lineHeight: 1.5, marginBottom: 17 }}>
          This changes how amounts are displayed; it does not convert values using exchange rates. Your workspace is saved in this browser on this device and is not synced to other devices.
        </div>

        {error && <div role="alert" style={{ color: "#FFAA9E", fontSize: 12, marginBottom: 12 }}>{error}</div>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 9 }}>
          <button type="button" className="secondary-action" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-action" style={{ minHeight: 36, border: 0, borderRadius: 9, padding: "8px 14px", background: colors.accent, color: "#06120D", fontSize: 12.5, fontWeight: 650, cursor: "pointer" }}>Save profile</button>
        </div>
      </form>
    </Modal>
  );
}
