import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';  // Assuming you have this component

const InvoiceForm = () => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getFullYear().toString().slice(2)}`;

    const [formData, setFormData] = useState({
        invoiceNumber: `INV-${formattedDate}`,
        invoiceDate: today.toISOString().split('T')[0],
        customerName: '',  // Default to empty string
        customerAddress: '',
        items: [{ date: new Date().toISOString().split('T')[0], service: '', quantity: 0, rate: 0, showDropdown: false }]
    });

    const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
    const [showBusinessDropdown, setShowBusinessDropdown] = useState(false);
    const [showBankDetails, setShowBankDetails] = useState(false);
    const [showBankDropdown, setShowBankDropdown] = useState(false);
    const [businessInfo, setBusinessInfo] = useState({
        name: "Apsara Power Laundry",
        address1: "Shop No: 8, Kedar Appartment, Opp Chamak-Chuna",
        address2: "Thakkar Nagar - 382350",
        phone: "",
        email: ""
    });
    const [bankDetails, setBankDetails] = useState({
        accountName: "",
        accountNumber: "",
        ifsc: "",
        bankName: ""
    });

    const predefinedServices = [
        { service: 'White Apron', rate: 22 },
        { service: 'Blue Face Mask', rate: 5 },
        { service: 'Blue Socks', rate: 5 },
        { service: 'Blue Apron', rate: 40 },
    ];

    const customerList = [
        { name: 'Halewood Laboratories Private Limited', address: '319 G I D C Industrial Estate, Phase 2, Vatva, Ahmedabad, Gujarat 382440' },
        { name: 'Hagji Bhai', address: 'Some other address here' },
    ];

    const exampleBusinesses = [
        {
            name: "Apsara Power Laundry",
            address1: "Shop No: 8, Kedar Appartment, Opp Chamak-Chuna",
            address2: "Thakkar Nagar - 382350",
            phone: "9558768784",
            email: "apsarapowerlaundry@gmail.com"
        },
        {
            name: "Bharat Laundry Services",
            address1: "34, New Cloth Market",
            address2: "Navrangpura, Ahmedabad - 380009",
            phone: "9876543210",
            email: "bharatlaundry@gmail.com"
        },
        {
            name: "Shree Dry Clean",
            address1: "45 Market Road",
            address2: "Maninagar, Ahmedabad - 380008",
            phone: "9123456780",
            email: "shreedryclean@gmail.com"
        },
        {
            name: "Crystal Laundry Services",
            address1: "101, City Center",
            address2: "Satellite, Ahmedabad - 380015",
            phone: "9988776655",
            email: "crystallaundry@gmail.com"
        },
        {
            name: "Urban Wash Hub",
            address1: "22, Riverfront Plaza",
            address2: "Sabarmati, Ahmedabad - 380005",
            phone: "9090909090",
            email: "urbanwashhub@gmail.com"
        }
    ];

    const exampleBankDetails = [
        {
            accountName: "Apsara Power Laundry",
            accountNumber: "1234567890",
            ifsc: "SBIN0001234",
            bankName: "State Bank of India"
        },
        {
            accountName: "Bharat Laundry Services",
            accountNumber: "2345678901",
            ifsc: "HDFC0005678",
            bankName: "HDFC Bank"
        },
        {
            accountName: "Shree Dry Clean",
            accountNumber: "3456789012",
            ifsc: "ICIC0004321",
            bankName: "ICICI Bank"
        },
        {
            accountName: "Crystal Laundry Services",
            accountNumber: "4567890123",
            ifsc: "AXIS0008765",
            bankName: "Axis Bank"
        },
        {
            accountName: "Urban Wash Hub",
            accountNumber: "5678901234",
            ifsc: "BOB0002468",
            bankName: "Bank of Baroda"
        }
    ];

    const calculateTotal = (items) => {
        return items.reduce((sum, item) => sum + (item.quantity ? item.quantity * item.rate : 0), 0);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemChange = (index, e) => {
        const { name, value } = e.target;
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [name]: name === 'quantity' || name === 'rate' ? (value ? parseFloat(value) : 0) : value
        };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                date: new Date().toISOString().split('T')[0],
                service: '', // Empty initially
                quantity: 0,  // Default to 0
                rate: 0,  // Default to 0
                showDropdown: false  // Hidden dropdown initially
            }]
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const generatePDF = async () => {
        const total = calculateTotal(formData.items);

        // Add total, businessInfo, and bankDetails to formData
        const invoiceData = {
            ...formData,
            total,
            businessInfo,
            bankDetails: showBankDetails ? bankDetails : null
        };

        // Generate PDF and download immediately
        const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
        const pdfUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
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
            showDropdown: value.length > 0 // Show dropdown if there is some text
        };
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleServiceSelect = (index, selectedService) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            service: selectedService.service,
            rate: selectedService.rate,
            showDropdown: false // Hide the dropdown after selecting a service
        };
        setFormData(prev => ({ ...prev, items: newItems }));
    };
    const handleCustomerSelect = (customerName) => {
        const selectedCustomer = customerList.find(customer => customer.name === customerName);

        setFormData(prev => ({
            ...prev,
            customerName: selectedCustomer.name, // Set the selected customer name
            customerAddress: selectedCustomer.address, // Set the associated address
        }));

        // Hide the dropdown after selecting a customer
        setShowCustomerDropdown(false);
    };

    const handleCustomerChange = (e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            customerName: value
        }));
    };

    const handleBusinessInfoChange = (e) => {
        const { name, value } = e.target;
        setBusinessInfo(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === "name") {
            setShowBusinessDropdown(value.length > 0);
        }
    };

    const handleBusinessSelect = (business) => {
        setBusinessInfo(business);
        setShowBusinessDropdown(false);
    };

    return (
        <form className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Create New Invoice</h2>

            {/* Invoice Number & Today Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Number</label>
                    <input
                        type="text"
                        name="invoiceNumber"
                        value={formData.invoiceNumber}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-700"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Today’s Date</label>
                    <input
                        type="text"
                        value={new Date().toLocaleDateString('en-CA')}
                        readOnly
                        className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-700"
                    />
                </div>
            </div>

            {/* Business Information Section */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-blue-900 mb-4 border-b pb-2">Business Information</h3>
                <div className="bg-white border border-blue-100 rounded-lg shadow-sm p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="relative md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Business Name</label>
                        <input
                            type="text"
                            name="name"
                            value={businessInfo.name}
                            onChange={handleBusinessInfoChange}
                            onFocus={() => setShowBusinessDropdown(businessInfo.name.length > 0)}
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 font-medium"
                            placeholder="Business Name"
                            required
                            autoComplete="off"
                        />
                        {showBusinessDropdown && businessInfo.name && (
                            <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                                {exampleBusinesses
                                    .filter(biz => biz.name.toLowerCase().includes(businessInfo.name.toLowerCase()))
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 1</label>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address Line 2</label>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
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
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className='relative'>
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="customerName"
                            value={formData.customerName || ''}
                            onChange={handleCustomerChange}
                            onFocus={() => setShowCustomerDropdown(true)}
                            className="w-full p-3 border border-gray-300 rounded"
                            required
                        />
                        {showCustomerDropdown && formData.customerName && (
                            <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                                {customerList
                                    .filter(customer => customer.name.toLowerCase().includes(formData.customerName.toLowerCase()))
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
                            value={formData.customerAddress || ''}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Services</h3>
                {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 md:mb-3 mb-8 items-end">
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
                                value={item.service || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                className="w-full p-2 border rounded"
                                required
                            />
                            {item.showDropdown && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                                    {predefinedServices.filter(service => service.service.toLowerCase().includes(item.service.toLowerCase())).map((service, idx) => (
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
                            <p className="font-medium mt-2 md:mt-0">₹{(item.quantity && item.quantity * item.rate).toFixed(2)}</p>
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
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto"
                >
                    + Add Service
                </button>
            </div>

            {/* Total Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded">
                    <div className="flex justify-between font-bold text-lg mt-2">
                        <span>Total:</span>
                        <span>₹{total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Bank Details Section */}
            <div className="mb-6">
                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={showBankDetails}
                        onChange={e => setShowBankDetails(e.target.checked)}
                    />
                    <span>Add Bank Details</span>
                </label>
                {showBankDetails && (
                    <div className="space-y-2">
                        <input
                            type="text"
                            placeholder="Account Name"
                            className="w-full p-2 border rounded"
                            value={bankDetails.accountName}
                            onChange={e => {
                                setBankDetails(prev => ({ ...prev, accountName: e.target.value }));
                                setShowBankDropdown(e.target.value.length > 0);
                            }}
                            onFocus={() => setShowBankDropdown(bankDetails.accountName.length > 0)}
                            autoComplete="off"
                        />
                        {showBankDropdown && bankDetails.accountName && (
                            <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-20 rounded shadow">
                                {exampleBankDetails
                                    .filter(bd => bd.accountName.toLowerCase().includes(bankDetails.accountName.toLowerCase()))
                                    .map((bd, idx) => (
                                        <li
                                            key={idx}
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
                            onChange={e => setBankDetails(prev => ({ ...prev, accountNumber: e.target.value }))}
                        />
                        <input
                            type="text"
                            placeholder="IFSC Code"
                            className="w-full p-2 border rounded"
                            value={bankDetails.ifsc}
                            onChange={e => setBankDetails(prev => ({ ...prev, ifsc: e.target.value }))}
                        />
                        <input
                            type="text"
                            placeholder="Bank Name"
                            className="w-full p-2 border rounded"
                            value={bankDetails.bankName}
                            onChange={e => setBankDetails(prev => ({ ...prev, bankName: e.target.value }))}
                        />
                    </div>
                )}
            </div>

            {/* PDF Generation Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                    type="button"
                    onClick={generatePDF}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 w-full sm:w-auto"
                >
                    Download Invoice as PDF
                </button>
            </div>
        </form>
    );
};

export default InvoiceForm;
