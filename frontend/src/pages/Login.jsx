import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { CheckCircle2, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();
  const { login, loading, user } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <div className="brand">
          <div className="brand-mark">T</div>
          <span>TaskFlow</span>
        </div>

        <div className="showcase-content">
          <span className="showcase-label">WORK SMARTER</span>

          <h1>
            Turn your plans into
            <span> progress.</span>
          </h1>

          <p>
            Organize tasks, stay focused, and keep every project moving forward
            from one powerful workspace.
          </p>

          <div className="feature-list">
            <div>
              <CheckCircle2 size={20} />
              Track every task and deadline
            </div>

            <div>
              <CheckCircle2 size={20} />
              Visualize progress instantly
            </div>

            <div>
              <CheckCircle2 size={20} />
              Collaborate with your team
            </div>
          </div>
        </div>

        <p className="showcase-footer">
          Productivity designed for modern teams.
        </p>
      </section>

      <section className="auth-form-section">
        <div className="auth-card">
          <div className="mobile-brand">
            <div className="brand-mark">T</div>
            <span>TaskFlow</span>
          </div>

          <div className="auth-heading">
            <span>WELCOME BACK</span>
            <h2>Sign in to your workspace</h2>
            <p>Enter your details to continue managing your work.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>

              <div className="input-wrapper">
                <Mail size={19} />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>

              <div className="input-wrapper">
                <LockKeyhole size={19} />

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            New to TaskFlow? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Login;
