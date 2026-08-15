import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { REGISTRATION_FEE_PER_PERSON } from "../constants/fee";
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
  FiUserPlus,
  FiPhone,
  FiMail,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiClock,
  FiPieChart,
  FiCheckSquare,
  FiSquare,
  FiFile,
  FiCode,
  FiDatabase,
  FiHardDrive,
  FiCheck,
} from "react-icons/fi";
import collegeLogo from "../assets/logos/college-logo.png";
import amsHackathonLogo from "../assets/logos/ams-hackathon-logo.png";
import {
  getTeamsAPI,
  getAnnouncementsAPI,
  createAnnouncementAPI,
  deleteAnnouncementAPI,
  generateCertificateAPI,
  deleteCertificateAPI,
  searchCertificatesAPI,
  getCoordinatorsAPI,
  createCoordinatorAPI,
  deleteCoordinatorAPI,
  getContactMessagesAPI,
  deleteContactMessageAPI,
  createManualRegistrationAPI,
  getBackupHistoryAPI,
  createManualBackupAPI,
  getBackupDownloadUrl,
} from "../services/api";
import {
  exportToCSV,
  exportToJSON,
  exportToExcel,
  exportToPDF,
} from "../utils/exportUtils";

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

  // Main Data States
  const [teams, setTeams] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backup System States
  const [backups, setBackups] = useState([]);
  const [backupLoading, setBackupLoading] = useState(false);
  const [backupActionStatus, setBackupActionStatus] = useState("");

  // Selection Checkboxes State
  const [selectedRegistrationIds, setSelectedRegistrationIds] = useState(new Set());

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportScope, setExportScope] = useState("filtered"); // "all", "filtered", "selected"
  const [exportFormat, setExportFormat] = useState("excel"); // "excel", "csv", "json", "pdf"

  // Search, Filter & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollegeFilter, setSelectedCollegeFilter] = useState("All");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("All");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState("All");
  const [selectedPaymentFilter, setSelectedPaymentFilter] = useState("All");
  const [selectedDateFilter, setSelectedDateFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Inspect Modal State
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

  // Coordinators
  const [coordinators, setCoordinators] = useState([]);
  const [coordName, setCoordName] = useState("");
  const [coordDept, setCoordDept] = useState("");
  const [coordPhone, setCoordPhone] = useState("");
  const [coordLoading, setCoordLoading] = useState(false);

  // Contact Inquiries
  const [contactMessages, setContactMessages] = useState([]);

  // Manual Cash Registration State
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);
  const manualRolesList = [
    "Lead Developer",
    "Frontend / UI/UX Developer",
    "Backend & API Engineer",
    "Hardware & Embedded Systems Tech",
    "AI / Machine Learning Engineer",
    "Cyber Security Specialist",
    "Cloud & DevOps Engineer",
  ];
  const createEmptyMembers = (size) =>
    Array.from({ length: size }, (_, i) => ({
      name: "",
      email: "",
      phone: "",
      role: i === 0 ? "Lead Developer" : "Frontend / UI/UX Developer",
    }));
  const [manualForm, setManualForm] = useState({
    teamName: "",
    teamSize: 4,
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    college: "",
    department: "",
    year: "3rd Year",
    track: "AI & Machine Learning",
    problemTitle: "",
    notes: "",
    members: createEmptyMembers(4),
  });

  // Check Auth Token on Mount
  useEffect(() => {
    const token = localStorage.getItem("ams_hackathon_2026_admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      fetchDashboardData();
    }
  }, [navigate]);

  // Reset to Page 1 whenever search or filter options change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCollegeFilter, selectedDeptFilter, selectedTrackFilter, selectedPaymentFilter, selectedDateFilter, sortOption]);

  const fetchContactMessages = async () => {
    try {
      const res = await getContactMessagesAPI();
      if (res.success) setContactMessages(res.messages || []);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
    }
  };

  const fetchBackupHistory = async () => {
    try {
      const res = await getBackupHistoryAPI();
      if (res.success) setBackups(res.backups || []);
    } catch (err) {
      console.error("Error fetching backup history:", err);
    }
  };

  const handleCreateManualBackup = async () => {
    setBackupLoading(true);
    setBackupActionStatus("Generating complete database backup (.xlsx, .csv, .json)...");
    try {
      const res = await createManualBackupAPI();
      if (res.success) {
        setBackupActionStatus("Backup generated successfully!");
        alert(`✅ Database Backup Created Successfully!\nBackup ID: ${res.backup.backupId}\nFiles: .xlsx, .csv, .json`);
        fetchBackupHistory();
      }
    } catch (err) {
      alert(`Error creating manual backup: ${err.message}`);
    } finally {
      setBackupLoading(false);
      setTimeout(() => setBackupActionStatus(""), 3000);
    }
  };

  const handleDeleteContactMessage = async (id) => {
    if (!window.confirm("Delete this inquiry message?")) return;
    try {
      await deleteContactMessageAPI(id);
      setContactMessages(contactMessages.filter((m) => m._id !== id));
    } catch (err) {
      alert(`Error deleting message: ${err.message}`);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const teamRes = await getTeamsAPI();
      if (teamRes.success) setTeams(teamRes.teams || []);

      const annRes = await getAnnouncementsAPI();
      if (annRes.success) setAnnouncements(annRes.announcements || []);

      const certRes = await searchCertificatesAPI("HV");
      if (certRes.success) setCertificates(certRes.certificates || []);

      await fetchContactMessages();
      await fetchBackupHistory();
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ams_hackathon_2026_admin_token");
    localStorage.removeItem("ams_hackathon_2026_admin_user");
    navigate("/admin/login");
  };

  const handleManualRegistrationSubmit = async (e) => {
    e.preventDefault();
    // Pre-flight member validation
    const members = manualForm.members || [];
    for (let i = 0; i < manualForm.teamSize; i++) {
      const m = members[i];
      const num = i + 1;
      if (!m || !m.name || m.name.trim().length < 2) {
        alert(`Member ${num}: Full name is required.`);
        return;
      }
      if (!m.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(m.email.trim())) {
        alert(`Member ${num}: A valid email address is required.`);
        return;
      }
      if (!m.phone || !/^[0-9]{10}$/.test(m.phone.trim())) {
        alert(`Member ${num}: A valid 10-digit phone number is required.`);
        return;
      }
    }
    setManualLoading(true);
    try {
      // Sync leader fields from Member 1 for backend compatibility
      const payload = {
        ...manualForm,
        leaderName: members[0]?.name || manualForm.leaderName,
        leaderEmail: members[0]?.email || manualForm.leaderEmail,
        leaderPhone: members[0]?.phone || manualForm.leaderPhone,
        members: members.slice(0, manualForm.teamSize),
      };
      const res = await createManualRegistrationAPI(payload);
      if (res.success) {
        alert(`✅ Cash Registration Created Successfully!\nRegistration ID: ${res.registrationId}`);
        setShowManualModal(false);
        setManualForm({
          teamName: "",
          teamSize: 4,
          leaderName: "",
          leaderEmail: "",
          leaderPhone: "",
          college: "",
          department: "",
          year: "3rd Year",
          track: "AI & Machine Learning",
          problemTitle: "",
          notes: "",
          members: createEmptyMembers(4),
        });
        fetchDashboardData();
      }
    } catch (err) {
      alert(`Error creating manual registration: ${err.message}`);
    } finally {
      setManualLoading(false);
    }
  };

  // ─── Extract Unique Options for Filter Dropdowns ───
  const uniqueColleges = useMemo(() => {
    const list = teams.map((t) => t.leader?.college).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [teams]);

  const uniqueDepartments = useMemo(() => {
    const list = teams.map((t) => t.leader?.department).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [teams]);

  // ─── Multi-Field Search, Filtering & Sorting Pipeline ───
  const filteredAndSortedTeams = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now.getTime() - 30 * 24 * 60 * 60 * 1000;

    let result = teams.filter((t) => {
      const searchLower = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !searchLower ||
        (t.registrationId && t.registrationId.toLowerCase().includes(searchLower)) ||
        (t.teamName && t.teamName.toLowerCase().includes(searchLower)) ||
        (t.leader?.name && t.leader.name.toLowerCase().includes(searchLower)) ||
        (t.leader?.email && t.leader.email.toLowerCase().includes(searchLower)) ||
        (t.leader?.phone && t.leader.phone.toLowerCase().includes(searchLower));

      const matchesCollege = selectedCollegeFilter === "All" || t.leader?.college === selectedCollegeFilter;
      const matchesDept = selectedDeptFilter === "All" || t.leader?.department === selectedDeptFilter;
      const matchesTrack = selectedTrackFilter === "All" || t.track === selectedTrackFilter;

      const isPaid = t.paymentStatus === "PAID" || t.paymentStatus === "SUCCESS" || t.paymentStatus === "CASH_PAID";
      const matchesPayment =
        selectedPaymentFilter === "All" ||
        (selectedPaymentFilter === "PAID" && isPaid) ||
        (selectedPaymentFilter === "UNPAID" && !isPaid) ||
        t.paymentStatus === selectedPaymentFilter;

      const regTime = new Date(t.createdAt || t.registrationDate).getTime();
      let matchesDate = true;
      if (selectedDateFilter === "Today") {
        matchesDate = regTime >= todayStart;
      } else if (selectedDateFilter === "Last 7 Days") {
        matchesDate = regTime >= sevenDaysAgo;
      } else if (selectedDateFilter === "Last 30 Days") {
        matchesDate = regTime >= thirtyDaysAgo;
      }

      return matchesSearch && matchesCollege && matchesDept && matchesTrack && matchesPayment && matchesDate;
    });

    result.sort((a, b) => {
      const timeA = new Date(a.createdAt || a.registrationDate).getTime();
      const timeB = new Date(b.createdAt || b.registrationDate).getTime();

      if (sortOption === "newest") {
        return timeB - timeA;
      } else if (sortOption === "oldest") {
        return timeA - timeB;
      } else if (sortOption === "teamName_asc") {
        return (a.teamName || "").localeCompare(b.teamName || "");
      } else if (sortOption === "college_asc") {
        return (a.leader?.college || "").localeCompare(b.leader?.college || "");
      } else if (sortOption === "paymentStatus") {
        const statusOrder = { PAID: 1, SUCCESS: 1, CASH_PAID: 1, UNPAID: 2, PENDING: 3 };
        return (statusOrder[a.paymentStatus] || 4) - (statusOrder[b.paymentStatus] || 4);
      }
      return timeB - timeA;
    });

    return result;
  }, [teams, searchTerm, selectedCollegeFilter, selectedDeptFilter, selectedTrackFilter, selectedPaymentFilter, selectedDateFilter, sortOption]);

  const selectedTeamsList = useMemo(() => {
    return teams.filter((t) => selectedRegistrationIds.has(t.registrationId || t._id));
  }, [teams, selectedRegistrationIds]);

  const isAllSelected = useMemo(() => {
    if (filteredAndSortedTeams.length === 0) return false;
    return filteredAndSortedTeams.every((t) => selectedRegistrationIds.has(t.registrationId || t._id));
  }, [filteredAndSortedTeams, selectedRegistrationIds]);

  const handleToggleSelectAll = () => {
    const nextSet = new Set(selectedRegistrationIds);
    if (isAllSelected) {
      filteredAndSortedTeams.forEach((t) => nextSet.delete(t.registrationId || t._id));
    } else {
      filteredAndSortedTeams.forEach((t) => nextSet.add(t.registrationId || t._id));
    }
    setSelectedRegistrationIds(nextSet);
  };

  const handleToggleSelectTeam = (regId) => {
    const nextSet = new Set(selectedRegistrationIds);
    if (nextSet.has(regId)) {
      nextSet.delete(regId);
    } else {
      nextSet.add(regId);
    }
    setSelectedRegistrationIds(nextSet);
  };

  const totalFilteredCount = filteredAndSortedTeams.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredCount / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedTeams = useMemo(() => {
    const startIdx = (validCurrentPage - 1) * itemsPerPage;
    return filteredAndSortedTeams.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedTeams, validCurrentPage, itemsPerPage]);

  const stats = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const totalRegistrations = teams.length;
    const totalParticipants = teams.reduce((sum, t) => sum + (t.teamSize || 4), 0);
    const todayRegistrations = teams.filter((t) => new Date(t.createdAt || t.registrationDate).getTime() >= todayStart).length;

    const paidRegistrations = teams.filter((t) => ["PAID", "SUCCESS", "CASH_PAID"].includes(t.paymentStatus)).length;
    const pendingRegistrations = teams.filter((t) => ["UNPAID", "PENDING"].includes(t.paymentStatus)).length;

    const totalRevenueINR = teams.reduce((sum, t) => sum + (t.teamSize || 4) * REGISTRATION_FEE_PER_PERSON, 0);

    const collegeMap = {};
    teams.forEach((t) => {
      const collegeName = t.leader?.college || "Unspecified College";
      if (!collegeMap[collegeName]) {
        collegeMap[collegeName] = { teams: 0, participants: 0 };
      }
      collegeMap[collegeName].teams += 1;
      collegeMap[collegeName].participants += t.teamSize || 4;
    });

    const collegeStats = Object.entries(collegeMap)
      .map(([college, data]) => ({ college, ...data }))
      .sort((a, b) => b.teams - a.teams);

    const deptMap = {};
    teams.forEach((t) => {
      const deptName = t.leader?.department || "Unspecified Dept";
      if (!deptMap[deptName]) {
        deptMap[deptName] = { teams: 0, participants: 0 };
      }
      deptMap[deptName].teams += 1;
      deptMap[deptName].participants += t.teamSize || 4;
    });

    const departmentStats = Object.entries(deptMap)
      .map(([department, data]) => ({ department, ...data }))
      .sort((a, b) => b.teams - a.teams);

    return {
      totalRegistrations,
      totalParticipants,
      todayRegistrations,
      paidRegistrations,
      pendingRegistrations,
      totalRevenueINR,
      collegeStats,
      departmentStats,
    };
  }, [teams]);

  const handleExecuteExport = (targetScope = exportScope, targetFormat = exportFormat) => {
    const token = localStorage.getItem("ams_hackathon_2026_admin_token");
    if (!token) {
      alert("Unauthorized: Export functionality is strictly restricted to authenticated administrators.");
      navigate("/admin/login");
      return;
    }

    let dataset = [];
    let scopeLabel = "Filtered";

    if (targetScope === "all") {
      dataset = teams;
      scopeLabel = "All";
    } else if (targetScope === "selected") {
      dataset = selectedTeamsList;
      scopeLabel = "Selected";
      if (dataset.length === 0) {
        alert("Please select at least one registration using the checkboxes to export selected data.");
        return;
      }
    } else {
      dataset = filteredAndSortedTeams;
      scopeLabel = "Filtered";
    }

    if (dataset.length === 0) {
      alert("No registration records available to export.");
      return;
    }

    const timestamp = Date.now();
    const filename = `AMS_Hackathon_${scopeLabel}_Registrations_${timestamp}`;

    if (targetFormat === "excel") {
      exportToExcel(dataset, `${filename}.xlsx`);
    } else if (targetFormat === "csv") {
      exportToCSV(dataset, `${filename}.csv`);
    } else if (targetFormat === "json") {
      exportToJSON(dataset, `${filename}.json`);
    } else if (targetFormat === "pdf") {
      exportToPDF(dataset, `${filename}.pdf`);
    }

    setShowExportModal(false);
  };

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

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    try {
      await deleteAnnouncementAPI(id);
      setAnnouncements(announcements.filter((a) => a._id !== id));
    } catch (err) {
      alert(`Error deleting announcement: ${err.message}`);
    }
  };

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

  const handleDeleteCertificate = async (id) => {
    if (!window.confirm("Are you sure you want to revoke/delete this certificate?")) return;
    try {
      await deleteCertificateAPI(id);
      setCertificates(certificates.filter((c) => c._id !== id && c.certificateCode !== id));
    } catch (err) {
      alert(`Error revoking certificate: ${err.message}`);
    }
  };

  const fetchCoordinators = async () => {
    try {
      const res = await getCoordinatorsAPI();
      if (res.success) setCoordinators(res.coordinators || []);
    } catch (err) {
      console.error("Error fetching coordinators:", err);
    }
  };

  const handleCreateCoordinator = async (e) => {
    e.preventDefault();
    if (!coordName || !coordDept || !coordPhone) return;
    setCoordLoading(true);
    try {
      const res = await createCoordinatorAPI({ name: coordName, department: coordDept, phone: coordPhone });
      if (res.success) {
        setCoordinators([res.coordinator, ...coordinators]);
        setCoordName("");
        setCoordDept("");
        setCoordPhone("");
      }
    } catch (err) {
      alert(`Error creating coordinator: ${err.message}`);
    } finally {
      setCoordLoading(false);
    }
  };

  const handleDeleteCoordinator = async (id) => {
    if (!window.confirm("Remove this coordinator?")) return;
    try {
      await deleteCoordinatorAPI(id);
      setCoordinators(coordinators.filter((c) => c._id !== id));
    } catch (err) {
      alert(`Error removing coordinator: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col font-['Inter']">
      {/* Top Header Navigation */}
      <header className="glass-nav border-b border-white/10 sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/5 border border-white/10">
            <img src={collegeLogo} alt="College Logo" className="h-8 w-auto object-contain" />
            <div className="h-5 w-[1px] bg-white/20" />
            <img src={amsHackathonLogo} alt="AMS HACKATHON 2026 Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              AMS HACKATHON 2026 <span className="text-cyan-400 font-medium text-xs">Admin Control Panel</span>
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
            { id: "registrations", name: "Registrations & Search", icon: FiUsers, badge: teams.length },
            { id: "backups", name: "Database Backups", icon: FiDatabase, badge: backups.length || undefined },
            { id: "inquiries", name: "Participant Inquiries", icon: FiMail, badge: contactMessages.length || undefined },
            { id: "tracks", name: "Manage Tracks", icon: FiLayers, badge: "12" },
            { id: "announcements", name: "Announcements", icon: FiBell, badge: announcements.length },
            { id: "certificates", name: "Issue Certificates", icon: FiAward },
            { id: "payments", name: "Payment Revenue", icon: FiDollarSign },
            { id: "coordinators", name: "Coordinators", icon: FiUserPlus, badge: coordinators.length || undefined },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === "coordinators") fetchCoordinators();
                  if (tab.id === "backups") fetchBackupHistory();
                }}
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
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    Organizer Analytics Dashboard
                  </h2>
                  <p className="text-gray-400 text-xs font-light mt-1">
                    Live metrics for registrations, today's activity, payment breakdown, and institution statistics.
                  </p>
                </div>
                <button
                  onClick={() => setShowExportModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FiDownload /> Export Center (.xlsx / .csv / .json / .pdf)
                </button>
              </div>

              {/* 6 Key Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                      <FiUsers size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300">
                      Total Teams
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium block">Total Registrations</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    {stats.totalRegistrations} <span className="text-xs text-gray-400 font-normal">({stats.totalParticipants} Participants)</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-amber-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 text-amber-400">
                      <FiCalendar size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                      Today's Activity
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium block">Today's Registrations</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-amber-400">
                    {stats.todayRegistrations} <span className="text-xs text-gray-400 font-normal">New Teams Today</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <FiCheckCircle size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                      Paid Status
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium block">Paid Registrations</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-emerald-400">
                    {stats.paidRegistrations} <span className="text-xs text-gray-400 font-normal">Verified</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-rose-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-rose-500/10 text-rose-400">
                      <FiAlertCircle size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300">
                      Pending Action
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium block">Pending / Unpaid Registrations</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-rose-400">
                    {stats.pendingRegistrations} <span className="text-xs text-gray-400 font-normal">Teams</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-purple-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-purple-500/10 text-purple-400">
                      <FiPieChart size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300">
                      Colleges
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium block">Colleges Represented</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-purple-300">
                    {stats.collegeStats.length} <span className="text-xs text-gray-400 font-normal">Institutions</span>
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-yellow-500/30 space-y-2 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center justify-center p-3 rounded-2xl bg-yellow-500/10 text-yellow-400">
                      <FiDollarSign size={24} />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-300">
                      Settled Funds
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs font-medium block">Total Revenue Collected</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-gradient-gold">
                    ₹{stats.totalRevenueINR}
                  </div>
                </div>
              </div>

              {/* Breakdown Statistics Grid: College-wise & Department-wise */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                      <FiPieChart className="text-cyan-400" /> College-wise Registrations
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">{stats.collegeStats.length} Colleges</span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {stats.collegeStats.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">No college statistics available.</p>
                    ) : (
                      stats.collegeStats.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <strong className="text-white font-medium">{item.college}</strong>
                            <p className="text-[11px] text-gray-400">{item.participants} Participants enrolled</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs font-['Space_Grotesk']">
                            {item.teams} {item.teams === 1 ? "Team" : "Teams"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                      <FiLayers className="text-purple-400" /> Department-wise Registrations
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">{stats.departmentStats.length} Departments</span>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {stats.departmentStats.length === 0 ? (
                      <p className="text-xs text-gray-500 text-center py-4">No department statistics available.</p>
                    ) : (
                      stats.departmentStats.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <strong className="text-white font-medium">{item.department}</strong>
                            <p className="text-[11px] text-gray-400">{item.participants} Participants enrolled</p>
                          </div>
                          <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs font-['Space_Grotesk']">
                            {item.teams} {item.teams === 1 ? "Team" : "Teams"}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                  Quick Organizer Actions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("announcements")}
                    className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center gap-3 transition-colors"
                  >
                    <FiBell size={20} /> Post Announcement
                  </button>

                  <button
                    onClick={() => setActiveTab("certificates")}
                    className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-3 transition-colors"
                  >
                    <FiAward size={20} /> Issue Certificate
                  </button>

                  <button
                    onClick={() => setActiveTab("backups")}
                    className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center gap-3 transition-colors"
                  >
                    <FiDatabase size={20} /> Database Backups
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-3 transition-colors"
                  >
                    <FiDownload size={20} /> Professional Export
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARTICIPANT TABLE & ADVANCED REGISTRATIONS CONTROL */}
          {activeTab === "registrations" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    Team Registrations ({totalFilteredCount} / {teams.length})
                  </h2>
                  <p className="text-gray-400 text-xs font-light">
                    Search, filter, inspect, select rows via checkboxes, and export to Excel, CSV, JSON, or PDF.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowManualModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <FiPlus /> Add Cash Registration
                  </button>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <FiDownload /> Export Center (.xlsx / .csv / .json / .pdf)
                  </button>
                </div>
              </div>

              {/* Selection Bar */}
              {selectedRegistrationIds.size > 0 && (
                <div className="glass-card p-4 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 flex items-center justify-between gap-4 text-xs animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-black font-extrabold flex items-center justify-center text-xs">
                      {selectedRegistrationIds.size}
                    </span>
                    <strong className="text-white font-['Space_Grotesk']">
                      Registration{selectedRegistrationIds.size > 1 ? "s" : ""} Selected
                    </strong>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleExecuteExport("selected", "excel")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <FiFileText /> Export Excel
                    </button>
                    <button
                      onClick={() => handleExecuteExport("selected", "pdf")}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 hover:bg-purple-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <FiFile /> Export PDF
                    </button>
                    <button
                      onClick={() => handleExecuteExport("selected", "csv")}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-semibold flex items-center gap-1"
                    >
                      <FiDownload /> Export CSV
                    </button>
                    <button
                      onClick={() => setSelectedRegistrationIds(new Set())}
                      className="px-3 py-1.5 rounded-xl bg-white/10 text-gray-300 hover:text-white text-xs font-medium"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
              )}

              {/* Comprehensive Search & Multi-Filter Control Panel */}
              <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
                <div className="relative">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by Registration ID, Team Name, Leader Name, Email, or Phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-10 py-3 rounded-2xl glass-card border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-cyan-500 shadow-inner"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">College</label>
                    <select
                      value={selectedCollegeFilter}
                      onChange={(e) => setSelectedCollegeFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Colleges ({uniqueColleges.length})</option>
                      {uniqueColleges.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Department</label>
                    <select
                      value={selectedDeptFilter}
                      onChange={(e) => setSelectedDeptFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Departments ({uniqueDepartments.length})</option>
                      {uniqueDepartments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Innovation Theme</label>
                    <select
                      value={selectedTrackFilter}
                      onChange={(e) => setSelectedTrackFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Themes (12)</option>
                      {initialTracks.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Payment Status</label>
                    <select
                      value={selectedPaymentFilter}
                      onChange={(e) => setSelectedPaymentFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Payment Statuses</option>
                      <option value="PAID">PAID Only</option>
                      <option value="UNPAID">UNPAID Only</option>
                      <option value="CASH_PAID">CASH_PAID Only</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Registration Date</label>
                    <select
                      value={selectedDateFilter}
                      onChange={(e) => setSelectedDateFilter(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="All">All Time</option>
                      <option value="Today">Today Only</option>
                      <option value="Last 7 Days">Last 7 Days</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Sort Order</label>
                    <select
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="teamName_asc">Team Name (A-Z)</option>
                      <option value="college_asc">College Name (A-Z)</option>
                      <option value="paymentStatus">Payment Status</option>
                    </select>
                  </div>
                </div>

                {(searchTerm || selectedCollegeFilter !== "All" || selectedDeptFilter !== "All" || selectedTrackFilter !== "All" || selectedPaymentFilter !== "All" || selectedDateFilter !== "All" || sortOption !== "newest") && (
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="text-gray-400 text-[11px]">
                      Showing <strong className="text-cyan-400">{totalFilteredCount}</strong> matching registrations
                    </span>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCollegeFilter("All");
                        setSelectedDeptFilter("All");
                        setSelectedTrackFilter("All");
                        setSelectedPaymentFilter("All");
                        setSelectedDateFilter("All");
                        setSortOption("newest");
                      }}
                      className="text-rose-400 hover:text-rose-300 font-semibold text-[11px] flex items-center gap-1"
                    >
                      <FiX /> Reset All Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Registrations Table */}
              <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/10 text-white font-['Space_Grotesk'] uppercase tracking-wider">
                      <tr>
                        <th className="p-4 w-10 text-center">
                          <button
                            type="button"
                            onClick={handleToggleSelectAll}
                            className="text-gray-300 hover:text-white"
                          >
                            {isAllSelected ? <FiCheckSquare className="text-cyan-400" size={16} /> : <FiSquare size={16} />}
                          </button>
                        </th>
                        <th className="p-4">Reg ID</th>
                        <th className="p-4">Team & College</th>
                        <th className="p-4">Leader Contact</th>
                        <th className="p-4">Theme & Dept</th>
                        <th className="p-4">Members</th>
                        <th className="p-4">Payment</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {paginatedTeams.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-gray-500">
                            No registration records match the selected search & filter criteria.
                          </td>
                        </tr>
                      ) : (
                        paginatedTeams.map((t, idx) => {
                          const regId = t.registrationId || t._id;
                          const isSelected = selectedRegistrationIds.has(regId);
                          return (
                            <tr key={idx} className={`hover:bg-white/5 transition-colors ${isSelected ? "bg-cyan-500/10" : ""}`}>
                              <td className="p-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSelectTeam(regId)}
                                  className="text-gray-400 hover:text-white"
                                >
                                  {isSelected ? <FiCheckSquare className="text-cyan-400" size={16} /> : <FiSquare size={16} />}
                                </button>
                              </td>
                              <td className="p-4 font-bold text-cyan-400 font-['Space_Grotesk']">{t.registrationId}</td>
                              <td className="p-4 space-y-0.5">
                                <strong className="text-white text-sm font-['Space_Grotesk'] block">{t.teamName}</strong>
                                <p className="text-[11px] text-gray-400">{t.leader?.college || "N/A"}</p>
                              </td>
                              <td className="p-4 space-y-0.5">
                                <strong className="text-gray-200 block">{t.leader?.name}</strong>
                                <p className="text-[11px] text-gray-400">{t.leader?.email}</p>
                                <p className="text-[11px] text-yellow-400 font-medium">{t.leader?.phone}</p>
                              </td>
                              <td className="p-4 space-y-1">
                                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold block w-fit">
                                  {t.track}
                                </span>
                                <p className="text-[10px] text-gray-400">{t.leader?.department} ({t.leader?.year || "3rd Year"})</p>
                              </td>
                              <td className="p-4 font-semibold text-white">{t.teamSize} Members</td>
                              <td className="p-4 space-y-0.5">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold inline-block ${
                                  t.paymentStatus === "PAID" || t.paymentStatus === "SUCCESS" || t.paymentStatus === "CASH_PAID"
                                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                    : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                                }`}>
                                  {t.paymentStatus || "PAID"}
                                </span>
                                <p className="text-[11px] text-amber-400 font-bold">₹{(t.teamSize || 4) * REGISTRATION_FEE_PER_PERSON}</p>
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => setSelectedTeamInspect(t)}
                                  className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1 mx-auto transition-colors"
                                >
                                  <FiEye /> Inspect
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls Bar */}
                <div className="p-4 border-t border-white/10 bg-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 text-[11px]">
                      Showing <strong>{totalFilteredCount > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0}</strong> to{" "}
                      <strong>{Math.min(validCurrentPage * itemsPerPage, totalFilteredCount)}</strong> of{" "}
                      <strong>{totalFilteredCount}</strong> registrations
                    </span>

                    <select
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value={10}>10 / page</option>
                      <option value={25}>25 / page</option>
                      <option value={50}>50 / page</option>
                      <option value={100}>100 / page</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={validCurrentPage === 1}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1 ${
                        validCurrentPage === 1
                          ? "opacity-30 cursor-not-allowed border-white/10 text-gray-500"
                          : "border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
                      }`}
                    >
                      <FiChevronLeft /> Prev
                    </button>

                    <div className="flex items-center gap-1 px-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - validCurrentPage) <= 1)
                        .map((p, idx, arr) => {
                          const isGap = idx > 0 && p - arr[idx - 1] > 1;
                          return (
                            <div key={p} className="flex items-center">
                              {isGap && <span className="px-1 text-gray-500">...</span>}
                              <button
                                onClick={() => setCurrentPage(p)}
                                className={`w-8 h-8 rounded-xl font-bold text-xs transition-all ${
                                  validCurrentPage === p
                                    ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                                    : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
                                }`}
                              >
                                {p}
                              </button>
                            </div>
                          );
                        })}
                    </div>

                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={validCurrentPage === totalPages}
                      className={`px-3 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1 ${
                        validCurrentPage === totalPages
                          ? "opacity-30 cursor-not-allowed border-white/10 text-gray-500"
                          : "border-white/10 hover:bg-white/10 text-gray-300 hover:text-white"
                      }`}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUTOMATED DATABASE BACKUPS */}
          {activeTab === "backups" && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                    Database Backup Management System
                  </h2>
                  <p className="text-gray-400 text-xs font-light mt-1">
                    Non-blocking, automated daily backups with manual trigger support. Download timestamped files in Excel, CSV, or JSON.
                  </p>
                </div>

                <button
                  onClick={handleCreateManualBackup}
                  disabled={backupLoading}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FiHardDrive className={backupLoading ? "animate-spin" : ""} size={18} />
                  <span>{backupLoading ? "Generating Backup..." : "Run Manual Backup Now"}</span>
                </button>
              </div>

              {backupActionStatus && (
                <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <FiCheck className="text-emerald-400" /> {backupActionStatus}
                </div>
              )}

              {/* Automatic Backup Scheduler Overview Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-cyan-500/30 space-y-2">
                  <span className="text-gray-400 text-xs font-medium block">Automated Daily Scheduler</span>
                  <div className="text-xl font-bold text-cyan-400 font-['Space_Grotesk']">Every 24 Hours</div>
                  <p className="text-[11px] text-gray-400">Background cron engine runs daily at 00:00 UTC without interrupting website traffic.</p>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-purple-500/30 space-y-2">
                  <span className="text-gray-400 text-xs font-medium block">Total Backups Generated</span>
                  <div className="text-xl font-bold text-purple-300 font-['Space_Grotesk']">{backups.length} Backups</div>
                  <p className="text-[11px] text-gray-400">Maintains 50 most recent timestamped backup archives.</p>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 space-y-2">
                  <span className="text-gray-400 text-xs font-medium block">Supported Formats</span>
                  <div className="text-xl font-bold text-emerald-400 font-['Space_Grotesk']">Excel • CSV • JSON</div>
                  <p className="text-[11px] text-gray-400">Instant direct download links available for all generated archives.</p>
                </div>
              </div>

              {/* Backup History Table */}
              <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">Backup History Manifest</h3>
                  <button
                    onClick={fetchBackupHistory}
                    className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <FiRefreshCw size={14} /> Refresh Manifest
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/10 text-white font-['Space_Grotesk'] uppercase tracking-wider">
                      <tr>
                        <th className="p-4">Backup ID</th>
                        <th className="p-4">Timestamp (IST)</th>
                        <th className="p-4">Trigger Source</th>
                        <th className="p-4">Records Backed Up</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-center">Download Archives</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {backups.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-gray-500">
                            No database backups found in manifest history. Click "Run Manual Backup Now" to create one.
                          </td>
                        </tr>
                      ) : (
                        backups.map((b, idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-bold text-cyan-400 font-mono">{b.backupId}</td>
                            <td className="p-4 text-gray-300">
                              {new Date(b.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
                            </td>
                            <td className="p-4">
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                                {b.triggeredBy || "AUTOMATIC"}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-white">
                              {b.totalRecords || 0} Records
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                                b.status === "SUCCESS"
                                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              }`}>
                                {b.status || "SUCCESS"}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              {b.files && (
                                <div className="flex items-center justify-center gap-2">
                                  {b.files.xlsx && (
                                    <a
                                      href={getBackupDownloadUrl(b.files.xlsx.filename)}
                                      download
                                      className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1"
                                      title="Download Excel Spreadsheet"
                                    >
                                      <FiFileText /> .xlsx
                                    </a>
                                  )}
                                  {b.files.csv && (
                                    <a
                                      href={getBackupDownloadUrl(b.files.csv.filename)}
                                      download
                                      className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1"
                                      title="Download CSV"
                                    >
                                      <FiDownload /> .csv
                                    </a>
                                  )}
                                  {b.files.json && (
                                    <a
                                      href={getBackupDownloadUrl(b.files.json.filename)}
                                      download
                                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-[11px] font-semibold flex items-center gap-1"
                                      title="Download JSON Dump"
                                    >
                                      <FiCode /> .json
                                    </a>
                                  )}
                                </div>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PARTICIPANT INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Participant Contact Desk Inquiries ({contactMessages.length})
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  Live participant queries submitted through the website contact form.
                </p>
              </div>

              {contactMessages.length === 0 ? (
                <div className="glass-card p-10 rounded-3xl border border-white/10 text-center text-gray-500 text-sm">
                  No participant inquiries received yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {contactMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className="glass-card p-6 rounded-3xl border border-cyan-500/20 space-y-4 relative overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                            {msg.subject || "General Query"}
                          </span>
                          <h3 className="text-base font-bold font-['Space_Grotesk'] text-white mt-1">
                            {msg.name} <span className="text-gray-400 font-normal text-xs">&lt;{msg.email}&gt;</span>
                          </h3>
                        </div>
                        <span className="text-[11px] text-gray-400">
                          {new Date(msg.createdAt).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-gray-200 text-xs font-light leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <a
                          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject || "AMS Hackathon Query")}`}
                          className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 text-xs font-bold flex items-center gap-2 transition-all"
                        >
                          <FiMail /> Reply via Email
                        </a>

                        <button
                          onClick={() => handleDeleteContactMessage(msg._id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <FiTrash2 /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MANAGE TRACKS */}
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

          {/* TAB 6: ANNOUNCEMENTS */}
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
                      <p className="text-xs text-gray-300 font-light">{ann.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann._id)}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs flex-shrink-0"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CERTIFICATES */}
          {activeTab === "certificates" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Issue Certificates
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  Generate digital verification codes for hackathon winners, participants, and mentors.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <FiAward className="text-amber-400" /> Issue Certificate Form
                </h3>

                <form onSubmit={handleGenerateCertificate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder="Recipient Full Name..."
                      value={certRecipient}
                      onChange={(e) => setCertRecipient(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                    />

                    <input
                      type="email"
                      placeholder="Recipient Email Address..."
                      value={certEmail}
                      onChange={(e) => setCertEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                    />

                    <input
                      type="text"
                      required
                      placeholder="College / Institution..."
                      value={certCollege}
                      onChange={(e) => setCertCollege(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                    />

                    <input
                      type="text"
                      placeholder="Registration ID (Optional)..."
                      value={certRegId}
                      onChange={(e) => setCertRegId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                    />

                    <select
                      value={certTrack}
                      onChange={(e) => setCertTrack(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      {initialTracks.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>

                    <select
                      value={certRole}
                      onChange={(e) => setCertRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Participant">Participant</option>
                      <option value="Winner - 1st Place">Winner - 1st Place</option>
                      <option value="Runner Up - 2nd Place">Runner Up - 2nd Place</option>
                      <option value="Mentor / Judge">Mentor / Judge</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider"
                  >
                    Generate & Issue Certificate
                  </button>
                </form>
              </div>

              <div className="glass-card rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">Issued Certificates</h3>
                  <span className="text-xs text-gray-400">{certificates.length} Total Issued</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/10 text-white font-['Space_Grotesk'] uppercase">
                      <tr>
                        <th className="p-4">Certificate Code</th>
                        <th className="p-4">Recipient Name</th>
                        <th className="p-4">College</th>
                        <th className="p-4">Role</th>
                        <th className="p-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {certificates.map((c, idx) => (
                        <tr key={idx} className="hover:bg-white/5">
                          <td className="p-4 font-bold text-amber-400 font-mono">{c.certificateCode}</td>
                          <td className="p-4 font-bold text-white">{c.recipientName}</td>
                          <td className="p-4">{c.college}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-bold">
                              {c.role}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteCertificate(c._id || c.certificateCode)}
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                            >
                              <FiTrash2 size={14} />
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

          {/* TAB 8: PAYMENTS */}
          {activeTab === "payments" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Payment & Revenue Analytics
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  Razorpay live transaction settlements and fee breakdown.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border border-yellow-500/30">
                  <span className="text-gray-400 text-xs font-medium">Total Settled Revenue</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-gradient-gold mt-1">
                    ₹{stats.totalRevenueINR}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-emerald-500/30">
                  <span className="text-gray-400 text-xs font-medium">Verified Payment Rate</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-emerald-400 mt-1">
                    {stats.paidRegistrations} Teams
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl border border-cyan-500/30">
                  <span className="text-gray-400 text-xs font-medium">Standard Registration Fee</span>
                  <div className="text-3xl font-extrabold font-['Space_Grotesk'] text-cyan-400 mt-1">
                    ₹{REGISTRATION_FEE_PER_PERSON} / Person
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: COORDINATORS */}
          {activeTab === "coordinators" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Space_Grotesk'] text-white">
                  Event Coordinators Directory
                </h2>
                <p className="text-gray-400 text-xs font-light mt-1">
                  Manage student and faculty coordinator contacts displayed on the website support section.
                </p>
              </div>

              <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <FiUserPlus className="text-cyan-400" /> Add New Coordinator
                </h3>

                <form onSubmit={handleCreateCoordinator} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Coordinator Name..."
                    value={coordName}
                    onChange={(e) => setCoordName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Department (e.g. CSE / IT)..."
                    value={coordDept}
                    onChange={(e) => setCoordDept(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                  />

                  <input
                    type="text"
                    required
                    placeholder="Phone Number..."
                    value={coordPhone}
                    onChange={(e) => setCoordPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                  />

                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={coordLoading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider"
                    >
                      {coordLoading ? "Adding..." : "Add Coordinator"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {coordinators.map((c) => (
                  <div key={c._id} className="glass-card p-6 rounded-3xl border border-white/10 space-y-3 relative group">
                    <button
                      onClick={() => handleDeleteCoordinator(c._id)}
                      className="absolute top-4 right-4 p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-xs"
                    >
                      <FiTrash2 />
                    </button>

                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 font-['Space_Grotesk'] text-lg">
                      {c.name.charAt(0)}
                    </div>

                    <div>
                      <h4 className="text-base font-bold font-['Space_Grotesk'] text-white">{c.name}</h4>
                      <p className="text-xs text-cyan-400 font-semibold">{c.department}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <FiPhone size={12} /> {c.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Professional Export Modal (Restricted to Authenticated Admins) */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-xl w-full p-6 sm:p-8 rounded-3xl border border-cyan-500/30 space-y-6 relative"
            >
              <button
                onClick={() => setShowExportModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <FiX size={20} />
              </button>

              <div className="border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold font-['Space_Grotesk'] uppercase">
                  ADMIN EXPORT CENTER
                </span>
                <h3 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white mt-2">
                  Export Registrations Data
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Generate structured spreadsheets, JSON datasets, or formatted PDF documents.
                </p>
              </div>

              {/* Data Scope Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  1. Select Data Target Scope
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setExportScope("filtered")}
                    className={`p-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] border transition-all text-center ${
                      exportScope === "filtered"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    Filtered ({filteredAndSortedTeams.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope("selected")}
                    disabled={selectedRegistrationIds.size === 0}
                    className={`p-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] border transition-all text-center ${
                      selectedRegistrationIds.size === 0
                        ? "opacity-30 cursor-not-allowed bg-white/5 text-gray-500 border-white/5"
                        : exportScope === "selected"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    Selected ({selectedRegistrationIds.size})
                  </button>

                  <button
                    type="button"
                    onClick={() => setExportScope("all")}
                    className={`p-3 rounded-2xl text-xs font-bold font-['Space_Grotesk'] border transition-all text-center ${
                      exportScope === "all"
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-500"
                        : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
                    }`}
                  >
                    All ({teams.length})
                  </button>
                </div>
              </div>

              {/* Export Format Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                  2. Choose File Format
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: "excel", label: "Excel (.xlsx)", icon: FiFileText, color: "text-emerald-400" },
                    { id: "csv", label: "CSV (.csv)", icon: FiDownload, color: "text-cyan-400" },
                    { id: "json", label: "JSON (.json)", icon: FiCode, color: "text-amber-400" },
                    { id: "pdf", label: "PDF (.pdf)", icon: FiFile, color: "text-purple-400" },
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    const isSel = exportFormat === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setExportFormat(fmt.id)}
                        className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${
                          isSel
                            ? "bg-cyan-500/20 border-cyan-500 text-white"
                            : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                        }`}
                      >
                        <Icon size={20} className={fmt.color} />
                        <span className="text-[11px] font-bold font-['Space_Grotesk']">{fmt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Included Information Checklist */}
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
                <span className="text-gray-400 font-bold text-[10px] uppercase block">Export Field Manifest Included</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-gray-300">
                  <p>✅ <strong>Registration Details</strong> (ID, Team, Leader, Email, Phone, College, Dept, Track)</p>
                  <p>✅ <strong>Payment Metadata</strong> (Amount, Payment Status, Order ID, Payment ID)</p>
                  <p>✅ <strong>Team Member Roster</strong> (Names, Emails, Phone Numbers, Assigned Roles)</p>
                  <p>✅ <strong>Timestamps & Notes</strong> (IST Registration Timestamp, Problem Title)</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleExecuteExport()}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 hover:scale-105 transition-transform flex items-center gap-2"
                >
                  <FiDownload size={16} /> Download {exportFormat.toUpperCase()} File
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inspect Modal */}
      <AnimatePresence>
        {selectedTeamInspect && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 relative"
            >
              <button
                onClick={() => setSelectedTeamInspect(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <FiX size={20} />
              </button>

              <div className="border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-bold font-['Space_Grotesk']">
                  Registration ID: {selectedTeamInspect.registrationId}
                </span>
                <h3 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white mt-2">
                  {selectedTeamInspect.teamName}
                </h3>
                <p className="text-xs text-gray-400">{selectedTeamInspect.leader?.college}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase text-gray-400 font-bold">Team Leader</span>
                  <p className="text-white font-bold text-sm">{selectedTeamInspect.leader?.name}</p>
                  <p className="text-gray-300">{selectedTeamInspect.leader?.email}</p>
                  <p className="text-yellow-400 font-mono">{selectedTeamInspect.leader?.phone}</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase text-gray-400 font-bold">Track & Department</span>
                  <p className="text-cyan-400 font-bold">{selectedTeamInspect.track}</p>
                  <p className="text-gray-300">{selectedTeamInspect.leader?.department} ({selectedTeamInspect.leader?.year || "3rd Year"})</p>
                  <p className="text-emerald-400 font-bold">Fee Paid: ₹{(selectedTeamInspect.teamSize || 4) * REGISTRATION_FEE_PER_PERSON}</p>
                </div>
              </div>

              {selectedTeamInspect.members && selectedTeamInspect.members.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 font-['Space_Grotesk']">
                    Team Members ({selectedTeamInspect.members.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTeamInspect.members.map((m, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs space-y-0.5">
                        <strong className="text-white block">{m.name}</strong>
                        <p className="text-[11px] text-cyan-300">{m.email}</p>
                        <p className="text-[11px] text-gray-400">{m.phone} • <span className="text-purple-300">{m.role}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manual Cash Registration Modal */}
      <AnimatePresence>
        {showManualModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 relative"
            >
              <button
                onClick={() => setShowManualModal(false)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <FiX size={20} />
              </button>

              <div className="border-b border-white/10 pb-4">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold font-['Space_Grotesk']">
                  Manual Desk Entry
                </span>
                <h3 className="text-2xl font-extrabold font-['Space_Grotesk'] text-white mt-2">
                  Create Cash Registration
                </h3>
              </div>

              <form onSubmit={handleManualRegistrationSubmit} className="space-y-5 text-xs">
                {/* ── Section 1: Team & College Info ── */}
                <div>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-3">Team & College Details</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Team Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CyberKnights"
                        value={manualForm.teamName}
                        onChange={(e) => setManualForm({ ...manualForm, teamName: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Team Size *</label>
                      <select
                        value={manualForm.teamSize}
                        onChange={(e) => {
                          const newSize = Number(e.target.value);
                          const currentMembers = manualForm.members || [];
                          let newMembers;
                          if (newSize > currentMembers.length) {
                            newMembers = [...currentMembers, ...createEmptyMembers(newSize - currentMembers.length)];
                          } else {
                            newMembers = currentMembers.slice(0, newSize);
                          }
                          setManualForm({ ...manualForm, teamSize: newSize, members: newMembers });
                        }}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value={3}>3 Members (₹{3 * REGISTRATION_FEE_PER_PERSON})</option>
                        <option value={4}>4 Members (₹{4 * REGISTRATION_FEE_PER_PERSON})</option>
                        <option value={5}>5 Members (₹{5 * REGISTRATION_FEE_PER_PERSON})</option>
                        <option value={6}>6 Members (₹{6 * REGISTRATION_FEE_PER_PERSON})</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">College Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Aalim Muhammed Salegh CoE"
                        value={manualForm.college}
                        onChange={(e) => setManualForm({ ...manualForm, college: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Department *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. CSE, AIDS, ECE"
                        value={manualForm.department}
                        onChange={(e) => setManualForm({ ...manualForm, department: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Academic Year *</label>
                      <select
                        value={manualForm.year}
                        onChange={(e) => setManualForm({ ...manualForm, year: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Innovation Track *</label>
                      <select
                        value={manualForm.track}
                        onChange={(e) => setManualForm({ ...manualForm, track: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                      >
                        {initialTracks.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Section 2: Member Details ── */}
                <div>
                  <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mb-3">
                    Member Details ({manualForm.teamSize} Members)
                  </p>
                  <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                    {(manualForm.members || []).slice(0, manualForm.teamSize).map((member, idx) => {
                      const memberNum = idx + 1;
                      const isLeader = idx === 0;
                      const updateMember = (field, value) => {
                        const updated = [...(manualForm.members || [])];
                        updated[idx] = { ...updated[idx], [field]: value };
                        setManualForm({ ...manualForm, members: updated });
                      };
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl border transition-all ${
                            isLeader
                              ? "border-cyan-500/40 bg-cyan-500/5"
                              : "border-white/10 bg-white/[0.02]"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isLeader ? "bg-cyan-500 text-black" : "bg-white/10 text-white"
                            }`}>M{memberNum}</span>
                            <span className="text-white font-bold text-xs">
                              Member {memberNum} {isLeader && <span className="text-cyan-400 font-normal">(Team Leader)</span>}
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold block mb-1">Full Name *</label>
                              <input
                                type="text"
                                required
                                placeholder={`Member ${memberNum} Full Name`}
                                value={member.name}
                                onChange={(e) => updateMember("name", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold block mb-1">Email Address *</label>
                              <input
                                type="email"
                                required
                                placeholder={isLeader ? "leader@college.edu" : `member${memberNum}@college.edu`}
                                value={member.email}
                                onChange={(e) => updateMember("email", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold block mb-1">Phone (10 digits) *</label>
                              <input
                                type="tel"
                                required
                                placeholder="9876543210"
                                value={member.phone}
                                onChange={(e) => updateMember("phone", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-400 font-bold block mb-1">Role / Specialty *</label>
                              <select
                                value={member.role}
                                onChange={(e) => updateMember("role", e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-[#0b1329] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-500"
                              >
                                {manualRolesList.map((r) => (
                                  <option key={r} value={r}>{r}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Section 3: Problem Details (optional) ── */}
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Problem Details (Optional)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Problem Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Smart Campus Navigator"
                        value={manualForm.problemTitle}
                        onChange={(e) => setManualForm({ ...manualForm, problemTitle: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-bold block mb-1">Notes</label>
                      <input
                        type="text"
                        placeholder="Any notes about cash collection"
                        value={manualForm.notes}
                        onChange={(e) => setManualForm({ ...manualForm, notes: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>

                {/* ── Submit Buttons ── */}
                <div className="pt-2 flex justify-end gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowManualModal(false)}
                    className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-300 font-bold text-xs hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={manualLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black font-extrabold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/20 transition-all"
                  >
                    {manualLoading ? "Processing..." : `Register & Collect ₹${manualForm.teamSize * REGISTRATION_FEE_PER_PERSON}`}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
