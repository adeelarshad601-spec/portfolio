"use client";

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { personalData } from '@/utils/data/personal-data';

const DEFAULT_BTN_CLS = "fixed bottom-24 right-6 z-50 flex items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-3.5 text-white shadow-lg transition-all duration-300 ease-out hover:scale-110 cursor-pointer";

const Whatsapp = () => {
  const message = `Hi ${personalData.name}, I visited your portfolio and would like to connect!`;

  // Dynamic link using personalData.whatsapp
  const whatsappUrl = `https://wa.me/${personalData.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={DEFAULT_BTN_CLS}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="h-6 w-6 text-white" />
    </a>
  );
};

export default Whatsapp;