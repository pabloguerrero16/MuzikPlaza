const Hero = () => {
  return (
    <div className="pb-16">
      <div className="lg:container md:px-20 px-10 mx-auto flex flex-col gap-2">
        <h1 className="lg:text-5xl md:text-5xl text-black font-bold text-3xl">
          Find your favorite Music
        </h1>
        <p className="text-1xl md:text-2xl lg:text-2xl text-black">
          Search for vinyls, CDs, or cassettes...
        </p>
      </div>
      <hr className="lg:mx-24 md:mx-24" />
    </div>
  );
};

export default Hero;
