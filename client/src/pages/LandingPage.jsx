import { Link } from 'react-router-dom';
import { Gavel, TrendingUp, ShieldCheck, Users, Award, Zap } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-800 font-sans">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="text-2xl font-heading font-bold text-primary flex items-center">
          <Gavel className="w-8 h-8 mr-2 text-secondary" />
          ArecaAuction
        </div>
        <div className="space-x-4">
          <Link to="/login" className="px-5 py-2 text-primary font-medium hover:bg-green-50 rounded-lg transition">Login</Link>
          <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-primary to-green-700 text-white rounded-full font-medium hover:shadow-lg transition transform hover:-translate-y-0.5">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="container mx-auto px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(34,197,94,0.1),transparent_50%)]"></div>
        <div className="relative z-10">
          <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-primary rounded-full text-sm font-semibold">
            🌱 Empowering Farmers Since 2024
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary mb-6 leading-tight">
            Fair Prices for Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-amber-700">Arecanut Harvest</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Connect directly with traders, participate in transparent real-time auctions, and get the best value for your produce. No middlemen, just fair trade.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/register" className="px-8 py-4 bg-gradient-to-r from-primary to-green-700 text-white text-lg rounded-full font-bold shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
              Start Trading Today →
            </Link>
            <Link to="/login" className="px-8 py-4 bg-white border-2 border-primary text-primary text-lg rounded-full font-bold shadow-lg hover:bg-green-50 transition">
              View Live Auctions
            </Link>
          </div>
          <div className="mt-12 flex justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-primary mr-2" />
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center">
              <ShieldCheck className="w-5 h-5 text-primary mr-2" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center">
              <Zap className="w-5 h-5 text-primary mr-2" />
              <span>Live Bidding</span>
            </div>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="bg-white py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">Why Choose ArecaAuction?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experience the future of arecanut trading with our innovative platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="group text-center p-8 border-2 border-gray-100 rounded-2xl hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-block p-5 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Gavel className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Transparent Auctions</h3>
              <p className="text-gray-600 leading-relaxed">Real-time bidding with admin quality assurance ensures you get the true market price for your produce.</p>
            </div>
            <div className="group text-center p-8 border-2 border-gray-100 rounded-2xl hover:border-secondary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-block p-5 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Direct Access</h3>
              <p className="text-gray-600 leading-relaxed">Farmers meet traders directly. Maximum profit, minimum hassle. Cut out the middlemen.</p>
            </div>
            <div className="group text-center p-8 border-2 border-gray-100 rounded-2xl hover:border-blue-600 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="inline-block p-5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Secure Payments</h3>
              <p className="text-gray-600 leading-relaxed">Verified users and tracked transactions with multiple payment options for peace of mind.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-heading font-bold text-primary mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to start trading</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Register', desc: 'Create your account as farmer or trader', icon: Users },
              { step: '2', title: 'Get Approved', desc: 'Admin verifies your account', icon: ShieldCheck },
              { step: '3', title: 'List/Browse', desc: 'Farmers list auctions, traders browse', icon: Gavel },
              { step: '4', title: 'Trade', desc: 'Bid, win, and complete payments', icon: TrendingUp }
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="inline-block w-16 h-16 bg-gradient-to-br from-primary to-green-700 text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4 shadow-lg">
                  {item.step}
                </div>
                <item.icon className="w-12 h-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-green-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-10 opacity-90 max-w-2xl mx-auto">Join thousands of farmers and traders who trust ArecaAuction for fair and transparent trading</p>
          <Link to="/register" className="inline-block px-10 py-4 bg-white text-primary text-lg rounded-full font-bold shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-1 hover:scale-105">
            Create Your Account Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="text-2xl font-heading font-bold text-white mb-4 flex items-center justify-center">
            <Gavel className="w-6 h-6 mr-2 text-secondary" />
            ArecaAuction
          </div>
          <p className="mb-4">© 2024 ArecaAuction. All rights reserved.</p>
          <p className="text-sm">Empowering farmers through transparent digital auctions</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
