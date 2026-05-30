import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
  TrendingUp,
  UserPlus,
  PhoneCall,
  CheckCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import "./App.css";

const initialLeads = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    source: "Website Form",
    status: "New",
    notes: "Interested in website development.",
    date: "2026-05-30",
  },
  {
    id: 2,
    name: "Priya Mehta",
    email: "priya@example.com",
    phone: "9123456780",
    source: "LinkedIn",
    status: "Contacted",
    notes: "Follow up next week.",
    date: "2026-05-29",
  },
];

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({ email: "", password: "" });

  const [leads, setLeads] = useState(initialLeads);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    status: "New",
    notes: "",
  });

  const handleAuth = () => {
    const users = JSON.parse(localStorage.getItem("crmUsers")) || [];

    if (!authData.email || !authData.password) {
      alert("Please enter email and password.");
      return;
    }

    if (authMode === "register") {
      const existingUser = users.find((user) => user.email === authData.email);

      if (existingUser) {
        alert("Account already exists. Please login.");
        return;
      }

      users.push(authData);
      localStorage.setItem("crmUsers", JSON.stringify(users));
      alert("Account created successfully. Please login now.");
      setAuthMode("login");
      setAuthData({ email: "", password: "" });
      return;
    }

    const validUser = users.find(
      (user) =>
        user.email === authData.email && user.password === authData.password
    );

    if (validUser) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid login. Please create an account first.");
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);

    const matchesStatus =
      statusFilter === "All" || lead.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: leads.length,
    new: leads.filter((lead) => lead.status === "New").length,
    contacted: leads.filter((lead) => lead.status === "Contacted").length,
    qualified: leads.filter((lead) => lead.status === "Qualified").length,
    converted: leads.filter((lead) => lead.status === "Converted").length,
  };

  const chartData = [
    { name: "New", value: stats.new },
    { name: "Contacted", value: stats.contacted },
    { name: "Qualified", value: stats.qualified },
    { name: "Converted", value: stats.converted },
  ];

  const monthlyData = [
    { month: "Jan", leads: 8 },
    { month: "Feb", leads: 12 },
    { month: "Mar", leads: 18 },
    { month: "Apr", leads: 14 },
    { month: "May", leads: leads.length + 10 },
  ];

  const openAddModal = () => {
    setEditingLead(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "",
      status: "New",
      notes: "",
    });
    setShowModal(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setFormData(lead);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingLead) {
      setLeads(
        leads.map((lead) =>
          lead.id === editingLead.id
            ? { ...formData, id: editingLead.id, date: editingLead.date }
            : lead
        )
      );
    } else {
      const newLead = {
        ...formData,
        id: Date.now(),
        date: new Date().toISOString().split("T")[0],
      };
      setLeads([newLead, ...leads]);
    }

    setShowModal(false);
  };

  const deleteLead = (id) => {
    setLeads(leads.filter((lead) => lead.id !== id));
  };

  const updateStatus = (id, status) => {
    setLeads(
      leads.map((lead) => (lead.id === id ? { ...lead, status } : lead))
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="login-page">
        <div className="login-card">
          <h1>{authMode === "login" ? "Welcome Back 👋" : "Create Account 🚀"}</h1>

          <p>
            {authMode === "login"
              ? "Sign in to manage leads, clients and business growth."
              : "Join Mini CRM and start managing leads like a professional."}
          </p>

          <input
            type="email"
            placeholder="Email address"
            value={authData.email}
            onChange={(e) =>
              setAuthData({ ...authData, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={authData.password}
            onChange={(e) =>
              setAuthData({ ...authData, password: e.target.value })
            }
          />

          {authMode === "login" && (
            <div className="login-options">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span>Forgot password?</span>
            </div>
          )}

          <button onClick={handleAuth}>
            {authMode === "login" ? "Login" : "Create Account"}
          </button>

          <p className="switch-auth">
            {authMode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
            <span
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setAuthData({ email: "", password: "" });
              }}
            >
              {authMode === "login" ? " Create one" : " Login"}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">M</div>
          <div>
            <h2>Mini CRM</h2>
            <p>Lead Manager</p>
          </div>
        </div>

        <nav>
          <a className="active">
            <LayoutDashboard size={18} /> Dashboard
          </a>
          <a>
            <Users size={18} /> Leads
          </a>
          <a>
            <BarChart3 size={18} /> Analytics
          </a>
          <a>
            <Settings size={18} /> Settings
          </a>
        </nav>

        <div className="profile-box">
          <div className="avatar small">A</div>
          <div>
            <strong>Admin</strong>
            <p>CRM Manager</p>
          </div>
        </div>

        <button className="logout" onClick={() => setIsLoggedIn(false)}>
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="main">
        <header>
          <div>
            <h1>Client Lead Management System</h1>
            <p>Manage leads, track status, and convert clients faster.</p>
          </div>

          <button className="add-btn" onClick={openAddModal}>
            <Plus size={18} /> Add Lead
          </button>
        </header>

        <section className="hero-card">
          <div>
            <h2>Welcome back, Admin 👋</h2>
            <p>
              You have <strong>{stats.total}</strong> total leads and{" "}
              <strong>{stats.converted}</strong> converted clients.
            </p>
          </div>
          <button>View Analytics</button>
        </section>

        <section className="stats">
          <div className="stat-card">
            <Users size={24} />
            <p>Total Leads</p>
            <h2>{stats.total}</h2>
            <span>+12% this month</span>
          </div>

          <div className="stat-card blue">
            <UserPlus size={24} />
            <p>New Leads</p>
            <h2>{stats.new}</h2>
            <span>Fresh opportunities</span>
          </div>

          <div className="stat-card orange">
            <PhoneCall size={24} />
            <p>Contacted</p>
            <h2>{stats.contacted}</h2>
            <span>Follow-up active</span>
          </div>

          <div className="stat-card green">
            <CheckCircle size={24} />
            <p>Converted</p>
            <h2>{stats.converted}</h2>
            <span>Closed successfully</span>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="chart-card">
            <h3>Lead Status Overview</h3>
            <ResponsiveContainer width="100%" height={230}>
              <PieChart>
                <Pie data={chartData} dataKey="value" outerRadius={85} label>
                  <Cell fill="#2563eb" />
                  <Cell fill="#f59e0b" />
                  <Cell fill="#7c3aed" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Monthly Lead Growth</h3>
            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="leads" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel">
          <div className="panel-top">
            <div>
              <h3>Lead Management</h3>
              <p>Search, filter, edit and manage all client leads.</p>
            </div>

            <div className="filters">
              <div className="search-box">
                <Search size={18} />
                <input
                  placeholder="Search by name, email, or phone"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All</option>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Converted</option>
              </select>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div className="lead-user">
                      <div className="avatar">{lead.name.charAt(0)}</div>
                      <strong>{lead.name}</strong>
                    </div>
                  </td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.source}</td>
                  <td>
                    <select
                      className={`status ${lead.status.toLowerCase()}`}
                      value={lead.status}
                      onChange={(e) => updateStatus(lead.id, e.target.value)}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Converted</option>
                    </select>
                  </td>
                  <td>{lead.date}</td>
                  <td className="actions">
                    <button title={lead.notes}>
                      <Eye size={16} />
                    </button>
                    <button onClick={() => openEditModal(lead)}>
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteLead(lead.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>

      {showModal && (
        <div className="modal-bg">
          <form className="modal" onSubmit={handleSubmit}>
            <h2>{editingLead ? "Edit Lead" : "Add New Lead"}</h2>

            <input
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />

            <input
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <input
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />

            <input
              placeholder="Lead Source"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              required
            />

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Converted</option>
            </select>

            <textarea
              placeholder="Notes / Follow-up details"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />

            <div className="modal-actions">
              <button type="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit">
                {editingLead ? "Update Lead" : "Save Lead"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;