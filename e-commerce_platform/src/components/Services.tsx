import { useState } from 'react';
import { Truck, CreditCard, Clock, Headphones } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const Services = () => {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (title: string) => {
    setSelectedService(title);
    setIsModalOpen(true);
  };

  const services = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick and reliable delivery service coming soon to your doorstep'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Multiple payment options with 100% secure transactions'
    },
    {
      icon: Clock,
      title: 'Open 24/7',
      description: 'Shop anytime, anywhere with our convenient store hours'
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      description: 'Dedicated support team ready to help you with any queries'
    }
  ];

  return (
    <section id="SERVICES" className="py-16 sm:py-20 lg:py-24 bg-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4 text-foreground">
          Our Services
        </h2>
        <p className="text-center text-lg sm:text-xl text-muted-foreground mb-12 sm:mb-16 max-w-3xl mx-auto">
          We're committed to providing the best shopping experience with quality products and excellent service
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                onClick={() => handleCardClick(service.title)}
                className="bg-card p-6 sm:p-8 rounded-lg text-center card-shadow hover:card-hover-shadow transition-all duration-300 hover:-translate-y-1 group cursor-pointer border border-border/50 hover:border-primary/30"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/10 text-primary mb-4 sm:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-8 w-8 sm:h-10 sm:w-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-3 text-card-foreground">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-2">
              <Clock className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold">{selectedService} Unavailable</DialogTitle>
            <DialogDescription className="text-sm pt-3 text-muted-foreground leading-relaxed">
              This service is currently unavailable. We’re working on it and will make it available on our website soon. Thank you for your patience!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Services;
