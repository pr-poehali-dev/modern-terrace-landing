import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/3920dd0c-4dfa-4c78-9711-bb7b6291f67a/files/8ca3135f-40c5-46ed-8f8f-3b44b8abf83a.jpg";
const GAZEBO_IMAGE = "https://cdn.poehali.dev/projects/3920dd0c-4dfa-4c78-9711-bb7b6291f67a/files/0071f7a4-88d7-4cbd-82f0-4c5467fe0123.jpg";

const SERVICES = [
  { icon: "Home", title: "Веранды", desc: "Открытые и застеклённые веранды, которые станут любимым местом отдыха вашей семьи. Проектируем под ваш дом.", price: "от 180 000 ₽" },
  { icon: "Layers", title: "Террасы", desc: "Деревянные и композитные террасы с долговечным покрытием. Устойчивы к влаге, морозу и нагрузкам.", price: "от 120 000 ₽" },
  { icon: "TreePine", title: "Беседки", desc: "Классические и современные беседки из массива дерева. Идеально для летних вечеров и торжеств.", price: "от 90 000 ₽" },
  { icon: "Fence", title: "Навесы", desc: "Функциональные навесы для авто, дровника или зоны отдыха. Быстрый монтаж, надёжная конструкция.", price: "от 60 000 ₽" },
];

const PORTFOLIO = [
  { title: "Терраса у дома", area: "42 м²", material: "Лиственница", before: GAZEBO_IMAGE, after: HERO_IMAGE },
  { title: "Беседка с барбекю", area: "28 м²", material: "Кедр", before: HERO_IMAGE, after: GAZEBO_IMAGE },
  { title: "Веранда панорамная", area: "35 м²", material: "Ель + стекло", before: GAZEBO_IMAGE, after: HERO_IMAGE },
];

const REVIEWS = [
  { name: "Анна К.", city: "Москва", text: "Заказывала веранду под ключ. Бригада приехала вовремя, работали аккуратно. Результат превзошёл ожидания — теперь проводим там всё лето!", stars: 5 },
  { name: "Михаил Г.", city: "Подмосковье", text: "Делали беседку с барбекю. Материалы отличного качества, всё задокументировано. Прошло 2 года — ни одного нарекания.", stars: 5 },
  { name: "Светлана П.", city: "Красногорск", text: "Очень довольна работой. Помогли с проектом, подобрали материал под наш дом. Всё сделали за 12 дней.", stars: 5 },
];

const STATS = [
  { value: "10+", label: "лет опыта" },
  { value: "340+", label: "проектов" },
  { value: "98%", label: "клиентов довольны" },
  { value: "5 лет", label: "гарантия" },
];

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".section-reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function BeforeAfterSlider({ before, after, title }: { before: string; after: string; title: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  }, []);

  return (
    <div
      ref={ref}
      className="ba-slider rounded-lg overflow-hidden select-none"
      style={{ aspectRatio: "4/3" }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseMove={(e) => { if (dragging.current) update(e.clientX); }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onTouchMove={(e) => update(e.touches[0].clientX)}
      onTouchStart={(e) => update(e.touches[0].clientX)}
    >
      <img src={after} alt="После" className="w-full h-full object-cover" draggable={false} />
      <div className="ba-after" style={{ width: `${pos}%` }}>
        <img src={before} alt="До" className="h-full object-cover" style={{ width: ref.current?.offsetWidth + "px", maxWidth: "none" }} draggable={false} />
      </div>
      <div className="ba-handle" style={{ left: `${pos}%` }} />
      <span className="absolute top-3 left-3 z-20 text-xs font-semibold bg-black/50 text-white px-2 py-1 rounded">ДО</span>
      <span className="absolute top-3 right-3 z-20 text-xs font-semibold bg-black/50 text-white px-2 py-1 rounded">ПОСЛЕ</span>
      <p className="absolute bottom-3 left-0 right-0 text-center z-20 text-sm text-white font-medium drop-shadow-lg">{title}</p>
    </div>
  );
}

function Calculator() {
  const [type, setType] = useState("Терраса");
  const [area, setArea] = useState(20);
  const [material, setMaterial] = useState("Сосна");
  const [roof, setRoof] = useState(false);

  const basePrice: Record<string, number> = { Терраса: 6000, Веранда: 8000, Беседка: 7000, Навес: 4500 };
  const materialMult: Record<string, number> = { Сосна: 1, Лиственница: 1.35, Кедр: 1.6 };
  const roofAdd = roof ? 15000 : 0;
  const total = Math.round((basePrice[type] * area * materialMult[material] + roofAdd) / 1000) * 1000;

  return (
    <div className="bg-card border border-border rounded-xl p-8 max-w-2xl mx-auto">
      <h3 className="font-display text-3xl text-[#E4B68A] mb-8 text-center">Рассчитайте стоимость</h3>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Тип конструкции</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {["Терраса", "Веранда", "Беседка", "Навес"].map((t) => (
            <button key={t} onClick={() => setType(t)}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${type === t ? "bg-[#C8966A] text-[#14110D]" : "bg-secondary text-foreground hover:bg-[#8B5E3C] hover:text-white"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <div className="flex justify-between mb-3">
          <p className="text-sm text-muted-foreground">Площадь</p>
          <span className="font-display text-[#C8966A] text-xl">{area} м²</span>
        </div>
        <input type="range" min={10} max={100} step={5} value={area} onChange={(e) => setArea(+e.target.value)}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #C8966A ${((area - 10) / 90) * 100}%, #2a2520 ${((area - 10) / 90) * 100}%)` }} />
        <div className="flex justify-between mt-1 text-xs text-muted-foreground"><span>10 м²</span><span>100 м²</span></div>
      </div>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Материал</p>
        <div className="grid grid-cols-3 gap-2">
          {["Сосна", "Лиственница", "Кедр"].map((m) => (
            <button key={m} onClick={() => setMaterial(m)}
              className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${material === m ? "bg-[#C8966A] text-[#14110D]" : "bg-secondary text-foreground hover:bg-[#8B5E3C] hover:text-white"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-8 flex items-center gap-3">
        <button onClick={() => setRoof(!roof)}
          className={`w-11 h-6 rounded-full transition-all duration-300 relative ${roof ? "bg-[#C8966A]" : "bg-secondary"}`}>
          <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${roof ? "left-6" : "left-1"}`} />
        </button>
        <span className="text-sm text-foreground">Добавить кровлю <span className="text-muted-foreground">(+15 000 ₽)</span></span>
      </div>
      <div className="bg-[#8B5E3C]/20 border border-[#8B5E3C]/40 rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">Примерная стоимость</p>
        <p className="font-display text-5xl text-[#E4B68A] mb-4">{total.toLocaleString("ru")} ₽</p>
        <p className="text-xs text-muted-foreground mb-4">Точная стоимость рассчитывается после замера</p>
        <button className="w-full py-3 rounded-lg bg-[#C8966A] text-[#14110D] font-semibold text-sm hover:bg-[#E4B68A] transition-colors duration-200">
          Заказать бесплатный замер
        </button>
      </div>
    </div>
  );
}

export default function Index() {
  useScrollReveal();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const NAV = [
    { id: "about", label: "О нас" },
    { id: "services", label: "Услуги" },
    { id: "portfolio", label: "Портфолио" },
    { id: "reviews", label: "Отзывы" },
    { id: "calculator", label: "Калькулятор" },
    { id: "contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="font-display text-2xl text-[#C8966A] italic">
            НОВА
          </button>
          <ul className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <li key={n.id}>
                <button onClick={() => scrollTo(n.id)} className="nav-link text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
          <button onClick={() => scrollTo("contacts")}
            className="hidden md:block py-2.5 px-5 rounded-lg bg-[#C8966A] text-[#14110D] font-semibold text-sm hover:bg-[#E4B68A] transition-colors duration-200">
            Связаться
          </button>
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-card border-t border-border px-6 py-4">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="block w-full text-left py-3 text-sm text-foreground border-b border-border/50 last:border-0">
                {n.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Веранда" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#14110D]" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="text-[#C8966A] text-sm tracking-[0.3em] uppercase mb-6 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            Профессиональное строительство
          </p>
          <h1 className="font-display text-6xl sm:text-8xl font-light text-white leading-tight mb-6 animate-fade-up" style={{ animationDelay: "0.4s", opacity: 0 }}>
            Веранды.<br />
            <span className="italic text-[#E4B68A]">Террасы.</span><br />
            Беседки.
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto animate-fade-up" style={{ animationDelay: "0.7s", opacity: 0 }}>
            Создаём пространства, где хочется проводить время. Качественно, по фиксированным ценам, с гарантией 5 лет.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.9s", opacity: 0 }}>
            <button onClick={() => scrollTo("calculator")}
              className="py-4 px-8 rounded-lg bg-[#C8966A] text-[#14110D] font-semibold text-sm hover:bg-[#E4B68A] transition-all duration-200 hover:scale-105">
              Рассчитать стоимость
            </button>
            <button onClick={() => scrollTo("portfolio")}
              className="py-4 px-8 rounded-lg border border-white/30 text-white font-medium text-sm hover:bg-white/10 transition-all duration-200">
              Смотреть работы
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-0 right-0 flex justify-center animate-fade-in" style={{ animationDelay: "1.5s", opacity: 0 }}>
          <div className="flex flex-col items-center gap-2 text-white/40">
            <span className="text-xs tracking-widest uppercase">Листайте</span>
            <Icon name="ChevronDown" size={20} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-card border-y border-border py-12">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center section-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <p className="font-display text-4xl sm:text-5xl text-[#C8966A] mb-1">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* О КОМПАНИИ */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="section-reveal">
            <p className="text-[#C8966A] text-sm tracking-[0.25em] uppercase mb-4">О компании</p>
            <h2 className="font-display text-5xl sm:text-6xl font-light leading-tight mb-6">
              Строим с <span className="italic text-[#E4B68A]">душой</span> уже 10 лет
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Мы — команда мастеров, которые влюблены в своё дело. Каждый проект для нас уникален: мы учитываем архитектуру вашего дома, ваши пожелания и особенности участка.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Работаем с натуральными материалами — сосна, лиственница, кедр. Все конструкции проходят обработку от гниения и насекомых. Даём письменную гарантию на 5 лет.
            </p>
            <div className="flex flex-col gap-3">
              {["Бесплатный выезд и замер", "Проект в подарок при заказе", "Собственная бригада, без субподрядчиков", "Работаем по договору"].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#C8966A]/20 flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={12} className="text-[#C8966A]" />
                  </div>
                  <span className="text-sm text-foreground">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="section-reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="relative">
              <img src={GAZEBO_IMAGE} alt="Наша работа" className="rounded-xl w-full object-cover shadow-2xl" style={{ aspectRatio: "4/5" }} />
              <div className="absolute -bottom-6 -left-6 bg-[#C8966A] text-[#14110D] rounded-xl p-5 shadow-xl">
                <p className="font-display text-4xl font-semibold">340+</p>
                <p className="text-xs font-medium mt-1">завершённых проектов</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* УСЛУГИ */}
      <section id="services" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 section-reveal">
            <p className="text-[#C8966A] text-sm tracking-[0.25em] uppercase mb-4">Что мы строим</p>
            <h2 className="font-display text-5xl sm:text-6xl font-light">Наши услуги</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((s, i) => (
              <div key={i} className="section-reveal group bg-background border border-border rounded-xl p-6 hover:border-[#C8966A]/50 transition-all duration-300 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-lg bg-[#C8966A]/10 flex items-center justify-center mb-5 group-hover:bg-[#C8966A]/20 transition-colors">
                  <Icon name={s.icon as "Home" | "Layers" | "TreePine" | "Fence"} size={22} className="text-[#C8966A]" />
                </div>
                <h3 className="font-display text-2xl mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{s.desc}</p>
                <p className="text-sm font-semibold text-[#C8966A]">{s.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ПОРТФОЛИО */}
      <section id="portfolio" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 section-reveal">
            <p className="text-[#C8966A] text-sm tracking-[0.25em] uppercase mb-4">Наши работы</p>
            <h2 className="font-display text-5xl sm:text-6xl font-light">Портфолио</h2>
            <p className="text-muted-foreground mt-4 max-w-lg mx-auto">Перетащите ползунок, чтобы увидеть результат работы</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO.map((p, i) => (
              <div key={i} className="section-reveal" style={{ transitionDelay: `${i * 0.15}s` }}>
                <BeforeAfterSlider before={p.before} after={p.after} title={p.title} />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-display text-xl">{p.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.material}</p>
                  </div>
                  <span className="text-sm text-[#C8966A] font-semibold bg-[#C8966A]/10 px-3 py-1 rounded-full">{p.area}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ОТЗЫВЫ */}
      <section id="reviews" className="py-24 px-6 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 section-reveal">
            <p className="text-[#C8966A] text-sm tracking-[0.25em] uppercase mb-4">Что говорят клиенты</p>
            <h2 className="font-display text-5xl sm:text-6xl font-light">Отзывы</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <div key={i} className="section-reveal bg-background border border-border rounded-xl p-6" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.stars }).map((_, j) => (
                    <span key={j} className="text-[#C8966A] text-lg">★</span>
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-6">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#C8966A]/20 flex items-center justify-center">
                    <span className="font-display text-[#C8966A] text-lg">{r.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* КАЛЬКУЛЯТОР */}
      <section id="calculator" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 section-reveal">
            <p className="text-[#C8966A] text-sm tracking-[0.25em] uppercase mb-4">Планирование бюджета</p>
            <h2 className="font-display text-5xl sm:text-6xl font-light">Калькулятор</h2>
          </div>
          <div className="section-reveal" style={{ transitionDelay: "0.2s" }}>
            <Calculator />
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-24 px-6 bg-card border-t border-border">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div className="section-reveal">
            <p className="text-[#C8966A] text-sm tracking-[0.25em] uppercase mb-4">Свяжитесь с нами</p>
            <h2 className="font-display text-5xl sm:text-6xl font-light leading-tight mb-6">
              Начнём ваш <span className="italic text-[#E4B68A]">проект?</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Оставьте заявку — мы свяжемся в течение часа, ответим на вопросы и договоримся о бесплатном замере.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { icon: "Phone", text: "+7 (495) 000-00-00", sub: "Пн–Сб, 9:00–19:00" },
                { icon: "Mail", text: "info@veranda-master.ru", sub: "Ответим в течение 2 часов" },
                { icon: "MapPin", text: "Москва и Московская область", sub: "Выезд в любую точку" },
              ].map((c, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C8966A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={c.icon as "Phone" | "Mail" | "MapPin"} size={18} className="text-[#C8966A]" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{c.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="section-reveal" style={{ transitionDelay: "0.2s" }}>
            <div className="bg-background border border-border rounded-xl p-8">
              <h3 className="font-display text-2xl mb-6">Оставить заявку</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Ваше имя</label>
                  <input type="text" placeholder="Иван Иванов"
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#C8966A] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Телефон</label>
                  <input type="tel" placeholder="+7 (___) ___-__-__"
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#C8966A] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Что хотите построить?</label>
                  <select className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-[#C8966A] transition-colors">
                    <option>Террасу</option>
                    <option>Веранду</option>
                    <option>Беседку</option>
                    <option>Навес</option>
                    <option>Не определился</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">Комментарий (необязательно)</label>
                  <textarea rows={3} placeholder="Расскажите о вашем участке или пожеланиях..."
                    className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#C8966A] transition-colors resize-none" />
                </div>
                <button className="w-full py-3.5 rounded-lg bg-[#C8966A] text-[#14110D] font-semibold text-sm hover:bg-[#E4B68A] transition-colors duration-200 mt-2">
                  Отправить заявку
                </button>
                <p className="text-center text-xs text-muted-foreground">Нажимая кнопку, вы соглашаетесь с обработкой персональных данных</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 px-6" style={{ backgroundColor: "#14110D" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl italic text-[#C8966A]">НОВА</span>
          <p className="text-xs text-muted-foreground">© 2024 НОВА. Все права защищены.</p>
          <div className="flex gap-6">
            {["О нас", "Услуги", "Контакты"].map((n) => (
              <button key={n} className="text-xs text-muted-foreground hover:text-[#C8966A] transition-colors">{n}</button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}