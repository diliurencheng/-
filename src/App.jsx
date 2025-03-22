import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import db from './db';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: '', quantity: 1, location: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    // 登录验证逻辑
    setLoggedIn(true);
  };

  const generateQR = async (text) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = async () => {
    const id = uuidv4();
    const qrCode = await generateQR(id);
    db.run(
      'INSERT INTO items (id, name, category, quantity, location, qr_code) VALUES (?, ?, ?, ?, ?, ?)',
      [id, newItem.name, newItem.category, newItem.quantity, newItem.location, qrCode]
    );
    setNewItem({ name: '', category: '', quantity: 1, location: '' });
    loadItems();
  };

  const loadItems = () => {
    db.all('SELECT * FROM items', (err, rows) => {
      if (!err) setItems(rows);
    });
  };

  useEffect(() => {
    if (loggedIn) loadItems();
  }, [loggedIn]);

  return (
    <div style={{ padding: '2rem' }}>
      {!loggedIn ? (
        <form onSubmit={handleLogin}>
          <h2>用户登录</h2>
          <input type="text" placeholder="用户名" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">登录</button>
        </form>
      ) : (
        <>
          <h1>物资管理系统</h1>
          <div>
            <h3>新增物资</h3>
            <input placeholder="物品名称" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} />
            <input placeholder="分类" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} />
            <input type="number" value={newItem.quantity} onChange={(e) => setNewItem({...newItem, quantity: e.target.value})} />
            <input placeholder="存放位置" value={newItem.location} onChange={(e) => setNewItem({...newItem, location: e.target.value})} />
            <button onClick={addItem}>添加</button>
          </div>
          <div>
            <h3>物资列表</h3>
            {items.map(item => (
              <div key={item.id}>
                <p>{item.name} - {item.quantity}件</p>
                <img src={item.qr_code} alt="QR Code" width="100" />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App