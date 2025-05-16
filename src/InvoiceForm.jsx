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

        // Add total to formData
        const invoiceData = {
            ...formData,
            total
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

    return (
        <form className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-blue-800">Create New Invoice</h2>

            {/* Business Information Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="text-lg font-semibold mb-3">Business Information</h3>
                    <div className="space-y-3">
                        <p className="font-medium">Apsara Power Laundry</p>
                        <p>Shop No: 8, Kedar Appartment, Opp Chamak-Chuna</p>
                        <p>Thakkar Nagar - 382350</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Invoice Details</h3>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium">Invoice #</label>
                            <input
                                type="text"
                                name="invoiceNumber"
                                value={formData.invoiceNumber}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium">Date</label>
                                <input
                                    type="date"
                                    name="invoiceDate"
                                    value={formData.invoiceDate}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                        </div>
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
                            onChange={handleCustomerChange} // Handle customer name change
                            onFocus={() => setShowCustomerDropdown(true)} // Show dropdown on focus
                            className="w-full p-2 border rounded"
                            required
                        />
                        {/* Customer List Dropdown */}
                        {showCustomerDropdown && formData.customerName && (
                            <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-10">
                                {customerList
                                    .filter(customer => customer.name.toLowerCase().includes(formData.customerName.toLowerCase()))
                                    .map((customer, idx) => (
                                        <li
                                            key={idx}
                                            className="px-3 py-1 cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleCustomerSelect(customer.name)} // Close dropdown after selecting
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
                            value={formData.customerAddress || ''} // Set address dynamically
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Services</h3>
                {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-3 md:mb-3 mb-16 items-end">
                        <div className="col-span-12 sm:col-span-3">
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
                        <div className="col-span-12 sm:col-span-5 relative">
                            <label className="block text-sm mb-2 font-medium">Service</label>
                            <input
                                type="text"
                                name="service"
                                value={item.service || ''}
                                onChange={(e) => handleInputChange(index, e)}
                                className="w-full p-2 border rounded"
                                required
                            />

                            {/* Service Dropdown */}
                            {item.showDropdown && (
                                <ul className="absolute bg-white border border-gray-300 mt-1 w-full max-h-48 overflow-auto z-10">
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
                        <div className="col-span-4 sm:col-span-1">
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
                        <div className="col-span-4 sm:col-span-1">
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
                        <div className="col-span-4 md:col-span-1 text-right">
                            <p className="font-medium">₹{(item.quantity && item.quantity * item.rate).toFixed(2)}</p>
                        </div>
                        <div className="col-span-12 md:col-span-1">
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
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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

            {/* PDF Generation Button */}
            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={generatePDF}
                    className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
                >
                    Download Invoice as PDF
                </button>
            </div>
        </form>
    );
};

export default InvoiceForm;
