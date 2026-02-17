import { useNavigate } from "react-router-dom";

function BarberCard({ shop }) {
  const navigate = useNavigate();

  return (
    <div style={styles.card}>
      <img src={shop.image} alt={shop.name} style={styles.image} />
      <h3>{shop.name}</h3>
      <p>{shop.address}</p>
      <p>⭐ {shop.rating} / 5</p>
      <button onClick={() => navigate(`/appointment/${shop._id}`)}>
        Make Appointment
      </button>
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #ddd",
    padding: "15px",
    borderRadius: "10px",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
  },
};

export default BarberCard;