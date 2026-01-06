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
  FaSignOutAlt
} from "react-icons/fa";
import { 
  FaSackDollar,
  FaMoneyBillTransfer 
} from "react-icons/fa6";
import { TbReport } from "react-icons/tb";

import { NavLink } from "react-router-dom";
import LoadingSpinner from "../../components/loadingSpinner";

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
  const [openSections, setOpenSections] = useState({ exco: true });

  const formatCurrency = (num) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num || 0);
  };

  const Stat = ({ label, value, color }) => (
    <div className="p-3 bg-gray-50 rounded-lg shadow-sm text-center">
      <p className={`text-lg font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);
        // Fetch Members
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/member`
        );
        const list = res.data;
        // setMembers(list);
        setOrdinaryMembers(list.filter((m) => m.memberType === "ordinary"));
        setLifeMembers(list.filter((m) => m.memberType === "life"));
        setAssociateMembers(list.filter((m) => m.memberType === "associate"));
        setHonoraryMembers(list.filter((m) => m.memberType === "honorary"));
        setOverseasMembers(list.filter((m) => m.memberType === "overseas"));
        // Financial Summary
        const financeRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/ledger-account`
        );
        const accounts = financeRes.data;
        const cashAccount = accounts.find(
          (acc) => acc.accountId.toLowerCase() === "325-001"
        );
        const savingAccount = accounts.find(
          (acc) => acc.accountId.toLowerCase() === "325-002"
        );
        const currentAccount = accounts.find(
          (acc) => acc.accountId.toLowerCase() === "325-003"
        );
        setCashInHand(cashAccount?.accountBalance || 0);
        setSavingAccounts(savingAccount?.accountBalance || 0);
        setCurrentAccounts(currentAccount?.accountBalance || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      {/* ───────── SIDEBAR ───────── */}
      <aside
        className={`fixed md:static z-40 w-64 bg-white shadow-lg transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-4 font-bold text-orange-600 text-lg border-b">
          Control Panel
        </div>

        <nav className="flex flex-col p-2 gap-1 text-gray-700">

          <SidebarLink to="/" icon={<FaHome />} label="Home" />
          <SidebarLink to="/control" icon={<FaAtom />} label="Dashboard" />
          <SidebarLink to="/control/members" icon={<FaUsers />} label="Members" />
          <SidebarLink to="/control/exco-members" icon={<FaUsersCog />} label="Executive Committee" />

          <SidebarLink to="/control/pending-members" icon={<FaUserClock />} label="Approve New Members" />
          <SidebarLink to="add-member-secretary" icon={<FaUsers />} label="Add New Members" />
          <SidebarLink to="edit-member-secretary" icon={<FaUsers />} label="Edit Members" />

          <SidebarLink to="/control/receipts-entry" icon={<FaReceipt />} label="Receipts Entry" />
          <SidebarLink to="/control/vouchers-entry" icon={<FaMoneyCheckAlt />} label="Vouchers Entry" />
          <SidebarLink to="/control/fund-transfer" icon={<FaMoneyBillTransfer />} label="Transfers Entry" />
          <SidebarLink to="/control/cash-book" icon={<FaSackDollar />} label="Cash & Bank Book" />
          <SidebarLink to="/control/transactions-report" icon={<TbReport />} label="Transactions Report" />
          <SidebarLink to="/control/constitution" icon={<TbReport />} label="Constitution" />

          {/* Logout */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.reload();
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-50 transition text-gray-700"
          >
            <span className="text-red-500"><FaSignOutAlt /></span> Logout
          </button>

        </nav>

      </aside>

      {/* ───────── MAIN CONTENT ───────── */}
      <main className="flex-1 flex flex-col w-full">

        {/* TOP BAR */}
        <header className="sticky top-0 z-30 bg-white shadow-sm px-4 py-3 flex items-center gap-4">
          <button
            className="md:hidden text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            🖥️ Control Panel Dashboard
          </h1>
        </header>

        {/* CONTENT */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 w-full">
          <DashboardCard
            title="Members Count"
            icon={<FaUsersCog className="text-indigo-500" />}
            collapsible
            open={openSections.exco}
            onToggle={() => toggleSection("exco")}
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Stat label="Ordinary Members" value={ordinaryMembers.length} color="text-blue-600" />
              <Stat label="Life Members" value={lifeMembers.length} color="text-green-600" />
              <Stat label="Associate Members" value={associateMembers.length} color="text-purple-600" />
              <Stat label="Honorary Members" value={honoraryMembers.length} color="text-orange-600" />
              <Stat label="Overseas Members" value={overseasMembers.length} color="text-pink-600" />
              <Stat label="TOTAL MEMBERS" value={
                ordinaryMembers.length +
                lifeMembers.length +
                associateMembers.length +
                honoraryMembers.length +
                overseasMembers.length
              } color="text-red-600 font-bold"/>
            </div>
          </DashboardCard>

          <DashboardCard
            title="Financial Summary"
            icon={<FaUsersCog className="text-indigo-500" />}
            collapsible
            open={openSections.exco}
            onToggle={() => toggleSection("exco")}
          >
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Stat label="Cash in Hand" value={formatCurrency(cashInHand)} color="text-blue-600" />
            <Stat label="Saving Accounts" value={formatCurrency(savingAccounts)} color="text-green-600" />
            <Stat label="Current Accounts" value={formatCurrency(currentAccounts)} color="text-purple-600" />
            <Stat 
              label="TOTAL AMOUNT" 
              value={formatCurrency(
                (cashInHand || 0) +
                (savingAccounts || 0) +
                (currentAccounts || 0)
              )} 
              color="text-red-600 font-bold"
            />
          </div>

          </DashboardCard>

          <DashboardCard
            title="Member Applications Awaiting Approval"
            icon={<FaUserClock className="text-blue-500" />}
          >
            <Empty text="No pending applications to approve" />
          </DashboardCard>          
        </div>

      </main>
    </div>
  );
}

/* ───────── SIDEBAR COMPONENTS ───────── */

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-2 rounded-lg transition
       ${isActive ? "bg-orange-200 font-semibold text-orange-800" : "hover:bg-orange-50"}`
    }
  >
    <span className="text-orange-500">{icon}</span>
    {label}
  </NavLink>
);


const SidebarItem = ({ icon, label }) => (
  <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-orange-50 cursor-pointer transition">
    <span className="text-orange-500">{icon}</span>
    <span>{label}</span>
  </div>
);

/* ───────── DASHBOARD COMPONENTS ───────── */

const DashboardCard = ({
  title,
  icon,
  children,
  collapsible,
  open,
  onToggle,
}) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div
      className={`flex items-center justify-between p-4 bg-orange-50 ${
        collapsible ? "cursor-pointer" : ""
      }`}
      onClick={collapsible ? onToggle : undefined}
    >
      <h2 className="flex items-center gap-2 font-semibold text-gray-700">
        {icon} {title}
      </h2>
      {collapsible &&
        (open ? <FaChevronUp /> : <FaChevronDown />)}
    </div>

    <div className={`p-4 ${collapsible && !open ? "hidden" : ""}`}>
      {children}
    </div>
  </div>
);

const Empty = ({ text }) => (
  <p className="text-sm text-gray-400 text-center py-6">{text}</p>
);
