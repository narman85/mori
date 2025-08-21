import React from 'react';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  return (
    <section className={`w-full ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:px-8 xl:px-[150px]">
        {/* Left side - Content */}
        <div className="flex flex-col items-center lg:items-start lg:flex-1">
          <h1 className="text-black text-6xl font-normal leading-[80px] text-center lg:text-left mt-[60px] max-md:text-[40px] max-md:leading-[59px] max-md:mt-6">
            Sip the silence
            <br />
            Japan in a cup
          </h1>
          
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f4646c48a87e2fa35b1793686a774f13e6cc12f2?placeholderIfAbsent=true"
            alt="Japanese tea ceremony scene"
            className="aspect-[1.8] object-contain w-full max-w-[800px] md:max-w-[400px] lg:max-w-[600px] mt-[30px] max-md:mt-6"
          />
        </div>
        
        {/* Right side - Space for contact info */}
        <div className="hidden lg:block lg:w-80 lg:flex-shrink-0">
          {/* Contact məlumatları və ya digər məzmun burada olacaq */}
        </div>
      </div>
    </section>
  );
};
