import { useState } from "react";

function BusinessSetup() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(URL.createObjectURL(file));
  };

  const handleSubmit = () => {
    alert("Business Created (locally only)");
  };

  return (
    <div style={{ width: "400px", margin: "100px auto" }}>
      <h2>Create Business</h2>

      <input
        placeholder="Business Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Address (Street, City in Israel)"
        onChange={(e) => setAddress(e.target.value)}
      />

      <input type="file" onChange={handleImageChange} />

      {image && (
        <img
          src={image}
          alt="Preview"
          style={{ width: "100%", marginTop: "20px" }}
        />
      )}

      <button onClick={handleSubmit}>Create</button>
    </div>
  );
}

export default BusinessSetup;
