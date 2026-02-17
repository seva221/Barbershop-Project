import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const barbershops = [
    {
      id: 1,
      name: "Fresh Cut TLV",
      rating: 4.8,
      address: "Dizengoff 120, Tel Aviv",
      image:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1",
    },
    {
      id: 2,
      name: "Jerusalem Style",
      rating: 4.6,
      address: "Jaffa 45, Jerusalem",
      image:
        "https://images.unsplash.com/photo-1517832606299-7ae9b720a186",
    },
    {
      id: 3,
      name: "Haifa Barber Pro",
      rating: 4.9,
      address: "Herzl 33, Haifa",
      image:
        "https://images.unsplash.com/photo-1585747860715-2ba37e788b70",
    },
  ];

  return (
    <div style={styles.container}>
      {barbershops.map((shop) => (
        <div key={shop.id} style={styles.card}>
          <img src={shop.image} alt={shop.name} style={styles.image} />

          <div style={styles.content}>
            <h3>{shop.name}</h3>
            <p>{shop.address}</p>
            <p>⭐ {shop.rating} / 5</p>

            <button
              style={styles.button}
              onClick={() => navigate(`/appointment/${shop.id}`)}
            >
              Make Appointment
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
    padding: "40px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  content: {
    padding: "15px",
  },
  button: {
    marginTop: "10px",
    padding: "8px 15px",
    cursor: "pointer",
  },
};

export default Home;
