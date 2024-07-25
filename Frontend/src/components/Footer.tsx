const Footer = () => {
  return (
    <div className="py-10 lg:container md:mx-24">
      <hr className="lg:mx-24 md:mx-24" />
      <div className="lg:mx-auto md:auto mx-6 flex justify-between items-center">
        <span className="text-1xl md:text-3xl lg:text-3xl font-bold tracking-tight">
          MuzikPlaza
        </span>
        <span className="font-bold tracking-tight flex gap-4">
          <p className="cursor-pointer text-sm lg:text-base md:text-base">
            Privacy Policy
          </p>
          <p className="cursor-pointer text-sm lg:text-base md:text-base">
            Terms Of Service
          </p>
        </span>
      </div>
    </div>
  );
};

export default Footer;
