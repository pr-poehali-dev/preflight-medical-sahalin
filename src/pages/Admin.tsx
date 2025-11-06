import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface ContentItem {
  key: string;
  value: string;
  label: string;
}

export default function Admin() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const contentLabels: Record<string, string> = {
    hero_title: 'Заголовок главной секции',
    hero_subtitle: 'Подзаголовок главной секции',
    phone_primary: 'Основной телефон',
    phone_secondary: 'Дополнительный телефон',
    address: 'Адрес',
    email: 'Email',
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchContent();
  }, [navigate]);

  const fetchContent = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/7034badd-73b5-4177-b6ea-0fb826b9fd0c', {
        headers: {
          'X-Auth-Token': localStorage.getItem('admin_token') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedContent = data.map((item: any) => ({
          key: item.key,
          value: item.value,
          label: contentLabels[item.key] || item.key,
        }));
        setContent(formattedContent);
      } else {
        navigate('/login');
      }
    } catch (err) {
      console.error('Error fetching content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('https://functions.poehali.dev/7034badd-73b5-4177-b6ea-0fb826b9fd0c', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Auth-Token': localStorage.getItem('admin_token') || '',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setMessage('Изменения сохранены успешно!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Ошибка при сохранении');
      }
    } catch (err) {
      setMessage('Ошибка подключения к серверу');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const updateValue = (key: string, newValue: string) => {
    setContent(
      content.map((item) =>
        item.key === key ? { ...item, value: newValue } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Панель управления</h1>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/')}>
              <Icon name="Home" size={18} className="mr-2" />
              На сайт
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={18} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-3xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Редактирование контента</h2>
            <p className="text-gray-600">Измените информацию на сайте</p>
          </div>

          <div className="space-y-6">
            {content.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {item.label}
                </label>
                {item.key.includes('title') || item.key.includes('subtitle') ? (
                  <Input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateValue(item.key, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <Input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateValue(item.key, e.target.value)}
                    className="w-full"
                  />
                )}
              </div>
            ))}
          </div>

          {message && (
            <div
              className={`mt-6 px-4 py-3 rounded-lg flex items-center gap-2 ${
                message.includes('успешно')
                  ? 'bg-green-50 border border-green-200 text-green-700'
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}
            >
              <Icon
                name={message.includes('успешно') ? 'CheckCircle2' : 'AlertCircle'}
                size={20}
              />
              <span className="text-sm">{message}</span>
            </div>
          )}

          <div className="mt-8 flex gap-3">
            <Button onClick={handleSave} disabled={saving} size="lg" className="flex-1">
              {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
            <Button variant="outline" onClick={fetchContent} size="lg">
              <Icon name="RefreshCw" size={18} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}