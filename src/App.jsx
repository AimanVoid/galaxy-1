import React, { useEffect, useState } from "react";
import { FaBoxOpen, FaShippingFast, FaHandshake, FaEnvelope, FaPhone, FaWhatsapp } from "react-icons/fa";
import './App.css';

const WHATSAPP_NUMBER = "03703148097"; 

// ---------- useTypewriter Hook ----------
function useTypewriter(words, speed = 120, pause = 1200) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = words[wordIndex % words.length];

    if (!deleting) {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length + 1));
      }, speed);

      if (text === currentWord) {
        timeout = setTimeout(() => setDeleting(true), pause);
      }
    } else {
      timeout = setTimeout(() => {
        setText(currentWord.slice(0, text.length - 1));
      }, speed / 2);

      if (text === "") {
        setDeleting(false);
        setWordIndex((i) => i + 1);
      }
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return text;
}

// ---------- Sample products ----------
const SAMPLE_PRODUCTS = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Pencil Set", "Color Box", "Ball Pen Pack", "Sharpener", "Eraser", "Drawing Book",
    "Notebook", "Sketch Colors", "Marker Set", "Geometry Box", "Sticky Notes",
    "Highlighter Pack", "Planner", "Diary", "Tape Roll", "File Folder", "Glue Stick",
    "Stapler", "Punch Machine", "Whiteboard Marker"
  ][i],
  price: [50,250,120,30,20,180,90,300,200,350,60,180,450,300,40,70,50,220,350,90][i],
  img: `https://picsum.photos/600/400?random=${i + 1}`,
}));

// ---------- Format price ----------
function formatPrice(num) {
  return `Rs ${num}`;
}

// ---------- Main App ----------
function App() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart_v1");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setCartOpen] = useState(false);
  const [products] = useState(SAMPLE_PRODUCTS);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    localStorage.setItem("cart_v1", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const id = setInterval(() => setActiveSlide((s) => (s + 1) % 3), 4000);
    return () => clearInterval(id);
  }, []);

  const addToCart = (product) => {
    setCart((c) => [...c, product]);
    toast(`${product.name} added to cart`);
  };

  const removeFromCart = (index) => {
    setCart((c) => {
      const copy = [...c];
      copy.splice(index, 1);
      return copy;
    });
  };

  const clearCart = () => setCart([]);
  const confirmOrder = () => {
    if (cart.length === 0) return toast("Cart is empty");
    let message = "Hello! I want to confirm my order:%0A%0A";
    cart.forEach((item, i) => {
      message += `${i + 1}) ${item.name} - Rs ${item.price}%0A`;
    });
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar openCart={() => setCartOpen(true)} cartCount={cart.length} />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <Hero activeSlide={activeSlide} />
        <section id="products" className="mt-16"> 
          <SectionHeader title="Products" subtitle="Our best stationery & study essentials" />
          <ProductsGrid products={products} onAdd={addToCart} />
        </section>

        <section id="solutions" className="mt-20">
          <SectionHeader title="Solutions" subtitle="How we help our customers" />
          <Solutions />
        </section>

        <section id="support" className="mt-20">
          <SectionHeader title="Support" subtitle="We are here to help" />
          <Support />
        </section>

        <section id="clients" className="mt-20">
          <SectionHeader title="Clients" subtitle="People who trust us" />
          <Clients />
        </section>

        <section id="about" className="mt-20">
          <SectionHeader title="About Us" subtitle="Who we are" />
          <About />
        </section>

        <section id="events" className="mt-20">
          <SectionHeader title="Events" subtitle="Upcoming events & workshops" />
          <Events />
        </section>

        <section id="footer" className="mt-20 mb-0">
          <SectionHeader/>
          <Footer />
        </section>
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        close={() => setCartOpen(false)}
        cart={cart}
        remove={removeFromCart}
        confirm={confirmOrder}
        clear={clearCart}
      />

      <Toaster />
    </div>
  );
}

export default App;

// ---------- Components ----------
function Navbar({ openCart, cartCount }) {
  const links = [
    { id: "products", label: "Products" },
    { id: "solutions", label: "Solutions" },
    { id: "support", label: "Support" },
    { id: "clients", label: "Clients" },
    { id: "about", label: "About Us" },
    { id: "events", label: "Events" },
  ];

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">BrainyBytes</div>
            <div className="flex md:flex items-center gap-3">
              {links.map((l) => (
                <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm px-3 py-1 hover:text-blue-600 transition">{l.label}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={openCart} className="relative inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 transition">
              🛒 Cart
              <span className="absolute -top-2 -right-2 text-xs bg-red-600 rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
            </button>
            <MobileMenu links={links} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ links }) {
  const [open, setOpen] = useState(false);
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <button className="p-2" onClick={() => setOpen((s) => !s)}>
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-4 mt-2 bg-white shadow-md rounded-md p-3">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="block w-full text-left py-1 px-2">{l.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Hero ----------
function Hero({ activeSlide = 0 }) {
  const text = useTypewriter(["Creative UI", "Modern Design", "Fast Performance"], 100, 1000);

  return (
    <section className="pt-24 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <p className="text-sm text-orange-500 font-semibold mb-3">Welcome to BrainyBytes</p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
          Build beautiful products with
          <span className="ml-3 text-blue-600">{text}</span>
          <span className="inline-block w-1 h-8 bg-gray-800 align-middle animate-pulse ml-2" />
        </h1>
        <p className="mt-4 text-gray-600 max-w-xl">
          A small demo React site with animations, product list, and a cart that connects to WhatsApp for order confirmation.
        </p>
        <div className="mt-6 flex gap-3">
          <a href="#products" className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">See Products</a>
          <a href="#about" className="px-4 py-2 border rounded-md hover:border-gray-400 transition">Learn More</a>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative overflow-hidden rounded-2xl shadow-lg">
          <div className="flex transition-transform duration-700" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            <BannerCard title="Quality Stationery" desc="Top quality materials" img="https://picsum.photos/800/400?1" />
            <BannerCard title="Fast Delivery" desc="Get products quickly" img="https://picsum.photos/800/400?2" />
            <BannerCard title="Special Offers" desc="Seasonal discounts" img="https://picsum.photos/800/400?3" />
          </div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {[0, 1, 2].map((i) => (
              <button key={i} className={`w-3 h-3 rounded-full ${i === activeSlide ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <MiniCard title="Secure Payments" />
          <MiniCard title="Customer Support" />
        </div>
      </div>
    </section>
  );
}

// ---------- BannerCard ----------
function BannerCard({ title, desc, img }) {
  return (
    <div className="w-full flex-shrink-0">
      <div className="h-56 md:h-72 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }}>
        <div className="bg-gradient-to-t from-black/60 to-transparent h-full flex items-end p-6 rounded-2xl">
          <div>
            <h3 className="text-white text-xl font-bold">{title}</h3>
            <p className="text-white/90 text-sm">{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniCard({ title }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm flex items-center gap-3">
      <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center">⭐</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">Helpful & reliable</div>
      </div>
    </div>
  );
}

// ---------- SectionHeader ----------
function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-gray-500">{subtitle}</p>
    </div>
  );
}

// ---------- ProductsGrid ----------
function ProductsGrid({ products, onAdd }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <div
          key={p.id}
          className="bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-2 transition"
        >
          <div
            className="h-40 bg-cover bg-center"
            style={{ backgroundImage: `url(${p.img})` }}
          />
          <div className="p-4">
            <h3 className="font-semibold text-lg">{p.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{formatPrice(p.price)}</p>

            <div className="mt-4 flex items-center justify-between gap-2">
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                onClick={() => onAdd(p)}
              >
                Add to Cart
              </button>
              <button className="text-sm text-gray-500">Quick view</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


// solutions

function Solutions() {
  const solutionList = [
    {
      icon: <FaBoxOpen className="text-blue-600 w-8 h-8" />,
      title: "Inventory Management",
      desc: "Keep track of your stock efficiently and avoid shortages.",
    },
    {
      icon: <FaShippingFast className="text-green-600 w-8 h-8" />,
      title: "Custom Packaging",
      desc: "Tailored packaging solutions for your products.",
    },
    {
      icon: <FaHandshake className="text-orange-500 w-8 h-8" />,
      title: "B2B Orders",
      desc: "Manage bulk orders and corporate clients seamlessly.",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {solutionList.map((s, idx) => (
        <div
          key={idx}
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-start gap-4"
        >
          <div className="p-4 bg-gray-100 rounded-lg">{s.icon}</div>
          <h3 className="text-xl font-semibold">{s.title}</h3>
          <p className="text-gray-600">{s.desc}</p>
          <button className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>
      ))}
    </div>
  );
}

//support
function Support() {
  const supportChannels = [
    {
      icon: <FaEnvelope className="text-blue-500 w-6 h-6" />,
      title: "Email Support",
      desc: "Reach us via email for all queries and assistance.",
      action: "mailto:support@brainybytes.com",
      button: "Email Us"
    },
    {
      icon: <FaPhone className="text-green-500 w-6 h-6" />,
      title: "Call Support",
      desc: "Call us anytime. We provide 24/7 assistance.",
      action: "tel:+921234567890",
      button: "Call Now"
    },
    {
      icon: <FaWhatsapp className="text-green-600 w-6 h-6" />,
      title: "WhatsApp Support",
      desc: "Chat with us instantly for urgent queries.",
      action: "https://wa.me/1234567",
      button: "Chat Now"
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {supportChannels.map((s, idx) => (
        <div
          key={idx}
          className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 flex flex-col gap-4"
        >
          <div className="p-4 bg-gray-100 rounded-full w-14 h-14 flex items-center justify-center">
            {s.icon}
          </div>
          <h3 className="text-xl font-semibold">{s.title}</h3>
          <p className="text-gray-600">{s.desc}</p>
          <a
            href={s.action}
            className="mt-auto px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition text-center"
          >
            {s.button}
          </a>
        </div>
      ))}
    </div>
  );
}

// clients
function Clients() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="p-6 bg-white rounded-xl shadow text-center">Client {i + 1}</div>
      ))}
    </div>
  );
}

// about
function About() {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex md:items-center gap-6 p-6 md:p-10">
      {/* Left side - Image */}
      <div className="md:flex-1">
        <img
          src="https://picsum.photos/400/300?blur=2"
          alt="Team"
          className="rounded-xl w-full object-cover shadow"
        />
      </div>

      {/* Right side - Text */}
      <div className="md:flex-1 mt-6 md:mt-0">
        <h3 className="text-2xl font-bold">Who We Are</h3>
        <p className="mt-4 text-gray-600 leading-relaxed">
          We are a passionate team dedicated to building delightful web experiences
          for learners and creators. Our mission is to simplify technology and make
          learning engaging and interactive.
        </p>
        <p className="mt-2 text-gray-500">
          From creative UI design to fast and reliable web apps, we deliver solutions
          that empower our users.
        </p>
        <div className="mt-6">
          <a
            href="#contact"
            className="px-5 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}


// events
function Events() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="p-6 bg-white rounded-xl shadow">
        <h4 className="font-semibold">Design Workshop</h4>
        <p className="text-sm text-gray-500">December 10, 2025</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow">
        <h4 className="font-semibold">Stationery Sale</h4>
        <p className="text-sm text-gray-500">January 5, 2026</p>
      </div>
    </div>
  );
}




// footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">BrainyBytes</h2>
          <p className="text-gray-400">
            Building delightful web experiences for learners and creators.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#products" className="hover:text-white transition">Products</a></li>
            <li><a href="#solutions" className="hover:text-white transition">Solutions</a></li>
            <li><a href="#support" className="hover:text-white transition">Support</a></li>
            <li><a href="#about" className="hover:text-white transition">About Us</a></li>
            <li><a href="#events" className="hover:text-white transition">Events</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Email: <a href="mailto:info@brainybytes.com" className="hover:text-white transition">info@brainybytes.com</a></li>
            <li>Phone: <a href="tel:+923323486324" className="hover:text-white transition">+92 332 3486324</a></li>
            <li>WhatsApp: <a href={`https://wa.me/1234567`} className="hover:text-white transition">Chat Now</a></li>
          </ul>
        </div>

        {/* Social & Newsletter */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Follow Us</h3>
          <div className="flex gap-3 mb-4">
            <a href="#" className="hover:text-white transition">🔵</a>
            <a href="#" className="hover:text-white transition">📸</a>
            <a href="#" className="hover:text-white transition">💼</a>
            <a href="#" className="hover:text-white transition">🐦</a>
          </div>
          {/* <h3 className="text-xl font-semibold mb-2">Subscribe</h3> */}
          <form className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 rounded-md text-gray-900"
            />
            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Subscribe
            </button> */}
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} BrainyBytes. All rights reserved.
      </div>
    </footer>
  );
}








// cartsidebar
function CartSidebar({ isOpen, close, cart, remove, confirm, clear }) {
  const total = cart.reduce((s, i) => s + i.price, 0);
  return (
    <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl transform transition-transform z-50 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">Your Cart</h3>
          <div className="flex items-center gap-2">
            <button onClick={clear} className="text-sm text-red-600">Clear</button>
            <button onClick={close} className="px-3 py-1 bg-red-500 text-white rounded">Close</button>
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-gray-500">No items added yet.</div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-3 border-b">
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-500">{formatPrice(item.price)}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button className="text-sm text-red-600" onClick={() => remove(idx)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className="text-gray-600">Total</div>
            <div className="font-bold">{formatPrice(total)}</div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={confirm} className="flex-1 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">Confirm Order</button>
            <button onClick={close} className="px-4 py-2 border rounded">Close</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// toast (notification disappear)
function Toaster() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    window.__app_toast = (msg) => {
      const id = Date.now();
      setMessages((m) => [...m, { id, msg }]);
      setTimeout(() => setMessages((m) => m.filter((x) => x.id !== id)), 2600);
    };

    return () => {
      window.__app_toast = null;
    };
  }, []);

  return (
    <div className="fixed right-6 bottom-6 flex flex-col gap-2 z-50">
      {messages.map((m) => (
        <div key={m.id} className="px-4 py-2 bg-black text-white rounded shadow">{m.msg}</div>
      ))}
    </div>
  );
}

function toast(msg) {
  if (window.__app_toast) window.__app_toast(msg);
}
