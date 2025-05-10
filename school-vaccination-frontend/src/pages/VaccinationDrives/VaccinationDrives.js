import React, { useEffect, useState } from "react";
import "./VaccinationDrives.css";
import axios from "axios";

const VaccinationDrives = () => {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({
    vaccine: "",
    date: "",
    doses: "",
    classes: "",
  });

  const today = new Date();
  const minDate = new Date(today.setDate(today.getDate() + 15))
    .toISOString()
    .split("T")[0];

  // ✅ Fetch drives on load
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/drives")
      .then((res) => setDrives(res.data))
      .catch((err) => console.error("Failed to load drives", err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newDrive = {
      vaccine: form.vaccine,
      date: form.date,
      totalDoses: Number(form.doses),
      applicableClasses: form.classes.split(",").map((cls) => cls.trim()),
    };

    try {
      const res = await axios.post("http://localhost:8080/api/drives", newDrive);
      setDrives([...drives, res.data]); // update UI with new drive
      setForm({ vaccine: "", date: "", doses: "", classes: "" });
    } catch (err) {
      console.error("Failed to add drive", err);
    }
  };

  const isEditable = (date) => new Date(date) > new Date();

  return (
    <div className="drive-container">
      <h2 className="drive-title">Manage Vaccination Drives</h2>

      <form onSubmit={handleSubmit} className="drive-form">
        <input
          type="text"
          name="vaccine"
          placeholder="Vaccine Name"
          value={form.vaccine}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          min={minDate}
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="doses"
          placeholder="Available Doses"
          value={form.doses}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="classes"
          placeholder="Applicable Classes (e.g., 5A, 5B)"
          value={form.classes}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Drive</button>
      </form>

      <div className="drive-table">
        <h3>Scheduled Drives</h3>
        {drives.length === 0 ? (
          <p className="no-data">No drives scheduled.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Vaccine</th>
                <th>Classes</th>
                <th>Doses</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive._id}>
                  <td>{new Date(drive.date).toLocaleDateString()}</td>
                  <td>{drive.vaccine}</td>
                  <td>{drive.applicableClasses.join(", ")}</td>
                  <td>{drive.totalDoses}</td>
                  <td>
                    {isEditable(drive.date) ? (
                      <span className="editable">Editable</span>
                    ) : (
                      <span className="locked">Expired</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VaccinationDrives;
