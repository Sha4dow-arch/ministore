const products = [
  { name: "RAM", price: 20, img: "im/" },
  { name: "CPU", price: 20, im: "im/oip.webp" },
  { name: "Motherboard", price: 15, im: "im/.jpg" },
  { name: "PSU", price: 50, im: "im/.jpg" },
  { name: "Monitor", price: 35, im: "im/.jpg" },
  { name: "Keyboard", price: 30, im: "im/.jpg" },
  { name: "Mouse", price: 100, im: "im/.jpg" },
  { name: "Headphones", price: 25, im: "im/.jpg" },
  { name: "Webcam", price: 20, im: "im/.jpg" }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
}

function displayProducts(list){
  const el = document.getElementById("productList");
  el.innerHTML = "";

  list.forEach(p=>{
    const div = document.createElement("div");
    div.className = "product";

    div.innerHTML = `
      <img src="${p.img}">
      <b>${p.name}</b><br>
      <span class="price">₱${p.price}</span>
    `;

    div.onclick = ()=>addToCart(p);
    el.appendChild(div);
  });
}

function searchProduct(q){
  displayProducts(products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  ));
}

function addToCart(product){
  let item = cart.find(i => i.name === product.name);

  if(item){
    item.qty++;
  } else {
    cart.push({...product, qty:1});
  }

  saveCart();
  renderCart();
}

function renderCart(){
  const box = document.getElementById("cartItems");
  const totalEl = document.getElementById("total");
  const countEl = document.getElementById("cartCount");

  box.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item,i)=>{
    let subtotal = item.price * item.qty;
    total += subtotal;
    count += item.qty;

    box.innerHTML += `
      <div class="cart-item">
        <div>
          ${item.name}<br>
          ₱${item.price} x ${item.qty} = ₱${subtotal}
        </div>

        <div class="qty-controls">
          <button onclick="changeQty(${i},-1)">-</button>
          <button onclick="changeQty(${i},1)">+</button>
          <span class="remove" onclick="removeItem(${i})">✖</span>
        </div>
      </div>
    `;
  });

  totalEl.innerText = "₱" + total;
  countEl.innerText = count;
}

function changeQty(i,val){
  cart[i].qty += val;
  if(cart[i].qty <= 0) cart.splice(i,1);
  saveCart();
  renderCart();
}

function removeItem(i){
  cart.splice(i,1);
  saveCart();
  renderCart();
}

function clearCart(){
  cart = [];
  saveCart();
  renderCart();
}

function checkout(){
  if(cart.length === 0) return alert("Cart empty!");

  let total = cart.reduce((s,i)=>s+i.price*i.qty,0);
  let date = new Date().toLocaleString();

  let html = `
  <html>
  <body style="font-family:monospace;padding:20px">
  <h2>MINI POS RECEIPT</h2>
  <p>${date}</p><hr>
  `;

  cart.forEach(i=>{
    html += `<div>${i.name} x${i.qty} = ₱${i.price*i.qty}</div>`;
  });

  html += `<hr><h3>Total: ₱${total}</h3><p>Thank you!</p></body></html>`;

  let w = window.open();
  w.document.write(html);
  w.print();

  clearCart();
}

displayProducts(products);
renderCart();