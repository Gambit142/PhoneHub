import React, { useState } from 'react';
import { CreditCard, Plus, Trash2 } from 'lucide-react';

const UserPayments = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2026',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      last4: '8888',
      expiryMonth: '03',
      expiryYear: '2025',
      isDefault: false
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nameOnCard: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCard(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    
    // Mock adding the card
    const mockNewCard = {
      id: Date.now(),
      type: 'visa', // This would be determined by the card number
      last4: newCard.cardNumber.slice(-4),
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      isDefault: paymentMethods.length === 0
    };
    
    setPaymentMethods(prev => [...prev, mockNewCard]);
    setNewCard({
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      nameOnCard: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteCard = (cardId) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
    }
  };

  const setDefaultCard = (cardId) => {
    setPaymentMethods(prev =>
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
  };

  const getCardIcon = (type) => {
    // You could replace this with actual card brand icons
    return <CreditCard className="h-6 w-6" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Payment Methods</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage your saved payment methods
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 
            rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Add Payment Method Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Add New Payment Method</h4>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card
              </label>
              <input
                type="text"
                name="nameOnCard"
                value={newCard.nameOnCard}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={newCard.cardNumber}
                onChange={handleInputChange}
                required
                maxLength="19"
                className="w-full px-3 py-2 border border-gray-300 rounded-md 
                focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Month
                </label>
                <select
                  name="expiryMonth"
                  value={newCard.expiryMonth}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                      {String(i + 1).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <select
                  name="expiryYear"
                  value={newCard.expiryYear}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">YYYY</option>
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={new Date().getFullYear() + i}>
                      {new Date().getFullYear() + i}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={newCard.cvv}
                  onChange={handleInputChange}
                  required
                  maxLength="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md
                 hover:bg-blue-700 transition-colors"
              >
                Add Payment Method
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md 
                hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payment Methods List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Saved Payment Methods</h4>
          
          {paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No payment methods saved</p>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((card) => (
                <div
                  key={card.id}
                  className={`border rounded-lg p-4 ${
                    card.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getCardIcon(card.type)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            •••• •••• •••• {card.last4}
                          </span>
                          {card.isDefault && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Expires {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {!card.isDefault && (
                        <button
                          onClick={() => setDefaultCard(card.id)}
                          className="text-blue-600 hover:text-blue-800 
                          text-sm transition-colors"
                        >
                          Make Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-red-600 hover:text-red-800 p-1 
                        rounded hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPayments;