import { useEffect, useState } from "react";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch menu items from backend
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menu", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMenuItems(data);
      } catch (err) {
        console.log("Error fetching menu:", err);
      }
    };
    fetchMenu();
  }, [token]);

  // Add item to cart
  const addToCart = (item) => {
    const existing = cart.find((c) => c.menuId === item._id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.menuId === item._id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([
        ...cart,
        { menuId: item._id, name: item.name, price: item.price, quantity: 1 },
      ]);
    }
  };

  // Place booking
  const placeBooking = async () => {
    if (!token) {
      alert("Please login to place booking");
      return;
    }

    const totalPrice = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    try {
      const res = await fetch("http://localhost:5000/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cart.map((i) => ({ menuId: i.menuId, quantity: i.quantity })),
          totalPrice,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Booking placed successfully!");
        setCart([]);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log(err);
      alert("Error placing booking");
    }
  };

  return (
    <div className="content">
      <h1>Menu</h1>
      <ul>
        {menuItems.map((item) => (
          <li key={item._id} className="menu-item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>${item.price}</p>
            <button onClick={() => addToCart(item)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <div>
          <h2>Cart</h2>
          <ul>
            {cart.map((item) => (
              <li key={item.menuId}>
                {item.name} x {item.quantity} = ${item.price * item.quantity}
              </li>
            ))}
          </ul>
          <p>
            <strong>
              Total: ${cart.reduce((acc, i) => acc + i.price * i.quantity, 0)}
            </strong>
          </p>
          <button onClick={placeBooking}>Place Booking</button>
        </div>
      )}
    </div>
  );
}

export default Menu;
