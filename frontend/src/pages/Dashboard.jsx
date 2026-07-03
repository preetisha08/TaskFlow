import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDot,
  Clock3,
  Plus,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name?.split(" ")[0] || "there";
  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("Could not load dashboard tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;

    const inProgress = tasks.filter(
      (task) => task.status === "In Progress",
    ).length;

    const completed = tasks.filter(
      (task) => task.status === "Completed",
    ).length;

    const now = new Date();
    const nextSevenDays = new Date();
    nextSevenDays.setDate(now.getDate() + 7);

    const dueSoon = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);

      return (
        task.status !== "Completed" &&
        dueDate >= now &&
        dueDate <= nextSevenDays
      );
    }).length;

    const todo = tasks.filter((task) => task.status === "To Do").length;

    const completionPercentage =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      inProgress,
      completed,
      dueSoon,
      todo,
      completionPercentage,
    };
  }, [tasks]);

  const recentTasks = tasks.slice(0, 4);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getAssignmentText = (task) => {
    if (!task.assignedTo) return null;

    const assigneeId = task.assignedTo._id || task.assignedTo.id;

    if (assigneeId?.toString() === currentUserId?.toString()) {
      return "Assigned to you";
    }

    return `Assigned to ${task.assignedTo.name}`;
  };

  return (
    <AppLayout>
      <div className="dashboard-page">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Good to see you, {firstName}</h1>
            <p className="header-description">
              Here is what is happening with your work today.
            </p>
          </div>

          <button className="primary-action" onClick={() => navigate("/tasks")}>
            <Plus size={19} />
            New task
          </button>
        </header>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon purple">
              <CircleDot size={21} />
            </div>
            <div>
              <span>Total tasks</span>
              <strong>{loading ? "—" : stats.total}</strong>
              <small>Your complete workload</small>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon blue">
              <Clock3 size={21} />
            </div>
            <div>
              <span>In progress</span>
              <strong>{loading ? "—" : stats.inProgress}</strong>
              <small>Currently being worked on</small>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={21} />
            </div>
            <div>
              <span>Completed</span>
              <strong>{loading ? "—" : stats.completed}</strong>
              <small>Tasks successfully finished</small>
            </div>
          </article>

          <article className="stat-card">
            <div className="stat-icon orange">
              <CalendarDays size={21} />
            </div>
            <div>
              <span>Due soon</span>
              <strong>{loading ? "—" : stats.dueSoon}</strong>
              <small>Due within the next 7 days</small>
            </div>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="dashboard-panel">
            <div className="panel-heading">
              <div>
                <h2>Recent tasks</h2>
                <p>Your latest work and activity</p>
              </div>

              <button
                className="text-button"
                onClick={() => navigate("/tasks")}
              >
                View all
                <ArrowUpRight size={17} />
              </button>
            </div>

            {loading ? (
              <div className="empty-state">
                <p>Loading tasks...</p>
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <CheckCircle2 size={28} />
                </div>
                <h3>No tasks yet</h3>
                <p>Create your first task and start making progress.</p>

                <button
                  className="secondary-action"
                  onClick={() => navigate("/tasks")}
                >
                  <Plus size={18} />
                  Create first task
                </button>
              </div>
            ) : (
              <div className="recent-task-list">
                {recentTasks.map((task) => {
                  const assignmentText = getAssignmentText(task);

                  return (
                    <div className="recent-task-item" key={task._id}>
                      <div className="recent-task-main">
                        <span
                          className={`recent-status-dot ${task.status
                            .toLowerCase()
                            .replaceAll(" ", "-")}`}
                        />

                        <div>
                          <h3>{task.title}</h3>

                          <div className="recent-task-meta">
                            <p>Due {formatDate(task.dueDate)}</p>

                            {assignmentText && (
                              <p className="recent-assignment">
                                <UserRound size={14} />
                                {assignmentText}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`priority-badge ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </article>

          <article className="dashboard-panel progress-panel">
            <div className="panel-heading">
              <div>
                <h2>Progress</h2>
                <p>Your completion overview</p>
              </div>
            </div>

            <div className="progress-visual">
              <div
                className="progress-ring"
                style={{
                  background: `conic-gradient(
                    #625cdc ${stats.completionPercentage}%,
                    #ececf3 ${stats.completionPercentage}%
                  )`,
                }}
              >
                <div>
                  <strong>{stats.completionPercentage}%</strong>
                  <span>Complete</span>
                </div>
              </div>

              <div className="progress-summary">
                <div>
                  <span className="summary-dot todo" />
                  <p>To Do</p>
                  <strong>{stats.todo}</strong>
                </div>

                <div>
                  <span className="summary-dot active" />
                  <p>In Progress</p>
                  <strong>{stats.inProgress}</strong>
                </div>

                <div>
                  <span className="summary-dot done" />
                  <p>Completed</p>
                  <strong>{stats.completed}</strong>
                </div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </AppLayout>
  );
}

export default Dashboard;
