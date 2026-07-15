const Hero = () => {
  return (
    <section
      id="HOME"
      className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20"
      style={{
        backgroundImage: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvE4CjvHRkGg5s3uQ8rS-ehUvow5ag86xBGA&s)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-4 animate-fade-in">
            <span className="text-white drop-shadow-lg">BigMarket</span>
            <br />
            <span className="text-primary drop-shadow-lg text-3xl sm:text-4xl md:text-5xl italic">GROCERIES</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl text-white drop-shadow-lg font-medium animate-fade-in">
            your happiness, our honours...
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
