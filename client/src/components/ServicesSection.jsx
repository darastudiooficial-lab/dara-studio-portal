import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Layers, Ruler, FileCheck2 } from 'lucide-react';

const SERVICES_DATA = {
  EN: [
    {
      title: "Permit Sets",
      desc: "Complete architectural packages ready for city approval. We ensure 100% compliance with local building codes.",
      icon: <FileCheck2 size={24} className="text-purple-400" />
    },
    {
      title: "3D Modeling & Rendering",
      desc: "Photorealistic visualizations to help you and your clients see the final result before breaking ground.",
      icon: <Layers size={24} className="text-pink-400" />
    },
    {
      title: "Structural Detailing",
      desc: "High-precision structural drawings engineered for safe, efficient, and reliable construction.",
      icon: <Ruler size={24} className="text-purple-500" />
    }
  ],
  PT: [
    {
      title: "Plantas de Permissão (Permit Sets)",
      desc: "Pacotes arquitetônicos completos prontos para aprovação. Garantimos 100% de conformidade com os códigos de obra.",
      icon: <FileCheck2 size={24} className="text-purple-400" />
    },
    {
      title: "Modelagem 3D e Renderização",
      desc: "Visualizações fotorrealistas para ajudar você e seus clientes a verem o resultado final antes da obra.",
      icon: <Layers size={24} className="text-pink-400" />
    },
    {
      title: "Detalhamento Estrutural",
      desc: "Desenhos estruturais de alta precisão projetados para uma construção segura, eficiente e confiável.",
      icon: <Ruler size={24} className="text-purple-500" />
    }
  ]
};

export default function ServicesSection() {
  const { lang } = useAppContext();
  const services = SERVICES_DATA[lang];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white mb-4">
          {lang === 'EN' ? 'Technical Precision' : 'Precisão Técnica'}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {lang === 'EN' 
            ? 'We deliver industry-standard drawings tailored for US contractors.' 
            : 'Entregamos desenhos no padrão da indústria focados para construtores nos EUA.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((svc, idx) => (
          <div key={idx} className="relative group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-500/50 transition-all duration-300 shadow-2xl hover:shadow-[0_0_40px_rgba(168,85,247,0.2)]">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-purple-500/20 transition-colors">
              {svc.icon}
            </div>
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{svc.title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{svc.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
