
const db = {
  rooms: JSON.parse(localStorage.getItem("rooms") || "[]"),
  guests: JSON.parse(localStorage.getItem("guests") || "[]"),
  coupons: JSON.parse(localStorage.getItem("coupons") || "{}"),
  history: JSON.parse(localStorage.getItem("history") || "[]"),
  income: parseFloat(localStorage.getItem("income") || "0")
};

function saveData() {
  localStorage.setItem("rooms", JSON.stringify(db.rooms));
  localStorage.setItem("guests", JSON.stringify(db.guests));
  localStorage.setItem("coupons", JSON.stringify(db.coupons));
  localStorage.setItem("history", JSON.stringify(db.history));
  localStorage.setItem("income", db.income.toString());
}

function addRoom(roomNumber, type, price) {
  if (db.rooms.some(r => r.number === roomNumber)) return false;
  db.rooms.push({ number: roomNumber, type, price, status: "Available", guest: null });
  saveData();
  return true;
}

function getAvailableRooms() {
  return db.rooms.filter(r => r.status === "Available");
}

function checkIn(guestName, roomNumber, nights, couponCode = "") {
  const room = db.rooms.find(r => r.number === roomNumber && r.status === "Available");
  if (!room) return false;

  let discount = db.coupons[couponCode] || 0;
  let pricePerNight = room.price * (1 - discount / 100);
  let total = pricePerNight * nights;

  room.status = "Occupied";
  room.guest = guestName;

  db.guests.push({
    name: guestName,
    room: roomNumber,
    checkInDate: new Date().toISOString(),
    nights,
    pricePerNight,
    total
  });

  saveData();
  return true;
}

function checkOut(roomNumber) {
  const room = db.rooms.find(r => r.number === roomNumber);
  if (!room || room.status !== "Occupied") return false;

  const guestIndex = db.guests.findIndex(g => g.room === roomNumber);
  if (guestIndex === -1) return false;

  const guest = db.guests.splice(guestIndex, 1)[0];
  db.income += guest.total;
  db.history.push({
    ...guest,
    checkOutDate: new Date().toISOString()
  });

  room.status = "Available";
  room.guest = null;

  saveData();
  return true;
}

function setMaintenance(roomNumber) {
  const room = db.rooms.find(r => r.number === roomNumber);
  if (room) {
    room.status = "Maintenance";
    saveData();
  }
}

function removeMaintenance(roomNumber) {
  const room = db.rooms.find(r => r.number === roomNumber);
  if (room && room.status === "Maintenance") {
    room.status = "Available";
    saveData();
  }
}

function addCoupon(code, discount) {
  db.coupons[code.toUpperCase()] = discount;
  saveData();
}

function removeCoupon(code) {
  delete db.coupons[code.toUpperCase()];
  saveData();
}

function getIncome() {
  return db.income.toFixed(2);
}

function getHistory() {
  return db.history;
}

window.db = db;
window.hotelAPI = {
  addRoom,
  getAvailableRooms,
  checkIn,
  checkOut,
  setMaintenance,
  removeMaintenance,
  addCoupon,
  removeCoupon,
  getIncome,
  getHistory,
  saveData
};
