import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

function Register() {
  const navigate = useNavigate();
  const { register, loading, user } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
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

    const result = await register(formData);

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
          <span className="showcase-label">START ORGANIZING</span>

          <h1>
            Your best work starts with
            <span> clarity.</span>
          </h1>

          <p>
            Create your workspace and bring tasks, priorities, deadlines, and
            teamwork together.
          </p>

          <div className="feature-list">
            <div>
              <CheckCircle2 size={20} />
              Plan work with clear priorities
            </div>

            <div>
              <CheckCircle2 size={20} />
              Never lose track of deadlines
            </div>

            <div>
              <CheckCircle2 size={20} />
              See progress at a glance
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
            <span>GET STARTED</span>
            <h2>Create your workspace</h2>
            <p>Set up your account and start organizing your work.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full name</label>

              <div className="input-wrapper">
                <UserRound size={19} />

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  minLength="6"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/">Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Register;
