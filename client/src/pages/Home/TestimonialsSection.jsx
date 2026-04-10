import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import './TestimonialsSection.css';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Rahman',
    role: 'Marketing Director in Dubai',
    content: 'Upskill transformed my approach to GCC recruitment. The localized CV advice and Arabic basics course helped me land my dream role within 3 months of relocating.',
    initials: 'SR',
    colorClass: 'bg-purple'
  },
  {
    id: 2,
    name: 'Ahmed Tariq',
    role: 'Software Engineer in Riyadh',
    content: 'The digital skills bootcamp was exactly tailored to what employers in Saudi are looking for. The community support is also incredible for newcomers.',
    initials: 'AT',
    colorClass: 'bg-blue'
  },
  {
    id: 3,
    name: 'Elena Silva',
    role: 'Finance Manager in Doha',
    content: 'I was struggling to get past the ATS systems here before Upskill. Their LinkedIn optimization tools are a game changer for expats.',
    initials: 'ES',
    colorClass: 'bg-green'
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="testimonials-section">
      <div className="container">
        <h2 className="section-title text-center">Loved by ambitious expats</h2>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className="testimonial-card">
                <div className="testimonial-stars">
                  ★★★★★
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className={`author-avatar ${testimonial.colorClass}`}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
