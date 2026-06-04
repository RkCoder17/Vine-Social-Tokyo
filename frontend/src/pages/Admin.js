import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Menu as MenuIcon, 
  Image, 
  Settings, 
  MessageSquare, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit, 
  Upload, 
  X 
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://vine-social-tokyo.onrender.com';
const API = `${BACKEND_URL}/api`;
const CATEGORIES = ['Small Plates', 'Tandoor', 'Mains', 'Drinks', 'Lunch Sets', 'Party Courses'];

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('menu');
  
  // Menu state
  const [menuItems, setMenuItems] = useState([]);
  const [menuForm, setMenuForm] = useState({ category: 'Small Plates', name: '', description: '', price: '', image_url: '' });
  const [editingMenu, setEditingMenu] = useState(null);
  
  // Gallery state
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryForm, setGalleryForm] = useState({ url: '', caption: '', category: '' });
  
  // Settings state
  const [settings, setSettings] = useState({});
  
  // Contact submissions state
  const [contacts, setContacts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, activeTab]);

  const verifyToken = async () => {
    try {
      await axios.get(`${API}/admin/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem('admin_token');
      setToken(null);
      setIsAuthenticated(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await axios.post(`${API}/admin/login`, loginData);
      const { token } = response.data;
      localStorage.setItem('admin_token', token);
      setToken(token);
      setIsAuthenticated(true);
    } catch (error) {
      setLoginError('Invalid credentials');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsAuthenticated(false);
    navigate('/');
  };

  const fetchData = async () => {
    try {
      if (activeTab === 'menu') {
        const response = await axios.get(`${API}/menu`);
        setMenuItems(response.data);
      } else if (activeTab === 'gallery') {
        const response = await axios.get(`${API}/gallery`);
        setGalleryImages(response.data);
      } else if (activeTab === 'settings') {
        const response = await axios.get(`${API}/settings`);
        setSettings(response.data);
      } else if (activeTab === 'contacts') {
        const response = await axios.get(`${API}/contact`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContacts(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Menu handlers
  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMenu) {
        await axios.put(`${API}/menu/${editingMenu.id}`, menuForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API}/menu`, menuForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setMenuForm({ category: 'Small Plates', name: '', description: '', price: '', image_url: '' });
      setEditingMenu(null);
      fetchData();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleMenuDelete = async (id) => {
    if (window.confirm('Delete this menu item?')) {
      try {
        await axios.delete(`${API}/menu/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleMenuEdit = (item) => {
    setEditingMenu(item);
    setMenuForm({ category: item.category, name: item.name, description: item.description, price: item.price, image_url: item.image_url || '' });
  };

  // Gallery handlers
  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/gallery`, galleryForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGalleryForm({ url: '', caption: '', category: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding gallery image:', error);
    }
  };

  const handleGalleryDelete = async (id) => {
    if (window.confirm('Delete this image? This will also remove the file if it was uploaded locally.')) {
      try {
        await axios.delete(`${API}/gallery/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting gallery image:', error);
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      const uploadedUrl = response.data.url;
      
      // Update form based on active context
      if (activeTab === 'menu') {
        setMenuForm({ ...menuForm, image_url: uploadedUrl });
      } else if (activeTab === 'gallery') {
        setGalleryForm({ ...galleryForm, url: uploadedUrl });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Settings handlers
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F0F0F] px-6" data-testid="admin-login-page">
        <div className="max-w-md w-full bg-[#1B1C1A] border border-white/10 rounded-sm p-8">
          <h1 className="text-3xl font-heading font-light text-[#CBA052] mb-6 text-center">Admin Login</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-light text-[#F5F2E9] mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                data-testid="admin-login-email"
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-light text-[#F5F2E9] mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                data-testid="admin-login-password"
                className="w-full"
              />
            </div>
            {loginError && <p className="text-[#9E2A2B] text-sm font-light">{loginError}</p>}
            <button type="submit" className="btn-primary w-full" data-testid="admin-login-submit">
              LOGIN
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-32 pb-24" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-heading font-light text-[#CBA052]">Admin Panel</h1>
          <button onClick={handleLogout} className="btn-secondary flex items-center space-x-2" data-testid="admin-logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-12 overflow-x-auto">
          {[
            { key: 'menu', label: 'Menu Items', icon: <MenuIcon size={20} /> },
            { key: 'gallery', label: 'Gallery', icon: <Image size={20} /> },
            { key: 'settings', label: 'Settings', icon: <Settings size={20} /> },
            { key: 'contacts', label: 'Contact Submissions', icon: <MessageSquare size={20} /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              data-testid={`admin-tab-${tab.key}`}
              className={`px-6 py-3 rounded-sm flex items-center space-x-2 transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#CBA052] text-[#0F0F0F]'
                  : 'border border-white/10 text-[#F5F2E9] hover:border-[#CBA052]'
              }`}
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Menu Tab */}
        {activeTab === 'menu' && (
          <div>
            <h2 className="text-2xl font-heading font-light text-[#F5F2E9] mb-6">
              {editingMenu ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <form onSubmit={handleMenuSubmit} className="bg-[#1B1C1A] border border-white/10 rounded-sm p-6 mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Category</label>
                  <select
                    value={menuForm.category}
                    onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                    className="w-full"
                    data-testid="menu-form-category"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Name</label>
                  <input
                    type="text"
                    value={menuForm.name}
                    onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                    required
                    className="w-full"
                    data-testid="menu-form-name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Description</label>
                  <textarea
                    value={menuForm.description}
                    onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                    rows="3"
                    required
                    className="w-full"
                    data-testid="menu-form-description"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Price</label>
                  <input
                    type="text"
                    value={menuForm.price}
                    onChange={(e) => setMenuForm({ ...menuForm, price: e.target.value })}
                    placeholder="¥1,200"
                    required
                    className="w-full"
                    data-testid="menu-form-price"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Image URL or Upload</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={menuForm.image_url}
                      onChange={(e) => setMenuForm({ ...menuForm, image_url: e.target.value })}
                      placeholder="https://... or upload below"
                      className="flex-1"
                      data-testid="menu-form-image-url"
                    />
                    <label className="btn-secondary cursor-pointer flex items-center space-x-2 px-4">
                      <Upload size={16} />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4 mt-6">
                <button type="submit" className="btn-primary" data-testid="menu-form-submit">
                  {editingMenu ? 'UPDATE ITEM' : 'ADD ITEM'}
                </button>
                {editingMenu && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMenu(null);
                      setMenuForm({ category: 'Small Plates', name: '', description: '', price: '', image_url: '' });
                    }}
                    className="btn-secondary"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>

            <h3 className="text-xl font-heading font-light text-[#F5F2E9] mb-6">All Menu Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-card" data-testid={`menu-item-card-${item.id}`}>
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-sm mb-4" />
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-heading font-light text-[#F5F2E9]">{item.name}</h4>
                    <span className="text-[#CBA052] text-sm ml-2">{item.price}</span>
                  </div>
                  <p className="text-xs text-[#CBA052] mb-2">{item.category}</p>
                  <p className="text-sm text-[#A3A199] mb-4 line-clamp-2">{item.description}</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleMenuEdit(item)}
                      className="text-[#CBA052] hover:text-[#DBC184] transition-colors"
                      data-testid={`menu-item-edit-${item.id}`}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleMenuDelete(item.id)}
                      className="text-[#9E2A2B] hover:text-red-400 transition-colors"
                      data-testid={`menu-item-delete-${item.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <h2 className="text-2xl font-heading font-light text-[#F5F2E9] mb-6">Add Gallery Image</h2>
            <form onSubmit={handleGallerySubmit} className="bg-[#1B1C1A] border border-white/10 rounded-sm p-6 mb-12">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Image URL or Upload</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={galleryForm.url}
                      onChange={(e) => setGalleryForm({ ...galleryForm, url: e.target.value })}
                      placeholder="https://... or upload below"
                      required
                      className="flex-1"
                      data-testid="gallery-form-url"
                    />
                    <label className="btn-secondary cursor-pointer flex items-center space-x-2 px-4">
                      <Upload size={16} />
                      <span>Upload</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Caption (Optional)</label>
                  <input
                    type="text"
                    value={galleryForm.caption}
                    onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                    className="w-full"
                    data-testid="gallery-form-caption"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Category (Optional)</label>
                  <input
                    type="text"
                    value={galleryForm.category}
                    onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                    placeholder="e.g., Food, Interior, Drinks"
                    className="w-full"
                    data-testid="gallery-form-category"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary mt-6" data-testid="gallery-form-submit">
                ADD IMAGE
              </button>
            </form>

            <h3 className="text-xl font-heading font-light text-[#F5F2E9] mb-6">Gallery Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((img) => (
                <div key={img.id} className="relative group" data-testid={`gallery-image-card-${img.id}`}>
                  <img src={img.url} alt={img.caption} className="w-full h-48 object-cover rounded-sm" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => handleGalleryDelete(img.id)}
                      className="bg-[#9E2A2B] text-white p-2 rounded-sm hover:bg-red-600 transition-colors"
                      data-testid={`gallery-image-delete-${img.id}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  {img.caption && (
                    <p className="text-xs text-[#A3A199] mt-2 truncate">{img.caption}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-heading font-light text-[#F5F2E9] mb-6">Restaurant Settings</h2>
            <form onSubmit={handleSettingsSubmit} className="bg-[#1B1C1A] border border-white/10 rounded-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Opening Hours</label>
                  <input
                    type="text"
                    value={settings.opening_hours || ''}
                    onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                    className="w-full"
                    data-testid="settings-opening-hours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Phone</label>
                  <input
                    type="text"
                    value={settings.phone || ''}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="w-full"
                    data-testid="settings-phone"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Email</label>
                  <input
                    type="email"
                    value={settings.email || ''}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full"
                    data-testid="settings-email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Address</label>
                  <input
                    type="text"
                    value={settings.address || ''}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    className="w-full"
                    data-testid="settings-address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Instagram</label>
                  <input
                    type="text"
                    value={settings.instagram || ''}
                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    placeholder="@vinesocialtokyo"
                    className="w-full"
                    data-testid="settings-instagram"
                  />
                </div>
                <div>
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">WhatsApp</label>
                  <input
                    type="text"
                    value={settings.whatsapp || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                    placeholder="+81312345678"
                    className="w-full"
                    data-testid="settings-whatsapp"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-light text-[#F5F2E9] mb-2">Announcement (Optional)</label>
                  <textarea
                    value={settings.announcement || ''}
                    onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
                    rows="3"
                    placeholder="Display an announcement banner on the homepage"
                    className="w-full"
                    data-testid="settings-announcement"
                  ></textarea>
                </div>
              </div>
              <button type="submit" className="btn-primary mt-6" data-testid="settings-submit">
                SAVE SETTINGS
              </button>
            </form>
          </div>
        )}

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div>
            <h2 className="text-2xl font-heading font-light text-[#F5F2E9] mb-6">Contact Submissions</h2>
            <div className="space-y-4">
              {contacts.map((contact) => (
                <div key={contact.id} className="bg-[#1B1C1A] border border-white/10 rounded-sm p-6" data-testid={`contact-submission-${contact.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-light text-[#F5F2E9]">{contact.name}</h3>
                      <p className="text-sm text-[#A3A199]">{contact.email} • {contact.phone}</p>
                    </div>
                    <span className="text-xs text-[#CBA052]">
                      {new Date(contact.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#A3A199]">{contact.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
