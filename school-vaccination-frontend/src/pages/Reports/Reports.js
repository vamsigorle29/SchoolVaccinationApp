import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Reports = () => {
  const fullData = [
    {
      name: "Anjali Verma",
      roll: "S101",
      class: "Grade 5",
      vaccine: "Hepatitis B",
      date: "2025-05-15",
      status: "Vaccinated",
    },
    {
      name: "Rahul Iyer",
      roll: "S102",
      class: "Grade 6",
      vaccine: "MMR",
      date: "2025-05-25",
      status: "Vaccinated",
    },
    {
      name: "Sahana",
      roll: "S103",
      class: "Grade 6",
      vaccine: "Hepatitis B",
      date: "2025-05-15",
      status: "Vaccinated",
    },
  ];

  const [filters, setFilters] = useState({ name: "", roll: "", vaccine: "" });
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = fullData.filter((item) => {
    return (
      item.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      item.roll.toLowerCase().includes(filters.roll.toLowerCase()) &&
      item.vaccine.toLowerCase().includes(filters.vaccine.toLowerCase())
    );
  });

  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const downloadCSV = () => {
    const header = ["Name", "Roll", "Class", "Vaccine", "Date", "Status"];
    const rows = filteredData.map((d) => [
      d.name,
      d.roll,
      d.class,
      d.vaccine,
      d.date,
      d.status,
    ]);
    const csv =
      "data:text/csv;charset=utf-8," +
      [header, ...rows].map((e) => e.join(",")).join("\n");
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", "vaccination_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "vaccination_report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Roll", "Class", "Vaccine", "Date", "Status"];
    const tableRows = filteredData.map((d) => [
      d.name,
      d.roll,
      d.class,
      d.vaccine,
      d.date,
      d.status,
    ]);
    autoTable(doc, { head: [tableColumn], body: tableRows });
    doc.save("vaccination_report.pdf");
  };

  return (
    <div className="bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Vaccination Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          name="name"
          type="text"
          placeholder="Search by Student Name"
          value={filters.name}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="roll"
          type="text"
          placeholder="Search by Roll Number"
          value={filters.roll}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          name="vaccine"
          type="text"
          placeholder="Search by Vaccine"
          value={filters.vaccine}
          onChange={handleChange}
          className="border p-2 rounded"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={downloadCSV} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          CSV
        </button>
        <button onClick={downloadExcel} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          Excel
        </button>
        <button onClick={downloadPDF} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
          PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 font-semibold text-gray-700">Name</th>
              <th className="p-3 font-semibold text-gray-700">Roll</th>
              <th className="p-3 font-semibold text-gray-700">Class</th>
              <th className="p-3 font-semibold text-gray-700">Vaccine</th>
              <th className="p-3 font-semibold text-gray-700">Date</th>
              <th className="p-3 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((d, i) => (
              <tr key={i} className="border-b">
                <td className="p-3 text-gray-700">{d.name}</td>
                <td className="p-3 text-gray-700">{d.roll}</td>
                <td className="p-3 text-gray-700">{d.class}</td>
                <td className="p-3 text-gray-700">{d.vaccine}</td>
                <td className="p-3 text-gray-700">{d.date}</td>
                <td className="p-3 text-green-600 font-semibold">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          Showing {(page - 1) * rowsPerPage + 1}–{Math.min(page * rowsPerPage, filteredData.length)} of {filteredData.length} results
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Previous
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
