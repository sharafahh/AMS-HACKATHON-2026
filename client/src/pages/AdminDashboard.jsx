import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiUser,
  FiAward,
  FiDollarSign,
  FiLayers,
  FiGrid,
  FiSearch,
  FiFilter,
  FiDownload,
  FiPlus,
  FiTrash2,
  FiLogOut,
  FiCheckCircle,
  FiAlertCircle,
  FiBell,
  FiFileText,
  FiRefreshCw,
  FiEye,
  FiX,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import hackverseLogo from "../assets/logos/hackverse-logo.png";
import {
  getTeamsAPI,
  getAnnouncementsAPI,
  createAnnouncementAPI,
  deleteAnnouncementAPI,
  generateCertificateAPI,
  deleteCertificateAPI,
  searchCertificatesAPI,
} from "../services/api";

const initialTracks = [
  "AI & Machine Learning",
  "Cyber Security",
  "Healthcare",
  "Agriculture",
  "Smart Education",
  "Smart Mobility",
  "Smart Automation",
  "FinTech",
  "Sustainability",
  "Disaster Management",
  "Space Technology",
  "Open Innovation",
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // State
  const [teams, setTeams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("All");
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("All");
  const [selectedTeamInspect, setSelectedTeamInspect] = useState(null);

  // Announcement Form
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnContent, setNewAnnContent] = useState("");
  const [newAnnCategory, setNewAnnCategory] = useState("IMPORTANT");
  const [newAnnPinned, setNewAnnPinned] = useState(true);

  // Certificate Form
  const [certRecipient, setCertRecipient] = useState("");
  const [certEmail, setCertEmail] = useState("");
  const [certCollege, setCertCollege] = useState("");
  const [certTrack, setCertTrack] = useState("AI & Machine Learning");
  const [certRole, setCertRole] = useState("Participant");
  const [certRegId, setCertRegId] = useState("");

  // Check JWT Token
  useEffect(() => {
    const token = localStorage.getItem("hackverse_admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const teamRes = await getTeamsAPI();
      if (teamRes.success) setTeams(teamRes.teams || []);

      const annRes = await getAnnouncementsAPI();
      if (annRes.success) setAnnouncements(annRes.announcements || []);

      const certRes = await searchCertificatesAPI("HV");
      if (certRes.success) setCertificates(certRes.certificates || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("hackverse_admin_token");
    localStorage.removeItem("hackverse_admin_user");
    navigate("/admin/login");
  };

  // Export to Excel / CSV
  const handleExportCSV = () => {
    if (teams.length === 0) {
      alert("No registration records available to export.");
      return;
    }

    const headers = [
      "Registration ID",
      "Team Name",
      "Team Size",
      "Leader Name",
      "Leader Email",
      "Leader Phone",
      "College",
      "Department",
      "Year",
      "Track",
      "Problem Title",
      "Payment Status",
      "Registration Date",
    ];

    const rows = filteredTeams.map((t) => [
      `"${t.registrationId}"`,
      `"${t.teamName.replace(/"/g, '""')}"`,
      t.teamSize,
      `"${t.leader?.name || ""}"`,
      `"${t.leader?.email || ""}"`,
      `"${t.leader?.phone || ""}"`,
      `"${t.leader?.college?.replace(/"/g, '""') || ""}"`,
      `"${t.leader?.department || ""}"`,
      `"${t.leader?.year || ""}"`,
      `"${t.track}"`,
      `"${t.problemTitle?.replace(/"/g, '""') || ""}"`,
      `"${t.paymentStatus || "PAID"}"`,
      `"${new Date(t.createdAt).toLocaleDateString("en-IN")}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HACKVERSE_2026_Registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Announcement
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;

    try {
      const res = await createAnnouncementAPI({
        title: newAnnTitle,
        content: newAnnContent,
        category: newAnnCategory,
        isPinned: newAnnPinned,
      });

      if (res.success) {
        setAnnouncements([res.announcement, ...announcements]);
        setNewAnnTitle("");
        setNewAnnContent("");
        alert("Announcement posted successfully!");
      }
    } catch (err) {
      alert(`Error creating announcement: ${err.message}`);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteAnnouncementAPI(id);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err) {
      alert(`Error deleting announcement: ${err.message}`);
    }
  };

  // Issue Certificate
  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    if (!certRecipient || !certCollege) return;

    try {
      const res = await generateCertificateAPI({
        recipientName: certRecipient,
        email: certEmail,
        college: certCollege,
        track: certTrack,
        role: certRole,
        registrationId: certRegId || "HV26-ADMIN",
      });

      if (res.success) {
        setCertificates([res.certificate, ...certificates]);
        setCertRecipient("");
        setCertEmail("");
        setCertCollege("");
        setCertRegId("");
        alert(`Certificate issued! ID: ${res.certificate.certificateCode}`);
      }
    } catch (err) {
      alert(`Error issuing certificate: ${err.message}`);
    }
  };

  // Delete Certificate
  const handleDeleteCertificate = async (id) => {
    if (!window.confirm("Are you sure you want to revoke/delete this certificate?")) return;
    try {
      await deleteCertificateAPI(id);
      setCertificates(certificates.filter((c) => c._id !== id && c.certificateCode !== id));
    } catch (err) {
      alert(`Error revoking certificate: ${err.message}`);
    }
  };

  // Filtered Teams List
  const filteredTeams = teams.filter((t) => {
    const matchesSearch =
      t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.registrationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leader?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leader?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.leader?.college.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrack = selectedTrackFilter === "All" || t.track === selectedTrackFilter;
    const matchesPayment = selectedPaymentFilter === "All" || t.paymentStatus === selectedPaymentFilter;

    return matchesSearch && matchesTrack && matchesPayment;
  });

  // Calculate Metrics
  const totalTeamsCount = teams.length;
  const totalParticipantsCount = teams.reduce((sum, t) => sum + (t.teamSize || 4), 0);
  const totalRevenueINR = teams.reduce((sum, t) => sum + (t.teamSize || 4) * 100, 0);
  const paidTeamsCount = teams.filter((t) => t.paymentStatus === "PAID" || t.paymentStatus === "UNPAID").length;

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col font-['Inter']">
      {/* Top Header Navigation */}
      <header className="glass-nav border-b border-white/10 sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
            <img src={collegeLogo} alt="College Logo" className="h-8 w-auto object-contain" />
            <div className="h-5 w-[1px] bg-white/20" />
            <img src={hackverseLogo} alt="Hackverse Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              HACKVERSE 2026 <span className="text-cyan-400 font-medium text-xs">Admin Control Panel</span>
            </h1>
            <p className="text-[10px] text-gray-400">Aalim Muhammed Salegh College of Engineering</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={fetchDashboardData}
            title="Refresh Data"
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
          >
            <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all font-semibold text-xs flex items-center gap-2"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </header>

      {/* Main Panel Grid */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 glass-card border-r border-white/10 p-4 space-y-2 flex-shrink-0">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 px-3 py-2">
            Navigation Menu
          </p>

          {[
            { id: "overview", name: "Dashboard Overview", icon: FiGrid },
            { id: "registrations", name: "Registrations & Export", icon: FiUsers, badge: teams.length },
            { id: "tracks", name: "Manage Tracks", icon: FiLayers, badge: "12" },
            { id: "announcements", name: "Announcements", icon: FiBell, badge: announcements.length },
            { id: "certificates", name: "Issue Certificates", icon: FiAward },
            { id: "payments", name: "Payment Revenue", icon: FiDollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] tracking-wide transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{tab.name}</span>
                </div>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-white">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-x-hidden">
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    Organizer Analytics Dashboard
                  </h2>
                  <p className="text-gray-400 text-xs font-light mt-1">
                    Live overview of registrations, revenue metrics, tracks, and system health.
                  </p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FiDownload /> Export Excel / CSV
                </button>
              </div>

              {/* Stat Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-2 relative overflow-hidden">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 w-fit">
                    <FiUsers size={24} />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">Total Registered Teams</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-white">{totalTeamsCount}</div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-purple-500/30 space-y-2 relative overflow-hidden">
                  <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 w-fit">
                    <FiUser size={24} />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">Total Participants</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-white">{totalParticipantsCount}</div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-2 relative overflow-hidden">
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
                    <FiDollarSign size={24} />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">Total Revenue Collected</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-gradient-gold">₹{totalRevenueINR}</div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-2 relative overflow-hidden">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit">
                    <FiCheckCircle size={24} />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">Payment Verified Ratio</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-emerald-400">100% Verified</div>
                </div>
              </div>

              {/* Quick Actions & Recent Teams */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                      Recent Registration Submissions
                    </h3>
                    <button
                      onClick={() => setActiveTab("registrations")}
                      className="text-xs text-cyan-400 hover:underline"
                    >
                      View All ({teams.length}) →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {teams.slice(0, 4).map((t, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <strong className="text-white text-sm font-['Space_Grotesk']">{t.teamName}</strong>
                          <p className="text-gray-400">{t.leader?.name} ({t.leader?.email})</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 font-bold">
                            {t.track}
                          </span>
                          <p className="text-gray-400 text-[10px] mt-1">{t.registrationId}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                    Quick Admin Actions
                  </h3>

                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("announcements")}
                      className="w-full p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs text-left flex items-center gap-3 transition-colors"
                    >
                      <FiBell size={20} /> Post New Announcement
                    </button>

                    <button
                      onClick={() => setActiveTab("certificates")}
                      className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-bold text-xs text-left flex items-center gap-3 transition-colors"
                    >
                      <FiAward size={20} /> Issue Participant Certificate
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="w-full p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs text-left flex items-center gap-3 transition-colors"
                    >
                      <FiDownload size={20} /> Download Registrations Spreadsheet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGISTRATIONS & EXPORT */}
          {activeTab === "registrations" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    Team Registrations ({filteredTeams.length})
                  </h2>
                  <p className="text-gray-400 text-xs font-light">
                    Search, filter, inspect team members, and export Excel/CSV reports.
                  </p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FiDownload /> Export Excel / CSV
                </button>
              </div>

              {/* Search & Filter Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative sm:col-span-1">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search team, ID, leader, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl glass-card border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <select
                  value={selectedTrackFilter}
                  onChange={(e) => setSelectedTrackFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Innovation Tracks</option>
                  {initialTracks.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedPaymentFilter}
                  onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Payment Statuses</option>
                  <option value="PAID">PAID Only</option>
                  <option value="UNPAID">UNPAID Only</option>
                </select>
              </div>

              {/* Registrations Table */}
              <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/10 text-white font-['Space_Grotesk'] uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Reg ID</th>
                        <th className="p-4">Team Name</th>
                        <th className="p-4">Leader & Contact</th>
                        <th className="p-4">Track</th>
                        <th className="p-4">Members</th>
                        <th className="p-4">Fee Paid</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {filteredTeams.map((t, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-bold text-cyan-400 font-['Space_Grotesk']">{t.registrationId}</td>
                          <td className="p-4 font-bold text-white">{t.teamName}</td>
                          <td className="p-4">
                            <strong className="text-gray-200">{t.leader?.name}</strong>
                            <p className="text-[11px] text-gray-400">{t.leader?.email} | {t.leader?.phone}</p>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                              {t.track}
                            </span>
                          </td>
                          <td className="p-4">{t.teamSize} Members</td>
                          <td className="p-4 text-amber-400 font-bold">₹{t.teamSize * 100}</td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => setSelectedTeamInspect(t)}
                              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1 mx-auto"
                            >
                              <FiEye /> Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE TRACKS */}
          {activeTab === "tracks" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Innovation Tracks Management (12 Domains)
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  View distribution of registered teams across Smart India Hackathon themes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialTracks.map((trackName, idx) => {
                  const trackCount = teams.filter((t) => t.track === trackName).length;
                  return (
                    <div
                      key={idx}
                      className="glass-card p-6 rounded-3xl border border-white/10 flex items-center justify-between relative overflow-hidden group hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-widest">
                          Domain #{idx + 1}
                        </span>
                        <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                          {trackName}
                        </h3>
                        <p className="text-xs text-gray-400">{trackCount} Teams Enrolled</p>
                      </div>

                      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-lg font-['Space_Grotesk']">
                        {trackCount}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Hackathon Announcements
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  Post news updates to the public homepage and participant portal.
                </p>
              </div>

              {/* Post Announcement Form */}
              <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <FiBell className="text-cyan-400" /> Post New Announcement
                </h3>

                <form onSubmit={handleCreateAnnouncement} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Announcement Title..."
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                    />

                    <select
                      value={newAnnCategory}
                      onChange={(e) => setNewAnnCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="IMPORTANT">IMPORTANT</option>
                      <option value="GENERAL">GENERAL</option>
                      <option value="SCHEDULE">SCHEDULE</option>
                    </select>
                  </div>

                  <textarea
                    rows={3}
                    required
                    placeholder="Announcement Content details..."
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500 resize-none"
                  />

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAnnPinned}
                        onChange={(e) => setNewAnnPinned(e.target.checked)}
                        className="rounded border-white/20 text-cyan-500"
                      />
                      <span>Pin to Top of Portal</span>
                    </label>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider"
                    >
                      Post Announcement
                    </button>
                  </div>
                </form>
              </div>

              {/* Announcements List */}
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann._id}
                    className="glass-card p-6 rounded-2xl border border-white/10 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {ann.category}
                        </span>
                        {ann.isPinned && (
                          <span className="text-[10px] text-amber-400 font-bold">📌 Pinned</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold font-['Space_Grotesk'] text-white">{ann.title}</h4>
                      <p className="text-gray-300 text-xs">{ann.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann._id)}
                      className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition-colors"
                      title="Delete Announcement"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFICATES MANAGEMENT */}
          {activeTab === "certificates" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Issue & Revoke Certificates
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  Generate digital certificates for team members with QR verification codes or revoke existing ones.
                </p>
              </div>

              {/* Generate Form */}
              <div className="glass-card p-8 rounded-3xl border border-amber-500/30 space-y-4">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <FiAward className="text-amber-400" /> Issue New Digital Certificate
                </h3>

                <form onSubmit={handleGenerateCertificate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Name (e.g. John Doe)"
                      value={certRecipient}
                      onChange={(e) => setCertRecipient(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="email"
                      placeholder="Recipient Email"
                      value={certEmail}
                      onChange={(e) => setCertEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-500"
                    />

                    <input
                      type="text"
                      required
                      placeholder="College Name"
                      value={certCollege}
                      onChange={(e) => setCertCollege(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <select
                      value={certTrack}
                      onChange={(e) => setCertTrack(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none"
                    >
                      {initialTracks.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Role (e.g. Lead Developer)"
                      value={certRole}
                      onChange={(e) => setCertRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none"
                    />

                    <input
                      type="text"
                      placeholder="Registration ID (HV26-XXXX)"
                      value={certRegId}
                      onChange={(e) => setCertRegId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold font-['Space_Grotesk'] text-xs uppercase tracking-wider"
                  >
                    Generate & Issue Certificate
                  </button>
                </form>
              </div>

              {/* Certificates List & Revoke Action */}
              <div className="space-y-3">
                <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                  Issued Certificates Database ({certificates.length})
                </h3>

                <div className="space-y-3">
                  {certificates.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl glass-card border border-white/10 flex items-center justify-between text-xs"
                    >
                      <div>
                        <strong className="text-amber-400 font-['Space_Grotesk'] text-sm">{c.certificateCode}</strong>
                        <p className="text-white font-semibold">{c.recipientName} ({c.college})</p>
                        <p className="text-gray-400 text-[11px]">{c.track} | Reg ID: {c.registrationId}</p>
                      </div>

                      <button
                        onClick={() => handleDeleteCertificate(c.certificateCode || c._id)}
                        className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1"
                      >
                        <FiTrash2 /> Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: PAYMENTS & REVENUE */}
          {activeTab === "payments" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Payment Revenue & Financial Statistics
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  Detailed revenue report based on ₹100 per member registration fees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-amber-500/30">
                  <span className="text-gray-400 text-xs uppercase font-bold">Total Gross Revenue</span>
                  <div className="text-4xl font-extrabold font-['Space_Grotesk'] text-gradient-gold mt-2">₹{totalRevenueINR}</div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-emerald-500/30">
                  <span className="text-gray-400 text-xs uppercase font-bold">Payment Gateway</span>
                  <div className="text-xl font-bold text-emerald-400 mt-2 font-['Space_Grotesk']">Razorpay Verified</div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-cyan-500/30">
                  <span className="text-gray-400 text-xs uppercase font-bold">Fee Breakdown</span>
                  <div className="text-xl font-bold text-cyan-400 mt-2 font-['Space_Grotesk']">₹100 / Member</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Team Inspector Modal */}
      <AnimatePresence>
        {selectedTeamInspect && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="glass-card max-w-2xl w-full p-8 rounded-3xl border border-cyan-500/40 relative space-y-6">
              <button
                onClick={() => setSelectedTeamInspect(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-gray-300 hover:text-white"
              >
                <FiX size={20} />
              </button>

              <div className="border-b border-white/10 pb-4">
                <span className="text-xs font-bold text-cyan-400 uppercase">
                  {selectedTeamInspect.registrationId}
                </span>
                <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
                  {selectedTeamInspect.teamName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <p><strong className="text-gray-400">Leader:</strong> {selectedTeamInspect.leader?.name}</p>
                <p><strong className="text-gray-400">Email:</strong> {selectedTeamInspect.leader?.email}</p>
                <p><strong className="text-gray-400">Phone:</strong> {selectedTeamInspect.leader?.phone}</p>
                <p><strong className="text-gray-400">College:</strong> {selectedTeamInspect.leader?.college}</p>
                <p><strong className="text-gray-400">Track:</strong> {selectedTeamInspect.track}</p>
                <p><strong className="text-gray-400">Fee Paid:</strong> ₹{selectedTeamInspect.teamSize * 100}</p>
              </div>

              <div className="space-y-2 border-t border-white/10 pt-4">
                <h4 className="text-xs font-bold uppercase text-white">Team Members</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedTeamInspect.members?.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                      <p className="font-bold text-white">{m.name}</p>
                      <p className="text-[10px] text-gray-400">{m.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
