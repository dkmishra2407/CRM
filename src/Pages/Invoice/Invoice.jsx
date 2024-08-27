import axios from "axios";
import { useState } from "react";

const CreateInvoiceComponent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const createInvoice = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post("http://localhost:7171/api/invoices", {
        "invoiceId": "INV003",
        "invoiceDate": "2023-08-16",
        "dueDate": "2023-08-31",
        "purchaseOrderNumber": "PO789123",
        "salespersonName": "John Doe",
        "paymentTerms": "Net 20",
        "currency": "USD",
        "discountOffers": "15% off"
      });

      // Handle success
      if (response.status === 201 || response.status === 200) {
        setSuccess("Invoice created successfully!");
        console.log("Invoice created:", response.data);
      }
    } catch (err) {
      // Handle error
      setError("Failed to create invoice. Please try again.");
      console.error("Error creating invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={createInvoice} disabled={loading}>
        {loading ? "Creating Invoice..." : "Create Invoice"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default CreateInvoiceComponent;
