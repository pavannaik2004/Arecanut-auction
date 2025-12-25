import { Link } from 'react-router-dom';
import { Gavel, TrendingUp, ShieldCheck } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-heading font-bold text-primary">ArecaAuction</div>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2 text-primary font-medium hover:underline">Login</Link>
          <Link to="/register" className="px-5 py-2 bg-secondary text-white rounded-full font-medium hover:bg-amber-700 transition">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6">
          Fair Prices for Your <br /> <span className="text-secondary">Arecanut Harvest</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Connect directly with traders, participate in transparent auctions, and get the best value for your produce. No middlemen, just fair trade.
        </p>
        <Link to="/register" className="px-8 py-4 bg-primary text-white text-lg rounded-full font-bold shadow-lg hover:bg-green-900 transition transform hover:-translate-y-1">
          Start Trading Today
        </Link>
      </header>

      {/* Features */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-10">
          <div className="text-center p-6 border rounded-xl hover:shadow-xl transition">
            <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
              <Gavel className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Transparent Auctions</h3>
            <p className="text-gray-600">Real-time bidding ensures you get the true market price.</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-xl transition">
            <div className="inline-block p-4 bg-amber-100 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Direct Access</h3>
            <p className="text-gray-600">Farmers meet traders directly. Maximum profit, minimum hassle.</p>
          </div>
          <div className="text-center p-6 border rounded-xl hover:shadow-xl transition">
            <div className="inline-block p-4 bg-blue-100 rounded-full mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Secure Payments</h3>
            <p className="text-gray-600">Verified users and tracked transactions for peace of mind.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
