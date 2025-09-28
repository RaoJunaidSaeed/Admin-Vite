import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useLoading } from '../context/LoadingContext';

// Utility function to capitalize each word
const capitalizeWords = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str
    .split(' ')
    .map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const AdminPaymentPage = () => {
  const { setIsLoading } = useLoading();
  const [payments, setPayments] = useState([]);

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/v1/payments');
      setPayments(res.data.data.data);
    } catch (err) {
      toast.error('Failed to fetch payments');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <>
      <main className="min-h-screen bg-gradient-to-br from-gray-900 to-green-950 py-12 px-4">
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
          <h1 className="text-2xl font-bold text-green-200 mb-8 border-b border-white/10 pb-3">
            Admin Payment Management
          </h1>

          {payments.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {payments.map((payment) => (
                <div
                  key={payment._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-900 border border-green-700 rounded-xl p-5 shadow-md"
                >
                  <h2 className="text-lg font-bold text-green-300 mb-2">
                    💳 Payment: {payment.amount} {payment.currency}
                  </h2>

                  <div className="text-sm text-green-100 space-y-1">
                    <p>
                      <span className="font-semibold text-green-400">Owner:</span>{' '}
                      {capitalizeWords(payment?.ownerId?.firstName)}{' '}
                      {capitalizeWords(payment?.ownerId?.lastName)} ({payment?.ownerId?.email})
                    </p>

                    <p>
                      <span className="font-semibold text-green-400">Plan:</span>{' '}
                      {capitalizeWords(payment?.planId?.name)} - {payment?.planId?.price} Rs
                    </p>

                    <p>
                      <span className="font-semibold text-green-400">Type:</span>{' '}
                      {capitalizeWords(payment.paymentType)}
                    </p>

                    <p>
                      <span className="font-semibold text-green-400">Status:</span>{' '}
                      <span
                        className={
                          payment.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                        }
                      >
                        {capitalizeWords(payment.status)}
                      </span>
                    </p>

                    <p>
                      <span className="font-semibold text-green-400">Date:</span>{' '}
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </p>

                    <p>
                      <span className="font-semibold text-green-400">Properties:</span>{' '}
                      {payment.propertyIds?.map((prop) => capitalizeWords(prop.title)).join(', ') ||
                        '—'}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          ) : (
            <div className="text-center text-green-300 mt-10 text-lg">No payments found.</div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminPaymentPage;
