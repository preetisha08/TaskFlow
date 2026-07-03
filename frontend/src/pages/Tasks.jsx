import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Edit3,
  Filter,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/tasks.css";

const emptyForm = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  dueDate: "",
  assignedTo: "",
};

function Tasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const tasksResponse = await api.get("/tasks");
        setTasks(tasksResponse.data);

        try {
          const teamResponse = await api.get("/team");
          setTeam(teamResponse.data);
        } catch {
          setTeam(null);
        }
      } catch {
        setError("Could not load your tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);

    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate.split("T")[0],
      assignedTo: task.assignedTo?._id || "",
    });

    setError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const taskData = {
      ...formData,
      assignedTo: formData.assignedTo || null,
    };

    try {
      if (editingTask) {
        const response = await api.put(`/tasks/${editingTask._id}`, taskData);

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task._id === editingTask._id ? response.data.task : task,
          ),
        );
      } else {
        const response = await api.post("/tasks", taskData);

        setTasks((currentTasks) => [response.data.task, ...currentTasks]);
      }

      closeForm();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          `Could not ${editingTask ? "update" : "create"} the task.`,
      );
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) return;

    try {
      await api.delete(`/tasks/${taskId}`);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task._id !== taskId),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Could not delete the task.");
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const response = await api.put(`/tasks/${task._id}`, {
        status: newStatus,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask._id === task._id ? response.data.task : currentTask,
        ),
      );
    } catch (error) {
      setError(
        error.response?.data?.message || "Could not update the task status.",
      );
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const isOverdue = (task) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    return task.status !== "Completed" && dueDate < today;
  };

  return (
    <AppLayout>
      <div className="tasks-page">
        <header className="tasks-header">
          <div>
            <p className="eyebrow">MY WORK</p>
            <h1>My Tasks</h1>
            <p>Plan, prioritize, and keep your work moving forward.</p>
          </div>

          <button className="primary-action" onClick={openCreateForm}>
            <Plus size={19} />
            New task
          </button>
        </header>

        <section className="task-toolbar">
          <div className="task-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="task-filters">
            <Filter size={18} />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option>All</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </section>

        {error && <div className="task-error">{error}</div>}

        {loading ? (
          <div className="tasks-message">Loading your tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="tasks-empty">
            <div>
              <Plus size={28} />
            </div>

            <h2>No tasks found</h2>
            <p>Create a task or adjust your search and filters.</p>
          </div>
        ) : (
          <section className="task-grid">
            {filteredTasks.map((task) => {
              const isTaskOwner = task.user === user?.id;
              const taskIsOverdue = isOverdue(task);

              return (
                <article className="task-card" key={task._id}>
                  <div className="task-card-top">
                    <span
                      className={`priority-badge ${task.priority.toLowerCase()}`}
                    >
                      {task.priority} priority
                    </span>

                    {isTaskOwner && (
                      <div className="task-card-actions">
                        <button
                          title="Edit task"
                          onClick={() => openEditForm(task)}
                        >
                          <Edit3 size={16} />
                        </button>

                        <button
                          className="delete-task-button"
                          title="Delete task"
                          onClick={() => handleDelete(task._id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <h2>{task.title}</h2>

                  <p className="task-description">
                    {task.description || "No description added."}
                  </p>

                  <div className="task-assignee">
                    <UserRound size={16} />

                    <div>
                      <span>Assigned to</span>
                      <strong>{task.assignedTo?.name || "Unassigned"}</strong>
                    </div>
                  </div>

                  <div className="task-status-control">
                    <label>Status</label>

                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task, e.target.value)}
                      className={`status-select ${task.status
                        .toLowerCase()
                        .replaceAll(" ", "-")}`}
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>

                  <div
                    className={`task-card-footer ${
                      taskIsOverdue ? "task-overdue" : ""
                    }`}
                  >
                    <CalendarDays size={17} />

                    {taskIsOverdue ? (
                      <>
                        Overdue · {formatDate(task.dueDate)}
                        <span className="overdue-badge">Overdue</span>
                      </>
                    ) : (
                      <>Due {formatDate(task.dueDate)}</>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        {showForm && (
          <div className="task-modal-backdrop">
            <div className="task-modal">
              <div className="task-modal-header">
                <div>
                  <h2>{editingTask ? "Edit task" : "Create new task"}</h2>

                  <p>
                    {editingTask
                      ? "Update the details and keep your work current."
                      : "Add the details needed to keep your work on track."}
                  </p>
                </div>

                <button onClick={closeForm}>
                  <X size={21} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="task-form-group">
                  <label>Task title</label>

                  <input
                    type="text"
                    name="title"
                    placeholder="What needs to be done?"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="task-form-group">
                  <label>Description</label>

                  <textarea
                    name="description"
                    placeholder="Add more details about this task..."
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>

                <div className="task-form-row">
                  <div className="task-form-group">
                    <label>Status</label>

                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option>To Do</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>

                  <div className="task-form-group">
                    <label>Priority</label>

                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <div className="task-form-group">
                  <label>
                    Assign to
                    {!team && <span> · Create a team to assign tasks</span>}
                  </label>

                  <select
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                  >
                    <option value="">Unassigned</option>

                    {team?.members?.map((member) => (
                      <option key={member.user._id} value={member.user._id}>
                        {member.user.name} — {member.role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="task-form-group">
                  <label>Due date</label>

                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="task-modal-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="primary-action">
                    {editingTask ? "Save changes" : "Create task"}
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

export default Tasks;
