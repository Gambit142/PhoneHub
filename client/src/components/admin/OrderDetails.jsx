import React from 'react';
import { X } from 'lucide-react';

const OrderDetails = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Order Details #{order._id}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
            <p className="text-sm text-gray-600">Name: {order.user.name}</p>
            <p className="text-sm text-gray-600">Email: {order.user.email}</p>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shippingAddress.address}</p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
            </p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between border-b border-gray-200 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.phone.name}</p>
                    <p className="text-sm text-gray-600">
                      Color: {item.selectedColor || 'N/A'}, Storage: {item.selectedStorage || 'N/A'}, RAM: {item.selectedRam || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">${item.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Items Price:</p>
                <p className="text-sm font-medium text-gray-900">${order.itemsPrice}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Tax Price:</p>
                <p className="text-sm font-medium text-gray-900">${order.taxPrice}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Shipping Price:</p>
                <p className="text-sm font-medium text-gray-900">${order.shippingPrice}</p>
              </div>
              <div className="flex justify-between font-semibold">
                <p className="text-sm text-gray-900">Total Price:</p>
                <p className="text-sm text-gray-900">${order.totalPrice}</p>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payment & Status</h3>
            <p className="text-sm text-gray-600">Payment Method: {order.paymentMethod}</p>
            <p className="text-sm text-gray-600">Payment Status: {order.isPaid ? 'Paid' : 'Not Paid'}</p>
            {order.paidAt && <p className="text-sm text-gray-600">Paid At: {new Date(order.paidAt).toLocaleString()}</p>}
            <p className="text-sm text-gray-600">Order Status: {order.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
