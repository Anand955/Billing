import React, { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "./InvoicePDF"; // Assuming you have this component

const InvoiceForm = () => {
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, "0")}${(
    today.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}${today.getFullYear().toString().slice(2)}`;

  const [formData, setFormData] = useState({
    invoiceNumber: `INV-${formattedDate}`,
    invoiceDate: today.toISOString().split("T")[0],
    customerName: "", // Default to empty string
    customerAddress: "",
    items: [
      {
        date: new Date().toISOString().split("T")[0],
        service: "",
        quantity: 0,
        rate: 0,
        showDropdown: false,
      },
    ],
  });

  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showQrUpload, setShowQrUpload] = useState(false);
  const [qrImage, setQrImage] = useState(null);
  const [businessInfo, setBusinessInfo] = useState({
    name: "",
    address1: "",
    address2: "",
    phone: "",
    email: "",
  });
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
  });

  const predefinedServices = [
    { service: "White Apron", rate: 22 },
    { service: "Blue Face Mask", rate: 5 },
    { service: "Blue Socks", rate: 5 },
    { service: "Blue Apron", rate: 40 },
  ];

  const customerList = [
    {
      name: "Halewood Laboratories Private Limited",
      address:
        "319 G I D C Industrial Estate, Phase 2, Vatva, Ahmedabad, Gujarat 382440",
    },
    { name: "Hagji Bhai", address: "Some other address here" },
  ];

  const exampleBusinesses = [
    {
      name: "Apsara Power Laundry",
      address1: "Shop No: 8, Kedar Appartment, Opp Chamak-Chuna",
      address2: "Thakkar Nagar - 382350",
      phone: "9558768784",
      email: "ananddagar111@gmail.com",
      bankId: 1,
      qrImage: "/images/QR_code.jpg",
    },
    {
      name: "Bharat Laundry Services",
      address1: "34, New Cloth Market",
      address2: "Navrangpura, Ahmedabad - 380009",
      phone: "9876543210",
      email: "bharatlaundry@gmail.com",
      bankId: 2,
    },
    {
      name: "Shree Dry Clean",
      address1: "45 Market Road",
      address2: "Maninagar, Ahmedabad - 380008",
      phone: "9123456780",
      email: "shreedryclean@gmail.com",
      bankId: 3,
    },
    {
      name: "Crystal Laundry Services",
      address1: "101, City Center",
      address2: "Satellite, Ahmedabad - 380015",
      phone: "9988776655",
      email: "crystallaundry@gmail.com",
    },
    {
      name: "Urban Wash Hub",
      address1: "22, Riverfront Plaza",
      address2: "Sabarmati, Ahmedabad - 380005",
      phone: "9090909090",
      email: "urbanwashhub@gmail.com",
    },
  ];

  const exampleBankDetails = [
    {
      id: 1,
      accountName: "Dagar Anand Kishanbhai",
      accountNumber: "4647033889",
      ifsc: "KKBK0002603",
      bankName: "Kotak Mahindra Bank",
    },
    {
      id: 2,
      accountName: "Bharat Laundry Services",
      accountNumber: "2345678901",
      ifsc: "HDFC0005678",
      bankName: "HDFC Bank",
    },
    {
      id: 3,
      accountName: "Shree Dry Clean",
      accountNumber: "3456789012",
      ifsc: "ICIC0004321",
      bankName: "ICICI Bank",
    },
    {
      id: 4,
      accountName: "Crystal Laundry Services",
      accountNumber: "4567890123",
      ifsc: "AXIS0008765",
      bankName: "Axis Bank",
    },
    {
      id: 5,
      accountName: "Urban Wash Hub",
      accountNumber: "5678901234",
      ifsc: "BOB0002468",
      bankName: "Bank of Baroda",
    },
  ];

  const calculateTotal = (items) => {
    return items.reduce(
      (sum, item) => sum + (item.quantity ? item.quantity * item.rate : 0),
      0
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [name]:
        name === "quantity" || name === "rate"
          ? value
            ? parseFloat(value)
            : 0
          : value,
    };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          date: new Date().toISOString().split("T")[0],
          service: "", // Empty initially
          quantity: 0, // Default to 0
          rate: 0, // Default to 0
          showDropdown: false, // Hidden dropdown initially
        },
      ],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const generatePDF = async () => {
    const total = calculateTotal(formData.items);

    // Add total, businessInfo, and bankDetails to formData
    const invoiceData = {
      ...formData,
      businessInfo,
      bankDetails: showBankDetails ? bankDetails : null,
      total,
      qrImage: showQrUpload ? qrImage : null, // <-- add this line
    };

    // Generate PDF and download immediately
    const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `invoice_${invoiceData.invoiceNumber}.pdf`;
    a.click();
  };

  const total = calculateTotal(formData.items);

  const handleInputChange = (index, e) => {
    const { value } = e.target;
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      service: value,
      showDropdown: value.length > 0, // Show dropdown if there is some text
    };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleServiceSelect = (index, selectedService) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      service: selectedService.service,
      rate: selectedService.rate,
      showDropdown: false, // Hide the dropdown after selecting a service
    };
    setFormData((prev) => ({ ...prev, items: newItems }));
  };
  const handleCustomerSelect = (customerName) => {
    const selectedCustomer = customerList.find(
      (customer) => customer.name === customerName
    );

    setFormData((prev) => ({
      ...prev,
      customerName: selectedCustomer.name, // Set the selected customer name
      customerAddress: selectedCustomer.address, // Set the associated address
    }));

    // Hide the dropdown after selecting a customer
    setShowCustomerDropdown(false);
  };

  const handleCustomerChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      customerName: value,
    }));
  };

  const handleBusinessInfoChange = (e) => {
    const { name, value } = e.target;
    setBusinessInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "name") {
      setShowBusinessDropdown(value.length > 0);
    }
  };

  const handleBusinessSelect = (business) => {
    setBusinessInfo(business);
    setShowBusinessDropdown(false);

    // Set QR image if present
    if (business.qrImage) {
      setQrImage(business.qrImage);
    } else {
      setQrImage(null);
    }

    // Auto-fill bank details if bankId is present
    if (business.bankId) {
      const matchedBank = exampleBankDetails.find(
        (b) => b.id === business.bankId
      );
      if (matchedBank) {
        setBankDetails(matchedBank);
        setShowBankDetails(true); // Checkbox bhi tick ho jayega
      }
    }
  };

  useEffect(() => {
    if (showBankDetails && businessInfo.bankId) {
      const matchedBank = exampleBankDetails.find(
        (b) => b.id === businessInfo.bankId
      );
      if (matchedBank) {
        setBankDetails(matchedBank);
      }
    }
    // Agar checkbox untick ho to bank details blank ho jayein
    if (!showBankDetails) {
      setBankDetails({
        accountName: "",
        accountNumber: "",
        ifsc: "",
        bankName: "",
      });
    }
  }, [showBankDetails, businessInfo.bankId]);

  return (
    <form className="max-w-4xl mx-auto p-2 sm:p-4 md:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-blue-800 text-center">
        Create New Invoice
      </h2>

      {/* Invoice Number & Today Date */}
      <div className="bg-gray-50 border border-blue-100 rounded-lg shadow-sm p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Invoice Number
          </label>
          <input
            type="text"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            readOnly
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Today’s Date
          </label>
          <input
            type="text"
            value={new Date().toLocaleDateString("en-CA")}
            readOnly
            className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-700"
          />
        </div>
      </div>

      {/* Business Information Section */}
      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-4 border-b pb-2">
          Business Information
        </h3>
        <div className="bg-gray-50 border border-blue-100 rounded-lg shadow-sm p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Business Name
            </label>
            <input
              type="text"
              name="name"
              value={businessInfo.name}
              onChange={handleBusinessInfoChange}
              onFocus={() =>
                setShowBusinessDropdown(businessInfo.name.length > 0)
              }
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
              placeholder="Business Name"
              required
              autoComplete="off"
            />
            {showBusinessDropdown && businessInfo.name && (
              <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                {exampleBusinesses
                  .filter((biz) =>
                    biz.name
                      .toLowerCase()
                      .includes(businessInfo.name.toLowerCase())
                  )
                  .map((biz, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-50"
                      onClick={() => handleBusinessSelect(biz)}
                    >
                      {biz.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address Line 1
            </label>
            <input
              type="text"
              name="address1"
              value={businessInfo.address1}
              onChange={handleBusinessInfoChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Address Line 1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              type="text"
              name="address2"
              value={businessInfo.address2}
              onChange={handleBusinessInfoChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Address Line 2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={businessInfo.phone}
              onChange={handleBusinessInfoChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Phone Number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={businessInfo.email}
              onChange={handleBusinessInfoChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Email Address"
            />
          </div>
        </div>
      </div>

      {/* Customer Information Section */}
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-3">
          Customer Information
        </h3>
        <div className="bg-gray-50 border border-blue-100 rounded-lg shadow-sm p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="relative">
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName || ""}
              onChange={handleCustomerChange}
              onFocus={() => setShowCustomerDropdown(true)}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
            {showCustomerDropdown && formData.customerName && (
              <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                {customerList
                  .filter((customer) =>
                    customer.name
                      .toLowerCase()
                      .includes(formData.customerName.toLowerCase())
                  )
                  .map((customer, idx) => (
                    <li
                      key={idx}
                      className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleCustomerSelect(customer.name)}
                    >
                      {customer.name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium">Address</label>
            <input
              type="text"
              name="customerAddress"
              value={formData.customerAddress || ""}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="mb-6">
        <h3 className="text-lg md:text-xl font-semibold mb-3">Services</h3>
        {formData.items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 md:mb-3 mb-8 items-end  border-1 border-gray-200 p-3 rounded-lg shadow-sm"
          >
            <div className="md:col-span-3">
              <label className="block text-sm mb-2 font-medium">Date</label>
              <input
                type="date"
                name="date"
                value={item.date}
                onChange={(e) => handleItemChange(index, e)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="relative md:col-span-5">
              <label className="block text-sm mb-2 font-medium">Service</label>
              <input
                type="text"
                name="service"
                value={item.service || ""}
                onChange={(e) => handleInputChange(index, e)}
                className="w-full p-2 border rounded"
                required
              />
              {item.showDropdown && (
                <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                  {predefinedServices
                    .filter((service) =>
                      service.service
                        .toLowerCase()
                        .includes(item.service.toLowerCase())
                    )
                    .map((service, idx) => (
                      <li
                        key={idx}
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                        onClick={() => handleServiceSelect(index, service)}
                      >
                        {service.service} - ₹{service.rate}
                      </li>
                    ))}
                </ul>
              )}
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm mb-2 font-medium">Qty</label>
              <input
                type="number"
                name="quantity"
                value={item.quantity || 0}
                onChange={(e) => handleItemChange(index, e)}
                min="1"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm mb-2 font-medium">Rate (₹)</label>
              <input
                type="number"
                name="rate"
                value={item.rate || 0}
                onChange={(e) => handleItemChange(index, e)}
                min="0"
                step="0.01"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="md:col-span-1 text-right">
              <p className="font-medium mt-2 md:mt-0">
                ₹{(item.quantity && item.quantity * item.rate).toFixed(2)}
              </p>
            </div>
            <div className="md:col-span-1">
              {formData.items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 w-full"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 w-full sm:w-auto shadow transition"
        >
          + Add Service
        </button>
      </div>

      {/* Total Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg shadow flex justify-between items-center">
          <span className="font-bold text-lg">Total:</span>
          <span className="font-bold text-xl text-green-700">
            ₹{total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Bank Details Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showBankDetails}
              onChange={(e) => setShowBankDetails(e.target.checked)}
            />
            <span className="font-medium">Add Bank Details</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showQrUpload}
              onChange={(e) => setShowQrUpload(e.target.checked)}
              disabled={!showBankDetails}
            />
            <span className="font-medium">Add QR Code</span>
          </label>
        </div>
        {showBankDetails && (
          <div className="bg-gray-50 border border-blue-100 rounded-lg shadow-sm p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {/* Bank Details Fields */}
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Account Name"
                className="w-full p-2 border rounded"
                value={bankDetails.accountName}
                onChange={(e) => {
                  setBankDetails((prev) => ({
                    ...prev,
                    accountName: e.target.value,
                  }));
                  setShowBankDropdown(e.target.value.length > 0);
                }}
                onFocus={() =>
                  setShowBankDropdown(bankDetails.accountName.length > 0)
                }
                autoComplete="off"
              />
              {showBankDropdown && bankDetails.accountName && (
                <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                  {exampleBankDetails
                    .filter((bd) =>
                      bd.accountName
                        .toLowerCase()
                        .includes(bankDetails.accountName.toLowerCase())
                    )
                    .map((bd) => (
                      <li
                        key={bd.id}
                        className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setBankDetails(bd);
                          setShowBankDropdown(false);
                        }}
                      >
                        {bd.accountName}
                      </li>
                    ))}
                </ul>
              )}
              <input
                type="text"
                placeholder="Account Number"
                className="w-full p-2 border rounded"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  setBankDetails((prev) => ({
                    ...prev,
                    accountNumber: e.target.value,
                  }))
                }
              />
              <input
                type="text"
                placeholder="IFSC Code"
                className="w-full p-2 border rounded"
                value={bankDetails.ifsc}
                onChange={(e) =>
                  setBankDetails((prev) => ({ ...prev, ifsc: e.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Bank Name"
                className="w-full p-2 border rounded"
                value={bankDetails.bankName}
                onChange={(e) =>
                  setBankDetails((prev) => ({
                    ...prev,
                    bankName: e.target.value,
                  }))
                }
              />
            </div>
            {/* QR Code Section */}
            {showQrUpload && (
              <div className="flex flex-col items-center justify-center">
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  QR Code
                </label>
                <img
                  src={qrImage}
                  alt="QR Code"
                  className="mt-2 h-32 object-contain border rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* PDF Generation Button */}
      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <button
          type="button"
          onClick={generatePDF}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 w-full sm:w-auto shadow transition"
        >
          Download Invoice as PDF
        </button>
      </div>
    </form>
  );
};

export default InvoiceForm;
