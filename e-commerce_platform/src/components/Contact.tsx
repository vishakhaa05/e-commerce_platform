import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { api } from '@/lib/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Frontend validation
    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        toast.success('Thank you for contacting us! Your message has been sent successfully.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="CONTACT" className="py-16 sm:py-20 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-foreground">
            Contact Us
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-8 sm:mb-12">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 sm:p-8 rounded-lg card-shadow">
            <div>
              <Label htmlFor="name" className="text-base">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-2 h-12"
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-2 h-12"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <Label htmlFor="subject" className="text-base">Subject</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                className="mt-2 h-12"
                placeholder="Message subject"
              />
            </div>

            <div>
              <Label htmlFor="message" className="text-base">Message</Label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Your message..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-semibold"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent mx-auto"></div>
              ) : (
                'Submit'
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
