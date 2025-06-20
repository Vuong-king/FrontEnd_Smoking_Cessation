import React from "react";
import { Hero } from "../../../components/generic/home/Hero";
import { Services } from "../../../components/generic/home/Services";
import { WorkProcess } from "../../../components/generic/home/WorkProcess";
import { Pricing } from "../../../components/generic/home/Pricing";
import { ContactForm } from "../../../components/generic/home/ContactForm";
import { Testimonials } from "../../../components/generic/home/Testimonials";

function HomePages() {
  return (
    <div>
      <Hero />
      <Services />
      <WorkProcess />
      <Pricing />
      <ContactForm />
      <Testimonials />
    </div>
  );
}

export default HomePages;
