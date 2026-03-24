import { useState } from 'react'
import './Menu.css'

const menuItems = [
  // Coffee - Specialty Section
  { id: 1, name: 'South Indian Filter Coffee', category: 'coffee', price: '₹180', desc: 'Traditional decoction method, served in tumbler & davarah', image: 'https://cdn-v2.theculturetrip.com/1220x680/wp-content/uploads/2018/03/coffee-vsharmilee-wikicommons.webp' },
  { id: 2, name: 'Cold Coffee', category: 'coffee', price: '₹220', desc: 'Chilled espresso with vanilla ice cream, whipped cream', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop' },
  { id: 3, name: 'Cappuccino', category: 'coffee', price: '₹250', desc: 'Perfect foam art, premium Arabica beans', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop' },
  { id: 4, name: 'Espresso', category: 'coffee', price: '₹150', desc: 'Single origin, double shot, authentic Italian style', image: 'https://www.sharmispassions.com/wp-content/uploads/2012/07/espresso-coffee-recipe022.jpg' },
  { id: 5, name: 'Mocha Latte', category: 'coffee', price: '₹280', desc: 'Dark chocolate, espresso, steamed milk, whipped cream', image: 'https://milkandpop.com/wp-content/uploads/2020/11/mocha-latte-17.jpg' },
  { id: 6, name: 'Nitro Cold Brew', category: 'coffee', price: '₹260', desc: 'Smooth nitrogen-infused, 48hr steeped', image: 'https://i.pinimg.com/1200x/18/da/2f/18da2fad7461d22ec47f3a8d7da6e7b3.jpg' },

  // Tea Section
  { id: 7, name: 'Masala Chai', category: 'tea', price: '₹120', desc: 'Traditional spices, cardamom, ginger, cloves', image: 'https://i.pinimg.com/736x/a1/16/c8/a116c8bba3420dd89a67e39434a4d0d6.jpg' },
  { id: 8, name: 'Green Tea', category: 'tea', price: '₹140', desc: 'Premium Japanese sencha, antioxidant rich', image: 'https://i.pinimg.com/736x/62/b1/b4/62b1b4da54ac4a62794b620f6261c64c.jpg' },
  { id: 9, name: 'Earl Grey Tea', category: 'tea', price: '₹160', desc: 'Bergamot infused, served with lemon wedge', image: 'https://i.pinimg.com/736x/b2/ac/cf/b2accfd09d90d46f1bb616695c09a16d.jpg' },
  { id: 10, name: 'Herbal Infusion', category: 'tea', price: '₹130', desc: 'Chamomile, peppermint, hibiscus blend', image: 'https://i.pinimg.com/736x/31/ae/cd/31aecd7372bc523e24b0115416222f99.jpg' },

  // Food Section - Indian Fusion
  { id: 11, name: 'Paneer Tikka Sandwich', category: 'food', price: '₹280', desc: 'Marinated paneer, bell peppers, mint chutney, multigrain bread', image: 'https://i.pinimg.com/1200x/f0/cb/bd/f0cbbd1f3ba7ec549f457d100bbb1668.jpg' },
  { id: 12, name: 'Vada Pav', category: 'food', price: '₹120', desc: 'Crispy potato vada, pav bread, spicy chutneys', image: 'https://i.pinimg.com/1200x/b0/89/ad/b089ad220eafd51e100cf2f89e227be2.jpg' },
  { id: 13, name: 'Pasta Arrabbiata', category: 'food', price: '₹320', desc: 'Italian pasta with Indian spices, tomato sauce, parmesan', image: 'https://i.pinimg.com/736x/36/11/74/361174e0978384bdd73336b210babf5d.jpg' },
  { id: 14, name: 'Chicken Tikka Wrap', category: 'food', price: '₹350', desc: 'Tandoori chicken, mint yogurt, pickled onions, naan wrap', image: 'https://i.pinimg.com/1200x/c4/64/e1/c464e1223ac491658498f2161c13e1fe.jpg' },
  { id: 15, name: 'Chocolate Brownie', category: 'food', price: '₹180', desc: 'Fudgy chocolate, walnuts, served warm with ice cream', image: 'https://i.pinimg.com/1200x/be/4c/c1/be4cc11364289b55442e22960ffb19d8.jpg' },
  { id: 16, name: 'Masala Omelette', category: 'food', price: '₹160', desc: 'Spiced eggs, onions, tomatoes, served with toast', image: 'https://i.pinimg.com/1200x/a7/4d/08/a74d080def9c282fcefc4904285997ad.jpg' },
  { id: 17, name: 'Fruit Salad Bowl', category: 'food', price: '₹220', desc: 'Seasonal fruits, honey dressing, nuts, yogurt', image: 'https://i.pinimg.com/1200x/ab/2d/82/ab2d8277f7aa5de7ef67649eaf1c358a.jpg' },
  { id: 18, name: 'Croissant', category: 'food', price: '₹140', desc: 'Buttery, flaky, house-baked daily', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=300&fit=crop' },
]

const categories = [
  { id: 'all', label: 'All' },
  { id: 'coffee', label: 'Coffee' },
  { id: 'tea', label: 'Tea' },
  { id: 'food', label: 'Food' },
]

export default function Menu() {
  const [active, setActive] = useState('all')

  const filtered = active === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === active)

  return (
    <section className="menu" id="menu">
      <div className="menu-container">
        <div className="menu-header">
          <p className="menu-tagline">Our selection</p>
          <h2 className="menu-title">Menu</h2>
          <p className="menu-intro">
            Carefully curated drinks and bites, made fresh every day.
          </p>
        </div>

        <div className="menu-filters">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`filter-btn ${active === cat.id ? 'active' : ''}`}
              onClick={() => setActive(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="menu-grid">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="menu-card"
              style={{ '--order': index }}
            >
              {item.image && (
                <div className="menu-card-image">
                  <img src={item.image} alt={item.name} />
                </div>
              )}
              <div className="menu-card-inner">
                <div className="menu-card-header">
                  <h3>{item.name}</h3>
                  <span className="menu-price">{item.price}</span>
                </div>
                <p className="menu-desc">{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
