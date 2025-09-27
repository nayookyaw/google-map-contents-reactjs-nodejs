import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    role: "ADMIN" | "EDITOR" | "VIEWER";
  }) => Promise<void> | void;
};

const ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;

export default function AddUserModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<"ADMIN" | "EDITOR" | "VIEWER">(
    "VIEWER"
  );
  const [errors, setErrors] = React.useState<string[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  // Reset form when modal opens
  React.useEffect(() => {
    if (open) {
      setName("");
      setEmail("");
      setRole("VIEWER");
      setErrors([]);
      setSubmitting(false);
    }
  }, [open]);

  const validate = () => {
    const e: string[] = [];
    if (!name.trim()) e.push("Name is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.push("Valid email is required");
    setErrors(e);
    return e.length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim(), role });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h3>Add User</h3>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Validation errors */}
          {errors.length > 0 && (
            <div className="alert">
              {errors.map((e, i) => (
                <div key={i}>{e}</div>
              ))}
            </div>
          )}

          {/* Name */}
          <label className="label">Name</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />

          {/* Email */}
          <label className="label">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
          />

          {/* Role */}
          <label className="label">Role</label>
          <select
            className="select"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}