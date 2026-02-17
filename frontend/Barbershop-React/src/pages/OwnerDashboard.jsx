import WorkersTab from "../components/WorkersTab";
import IncomeChart from "../components/IncomeChart";
import OutcomeChart from "../components/OutcomeChart";
import AppointmentsChart from "../components/AppointmentsChart";

function OwnerDashboard() {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Business Dashboard</h2>

      <div style={{ marginBottom: "40px" }}>
        <IncomeChart />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <OutcomeChart />
      </div>

      <div style={{ marginBottom: "40px" }}>
        <AppointmentsChart />
      </div>

      <WorkersTab />
    </div>
  );
}

export default OwnerDashboard;
