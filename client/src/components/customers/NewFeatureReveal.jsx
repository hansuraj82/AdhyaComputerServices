import React, { useEffect, useState } from 'react';
import { MdStars, MdOutlineClose, MdEventNote, MdHistory, MdLightbulb } from 'react-icons/md';
import { motion } from 'framer-motion';


const NewFeatureReveal = ({onClose}) => {

    const handleBackdropClick = () => {
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 transition-all"
            onClick={handleBackdropClick}>
            <div className="relative w-full mb-12 group" onClick={(e) => e.stopPropagation()}>
                {/* Main Glow Background */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-[2.8rem] p-1 border border-slate-100 overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center justify-between p-6 md:p-10 gap-8">

                        {/* Left: Content & Branding */}
                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full">
                                <MdStars className="text-indigo-600 animate-spin-slow" size={18} />
                                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-wrap">New Update Added</span>
                            </div>
                            <button
                                onClick={handleBackdropClick}
                                className="cursor-pointer absolute top-4 right-4 text-rose-300 hover:text-rose-600 disabled:hidden transition-colors"
                            >
                                <MdOutlineClose size={24} />
                            </button>

                            <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none">
                                Smart Customer <span className="text-indigo-600">Intelligence.</span>
                            </h2>

                            <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-lg">
                                We’ve added a new **Customer Notes** feature just for you.
                                Now, you can maintain a digital diary for every customer—tracking
                                everything from pending payments to special requests.
                            </p>


                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-slate-50 px-3 py-2 rounded-xl">
                                    <MdHistory size={16} /> Auto-Timestamped
                                </div>
                                <div className="flex items-center gap-2 text-slate-400 text-xs font-bold bg-slate-50 px-3 py-2 rounded-xl">
                                    <MdLightbulb size={16} /> Business Insights
                                </div>
                            </div>
                        </div>

                        {/* Right: The "Visual Teaser" of the Note Card */}
                        <AutoTypingCard/>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewFeatureReveal;





const AutoTypingCard = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const fullTitle = "Customer Email";
  const fullContent = "abcdef@gmail.com and 12345@gmail.com";

  useEffect(() => {
    let isMounted = true; // Prevents memory leaks/flickering on unmount

    const typeTitle = (index) => {
      if (!isMounted) return;
      if (index <= fullTitle.length) {
        setTitle(fullTitle.slice(0, index));
        setTimeout(() => typeTitle(index + 1), 100); // Title typing speed
      } else {
        setTimeout(() => typeContent(0), 600); // Pause before content
      }
    };

    const typeContent = (index) => {
      if (!isMounted) return;
      if (index <= fullContent.length) {
        setContent(fullContent.slice(0, index));
        setTimeout(() => typeContent(index + 1), 50); // Content typing speed
      } else {
        // Wait 4 seconds, then reset
        setTimeout(() => {
          if (isMounted) {
            setTitle("");
            setContent("");
            typeTitle(0); // Restart the loop
          }
        }, 4000);
      }
    };

    // Kick off the animation
    typeTitle(0);

    return () => {
      isMounted = false; // Cleanup
    };
  }, []); // Empty dependency array ensures it only starts ONCE

  return (
    <div className="relative flex-1 flex justify-center items-center">
      {/* Background Glow */}
      <div className="absolute w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px]" />

      <motion.div 
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-72 h-48 bg-white rounded-[2.5rem] border border-slate-100 p-6 shadow-2xl relative z-10"
      >
        <div className="w-10 h-10 bg-indigo-50 rounded-2xl mb-4 flex items-center justify-center text-indigo-600">
          <MdEventNote size={22} />
        </div>

        {/* Title Field */}
        <div className="mb-3">
          <div className="h-8 bg-slate-50 rounded-xl border border-slate-100 px-3 flex items-center">
            <span className="text-[10px] font-black text-slate-700">
              {title}
            </span>
            {title.length < fullTitle.length && (
               <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 h-3 bg-indigo-500 ml-1" />
            )}
          </div>
        </div>

        {/* Content Field */}
        <div className="h-16 bg-slate-50 rounded-xl border border-slate-100 p-3 overflow-hidden">
          <p className="text-[9px] font-bold text-slate-500 leading-relaxed italic">
            {content}
            {title.length >= fullTitle.length && (
               <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1 h-2 bg-indigo-300 ml-0.5" />
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};


