import { useState } from "react";

function WorkersTab() {
  const [workers, setWorkers] = useState([
    { id: 1, name: "David Cohen", phone: "050-1234567" },
    { id: 2, name: "Moshe Levi", phone: "052-7654321" },
  ]);

  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  const addWorker = () => {
    if (!newName || !newPhone) return;

    const newWorker = {
      id: Date.now(),
      name: newName,
      phone: newPhone,
    };

    setWorkers([...workers, newWorker]);
    setNewName("");
    setNewPhone("");
  };

  const deleteWorker = (id) => {
    setWorkers(workers.filter((w) => w.id !== id));
  };

  const startEdit = (worker) => {
    setEditingId(worker.id);
    setNewName(worker.name);
    setNewPhone(worker.phone);
  };

  const saveEdit = () => {
    setWorkers(
      workers.map((w) =>
        w.id === editingId ? { ...w, name: newName, phone: newPhone } : w
      )
    );
    setEditingId(null);
    setNewName("");
    setNewPhone("");
  };

  return (
    <div>
      <h3>Workers</h3>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          placeholder="Phone"
          value={newPhone}
          onChange={(e) => setNewPhone(e.target.value)}
        />

        {editingId ? (
          <button onClick={saveEdit}>Save</button>
        ) : (
          <button onClick={addWorker}>Add</button>
        )}
      </div>

      {workers.map((worker) => (
        <div key={worker.id} style={{ marginBottom: "10px" }}>
          {worker.name} - {worker.phone}
          <button onClick={() => startEdit(worker)}>Edit</button>
          <button onClick={() => deleteWorker(worker.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default WorkersTab;
