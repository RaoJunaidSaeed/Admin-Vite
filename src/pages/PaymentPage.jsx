import React, { useState, useEffect } from 'react';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { toast } from 'react-toastify';

const stripePromise = loadStripe(
  'pk_test_51QooBpIM1ODNnTet8Oy080z4orKQvOCWxbcws4bWmjN0JWxoNFDk49jDgwsOUhbqX6sgsWEg2ZZ0xDd19d1rbk6k00FLeF1l04'
);

function CheckoutForm({ plan }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [cardholderName, setCardholderName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // ✅ Step 1: Create Payment Intent (Axios instead of fetch)
      const { data } = await API.post(
        '/v1/payments/create-payment-intent',
        { planId: plan._id, currency: 'PKR' },
        { withCredentials: true }
      );

      const clientSecret = data?.clientSecret;
      if (!clientSecret) return toast.error('Failed to create payment intent');

      // ✅ Step 2: Confirm payment on Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: cardholderName || 'No Name' },
        },
      });

      if (result.error) {
        toast.error(`Payment failed: ${result.error.message}`);
      } else if (result.paymentIntent.status === 'succeeded') {
        const transactionId = result.paymentIntent.id;
        const amount = result.paymentIntent.amount / 100;

        // ✅ Step 3: Record payment (Axios instead of fetch)
        const res = await API.post(
          `/v1/payments/record-payment/${plan._id}`,
          {
            transactionId,
            amount,
            currency: 'PKR',
            paymentType: 'listing_fee',
          },
          { withCredentials: true }
        );

        if (res.status === 200) {
          toast.success('✅ Payment successful!');
          navigate('/owner-dashboard');
        } else {
          toast.warning('Payment succeeded but saving failed.');
        }
      }
    } catch (err) {
      toast.error('Unexpected error: ' + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const elementStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1A202C',
        '::placeholder': { color: '#A0AEC0' },
      },
      invalid: { color: '#E53E3E' },
    },
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-8 sm:p-10 space-y-6 shadow-2xl"
    >
      <h2 className="text-3xl font-extrabold text-white text-center">
        Subscribe to {plan.name} Plan
      </h2>
      <p className="text-center text-green-200 text-lg">
        Pay <strong>Rs {plan.price}</strong> for <strong>{plan.durationDays} days</strong> access
      </p>

      {/* Cardholder Name */}
      <div>
        <label className="text-sm text-green-200 block mb-1">Cardholder Name</label>
        <input
          type="text"
          required
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="e.g. Ali Khan"
          className="w-full bg-white/10 text-white px-4 py-3 rounded-md border border-white/20 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
      </div>

      {/* Card Number */}
      <div>
        <label className="text-sm text-green-200 block mb-1">Card Number</label>
        <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
          <CardNumberElement options={elementStyle} />
        </div>
      </div>

      {/* Expiry / CVC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-green-200 block mb-1">Expiry</label>
          <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
            <CardExpiryElement options={elementStyle} />
          </div>
        </div>
        <div>
          <label className="text-sm text-green-200 block mb-1">CVC</label>
          <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
            <CardCvcElement options={elementStyle} />
          </div>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
      >
        {isProcessing ? 'Processing...' : `Pay Rs ${plan.price}`}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { planId } = useParams();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await API.get('/v1/plans', { withCredentials: true });
        const allPlans = res.data.data.plans;
        const selected = allPlans.find((p) => p._id === planId);
        if (selected) setPlan(selected);
        else toast.error('Invalid plan selected');
      } catch (err) {
        toast.error('Failed to load plan');
      }
    };
    fetchPlan();
  }, [planId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-6 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Intro */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-white">Complete Your Subscription Payment</h1>
          <p className="text-green-300 text-lg max-w-2xl mx-auto">
            RentoFix empowers property owners with smart tools for managing rental listings
            securely. Payments are processed via Stripe.
          </p>
        </div>

        {/* Form */}
        {plan ? (
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} />
          </Elements>
        ) : (
          <p className="text-center text-green-200 text-lg">Loading plan details...</p>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import {
//   Elements,
//   useStripe,
//   useElements,
//   CardNumberElement,
//   CardExpiryElement,
//   CardCvcElement,
// } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import { useParams, useNavigate } from 'react-router-dom';
// import API from '../api/axios';
// import { toast } from 'react-toastify';

// const stripePromise = loadStripe(
//   'pk_test_51QooBpIM1ODNnTet8Oy080z4orKQvOCWxbcws4bWmjN0JWxoNFDk49jDgwsOUhbqX6sgsWEg2ZZ0xDd19d1rbk6k00FLeF1l04'
// );

// function CheckoutForm({ plan }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const [cardholderName, setCardholderName] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsProcessing(true);

//     try {
//       const paymentIntentRes = await fetch(
//         'http://localhost:5000/api/v1/payments/create-payment-intent',
//         {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ planId: plan._id, currency: 'PKR' }),
//         }
//       );

//       const { clientSecret } = await paymentIntentRes.json();
//       if (!clientSecret) return toast.error('Failed to create payment intent');

//       const result = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardNumberElement),
//           billing_details: { name: cardholderName || 'No Name' },
//         },
//       });

//       if (result.error) {
//         toast.error(`Payment failed: ${result.error.message}`);
//       } else if (result.paymentIntent.status === 'succeeded') {
//         const transactionId = result.paymentIntent.id;
//         const amount = result.paymentIntent.amount / 100;

//         const res = await fetch(
//           `http://localhost:5000/api/v1/payments/record-payment/${plan._id}`,
//           {
//             method: 'POST',
//             credentials: 'include',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({
//               transactionId,
//               amount,
//               currency: 'PKR',
//               paymentType: 'listing_fee',
//             }),
//           }
//         );

//         if (res.ok) {
//           toast.success('✅ Payment successful!');
//           navigate('/owner-dashboard');
//         } else {
//           toast.warning('Payment succeeded but saving failed.');
//         }
//       }
//     } catch (err) {
//       toast.error('Unexpected error: ' + err.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const elementStyle = {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#1A202C',
//         '::placeholder': { color: '#A0AEC0' },
//       },
//       invalid: { color: '#E53E3E' },
//     },
//   };

//   return (
//     <form
//       onSubmit={handleSubmit}
//       className="w-full max-w-xl mx-auto bg-white/10 backdrop-blur-lg ring-1 ring-white/10 rounded-2xl p-8 sm:p-10 space-y-6 shadow-2xl"
//     >
//       <h2 className="text-3xl font-extrabold text-white text-center">
//         Subscribe to {plan.name} Plan
//       </h2>
//       <p className="text-center text-green-200 text-lg">
//         Pay <strong>Rs {plan.price}</strong> for <strong>{plan.durationDays} days</strong> access
//       </p>

//       {/* Cardholder Name */}
//       <div>
//         <label className="text-sm text-green-200 block mb-1">Cardholder Name</label>
//         <input
//           type="text"
//           required
//           value={cardholderName}
//           onChange={(e) => setCardholderName(e.target.value)}
//           placeholder="e.g. Ali Khan"
//           className="w-full bg-white/10 text-white px-4 py-3 rounded-md border border-white/20 placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
//         />
//       </div>

//       {/* Card Number */}
//       <div>
//         <label className="text-sm text-green-200 block mb-1">Card Number</label>
//         <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
//           <CardNumberElement options={elementStyle} />
//         </div>
//       </div>

//       {/* Expiry / CVC */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div>
//           <label className="text-sm text-green-200 block mb-1">Expiry</label>
//           <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
//             <CardExpiryElement options={elementStyle} />
//           </div>
//         </div>
//         <div>
//           <label className="text-sm text-green-200 block mb-1">CVC</label>
//           <div className="px-4 py-3 bg-white/10 border border-white/20 rounded-md text-white">
//             <CardCvcElement options={elementStyle} />
//           </div>
//         </div>
//       </div>

//       {/* Submit */}
//       <button
//         type="submit"
//         disabled={!stripe || isProcessing}
//         className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50"
//       >
//         {isProcessing ? 'Processing...' : `Pay Rs ${plan.price}`}
//       </button>
//     </form>
//   );
// }

// export default function PaymentPage() {
//   const { planId } = useParams();
//   const [plan, setPlan] = useState(null);

//   useEffect(() => {
//     const fetchPlan = async () => {
//       try {
//         const res = await API.get('/v1/plans', { withCredentials: true });
//         const allPlans = res.data.data.plans;
//         const selected = allPlans.find((p) => p._id === planId);
//         if (selected) setPlan(selected);
//         else toast.error('Invalid plan selected');
//       } catch (err) {
//         toast.error('Failed to load plan');
//       }
//     };
//     fetchPlan();
//   }, [planId]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 to-green-900 py-12 px-6 sm:px-8 lg:px-16">
//       <div className="max-w-4xl mx-auto space-y-10">
//         {/* Intro */}
//         <div className="text-center space-y-4">
//           <h1 className="text-4xl font-extrabold text-white">Complete Your Subscription Payment</h1>
//           <p className="text-green-300 text-lg max-w-2xl mx-auto">
//             RentoFix empowers property owners with smart tools for managing rental listings
//             securely. Payments are processed via Stripe.
//           </p>
//         </div>

//         {/* Form */}
//         {plan ? (
//           <Elements stripe={stripePromise}>
//             <CheckoutForm plan={plan} />
//           </Elements>
//         ) : (
//           <p className="text-center text-green-200 text-lg">Loading plan details...</p>
//         )}
//       </div>
//     </div>
//   );
// }
