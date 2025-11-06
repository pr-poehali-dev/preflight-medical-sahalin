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

interface ImageItem {
  id: number;
  key: string;
  url: string;
  filename: string;
  label: string;
}

export default function Admin() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const imageLabels: Record<string, string> = {
    hero_image: 'Главное изображение',
    about_image: 'Изображение "О нас"',
    service_image: 'Изображение услуг',
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchContent();
    fetchImages();
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

  const fetchImages = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/f65b1658-5938-425b-a90e-fc32d7126383', {
        headers: {
          'X-Auth-Token': localStorage.getItem('admin_token') || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedImages = data.map((item: any) => ({
          ...item,
          label: imageLabels[item.key] || item.key,
        }));
        setImages(formattedImages);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
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

  const handleImageUpload = async (key: string, file: File) => {
    setUploading(true);
    setMessage('');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Data = reader.result as string;
        
        const response = await fetch('https://functions.poehali.dev/f65b1658-5938-425b-a90e-fc32d7126383', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': localStorage.getItem('admin_token') || '',
          },
          body: JSON.stringify({
            key,
            url: base64Data,
            filename: file.name,
          }),
        });

        if (response.ok) {
          setMessage('Изображение загружено успешно!');
          setTimeout(() => setMessage(''), 3000);
          await fetchImages();
        } else {
          setMessage('Ошибка при загрузке изображения');
        }
        setUploading(false);
      };
    } catch (err) {
      setMessage('Ошибка при загрузке изображения');
      setUploading(false);
    }
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

          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Тексты</h3>
              {content.map((item) => (
                <div key={item.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {item.label}
                  </label>
                  <Input
                    type="text"
                    value={item.value}
                    onChange={(e) => updateValue(item.key, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Изображения</h3>
              <div className="space-y-6">
                {images.map((image) => (
                  <div key={image.key} className="border rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {image.label}
                    </label>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <img
                          src={image.url}
                          alt={image.label}
                          className="w-32 h-32 object-cover rounded-lg border"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600 mb-3">{image.filename}</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(image.key, file);
                          }}
                          disabled={uploading}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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