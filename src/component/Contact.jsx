import React, { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiMessageSquare } from 'react-icons/fi';

const Contact = () => {
  // 1. Form state management
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  // 2. Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Submit form to backend SMS API route
  const handleSendSMS = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus({ type: '', text: '' });

    try {
      // Replace with your backend SMS route (e.g., Twilio or Nexmo integration)
      // const response = await axios.post('/api/contact/send-sms', formData);
      
      // Simulating API network latency
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus({
        type: 'success',
        text: 'Your message has been sent via SMS successfully!'
      });
      setFormData({ name: '', phone: '', message: '' }); // Clear form
    } catch (error) {
      setStatus({
        type: 'error',
        text: 'Failed to send SMS. Please try again later.'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white pt-28 pb-20 px-6 max-w-7xl mx-auto pt-45">
      
      {/* Page Heading */}
      <div className="text-center mb-16">
        <span className="text-xs font-bold tracking-[0.3em] text-amber-500 uppercase block mb-3">Get In Touch</span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-zinc-100">CONTACT OUR CAFE</h1>
        <p className="text-zinc-500 text-sm max-w-md mx-auto mt-4 font-light">
          Have a question or want to book a private table? Drop us a direct SMS instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
        
        {/* Left Side: Premium Cafe Information Panel (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-8 space-y-8">
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-amber-500 shadow-inner">
                <FiMapPin size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Our Location</h3>
                <p className="text-zinc-200 text-base mt-1 font-medium">123 Luxury Blend Avenue, Banani, Dhaka</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-amber-500 shadow-inner">
                <FiPhone size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Direct Hotline</h3>
                <p className="text-zinc-200 text-base mt-1 font-mono font-bold">+880 1712 345678</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-amber-500 shadow-inner">
                <FiMail size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Official Email</h3>
                <p className="text-zinc-200 text-base mt-1 font-medium">lounge@ivoricafe.com</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl text-amber-500 shadow-inner">
                <FiClock size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold tracking-wider text-zinc-400 uppercase">Working Hours</h3>
                <p className="text-zinc-200 text-sm mt-1 leading-relaxed">
                  Mon - Fri: <span className="text-amber-500 font-mono">08:00 AM - 11:00 PM</span> <br />
                  Sat - Sun: <span className="text-amber-500 font-mono">10:00 AM - Midnight</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Interactive SMS Form Panel (3 Columns) */}
        <div className="lg:col-span-3 bg-zinc-900/10 border border-zinc-900 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
            <FiMessageSquare className="text-amber-500" /> Send Instant SMS
          </h2>

          {/* Alert Messaging Board */}
          {status.text && (
            <div className={`p-4 rounded-xl text-xs font-bold tracking-wide uppercase mb-6 text-center border ${
              status.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {status.text}
            </div>
          )}

          <form onSubmit={handleSendSMS} className="space-y-5">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Your Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-xl px-4 py-3.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Phone Number (For SMS Target)</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880 1XXXX XXXXXX"
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-xl px-4 py-3.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block mb-2">Message</label>
              <textarea
                name="message"
                required
                rows="5"
                value={formData.message}
                onChange={handleChange}
                placeholder="Type your query or request here..."
                className="w-full bg-zinc-950 border border-zinc-900 focus:border-amber-500/50 rounded-xl px-4 py-3.5 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-amber-600 text-zinc-950 font-bold py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-amber-700 active:scale-98 transition flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-amber-600/5 disabled:opacity-50"
            >
              {isSending ? 'Sending SMS...' : 'Transmit Message'}
              {!isSending && <FiSend size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition duration-200" />}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Contact;