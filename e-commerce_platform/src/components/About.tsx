const About = () => {
  return (
    <section id="ABOUT" className="py-16 sm:py-20 lg:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 sm:mb-8 text-foreground">ABOUT</h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 leading-relaxed">
            Welcome to BigMarket, where we offer an extensive selection of high-quality groceries at great prices. 
            While home delivery isn't available just yet, we're working on it and will have it up and running soon. 
            In the meantime, visit our store to enjoy fresh produce, pantry staples, and more. We appreciate your 
            patience and look forward to serving you with convenience in the near future. Stay tuned for updates!
          </p>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://www.bigbasket.com/media/uploads/banner_images/IBBN092113357-26110.jpg?tr=w-1920,q=80"
              alt="BigMarket Store"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
