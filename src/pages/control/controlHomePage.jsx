import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaMoneyCheckAlt,
  FaUserClock,
  FaChevronDown,
  FaChevronUp,
  FaUsersCog,
  FaHome,
  FaAtom,
  FaUsers,
  FaBars,
  FaReceipt,
  FaSignOutAlt,
  FaTimes,
} from "react-icons/fa";
import { FaSackDollar, FaMoneyBillTransfer } from "react-icons/fa6";
import { TbReport } from "react-icons/tb";
import { NavLink } from "react-router-dom";
import LoadingSpinner from "../../components/loadingSpinner";
import { Outlet } from "react-router-dom";

/* ───────── MAIN PAGE ───────── */

export default function ControlHomePage() {
  const [isLoading, setIsLoading] = useState(true);

  const [ordinaryMembers, setOrdinaryMembers] = useState([]);
  const [lifeMembers, setLifeMembers] = useState([]);
  const [associateMembers, setAssociateMembers] = useState([]);
  const [honoraryMembers, setHonoraryMembers] = useState([]);
  const [overseasMembers, setOverseasMembers] = useState([]);

  const [cashInHand, setCashInHand] = useState(0);
  const [savingAccounts, setSavingAccounts] = useState(0);
  const [currentAccounts, setCurrentAccounts] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ exco: true, finance: true });

  /* ───── USER & ROLE ───── */
  const user = JSON.parse(localStorage.getItem("user"));
  // const memberRoll = user?.memberRole; // <-- correct key
  const memberRoll = "admin";
  const normalizedRole = memberRoll?.toLowerCase().trim();  

  /* ───── MENU CONFIG ───── */
  const menuItems = [
    { label: "Home", to: "/", icon: <FaHome />, roles: ["admin","president","secretary","treasurer","vice-president","assistant-secretary","assistant-treasurer","activity-coordinator","committee-member","internal-auditor"] },
    { label: "Dashboard", to: "/control", icon: <FaAtom />, roles: ["admin","president","secretary","treasurer","vice-president","assistant-secretary","assistant-treasurer","activity-coordinator","committee-member","internal-auditor"] },
    { label: "Members", to: "/control/members", icon: <FaUsers />, roles: ["admin","president","secretary","treasurer","vice-president","assistant-secretary","assistant-treasurer","activity-coordinator","committee-member","internal-auditor"] },
    { label: "Executive Committee", to: "/control/exco-members", icon: <FaUsersCog />, roles: ["admin","president","secretary","treasurer","vice-president","assistant-secretary","assistant-treasurer","activity-coordinator","committee-member","internal-auditor"] },
    { label: "Approve Members", to: "/control/pending-members", icon: <FaUserClock />, roles: ["admin","secretary","assistant-secretary"] },
    { label: "Receipts Entry", to: "/control/receipts-entry", icon: <FaReceipt />, roles: ["admin","treasurer","assistant-treasurer","secretary"] },
    { label: "Vouchers Entry", to: "/control/vouchers-entry", icon: <FaMoneyCheckAlt />, roles: ["admin","treasurer","assistant-treasurer"] },
    { label: "Fund Transfer", to: "/control/fund-transfer", icon: <FaMoneyBillTransfer />, roles: ["admin","treasurer"] },
    { label: "Cash Book", to: "/control/cash-book", icon: <FaSackDollar />, roles: ["admin","treasurer","committee-member"] },
    { label: "Transactions Report", to: "/control/transactions-report", icon: <TbReport />, roles: ["admin","president","treasurer","committee-member","internal-auditor"] },
  ];

  /* ───── HELPERS ───── */
  const formatCurrency = (num) =>
    new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(num || 0);

  const Stat = ({ label, value, color }) => (
    <div className="p-3 bg-gray-50 rounded-lg shadow-sm text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );

  /* ───── DATA FETCH ───── */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const membersRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/member`);
        const list = membersRes.data;

        setOrdinaryMembers(list.filter(m => m.memberType === "ordinary"));
        setLifeMembers(list.filter(m => m.memberType === "life"));
        setAssociateMembers(list.filter(m => m.memberType === "associate"));
        setHonoraryMembers(list.filter(m => m.memberType === "honorary"));
        setOverseasMembers(list.filter(m => m.memberType === "overseas"));

        const financeRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/ledger-account`);
        const accounts = financeRes.data;

        setCashInHand(accounts.find(a => a.accountId === "325-001")?.accountBalance || 0);
        setSavingAccounts(accounts.find(a => a.accountId === "325-002")?.accountBalance || 0);
        setCurrentAccounts(accounts.find(a => a.accountId === "325-003")?.accountBalance || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleSection = (key) =>
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex w-full min-h-screen bg-gray-100">

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
             onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`fixed md:static z-40 w-64 bg-white shadow-lg transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>

        <div className="p-4 flex justify-between items-center font-bold text-orange-600 border-b">
          Control Panel
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className="flex flex-col p-2 gap-1">
          {menuItems
            .filter(item =>
              !normalizedRole ||
              item.roles.map(r => r.toLowerCase()).includes(normalizedRole)
            )
            .map(item => (
              <SidebarLink
                key={item.to}
                to={item.to}
                icon={item.icon}
                label={item.label}
                onClick={() => setSidebarOpen(false)}
              />
            ))}

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <FaSignOutAlt className="text-red-500" /> Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col">

        <header className="sticky top-0 z-20 bg-white px-4 py-3 flex gap-4 shadow-sm">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold">🖥️ Control Panel Dashboard</h1>
        </header>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardCard title="Members Count" icon={<FaUsersCog />} collapsible open={openSections.exco}
            onToggle={() => toggleSection("exco")}>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Ordinary" value={ordinaryMembers.length} color="text-blue-600" />
              <Stat label="Life" value={lifeMembers.length} color="text-green-600" />
              <Stat label="Associate" value={associateMembers.length} color="text-purple-600" />
              <Stat label="Honorary" value={honoraryMembers.length} color="text-orange-600" />
              <Stat label="Overseas" value={overseasMembers.length} color="text-pink-600" />
              <Stat label="TOTAL" value={
                ordinaryMembers.length + lifeMembers.length + associateMembers.length +
                honoraryMembers.length + overseasMembers.length
              } color="text-red-600" />
            </div>
          </DashboardCard>

          <DashboardCard title="Financial Summary" icon={<FaSackDollar />} collapsible open={openSections.finance}
            onToggle={() => toggleSection("finance")}>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Cash In Hand" value={formatCurrency(cashInHand)} color="text-blue-600" />
              <Stat label="Savings Account" value={formatCurrency(savingAccounts)} color="text-green-600" />
              <Stat label="Current Account" value={formatCurrency(currentAccounts)} color="text-purple-600" />
              <Stat label="TOTAL" value={formatCurrency(cashInHand + savingAccounts + currentAccounts)} color="text-red-600" />
            </div>
          </DashboardCard>

          <DashboardCard title="Pending Applications" icon={<FaUserClock />}>
            <Empty text="No pending applications" />
          </DashboardCard>
        </div>
        <Outlet />
      </main>
    </div>
  );
}

/* ───────── COMPONENTS ───────── */

const SidebarLink = ({ to, icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg transition
      ${isActive ? "bg-orange-200 font-semibold" : "hover:bg-orange-50"}`
    }
  >
    <span className="text-orange-500">{icon}</span>
    {label}
  </NavLink>
);

const DashboardCard = ({ title, icon, children, collapsible, open, onToggle }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className={`flex justify-between items-center p-4 bg-orange-50 ${collapsible ? "cursor-pointer" : ""}`}
         onClick={collapsible ? onToggle : undefined}>
      <h2 className="flex gap-2 font-semibold">{icon} {title}</h2>
      {collapsible && (open ? <FaChevronUp /> : <FaChevronDown />)}
    </div>
    <div className={`p-4 ${collapsible && !open ? "hidden" : ""}`}>
      {children}
    </div>
  </div>
);

const Empty = ({ text }) => (
  <p className="text-sm text-gray-400 text-center py-6">{text}</p>
);
