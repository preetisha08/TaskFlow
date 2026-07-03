import { useEffect, useState } from "react";
import {
  Crown,
  Mail,
  Plus,
  Trash2,
  UserPlus,
  UsersRound,
  X,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/team.css";

function Team() {
  const { user } = useAuth();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTeam = async () => {
    try {
      const response = await api.get("/team");
      setTeam(response.data);
    } catch {
      setError("Could not load your team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/team", {
        name: teamName,
      });

      setTeam(response.data.team);
      setTeamName("");
    } catch (error) {
      setError(error.response?.data?.message || "Could not create the team.");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/team/members", {
        email: memberEmail,
      });

      setTeam(response.data.team);
      setMemberEmail("");
      setShowMemberForm(false);
      setSuccess("Member added successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Could not add the member.");
    }
  };

  const handleRemoveMember = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this member?",
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/team/members/${userId}`);
      setTeam(response.data.team);
    } catch (error) {
      setError(error.response?.data?.message || "Could not remove the member.");
    }
  };

  const isOwner = team?.owner === user?.id;

  if (loading) {
    return (
      <AppLayout>
        <div className="team-page">
          <div className="team-loading">Loading your workspace...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="team-page">
        <header className="team-header">
          <div>
            <p className="eyebrow">COLLABORATION</p>
            <h1>Team Workspace</h1>
            <p>Bring people together and keep everyone aligned.</p>
          </div>

          {team && isOwner && (
            <button
              className="primary-action"
              onClick={() => setShowMemberForm(true)}
            >
              <UserPlus size={19} />
              Add member
            </button>
          )}
        </header>

        {error && <div className="task-error">{error}</div>}
        {success && <div className="team-success">{success}</div>}

        {!team ? (
          <section className="create-team-card">
            <div className="create-team-icon">
              <UsersRound size={32} />
            </div>

            <p className="eyebrow">CREATE YOUR WORKSPACE</p>
            <h2>Start collaborating with your team</h2>

            <p className="create-team-description">
              Create one shared workspace, invite registered users, and manage
              work together.
            </p>

            <form onSubmit={handleCreateTeam}>
              <label>Team name</label>

              <div className="create-team-form">
                <input
                  type="text"
                  placeholder="Example: Product Team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />

                <button type="submit" className="primary-action">
                  <Plus size={18} />
                  Create team
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            <section className="team-overview">
              <div className="team-identity">
                <div className="team-logo">
                  {team.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <span>YOUR WORKSPACE</span>
                  <h2>{team.name}</h2>
                  <p>{team.members.length} team member(s)</p>
                </div>
              </div>

              <div className="team-stat">
                <UsersRound size={20} />
                <div>
                  <strong>{team.members.length}</strong>
                  <span>Members</span>
                </div>
              </div>
            </section>

            <section className="members-panel">
              <div className="members-heading">
                <div>
                  <h2>Team members</h2>
                  <p>People who have access to this workspace.</p>
                </div>
              </div>

              <div className="members-list">
                {team.members.map((member) => {
                  const memberUser = member.user;
                  const initial =
                    memberUser.name?.charAt(0).toUpperCase() || "U";

                  return (
                    <div className="member-row" key={memberUser._id}>
                      <div className="member-profile">
                        <div className="member-avatar">{initial}</div>

                        <div>
                          <h3>{memberUser.name}</h3>

                          <p>
                            <Mail size={14} />
                            {memberUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="member-actions">
                        <span
                          className={
                            member.role === "Owner"
                              ? "role-badge owner"
                              : "role-badge"
                          }
                        >
                          {member.role === "Owner" && <Crown size={13} />}
                          {member.role}
                        </span>

                        {isOwner && member.role !== "Owner" && (
                          <button
                            className="remove-member-button"
                            title="Remove member"
                            onClick={() => handleRemoveMember(memberUser._id)}
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {showMemberForm && (
          <div className="task-modal-backdrop">
            <div className="team-modal">
              <div className="task-modal-header">
                <div>
                  <h2>Add team member</h2>
                  <p>The user must already have a TaskFlow account.</p>
                </div>

                <button onClick={() => setShowMemberForm(false)}>
                  <X size={21} />
                </button>
              </div>

              <form onSubmit={handleAddMember}>
                <div className="task-form-group">
                  <label>Registered email address</label>

                  <input
                    type="email"
                    placeholder="member@example.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="task-modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowMemberForm(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="primary-action">
                    <UserPlus size={18} />
                    Add member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default Team;
