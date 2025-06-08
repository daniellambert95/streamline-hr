import Footer from '../../components/common/Footer';

const Reviews = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "HR Director, TechCorp",
      rating: 5,
      text: "StreamlineHR's AI matching is incredible. We went from reviewing 200+ resumes manually to having the top 5 candidates highlighted automatically. Reduced our hiring time from 6 weeks to 2 weeks.",
      metric: "67% reduction in hiring time"
    },
    {
      name: "David Chen", 
      title: "CEO, GrowthCo",
      rating: 5,
      text: "Finally, one platform for everything! No more juggling 5 different HR tools. The time tracking alone saves us 20 hours per month in administrative work.",
      metric: "20 hours saved monthly"
    },
    {
      name: "Lisa Rodriguez",
      title: "Operations Manager, StartupXYZ", 
      rating: 5,
      text: "The onboarding automation is a game-changer. New hires are productive from day one, and we've eliminated 90% of paperwork.",
      metric: "35% increase in satisfaction"
    }
  ];

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-lavender/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center pt-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-dark mb-6 leading-tight">
            Loved by <span className="text-primary">HR Teams</span> Everywhere
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            See what HR professionals are saying about how StreamlineHR has transformed their operations.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center bg-neutral-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
              <div className="flex items-center mr-6">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-left">
                <div className="text-2xl font-bold text-neutral-dark">4.9/5</div>
                <div className="text-sm text-gray-600">Based on 500+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-neutral-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-1">98%</div>
              <div className="text-gray-600 font-medium">Customer Satisfaction</div>
            </div>
            <div className="text-center bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-1">4.9/5</div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
            <div className="text-center bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-1">500+</div>
              <div className="text-gray-600 font-medium">Companies Served</div>
            </div>
            <div className="text-center bg-gradient-to-br from-gray-50 to-purple-50/30 p-6 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-1">96%</div>
              <div className="text-gray-600 font-medium">Would Recommend</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-purple-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-dark mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">Real stories from real customers</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-neutral-white p-8 rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                <div className="bg-gradient-to-r from-primary/10 to-purple-100/50 p-4 rounded-xl mb-6">
                  <div className="text-lg font-bold text-neutral-dark">{testimonial.metric}</div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-purple-800 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-dark">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-neutral-white to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-neutral-dark mb-6">
            Ready to Join Our <span className="text-primary">Success Stories?</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Start your free trial today and see why hundreds of companies trust StreamlineHR.
          </p>
          <button className="bg-gradient-to-r from-primary to-purple-800 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg transform hover:scale-105 hover:-translate-y-1">
            Start Free Trial
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Reviews; 