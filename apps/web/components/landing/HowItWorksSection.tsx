const steps = [
    {
        num: "01",
        icon: "🌐",
        title: "Парсинг источников",
        desc: "Каждый день обходим 50+ сайтов: министерства, фонды, университеты, бизнес-акселераторы.",
    },
    {
        num: "02",
        icon: "⚙️",
        title: "Нормализация данных",
        desc: "Извлекаем названия, организации, дедлайны и суммы — и приводим к единому формату.",
    },
    {
        num: "03",
        icon: "🔍",
        title: "Поиск и фильтрация",
        desc: "Находи по направлению, дедлайну или ключевому слову за секунды.",
    },
];

export default function HowItWorksSection() {
    return (
        <section id="how-it-works" className="relative bg-white py-24">
            <div className="mx-auto max-w-screen-xl px-6">
                <div className="mx-auto mb-16 max-w-2xl text-center">
                    <span className="inline-flex items-center rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 ring-1 ring-inset ring-primary-100">
                        Как это работает
                    </span>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Три шага от&nbsp;источника до&nbsp;твоего экрана
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                        Полностью автоматический пайплайн — без ручного труда.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {steps.map((step) => (
                        <div
                            key={step.num}
                            className="reveal-up group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary-100 hover:shadow-soft-lg"
                        >
                            {/* Номер-водяной знак */}
                            <span className="pointer-events-none absolute -right-2 top-2 text-7xl font-black text-gray-50 transition-colors duration-300 group-hover:text-primary-50">
                                {step.num}
                            </span>

                            <div className="relative">
                                <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 text-3xl shadow-soft ring-1 ring-inset ring-primary-100">
                                    {step.icon}
                                </span>
                                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                    {step.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
