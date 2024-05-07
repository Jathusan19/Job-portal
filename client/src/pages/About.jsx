import React from "react";
import { JobImg } from "../assets";

const About = () => {
  return (
    <div className='container mx-auto flex flex-col gap-8 2xl:gap-14 py-6 '>
      <div className='w-full flex flex-col-reverse md:flex-row gap-10 items-center p-5'>
        <div className='w-full md:2/3 2xl:w-2/4'>
          <h1 className='text-3xl text-blue-600 font-bold mb-5'>About Us</h1>
          <p className='text-justify leading-7'>
          The University of Ruhuna, established by a Special Presidential Decree in 1978 and elevated to a fully-fledged university in 1984, is Sri Lanka's sixth oldest University. It is the only University in the country's southern region, with ten faculties spread across three prominent locations. The central campus, which is located in Wellamadama, houses the faculties of Science, Humanities and Social Sciences, Management and Finance, and Fisheries and Marine Sciences & Technology. Agriculture and Technology faculties are located in Kamburupitiya, while Engineering, Medicine, and Allied Health Science faculties are located in Galle. Over the past 43 years, the University of Ruhuna has witnessed tremendous progress and development in the academic, research, and outreach spheres and significant improvements in intellectual and infrastructure resources, emerging as a leader in higher education in Sri Lanka.
          </p>
        </div>
        <img src={JobImg} alt='About' className='w-auto h-[300px]' />
      </div>

      <div className='leading-8 px-5 text-justify'>
        <p>
          
        </p>
      </div>
    </div>
  );
};

export default About;
