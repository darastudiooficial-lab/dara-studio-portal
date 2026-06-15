const fs = require('fs');

const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

// Replace the else block mapping
const targetMap = `<ul className="service-list">
                    {service.list[lang].map((item, i) => (
                      <li key={i} className="service-list-item">
                        <Icons.Check />
                        {item}
                      </li>
                    ))}
                  </ul>`;

const replacementMap = `<ul className="service-list">
                    {service.list[lang].map((item, i) => (
                      <li key={i} className="service-list-item">
                        <Icons.Check />
                        <span style={{ display: 'inline-block' }}>
                          {typeof item === 'string' ? item : (
                            <>
                              <strong style={{ color: "#fff" }}>{item.label}:</strong> {item.desc}
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>`;

content = content.replace(targetMap, replacementMap);

// Replace office_support object
const targetObject = `{
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    title: { EN: "High-Performance Back-Office Support", PT: "Suporte Back-Office de Alta Performance" },
    desc: { 
      EN: "Scale your firm’s production capacity without the overhead of expanding your local team. We act as your dedicated technical back-office, handling high-volume drafting and complex revisions so you can focus on winning new contracts and managing client relationships.",
      PT: "Escale a capacidade de produção do seu escritório sem os custos fixos de expandir sua equipe local. Atuamos como seu back-office técnico dedicado, lidando com grandes volumes de desenho e revisões complexas."
    },
    list: {
      EN: ["Agile Revision Cycles", "Capacity on Demand", "Standardized Workflows", "Complex Layout Modeling", "Project Documentation Management"],
      PT: ["Ciclos de Revisão Ágeis", "Capacidade Sob Demanda", "Fluxos de Trabalho Padronizados", "Modelagem de Layouts Complexos", "Gestão de Documentação de Projeto"]
    },
    output: "Consultative Extension",
    deliverables: {
      EN: "White-Label Integration | Time-Zone Advantage",
      PT: "Integração White-Label | Vantagem de Fuso Horário"
    }
  }`;

const replacementObject = `{
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    badge: { EN: "CORPORATE SOLUTIONS · B2B SUPPORT", PT: "SOLUÇÕES CORPORATIVAS · SUPORTE B2B" },
    title: { EN: "High-Performance Back-Office Support", PT: "Suporte Back-Office de Alta Performance" },
    desc: { 
      EN: "Scale your firm’s production capacity without the overhead of expanding your local team. DARA Studio operates as your dedicated technical back-office, seamlessly handling high-volume drafting, precision documentation, and complex revisions.",
      PT: "Escale a capacidade de produção do seu escritório ou construtora sem os custos fixos de expandir sua equipe local nos EUA. Atuamos como seu back-office técnico dedicado, absorvendo grandes volumes de desenho, detalhamento e revisões complexas."
    },
    list: {
      EN: [
        { label: "Accelerated Revision Cycles", desc: "Fast turnaround times to keep your active projects moving forward." },
        { label: "On-Demand Scalability", desc: "Instant technical capacity to absorb sudden increases in project volume." },
        { label: "Standardized Technical Workflows", desc: "Seamless file integration aligned with US graphic standards." },
        { label: "Complex Layout & Project Management", desc: "End-to-end technical production and drafting oversight." }
      ],
      PT: [
        { label: "Ciclos de Revisão Ágeis", desc: "Prazos otimizados para manter o fluxo dos seus projetos em andamento." },
        { label: "Capacidade Sob Demanda", desc: "Infraestrutura técnica imediata para absorver picos de demanda." },
        { label: "Fluxos de Trabalho Padronizados", desc: "Processos integrados e alinhados aos padrões gráficos americanos." },
        { label: "Modelagem e Gestão Documental", desc: "Produção de documentação técnica e detalhamentos complexos." }
      ]
    },
    output: "Consultative Extension",
    deliverables: {
      EN: "White-Label Integration | Time-Zone Advantage",
      PT: "Integração White-Label | Vantagem de Fuso Horário"
    }
  }`;

content = content.replace(targetObject, replacementObject);

fs.writeFileSync(path, content, 'utf-8');
console.log("Successfully updated office_support");
