import React from 'react';
import { FinalReportData } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface FinalDiagnosticProps {
    data: FinalReportData;
}

const FinalDiagnostic: React.FC<FinalDiagnosticProps> = ({ data }) => {

    // Helper to format currency
    const formatToBRL = (value: string | undefined) => {
        if (!value) return 'R$ 0,00';

        // 1. Remove "R$", spaces
        let clean = value.replace(/R\$|\s/g, '');

        // 2. Handle "k" = 000
        if (clean.toLowerCase().includes('k')) {
            clean = clean.toLowerCase().replace('k', '000');
            clean = clean.replace('.', '');
        }

        // Heuristic parsing:
        if (value.toLowerCase().includes('k')) {
            const match = value.match(/[\d,.]+/);
            if (match) {
                let numStr = match[0].replace(',', '.');
                let num = parseFloat(numStr);
                if (!isNaN(num)) {
                    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num * 1000);
                }
            }
        }

        if (/^\d+$/.test(clean)) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(parseInt(clean));
        }

        if (clean.includes(',') && !clean.includes('.')) {
            const dotFormat = clean.replace(',', '.');
            const num = parseFloat(dotFormat);
            if (!isNaN(num)) return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
        }

        if (clean.includes('.') && clean.includes(',')) {
            const usFormat = clean.replace(/\./g, '').replace(',', '.');
            const num = parseFloat(usFormat);
            if (!isNaN(num)) return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(num);
        }

        if (!value.includes('R$')) return `R$ ${value}`;
        return value;
    };

    // Prepare Chart Data
    const chartData = [
        { subject: 'Tráfego', A: data.pillarScores?.traffic || 30, fullMark: 100 },
        { subject: 'Vendas', A: data.pillarScores?.sales || 40, fullMark: 100 },
        { subject: 'Produto', A: data.pillarScores?.product || 60, fullMark: 100 },
        { subject: 'Gestão', A: data.pillarScores?.management || 20, fullMark: 100 },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in pb-32">

            {/* --- TOP BAR: SYSTEM STATUS --- */}
            <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-8 text-[10px] md:text-xs font-mono text-zinc-500 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span>MentorFlow AI System // v3.0 (Analytics)</span>
                </div>
                <div>
                    DIAGNÓSTICO: {data.stage.toUpperCase()}
                </div>
            </div>

            {/* --- HEADER: DIAGNOSTIC --- */}
            <header className="mb-12">
                <div className="inline-block px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-yellow-500 text-xs font-bold uppercase tracking-wider mb-4">
                    Dossiê Estratégico
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                    Seu Roadmap para <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        R$ 50k / Mês
                    </span>
                </h1>
                <p className="text-zinc-400 text-lg md:text-xl max-w-2xl leading-relaxed">
                    {data.userName}, analisamos seu perfil ({data.stage}). O plano abaixo conecta sua realidade atual de <strong className="text-white">{formatToBRL(data.currentIncome)}</strong> à sua meta de <strong className="text-yellow-500">{formatToBRL(data.financialGoal)}</strong>.
                </p>
            </header>

            {/* --- SECTION 1: FINANCIAL VISION --- */}
            <section className="mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Current Reality */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg relative overflow-hidden">
                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Realidade Atual</div>
                        <div className="text-2xl font-mono text-zinc-300 truncate" title={data.currentIncome}>{formatToBRL(data.currentIncome)}</div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-700"></div>
                    </div>

                    {/* Ticket Price */}
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg relative overflow-hidden">
                        <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Ticket da Mentoria</div>
                        <div className="text-2xl font-mono text-white truncate">
                            {data.ticketPrice && data.ticketPrice !== 'A Definir' ? formatToBRL(data.ticketPrice) : <span className="text-zinc-600 text-lg">Em definição</span>}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-500"></div>
                    </div>

                    {/* Financial Goal */}
                    <div className="bg-zinc-900 border border-yellow-500/30 p-6 rounded-lg relative overflow-hidden group">
                        <div className="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
                        <div className="text-xs text-yellow-600 uppercase font-bold tracking-wider mb-2">Meta Financeira</div>
                        <div className="text-2xl font-mono text-yellow-400 font-bold truncate" title={data.financialGoal}>{formatToBRL(data.financialGoal)}</div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
                    </div>
                </div>
            </section>

            {/* --- SECTION 2: RADAR CHART & ANALYSIS --- */}
            <section className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

                {/* Left: Chart */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 md:p-8 flex flex-col items-center justify-center min-h-[350px] relative">
                    <h3 className="text-zinc-500 text-xs uppercase tracking-widest absolute top-6 left-6 font-bold">Raio-X do Negócio</h3>

                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="#3f3f46" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Seu Negócio"
                                    dataKey="A"
                                    stroke="#eab308"
                                    strokeWidth={2}
                                    fill="#eab308"
                                    fillOpacity={0.3}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="text-[10px] text-zinc-600 text-center mt-2">
                        Comparativo com a média de mentores que faturam 50k+
                    </div>
                </div>

                {/* Right: Strengths & Weaknesses */}
                <div className="space-y-6">

                    {/* Strengths */}
                    <div className="bg-green-900/10 border border-green-900/30 rounded-lg p-5">
                        <h4 className="flex items-center gap-2 text-green-500 font-bold uppercase text-xs tracking-widest mb-3">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Seus Pontos Fortes
                        </h4>
                        <ul className="space-y-2">
                            {data.strengths?.map((item, i) => (
                                <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                                    <span className="text-green-500/50 mt-1">●</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-5">
                        <h4 className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest mb-3">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            Pontos de Atenção (Gargalos)
                        </h4>
                        <ul className="space-y-2">
                            {data.weaknesses?.map((item, i) => (
                                <li key={i} className="text-zinc-300 text-sm flex items-start gap-2">
                                    <span className="text-red-500/50 mt-1">●</span> {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- SECTION 3: CORRECTION PLAN --- */}
            <section className="mb-16">
                <div className="bg-zinc-900 border-l-4 border-yellow-500 p-8 rounded-r-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Plano de Correção Imediata</h3>
                    <p className="text-zinc-400 text-sm mb-6 max-w-2xl">
                        Baseado nos seus gargalos, identificamos as ações prioritárias para destravar a sua escala antes mesmo de começar o tráfego pesado.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.correctionPlan?.map((item, i) => (
                            <div key={i} className="flex items-start gap-3 p-3 hover:bg-zinc-800/50 rounded transition-colors">
                                <div className="mt-1 w-5 h-5 bg-yellow-500/20 text-yellow-500 rounded flex items-center justify-center text-xs font-bold shrink-0">
                                    {i + 1}
                                </div>
                                <p className="text-zinc-200 text-sm">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: THE 4-MONTH ROADMAP --- */}
            <section className="mb-20">
                <div className="flex items-center gap-4 mb-8">
                    <svg className="w-6 h-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wider">Cronograma de Implementação</h3>
                </div>

                <div className="flex flex-col gap-6">
                    {data.roadmap && data.roadmap.map((step, index) => (
                        <div key={index} className="group flex flex-col md:flex-row bg-zinc-900/30 border border-zinc-800 hover:border-yellow-500/50 rounded-xl overflow-hidden transition-all">
                            {/* Month Indicator */}
                            <div className="bg-black/50 p-6 md:w-32 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 group-hover:border-yellow-500/30 transition-colors">
                                <span className="text-3xl font-bold text-zinc-700 group-hover:text-yellow-500 transition-colors">{index + 1}</span>
                                <span className="text-[10px] uppercase text-zinc-500 tracking-widest mt-1">Mês</span>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-grow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">{step.title}</h3>
                                    <div className="inline-block px-3 py-1 bg-zinc-800 rounded-full text-xs text-zinc-400 border border-zinc-700">
                                        Foco: <span className="text-zinc-200">{step.focus}</span>
                                    </div>
                                </div>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                                    {step.actions && step.actions.map((action, actionIndex) => (
                                        <li key={actionIndex} className="flex items-start gap-2 text-sm text-zinc-400">
                                            <svg className="w-3 h-3 text-yellow-500 mt-1 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>
                                            <span>{action}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- SECTION 5: CTA (MENTORFLOW SOLUTION) --- */}
            <section className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/10 to-transparent rounded-2xl -z-10"></div>
                <div className="bg-black border border-yellow-500 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <svg className="w-64 h-64 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                        Você não precisa fazer isso <span className="text-yellow-500 italic">sozinho</span>.
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
                        Muitos mentores travam tentando aprender tráfego, configurar CRM, editar vídeos e ainda vender.
                        <br /><br />
                        <span className="text-white font-bold">A MentorFlow é sua equipe de implementação completa.</span>
                        <br />
                        Nós instalamos o funil, configuramos o tráfego, escrevemos as copys e entregamos leads qualificados no seu WhatsApp.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <a
                            href={`https://wa.me/5521972070247?text=Eu%20fiz%20o%20diagn%C3%B3stico%20no%20Lucius%20e%20quero%20ajuda%20para%20implementar`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full md:w-auto px-8 py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold uppercase tracking-widest text-lg rounded-lg transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_40px_rgba(234,179,8,0.6)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.506-.669-.516l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.084 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" /></svg>
                            Falar com Consultor (Whatsapp)
                        </a>
                    </div>
                    <p className="text-zinc-600 text-xs mt-4">
                        Sessão Estratégica Gratuita • Vagas Limitadas
                    </p>
                </div>
            </section>

        </div>
    );
};

export default FinalDiagnostic;