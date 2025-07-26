import React from "react";
import { Hero } from "../../../components/generic/home/Hero";
import { Services } from "../../../components/generic/home/Services";
import { WorkProcess } from "../../../components/generic/home/WorkProcess";
import { Pricing } from "../../../components/generic/home/Pricing";
import ChatboxAI from "../../../components/generic/ChatboxAI";
import Testimonials from "../../../components/generic/home/Testimonials";
import RelapseChatbox from "../../../components/generic/RelapseChatbox";

function HomePages() {
  return (
    <div>
      <Hero />
      <Services />
      <WorkProcess />
      <Pricing />
      <Testimonials />
      <ChatboxAI />
      <RelapseChatbox />
    </div>
  );
}

export default HomePages;
