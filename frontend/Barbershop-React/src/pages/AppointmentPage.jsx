import { useParams } from "react-router-dom";

function AppointmentPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h2>Book Appointment</h2>
      <p>Barbershop ID: {id}</p>

      <input type="date" />
      <input type="time" />
      <button>Confirm Appointment</button>
    </div>
  );
}

export default AppointmentPage;
