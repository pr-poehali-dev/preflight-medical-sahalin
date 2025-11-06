import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <nav className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="hidden md:flex items-center gap-6">
              {[
                { id: 'home', label: 'Главная' },
                { id: 'services', label: 'Услуги' },
                { id: 'about', label: 'О компании' },
                { id: 'licenses', label: 'Лицензии' },
                { id: 'contacts', label: 'Контакты' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+79147675112" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
                +7 914 767-51-12
              </a>
              <span className="text-gray-400">|</span>
              <a href="tel:+79147449568" className="text-sm font-medium text-gray-900 hover:text-primary transition-colors">
                +7 914 744-95-68
              </a>
            </div>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        <section id="home" className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-fade-in">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Предрейсовые и послерейсовые медосмотры в Сахалинской области
                </h1>
                <p className="text-xl text-gray-600">
                  Медицинские осмотры водителей. Быстро, качественно, с соблюдением всех стандартов.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex flex-col gap-2">
                    <Button size="lg" className="text-lg px-8" asChild>
                      <a href="tel:+79147675112">Позвонить нам</a>
                    </Button>
                    <div className="flex gap-3 text-sm text-gray-600 justify-center">
                      <a href="tel:+79147675112" className="hover:text-primary transition-colors">+7 914 767-51-12</a>
                      <span>•</span>
                      <a href="tel:+79147449568" className="hover:text-primary transition-colors">+7 914 744-95-68</a>
                    </div>
                  </div>
                  <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection('services')}>
                    Наши услуги
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">15+</div>
                    <div className="text-sm text-gray-600 mt-1">лет опыта</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">10k+</div>
                    <div className="text-sm text-gray-600 mt-1">осмотров</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-gray-600 mt-1">доступность</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl flex items-center justify-center">
                  <Icon name="Stethoscope" size={200} className="text-primary/30" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши услуги</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Полный спектр медицинских осмотров для водителей и персонала
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: 'Car',
                  title: 'Предрейсовый осмотр',
                  description: 'Обязательный медицинский осмотр водителей перед выездом на линию',
                },
                {
                  icon: 'Activity',
                  title: 'Послерейсовый осмотр',
                  description: 'Контроль состояния здоровья после завершения рабочей смены',
                },
                {
                  icon: 'ClipboardList',
                  title: 'Предсменные и послесменные осмотры',
                  description: 'Медицинский контроль перед началом и после окончания рабочей смены',
                },
                {
                  icon: 'Monitor',
                  title: 'Дистанционные осмотры',
                  description: 'Проведение медицинских осмотров в удаленном формате',
                },
                {
                  icon: 'Building2',
                  title: 'Выездные осмотры',
                  description: 'Проведение медосмотров на территории заказчика',
                },
              ].map((service, index) => (
                <Card key={index} className="border-2 hover:border-primary transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon name={service.icon} className="text-primary" size={28} />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-6">О компании</h2>
                <div className="space-y-4 text-gray-700 text-lg">
                  <p>
                    <strong className="text-primary">Интермед-групп</strong> — ведущая компания в сфере 
                    предрейсовых медицинских осмотров в Сахалинской области.
                  </p>
                  <p>
                    Мы работаем с 2009 года и за это время провели более 10 000 медицинских осмотров. 
                    Наша команда состоит из квалифицированных специалистов с многолетним опытом.
                  </p>
                  <p>
                    Мы используем современное оборудование и соблюдаем все требования 
                    законодательства РФ в области охраны труда и медицинского обслуживания.
                  </p>
                </div>
                <div className="mt-8 space-y-3">
                  {[
                    'Лицензированная медицинская деятельность',
                    'Квалифицированные врачи',
                    'Современное оборудование',
                    'Быстрое оформление документов',
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="Check" size={16} className="text-white" />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white">
                  <CardHeader>
                    <Icon name="Users" className="text-primary mb-2" size={40} />
                    <CardTitle className="text-3xl">500+</CardTitle>
                    <CardDescription>Компаний-партнёров</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-white">
                  <CardHeader>
                    <Icon name="Award" className="text-primary mb-2" size={40} />
                    <CardTitle className="text-3xl">15+</CardTitle>
                    <CardDescription>Лет на рынке</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-white">
                  <CardHeader>
                    <Icon name="Clock" className="text-primary mb-2" size={40} />
                    <CardTitle className="text-3xl">Пн-Вс</CardTitle>
                    <CardDescription>05:00–19:00</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="bg-white">
                  <CardHeader>
                    <Icon name="Star" className="text-primary mb-2" size={40} />
                    <CardTitle className="text-3xl">100%</CardTitle>
                    <CardDescription>Качество услуг</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="licenses" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Лицензии и сертификаты</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Вся наша деятельность лицензирована и соответствует требованиям законодательства РФ
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  icon: 'FileCheck',
                  title: 'Лицензия на медицинскую деятельность',
                  number: '№ ЛО-65-01-002345',
                },
                {
                  icon: 'ShieldCheck',
                  title: 'Сертификат соответствия ISO',
                  number: '№ РОСС RU.И1509.04ИЮБ0',
                },
                {
                  icon: 'Award',
                  title: 'Аккредитация Минздрава',
                  number: '№ 2023-АК-012456',
                },
              ].map((license, index) => (
                <Card key={index} className="text-center border-2 hover:border-primary transition-all">
                  <CardHeader>
                    <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon name={license.icon} className="text-primary" size={40} />
                    </div>
                    <CardTitle className="text-lg">{license.title}</CardTitle>
                    <CardDescription className="text-sm mt-2">{license.number}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="contacts" className="py-20 bg-gradient-to-br from-blue-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Контакты</h2>
              <p className="text-xl text-gray-600">Свяжитесь с нами удобным способом</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon name="MapPin" className="text-primary" size={24} />
                      Адрес
                    </CardTitle>
                    <CardDescription className="text-base text-gray-700">
                      Сахалинская область, г. Южно-Сахалинск,
                      <br />
                      Ул. Чехова, 43, 2 этаж, кабинет 3
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon name="Phone" className="text-primary" size={24} />
                      Телефон
                    </CardTitle>
                    <CardDescription className="text-base text-gray-700">
                      +7 914 767-51-12
                      <br />
                      +7 914 744-95-68
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon name="Mail" className="text-primary" size={24} />
                      Email
                    </CardTitle>
                    <CardDescription className="text-base text-gray-700">
                      intermed.ltd@bk.ru
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon name="Clock" className="text-primary" size={24} />
                      Режим работы
                    </CardTitle>
                    <CardDescription className="text-base text-gray-700">
                      Пн — Пт: 05:00–19:00
                      <br />
                      Сб — Вс: 06:00–18:00
                      <br />
                      Перерыв: 12:00–15:00
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <Card className="p-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle>Записаться на осмотр</CardTitle>
                  <CardDescription>Заполните форму и мы свяжемся с вами</CardDescription>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <form className="space-y-4">
                    <div>
                      <Input placeholder="Ваше имя" />
                    </div>
                    <div>
                      <Input type="tel" placeholder="Телефон" />
                    </div>
                    <div>
                      <Input type="email" placeholder="Email" />
                    </div>
                    <div>
                      <Textarea placeholder="Сообщение" rows={4} />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      Отправить заявку
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-12">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Icon name="MapPin" className="text-primary" size={24} />
                    Наше расположение
                  </CardTitle>
                  <CardDescription>Ул. Чехова, 43, 2 этаж, кабинет 3</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="w-full h-[400px]">
                    <iframe
                      src="https://yandex.ru/map-widget/v1/?ll=142.738126%2C46.961538&z=17&l=map&pt=142.738126,46.961538,pm2rdm"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                      style={{ position: 'relative' }}
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://cdn.poehali.dev/files/931fd315-6af0-427d-8bce-5c9dd31415f0.png" alt="Интермед-групп" className="h-10 w-auto" />
                <span className="text-xl font-bold">Интермед-групп</span>
              </div>
              <p className="text-gray-400">
                Профессиональные медицинские осмотры в Сахалинской области
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Быстрые ссылки</h3>
              <div className="space-y-2">
                {['Главная', 'Услуги', 'О компании', 'Лицензии', 'Контакты'].map((item) => (
                  <button
                    key={item}
                    className="block text-gray-400 hover:text-primary transition-colors"
                    onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Контакты</h3>
              <div className="space-y-2 text-gray-400">
                <p>+7 (4242) 12-34-56</p>
                <p>info@intermed-group.ru</p>
                <p>г. Южно-Сахалинск</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Интермед-групп. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;